import countDown, { getCountDownData } from "../src/js/countdown/countdown";

const data = {
    input: 123456000,
    output: {
        target: 123456000,
        days: 1,
        hours: 10,
        minutes: 17,
        seconds: 36
    }
};
const stepCallback = jest.fn();
const resetCallback = jest.fn((data) => data);

let demo;

describe("Countdown module", () => {
    beforeAll(() => {
        jest.useFakeTimers();
        demo = countDown(123456000, {
            onStep: jest.fn(),
            onReset: (data) => {
                resetCallback(data);
            }
        });
    });

    afterAll(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
        demo = null;
    });

    it("exports as expected", () => {
        expect(typeof countDown).toBe("function");
        expect(typeof getCountDownData).toBe("function");
    });

    it("exposes the expected public API", () => {
        expect(demo).toStrictEqual(
            expect.objectContaining({
                status: expect.any(Function),
                start: expect.any(Function),
                stop: expect.any(Function),
                pause: expect.any(Function),
                resume: expect.any(Function)
            })
        );
    });

    it("start() will not try to run a countdown with zero time left", () => {
        let startDemo = countDown(0);
        startDemo.start();
        // Jump programme to five seconds later
        jest.advanceTimersByTime(5000);
        expect(setTimeout).toHaveBeenCalledTimes(0);
    });

    it("with a three second countdown, start() should loop three times and stop", () => {
        let startDemo = countDown(3000);
        startDemo.start();
        // Jump programme to five seconds later
        jest.advanceTimersByTime(5000);
        expect(setTimeout).toHaveBeenCalledTimes(3);
    });

    it("stopping should prevent any further updates", () => {
        demo.start();
        jest.advanceTimersByTime(1000);
        demo.stop();
        const stoppedStatus = demo.status();
        jest.advanceTimersByTime(5000);
        expect(demo.status()).toStrictEqual(expect.objectContaining(stoppedStatus));
    });

    it("resetting zeroes time units and runs onReset callback", () => {
        const zeroedData = {
            target: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        demo.stop({ reset: true });
        expect(demo.status()).toStrictEqual(expect.objectContaining(zeroedData));
        expect(resetCallback).toHaveReturnedWith(zeroedData);
    });

    // it("status() yields expected time unit breakdown at any given point", () => {
    //     const threeMinsThreeSecs = 183000;
    //     expect(demo.status()).toStrictEqual(expect.objectContaining(data.output));
    //     demo.start();
    //     // Fast-forward the countdown...
    //     jest.advanceTimersByTime(threeMinsThreeSecs);
    //     expect(demo.status().minutes).toBe(14);
    //     expect(demo.status().seconds).toBe(32);
    // });
});
