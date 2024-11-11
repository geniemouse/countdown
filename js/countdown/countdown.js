/**
 * @todo:
 * [] Add function JSDoc comments
 * [] Add onPause()/onStop callbacks, as this seems like it could be wanted
 * [] Review/move inner functions out from countdown, as appropriate
 */

import { MILLISECONDS } from "../constants/time.units.js";

/**************
 * Public API *
 ***************/

export { countdown, calculateCountdown, createApiCallbacks, sumMilliseconds };

/**
 * Countdown API wrapper
 *
 * @param   {Number}  milliseconds   -- Time in milliseconds
 * @param   {Object}  customOptions  -- Customisable settings
 *
 * @return  {Function}                 -- API module factory function
 */
export default function countdown(milliseconds, customOptions = {}) {
	var options = {
		zeroBased: true,
		...createApiCallbacks(),
		...customOptions,
	};

	var data = {};
	var pausedTimeStamp = null;
	var timerExpired = null;
	var timerId = null;

	// @todo: Review this, see if it can be simplified &/largely removed
	function addZero(units) {
		const { zeroBased } = options;
		if (!zeroBased) {
			return units;
		}

		return Object.keys(units).reduce((zeroedUnits, unit) => {
			const value = Number(units[unit]);
			zeroedUnits[unit] = String(value).padStart(2, "0");
			return zeroedUnits;
		}, {});
	}

	function hasTimeLeft() {
		const { target } = data;
		return target / MILLISECONDS.SECOND >= 1;
	}

	function advanceTimerData() {
		// Manually count down seconds; avoids need need to call
		// `calculateCountdown(...)` (four recursive calls) per second
		data.target -= MILLISECONDS.SECOND;

		if (data.seconds > 0) {
			data.seconds -= 1;
		} else {
			// Call `calculateCountdown(time)` once a minute
			data = calculateCountdown(data.target);
		}
	}

	function tick() {
		const { onEnd, onStep } = options;

		if (!hasTimeLeft()) {
			stopTimer();
			onEnd.call(options, addZero(data));
			timerExpired = true;
			return;
		}

		advanceTimerData();
		onStep.call(options, addZero(data));

		// Using nested `setTimeout` calls for accuracy & efficiency;
		// more breathing space for garbage collection, etc
		// (e.g. `setInterval` does not guarantee one second time intervals)
		timerId = setTimeout(tick, MILLISECONDS.SECOND);
	}

	function startTimer(time) {
		// Quick get-out clauses:
		// Countdown is already over, or timer already in progress
		if (!hasTimeLeft() || timerId || timerExpired) {
			return;
		}
		tick();
		pausedTimeStamp = null;
		return data;
	}

	function stopTimer() {
		clearTimeout(timerId);
		timerId = null;
	}

	function status() {
		return addZero(data);
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
		const { onReset } = options;
		stopTimer();
		pausedTimeStamp = null;
		timerExpired = true;
		data = calculateCountdown(0);
		onReset.call(options, addZero(data));
		return data;
	}

	(function init() {
		const { onInit } = options;
		data = calculateCountdown(milliseconds);
		onInit.call(options, addZero(data));
	})();

	// PUBLIC API (of instance)
	return {
		status,
		start,
		stop,
		reset,
	};
}

/**************************
 * Private Implementation *
 ***************************/

/**
 * Millisecond time unit key/values, suitable for iterating over.
 * Largest to smallest unit order, for target calculations
 *
 * @type {Array}
 */
const MILLISECOND_UNITMAP = [
	{ name: "days", value: MILLISECONDS.DAY },
	{ name: "hours", value: MILLISECONDS.HOUR },
	{ name: "minutes", value: MILLISECONDS.MINUTE },
	{ name: "seconds", value: MILLISECONDS.SECOND },
];

/**
 * Calculate target time (in milliseconds) from an object of units/values
 *
 * @param  {Object} units -- Accepts any combination of the following
 * 							 property names:
 *
 * 		"days", "hours", "minutes" or "seconds", e.g.
 * 			- { minutes: 3, seconds: 5 } => 185000ms countdown target
 * 			- { minutes: 62 } => 3720000ms countdown target
 *
 * @return {Number}       -- Target time (in milliseconds)
 */
function sumMilliseconds(units = {}) {
	return MILLISECOND_UNITMAP.reduce((target, { name, value }) => {
		if (!Object.prototype.hasOwnProperty.call(units, name)) {
			return target;
		}
		return target + units[name] * value;
	}, 0);
}

/**
 * Break the countdown (millisecond) time value down into an object of
 * units of time
 *
 * @param  {Number} time -- Time in milliseconds
 * @return {Object}
 * -- e.g.
 * {
 *   "target": 123456789,
 *   "days": 1,
 *   "hours": 10,
 *   "minutes": 17,
 *   "seconds": 36
 * }
 *
 */
function calculateCountdown(time) {
	var result = {};

	/**
	 * Recursive function: calculate per unit; add to result
	 *
	 * @param  {Number} time      -- Time in milliseconds
	 * @param  {Number} remainder -- (Optional) Remaining millisecond value
	 *                                 after current unit calculation.
	 *                                 Added on recursive calls
	 * @param  {Number} index     -- (Optional) Added on recursive calls
	 */
	function calculateUnits(time, remainder, index = 0) {
		var unit = MILLISECOND_UNITMAP[index].value;
		var nextIndex = index + 1;
		var division;
		var unitResult;

		if (typeof remainder === "undefined") {
			// biome-ignore lint/style/noParameterAssign: reassignment useful in this instance; on first call neither `remainder` or `index` will be passed-in
			remainder = time / 1;
			result.target = time; // Store target countdown, for public reference
		}

		division = remainder / unit;
		unitResult = division >= 0 ? Math.floor(division) : 0;
		result[MILLISECOND_UNITMAP[index].name] = unitResult;

		if (nextIndex < MILLISECOND_UNITMAP.length) {
			calculateUnits(unitResult, remainder % unit, nextIndex);
		}
	}

	calculateUnits(time);
	return result;
}

function createApiCallbacks() {
	return {
		onInit: () => {},
		onStep: () => {},
		onReset: () => {},
		onEnd: () => {},
	};
}
