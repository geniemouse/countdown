/**
 * Example usage:
 * @todo
 *
 * cd.initialstate()
 * cd.state()
 * cd.start()
 * cd.stop()
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

function returnFunction(value) {
    // this[key] = value;
    return function() {
        return value;
    };
}

/**
 * Get the countdown time as an object of units: days, hours, minutes, seconds
 * @param  {Number} time -- Time in milliseconds
 * @return {Object}      -- e.g. { target: 123456789, "days": 1, "hours": 10, "minutes": 17, "seconds": 36 }
 */
function getData(time) {
    const units = [
        { name: "days", value: MILLISECOND_DAY },
        { name: "hours", value: MILLISECOND_HOUR },
        { name: "minutes", value: MILLISECOND_MINUTE },
        { name: "seconds", value: MILLISECOND_SECOND }
    ];

    const result = {};

    /**
     * Recursive function: get millisecond time value broken down by units of time
     * @param  {Number} time      -- Time in milliseconds
     * @param  {Number} remainder -- (Optional) Remaining millisecond value after current unit calculation.
     *                                 Added on recursive calls
     * @param  {Number} index     -- (Optional) Added on recursive calls
     * @return {Object}           -- e.g. { target: 123456789, "days": 1, "hours": 10, "minutes": 17, "seconds": 36 }
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
 * Start countdown, exposed as `COUNTDOWN_INSTANCE.start()`
 * @param  {Number} time    -- Time in milliseconds
 * @param  {Object} options -- (Optional) Settings
 * @return {Undefined}
 */
function startCountDown(time, options = {}) {
    const { interval = MILLISECOND_SECOND, func = new Function() } = options;
    let data = getData(time);
    this.state = returnFunction(data);

    function hasTimeLeft() {
        return data.target / interval > 1;
    }

    // Countdown is already over, so let's get out of here!
    if (!hasTimeLeft()) {
        return;
    }

    (function tick(context) {
        // Using nested `setTimeout` calls instead of `setInterval` for efficiency;
        // more breathing space for garbage collection, etc
        const timer = setTimeout(tick, interval, context);

        if (hasTimeLeft()) {
            // Manually countdown seconds; avoids need need to call `getData(...)`
            // (four recursive calls) every second
            data.target -= interval;

            if (data.seconds > 0) {
                data.seconds -= 1;
            } else {
                // Call `getData(...)` once a minute
                data = getData(data.target);
            }

            // Expose countdown globally useful information
            // Return as functions, so the actual values are kept private
            context._timer = returnFunction(timer);
            context.state = returnFunction(data);

            // Make the callback
            func.call(null, data);
        } else {
            clearTimeout(timer);
        }

        return timer;
    })(this);
}

/**
 * Stop the countdown
 * @param  {Function} timer   -- Get the current `setTimeout` id
 * @param  {Object} options -- (Optional) Settings; e.g. { reset: true }
 * @return {Undefined|Object}
 */
function stopCountDown(timer, options = {}) {
    const { reset = false } = options;
    clearTimeout(timer());
    if (reset) {
        return getData(0);
    }
}

/**
 * Countdown API wrapper
 * @param  {Number} milliseconds -- Time in milliseconds
 * @return {Object} -- cf. Example usage section at file top
 */
export default function countDown(milliseconds) {
    function units() {
        return getData.call(this, milliseconds);
    }

    function start(options) {
        return startCountDown.call(this, milliseconds, options);
    }

    function stop(options) {
        return stopCountDown.call(this, this._timer, options);
    }

    return {
        initialstate: returnFunction(units()),
        state: returnFunction({}),
        start,
        stop,
        _timer: returnFunction(null)
    };
}
