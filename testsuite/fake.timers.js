/**
 * Fake-Timers (Sinon JS)
 * ======================
 * Add SinonJS's fake timers to cover missing implementation in Bun.
 *
 * -- https://bun.sh/docs/test/writing#matchers
 * -- https://js2brain.com/blog/fake-timers-in-bun-test (@tmp solution)
 */

import { install } from "@sinonjs/fake-timers";
import { afterAll, beforeEach } from "bun:test";

export function fakeTimers() {
	var clock = install(); // === jest.useFakeTimers()

	beforeEach(() => {
		clock.reset(); // === jest.clearAllTimers()
	});

	afterAll(() => {
		clock.uninstall(); // === jest.restoreCurrentDate()
	});

	return clock;
}
