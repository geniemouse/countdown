/**
 * Example usage:
 * @todo
 * cd.status()
 * cd.start()
 * cd.stop()
 * cd.pause()
 * cd.resume()
 *
 */

/**
 * Time constants (commented sums to show workings)
 * @type {Number}
 */
const MILLISECOND_DAY = 86400000; // 1000ms * 60s * 60mins * 24hrs
const MILLISECOND_HOUR = 3600000; // 1000ms * 60s * 60mins
const MILLISECOND_MINUTE = 60000; // 1000ms * 60s
const MILLISECOND_SECOND = 1000; // 1000ms * 1s

/**
 * Break the countdown millisecond value down into an object of units of time
 * @param  {Number} time -- Time in milliseconds
 * @return {Object}      -- e.g. { "target": 123456789, "days": 1, "hours": 10, "minutes": 17, "seconds": 36 }
 */
function getCountDownData(time) {
    const units = [
        { name: "days", value: MILLISECOND_DAY },
        { name: "hours", value: MILLISECOND_HOUR },
        { name: "minutes", value: MILLISECOND_MINUTE },
        { name: "seconds", value: MILLISECOND_SECOND }
    ];

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
        interval: MILLISECOND_SECOND,
        zeroBased: true,
        onInit: () => {},
        onStep: () => {},
        onReset: () => {},
        onEnd: () => {},
        ...options
    };

    let data = null;
    let pausedTimeStamp = null;
    let timerExpired = null;
    let timerId = null;

    function addZero(units) {
        Object.keys(units).map((unit) => {
            const value = Number(units[unit]);
            return (units[unit] = value >= 0 && value < 10 ? `0${value}` : `${value}`);
        });

        return units;
    }

    function hasTimeLeft() {
        const { interval } = countDownSettings;
        const { target } = data;
        return target / interval >= 1;
    }

    function tick() {
        const { interval, onEnd, onStep, zeroBased } = countDownSettings;

        if (!hasTimeLeft()) {
            stopTimer();
            onEnd.call(this, zeroBased ? addZero(data) : data);
            timerExpired = true;
            return;
        }

        // @todo: Extract to separate function?
        // Manually countdown seconds; avoids need need to call `getData(...)`
        // (four recursive calls) every second
        data.target -= interval;

        if (data.seconds > 0) {
            data.seconds -= 1;
        } else {
            // Call `getData(...)` once a minute
            data = getCountDownData(data.target);
        }

        onStep.call(this, zeroBased ? addZero(data) : data);

        // Using nested `setTimeout` calls instead of `setInterval` for efficiency;
        // more breathing space for garbage collection, etc
        timerId = setTimeout(tick, interval);
    }

    function startTimer(time) {
        // Quick get-out clauses:
        // Countdown is already over, or timer already in progress
        if (!hasTimeLeft() || timerId || timerExpired) {
            return;
        }
        data = time !== data.target ? getCountDownData(time) : data;
        tick();
        return data;
    }

    function stopTimer() {
        clearTimeout(timerId);
        timerId = null;
    }

    function start() {
        return startTimer(milliseconds);
    }

    function stop(options = {}) {
        const { reset } = options;
        const { onReset, zeroBased } = countDownSettings;
        stopTimer();
        if (reset) {
            data = getCountDownData(0);
            onReset.call(this, zeroBased ? addZero(data) : data);
            timerExpired = true;
        }
    }

    function pause() {
        stopTimer();
        pausedTimeStamp = data.target;
    }

    function resume() {
        if (!pausedTimeStamp) {
            return;
        }
        startTimer(pausedTimeStamp);
        pausedTimeStamp = null;
    }

    (function init() {
        const { onInit, zeroBased } = countDownSettings;
        data = getCountDownData(milliseconds);
        onInit.call(this, zeroBased ? addZero(data) : data);
    })();

    // PUBLIC API
    return {
        status: () => {
            return getCountDownData(!data ? milliseconds : data.target);
        },
        start,
        stop,
        pause,
        resume
    };
}

export { getCountDownData };
export default countDown;
