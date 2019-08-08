const MILLISECOND_DAY = 86400000; // 1000ms * 60s * 60mins * 24hrs
const MILLISECOND_HOUR = 3600000; // 1000ms * 60s * 60mins
const MILLISECOND_MINUTE = 60000; // 1000ms * 60s
const MILLISECOND_SECOND = 1000; // 1000ms * 1s

/**
 * Recursive function: get millisecond time value broken down by units of time
 * @param  {Number} time      -- Time in milliseconds
 * @param  {Number} remainder -- (Optional) Remaiing millisecond value after current unit calculation.
 *                                 Added on recursive calls
 * @param  {Number} index     -- (Optional) Added on recursive calls
 * @return {Object}           -- e.g. { "days": 148, "hours": 12, "minutes": 34, "seconds": 40 }
 */
export function getCountDownUnits(time) {
    const units = [
        { name: "days", value: MILLISECOND_DAY },
        { name: "hours", value: MILLISECOND_HOUR },
        { name: "minutes", value: MILLISECOND_MINUTE },
        { name: "seconds", value: MILLISECOND_SECOND }
    ];

    const result = {};

    function cdUnits(time, remainder, index = 0) {
        const unit = units[index].value;
        const nextIndex = index + 1;

        // First time through, remainder needs a neutral value; divide initial time value by 1
        if (typeof remainder === "undefined") {
            remainder = time / 1;
            result.target = time;
        }

        const unitResult = Math.floor(remainder / unit);
        result[units[index].name] = unitResult;

        if (nextIndex < units.length) {
            cdUnits(unitResult, remainder % unit, nextIndex);
        }
    }

    cdUnits(time);
    return result;
}

export function startCountDown(time, options = {}) {
    const { interval = MILLISECOND_SECOND, func = new Function() } = options;
    let data = getCountDownUnits(time);

    function hasTimeLeft() {
        return data.target / interval > 1;
    }

    // Countdown is already over, so let's get out of here!
    if (!hasTimeLeft()) {
        return;
    }

    function tick() {
        let timer = setTimeout(tick, interval);
        if (hasTimeLeft()) {
            data.target -= interval;

            if (data.seconds > 0) {
                data.seconds -= 1;
            } else {
                data = getCountDownUnits(data.target);
            }
            return func.call(null, data);
        } else {
            clearTimeout(timer);
        }
    }

    tick();
}
