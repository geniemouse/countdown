import { describe, expect, mock, spyOn, test } from "bun:test";
import { fakeTimers } from "../../testsuite/fake.timers.js";
import countdownUI, { updateDateTimeAttribute } from "./countdown.ui.js";

const CLOCK = fakeTimers();

describe("countdown.ui.js file:", () => {
	test("File successfully imported & module exports as expected", () => {
		expect(typeof countdownUI).toBe("function");
		expect(typeof updateDateTimeAttribute).toBe("function");
	});
});

describe("countdownUI:", () => {
	test("Exposes the expected public API", () => {
		const ELEMENT = document.createElement("div");
		expect(countdownUI(ELEMENT, 0, {})).toEqual(
			expect.objectContaining({
				status: expect.any(Function),
				start: expect.any(Function),
				stop: expect.any(Function),
				reset: expect.any(Function),
			}),
		);
	});

	test("Options get passed through successfully", () => {
		const ELEMENT = document.createElement("div");

		var exposed_information = {};
		var aCountdownUI = countdownUI(ELEMENT, 3000, {
			name: "[CountdownUI/NAME]",
			onInit(data) {
				exposed_information.name = this.name;
			},
			onStep(data) {
				exposed_information.step = "onStep() fired!";
			},
			onEnd(data) {
				exposed_information.end = "onEnd() fired!";
			},
			onReset(data) {
				exposed_information.reset = "onReset() fired!";
			},
		});

		expect(exposed_information).toEqual({
			name: "[CountdownUI/NAME]",
		});

		aCountdownUI.start();
		CLOCK.runAll(); // === `jest.runAllTimers()`

		expect(exposed_information).toEqual({
			name: "[CountdownUI/NAME]",
			step: "onStep() fired!",
			end: "onEnd() fired!",
		});

		aCountdownUI.reset();

		expect(exposed_information).toEqual({
			name: "[CountdownUI/NAME]",
			step: "onStep() fired!",
			end: "onEnd() fired!",
			reset: "onReset() fired!",
		});
	});
});

describe("updateDateTimeAttribute utility:", () => {
	test("Interpolates data with template string correctly", () => {
		var element = document.createElement("time");
		var pattern = "P${days}DT${hours}H${minutes}M${seconds}S";
		var output;

		element.setAttribute("datetime", "");
		output = updateDateTimeAttribute(element, pattern);

		// Pass-in data
		output({
			days: "01",
			hours: "23",
			minutes: "59",
			seconds: "59",
		});

		// "[Function: setDateTimeAttribute]"
		expect(typeof output).toBe("function");
		expect(element.getAttribute("datetime")).toEqual("P01DT23H59M59S");
	});

	test("Throws TypeError when called on an invalid element", () => {
		var output = updateDateTimeAttribute(null, "");
		expect(() => {
			output();
		}).toThrow();
	});

	test("Returns the original pattern when passed no data", () => {
		var element = document.createElement("time");
		var pattern = "P${days}DT${hours}H${minutes}M${seconds}S";
		var output;

		element.setAttribute("datetime", "");
		output = updateDateTimeAttribute(element, pattern);

		// Pass-in (blank) data
		output({});
		expect(element.getAttribute("datetime")).toEqual(pattern);
	});
});
