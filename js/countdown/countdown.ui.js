/**
 * @todo:
 * [] Add function JSDoc comments
 * [] Create unit tests for this file
 */

import { interpolate } from "../utils/string/interpolate.js";
import countdown, { createApiCallbacks } from "../countdown/countdown.js";

/**************
 * Public API *
 ***************/

export { updateDateTimeAttribute };

export default function countdownUI(element, timerTarget, customOptions = {}) {
	var options = {
		elements: getCountDownElements(element),
		...createApiCallbacks(),
		...customOptions,
	};

	return countdown(timerTarget, {
		...options,
		onInit(data) {
			options.onInit.call(options, data);
			update(options, data);
		},
		onStep(data) {
			options.onStep.call(options, data);
			update(options, data);
		},
		onEnd(data) {
			options.onEnd.call(options, data);
			update(options, data);
		},
		onReset(data) {
			options.onReset.call(options, data);
			update(options, data);
		},
	});
}

/**************************
 * Private Implementation *
 ***************************/

const TIME_UNITS = ["days", "hours", "minutes", "seconds"];

function getUnitElement(element, unitKey) {
	return (
		element.querySelector(`.${unitKey}`) || document.createElement("span")
	);
}

function getCountDownElements(element) {
	return TIME_UNITS.reduce(function gatherElements(elements, unit) {
		elements[unit] = getUnitElement(element, unit);
		return elements;
	}, {});
}

function compareValues(previousValue, nextValue, element) {
	if (element && nextValue !== previousValue) {
		element.textContent = nextValue;
	}
}

function update(options = {}, next = {}) {
	var { elements = {} } = options;
	var snapshot = {};
	requestAnimationFrame(() => {
		TIME_UNITS.map((unit) => {
			compareValues(snapshot[unit], next[unit], elements[unit]);
		});
		snapshot = { ...next };
	});
}

function updateDateTimeAttribute(element, pattern) {
	return function setDateTimeAttribute(values = {}) {
		element.setAttribute("datetime", interpolate(pattern, values));
	};
}
