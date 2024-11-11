/**
 * @tmp:
 * 		Bun does not support mocked timers yet;
 * 		using SinonJS fake-timers, for now.
 * @todo:
 * 		- Replace SinonJS fake timers for Bun native implementation,
 * 		  when available
 * 		- Implement `toHaveReturnedWith` once Bun supports it
 */

import { describe, expect, mock, spyOn, test } from "bun:test";
import { fakeTimers } from "../../testsuite/fake.timers.js";
import countdown, { calculateCountdown, sumMilliseconds } from "./countdown.js";

const CLOCK = fakeTimers();
const ZEROED_DATA = {
	target: 0,
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
};

test("File successfully imported & module exports as expected", () => {
	expect(typeof countdown).toBe("function");
	expect(typeof calculateCountdown).toBe("function");
	expect(typeof sumMilliseconds).toBe("function");
});

test("Exposes the expected public API", () => {
	expect(countdown(1000)).toEqual(
		expect.objectContaining({
			status: expect.any(Function),
			start: expect.any(Function),
			stop: expect.any(Function),
			reset: expect.any(Function),
		}),
	);
});

test("Countdown options: zero-based values printed", () => {
	const INIT = mock((data) => data);
	const MILLISECOND_TOTAL = 11169000;
	const NON_ZEROED_OUTPUT = {
		target: MILLISECOND_TOTAL,
		days: 0,
		hours: 3, // 10800000
		minutes: 6, // 360000
		seconds: 9, // 9000
	};
	const ZEROED_OUTPUT = (function prependZeroToValue(data) {
		Object.entries(data).forEach(
			([key, value]) => (data[key] = String(value).padStart(2, "0")),
		);
		return data;
	})({ ...NON_ZEROED_OUTPUT });

	var demos = {
		default: countdown(MILLISECOND_TOTAL, {
			// zeroBased: defaults to true
			onInit: (data) => INIT(data),
		}),
		zeroBasedTrue: countdown(MILLISECOND_TOTAL, {
			zeroBased: true,
			onInit: (data) => INIT(data),
		}),
		zeroBasedFalse: countdown(MILLISECOND_TOTAL, {
			zeroBased: false,
			onInit: (data) => INIT(data),
		}),
	};

	expect(demos.default.status()).toEqual(ZEROED_OUTPUT);
	expect(demos.zeroBasedTrue.status()).toEqual(ZEROED_OUTPUT);
	expect(demos.zeroBasedFalse.status()).toEqual(NON_ZEROED_OUTPUT);
	expect(INIT).toHaveBeenCalledTimes(3);
});

test("onInit, onStep & onEnd callbacks run in order, the correct number of times", () => {
	const INIT = mock((data) => data);
	const END = mock((data) => data);
	const RESET = mock((data) => data);
	const STEP = mock((data) => data);

	var demo = countdown(3000, {
		onInit: (data) => INIT(data),
		onEnd: (data) => END(data),
		onReset: (data) => RESET(data),
		onStep: (data) => STEP(data),
	});

	demo.start();
	expect(INIT).toHaveBeenCalledTimes(1);
	expect(STEP).toHaveBeenCalledTimes(1);
	// expect(STEP).toHaveReturnedWith(2);
	expect(END).toHaveBeenCalledTimes(0);

	CLOCK.runAll(); // === `jest.runAllTimers()`

	// expect(STEP).toHaveReturnedWith(1);
	// expect(STEP).toHaveReturnedWith(0);
	expect(STEP).toHaveBeenCalledTimes(3);
	expect(END).toHaveBeenCalledTimes(1);
});

test("Resetting a countdown zeroes data & fires the onReset callback", () => {
	const RESET = mock((data) => data);
	var demo = countdown(30000, {
		zeroBased: false,
		onReset: (data) => RESET(data),
	});

	// Confirm data before reset
	expect(demo.status()).toEqual(
		expect.objectContaining({
			...ZEROED_DATA,
			target: 30000,
			seconds: 30,
		}),
	);

	demo.reset();
	expect(demo.status()).toEqual(expect.objectContaining(ZEROED_DATA));
	// expect(RESET).toHaveReturnedWith(ZEROED_DATA);
	expect(RESET).toHaveBeenCalledTimes(1);
});

test("Stopping a countdown prevents further updates", () => {
	const STEP = mock((data) => data);

	var demo = countdown(30000, {
		zeroBased: false,
		onStep: (data) => STEP(data),
	});
	var snapshot;

	// Confirm data before timer advance & pause
	expect(demo.status()).toEqual(
		expect.objectContaining({
			...ZEROED_DATA,
			target: 30000,
			seconds: 30,
		}),
	);

	demo.start(); // Triggers first step/tick
	// Advance time by 5 seconds
	CLOCK.tick(5000); // === jest.advanceTimersByTime(5000)
	snapshot = demo.stop();
	CLOCK.runAll(); // === `jest.runAllTimers()`

	expect(demo.status()).toEqual(expect.objectContaining(snapshot));
	// expect(demo.status()).toHaveReturnedWith(snapshot);
	expect(STEP).toHaveBeenCalledTimes(6);
});

test("Resuming a paused countdown restarts from time remaining", () => {
	var demo = countdown(300000, { zeroBased: false });
	var snapshot;

	demo.start();
	// Advance time by 5 seconds
	CLOCK.tick(5000); // === jest.advanceTimersByTime(5000)
	snapshot = demo.stop();
	expect(demo.start().target).toBe(snapshot.target);
});

test("Starting a zeroed/expired timer does nothing", () => {
	const STEP = mock((data) => data);
	var demo = countdown(0, {
		onStep: (data) => STEP(data),
	});

	demo.start();
	expect(STEP).not.toHaveBeenCalled();
});

test("Passing the one minute mark recalculates unit data", () => {
	const SIXTY_ONE_SECONDS = 61000;

	var demo = countdown(SIXTY_ONE_SECONDS, { zeroBased: false });

	demo.start();
	CLOCK.tick(1000); // === jest.advanceTimersByTime(1000)

	expect(demo.status().minutes).toBe(0);
	expect(demo.status().seconds).toBe(59);
});

test("onEnd() callback fires when a countdown finishes", () => {
	const END = mock((data) => data);
	var demo = countdown(1000, {
		zeroBased: false,
		onEnd: (data) => END(data),
	});
	demo.start();
	CLOCK.runAll(); // === `jest.runAllTimers()`

	expect(END).toHaveReturnedTimes(1);
	// expect(END).toHaveReturnedWith(ZEROED_DATA);
});

/**
 * Other module exports:
 * - `calculateCountdown()`
 * - `sumMilliseconds()`
 */

test("sumMilliseconds() calculates millisecond target values correctly", () => {
	expect(sumMilliseconds()).toBe(0);
	// Handling single unit
	expect(sumMilliseconds({ minutes: 3 })).toBe(180000);
	expect(sumMilliseconds({ minutes: 150 })).toBe(9000000);
	expect(sumMilliseconds({ hours: 1.5 })).toBe(5400000);

	// Handling multiple units
	expect(
		sumMilliseconds({
			days: 1,
			hours: 2,
			minutes: 3,
			seconds: 4,
		}),
	).toBe(93784000);
});
