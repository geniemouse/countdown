/**
 * Time constants (commented sums to show workings)
 * @type {Number}
 */
const MILLISECOND_DAY = 86400000; // 1000ms * 60s * 60mins * 24hrs
const MILLISECOND_HOUR = 3600000; // 1000ms * 60s * 60mins
const MILLISECOND_MINUTE = 60000; // 1000ms * 60s
const MILLISECOND_SECOND = 1000; // 1000ms * 1s

/**
 * Helper function:
 * Return an array of time unit key/values, suitable for iterating over
 */
function setUnitMap() {
    return [
        { name: "days", value: MILLISECOND_DAY },
        { name: "hours", value: MILLISECOND_HOUR },
        { name: "minutes", value: MILLISECOND_MINUTE },
        { name: "seconds", value: MILLISECOND_SECOND }
    ];
}

/**
 * Calculate a countdown target time from an object of units/values
 * @param  {Object} units -- e.g. { "days": 3, "hours": 12, "minutes": 5, "seconds": 0 }
 * @return {Number}       -- time (in milliseconds)
 */
function countDownTime(units = {}) {
    return setUnitMap().reduce((target, mapItem) => {
        const { name, value } = mapItem;
        if (units[name]) {
            target += units[name] * value;
        }
        return target;
    }, 0);
}

/**
 * Break the countdown (millisecond) time value down into an object of units of time
 * @param  {Number} time -- Time in milliseconds
 * @return {Object}      -- e.g. { "target": 123456789, "days": 1, "hours": 10, "minutes": 17, "seconds": 36 }
 */
function getCountDownData(time) {
    const units = setUnitMap();
    const result = {};

    /**
     * Recursive function: calculate per unit; add to result
     * @param  {Number} time      -- Time in milliseconds
     * @param  {Number} remainder -- (Optional) Remaining millisecond value after current unit calculation.
     *                                 Added on recursive calls
     * @param  {Number} index     -- (Optional) Added on recursive calls
     */
    function calculateUnits(time, remainder, index = 0) {
        const unit = units[index].value;
        const nextIndex = index + 1;

        // First time through, remainder needs a neutral value; divide initial time value by 1
        if (typeof remainder === "undefined") {
            remainder = time / 1;
            result.target = time;
        }

        const division = remainder / unit;
        const unitResult = division >= 0 ? Math.floor(division) : 0;
        result[units[index].name] = unitResult;

        if (nextIndex < units.length) {
            calculateUnits(unitResult, remainder % unit, nextIndex);
        }
    }

    calculateUnits(time);
    return result;
}

/**
 * Countdown API wrapper
 * @param  {Number} milliseconds    -- Time in milliseconds
 * @return {Object}                 -- cf. Example usage section at file top
 */
function countDown(milliseconds, options = {}) {
    const countDownSettings = {
        zeroBased: true,
        onInit: () => {},
        onStep: () => {},
        onReset: () => {},
        onEnd: () => {},
        ...options
    };

    let data = {};
    let pausedTimeStamp = null;
    let timerExpired = null;
    let timerId = null;

    function addZero(units) {
        const { zeroBased } = countDownSettings;
        if (!zeroBased) {
            return units;
        }

        return Object.keys(units).reduce((zeroedUnits, unit) => {
            const value = Number(units[unit]);
            zeroedUnits[unit] = value >= 0 && value < 10 ? `0${value}` : `${value}`;
            return zeroedUnits;
        }, {});
    }

    function hasTimeLeft() {
        const { target } = data;
        return target / MILLISECOND_SECOND >= 1;
    }

    function advanceTimerData() {
        // Manually countdown seconds; avoids need need to call `getData(...)`
        // (four recursive calls) every second
        data.target -= MILLISECOND_SECOND;

        if (data.seconds > 0) {
            data.seconds -= 1;
        } else {
            // Call `getData(...)` once a minute
            data = getCountDownData(data.target);
        }
    }

    function tick() {
        const { onEnd, onStep } = countDownSettings;

        if (!hasTimeLeft()) {
            stopTimer();
            onEnd.call(countDownSettings, addZero(data));
            timerExpired = true;
            return;
        }

        advanceTimerData();
        onStep.call(countDownSettings, addZero(data));

        // Using nested `setTimeout` calls instead of `setInterval` for efficiency;
        // more breathing space for garbage collection, etc
        timerId = setTimeout(tick, MILLISECOND_SECOND);
    }

    function startTimer(time) {
        // Quick get-out clauses:
        // Countdown is already over, or timer already in progress
        if (!hasTimeLeft() || timerId || timerExpired) {
            return;
        }
        data = time !== data.target ? getCountDownData(time) : data;
        pausedTimeStamp = null;
        tick();
        return data;
    }

    function stopTimer() {
        clearTimeout(timerId);
        timerId = null;
    }

    function status() {
        // @todo @question: just return data?
        const currentStatus = getCountDownData(data.target);
        return addZero(currentStatus);
    }

    function start() {
        if (!pausedTimeStamp) {
            return startTimer(milliseconds);
        }
        return startTimer(pausedTimeStamp);
    }

    function stop() {
        stopTimer();
        pausedTimeStamp = data.target;
        return data;
    }

    function reset() {
        const { onReset } = countDownSettings;
        stopTimer();
        pausedTimeStamp = null;
        timerExpired = true;
        data = getCountDownData(0);
        onReset.call(countDownSettings, addZero(data));
        return data;
    }

    (function init() {
        const { onInit } = countDownSettings;
        data = getCountDownData(milliseconds);
        onInit.call(countDownSettings, addZero(data));
    })();

    // PUBLIC API
    return {
        status,
        start,
        stop,
        reset
    };
}

export { countDownTime, getCountDownData };
export default countDown;
