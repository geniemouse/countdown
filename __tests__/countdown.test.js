import countDown, { countDownTime, getCountDownData } from "../src/js/countdown/countdown";

const zeroedData = {
    target: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
};

function createCountDown(ms_time, options = {}) {
    return countDown(ms_time, {
        zeroBased: false,
        ...options
    });
}

describe("Countdown module", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.clearAllTimers();
        jest.resetAllMocks();
    });

    it("exports as expected", () => {
        expect(typeof countDown).toBe("function");
        expect(typeof countDownTime).toBe("function");
        expect(typeof getCountDownData).toBe("function");
    });

    it("calculates countdown millisecond target value", () => {
        expect(countDownTime()).toBe(0);
        expect(
            countDownTime({
                days: 3,
                hours: 12,
                minutes: 5,
                seconds: 0
            })
        ).toBe(302700000);
    });

    it("exposes the expected public API", () => {
        const demo = createCountDown(1000);
        expect(demo).toStrictEqual(
            expect.objectContaining({
                status: expect.any(Function),
                start: expect.any(Function),
                stop: expect.any(Function),
                reset: expect.any(Function)
            })
        );
    });

    it("starting an expired timer will do nothing", () => {
        const stepCallback = jest.fn((data) => data);
        const demo = createCountDown(-50, {
            zeroBased: false,
            onStep: (data) => stepCallback(data)
        });
        demo.start();
        jest.runAllTimers();
        expect(stepCallback).toHaveBeenCalledTimes(0);
    });

    it("default onInit, onStep, onReset, onEnd callbacks run without error", () => {
        expect(() => {
            // onInit, onStep & onReset callback defaults
            const demo = countDown(1000);
            const spyStart = jest.spyOn(demo, "start");
            const spyStop = jest.spyOn(demo, "stop");
            demo.start();
            demo.stop({ reset: true });
        }).not.toThrow("Cannot read property 'call'");

        expect(() => {
            // onEnd callback default
            const demo = countDown(1000);
            demo.start();
            jest.runAllTimers();
        }).not.toThrow("Cannot read property 'call'");
    });

    it("zero-based option, units are strings; any values below 10 lead with a zero", () => {
        const nineDDHHMMSS = 810549000;
        const expectedOutput = {
            target: String(nineDDHHMMSS),
            days: "09",
            hours: "09",
            minutes: "09",
            seconds: "09"
        };
        const initCallback = jest.fn((data) => data);
        const demo = createCountDown(nineDDHHMMSS, {
            zeroBased: true,
            onInit: (data) => initCallback(data)
        });

        expect(initCallback).toHaveReturnedWith(expectedOutput);
        expect(demo.status()).toStrictEqual(expectedOutput);
    });

    it("ticking over the one minute mark recalculates unit data", () => {
        const sixtyOneSeconds = 61000;
        const demo = createCountDown(sixtyOneSeconds);
        demo.start();
        jest.advanceTimersByTime(1000);
        const status = demo.status();
        expect(status.minutes).toBe(0);
        expect(status.seconds).toBe(59);
    });

    it("runs onStep callback the expected number of times", () => {
        const stepCallback = jest.fn((data) => data);
        const demo = createCountDown(3000, {
            zeroBased: false,
            onStep: (data) => stepCallback(data.seconds)
        });
        demo.start();
        jest.runAllTimers();
        expect(stepCallback).toHaveReturnedWith(2);
        expect(stepCallback).toHaveReturnedWith(1);
        expect(stepCallback).toHaveReturnedWith(0);
        expect(stepCallback).toHaveBeenCalledTimes(3);
    });

    it("runs onEnd callback when countdown finishes", () => {
        const endCallback = jest.fn((data) => data);
        const demo = createCountDown(1000, {
            zeroBased: false,
            onEnd: (data) => endCallback(data)
        });
        demo.start();
        jest.runAllTimers();
        expect(endCallback).toHaveReturnedWith(zeroedData);
    });

    it("stopping countdown prevents further updates", () => {
        const demo = createCountDown(2000, {
            zeroBased: false
        });
        let stoppedStatus;
        demo.start();
        jest.advanceTimersByTime(1000);
        stoppedStatus = demo.stop();
        jest.runAllTimers();
        expect(demo.status()).toStrictEqual(expect.objectContaining(stoppedStatus));
    });

    xit("stopping with reset flag zeroes time units & runs onReset callback", () => {
        const resetCallback = jest.fn((data) => data);
        const demo = createCountDown(1000, {
            zeroBased: false,
            onReset: (data) => resetCallback(data)
        });
        demo.stop({ reset: true });
        expect(resetCallback).toHaveReturnedWith(zeroedData);
    });

    xit("resuming (after pausing) countdown restarts from the remaining time", () => {
        const demo = createCountDown(3000);
        let pausedStatus;
        expect(demo.resume()).toBeUndefined();
        demo.start();
        expect(demo.resume()).toBeUndefined();
        jest.advanceTimersByTime(1000);
        pausedStatus = demo.pause();
        expect(demo.resume().target).toBe(pausedStatus.target);
    });
});
