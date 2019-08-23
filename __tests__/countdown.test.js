import countDown, { getCountDownData } from "../src/js/countdown/countdown";

const zeroedData = {
    target: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
};

const initCallback = jest.fn((data) => data);
const stepCallback = jest.fn((data) => data);
const resetCallback = jest.fn((data) => data);
const endCallback = jest.fn((data) => data);

const defaultOptions = {
    zeroBased: false,
    onInit: (data) => {
        initCallback(data);
    },
    onStep: (data) => {
        stepCallback(data);
    },
    onReset: (data) => {
        resetCallback(data);
    },
    onEnd: (data) => {
        endCallback(data);
    }
};

function createCountDown(ms_time, options = {}) {
    return countDown(ms_time, {
        ...defaultOptions,
        ...options
    });
}

describe("Countdown module", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.clearAllTimers();
    });

    it("exports as expected", () => {
        expect(typeof countDown).toBe("function");
        expect(typeof getCountDownData).toBe("function");
    });

    it("exposes the expected public API", () => {
        const demo = createCountDown(1000);
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

    it("runs onInit callback", () => {
        const demo = createCountDown(123456000);
        expect(initCallback).toHaveReturnedWith({
            target: 123456000,
            days: 1,
            hours: 10,
            minutes: 17,
            seconds: 36
        });
    });

    it("starting an expired timer will do nothing (fails silently)", () => {
        const demo = createCountDown(0);
        demo.start();
        jest.runAllTimers();
        expect(setTimeout).toHaveBeenCalledTimes(0);
    });

    xit("loops the expected number of times", () => {
        const demo = createCountDown(3000);
        demo.start();
        jest.runAllTimers();
        expect(setTimeout).toHaveBeenCalledTimes(3);
    });

    it("runs onStep callback the expected number of times", () => {
        const demo = createCountDown(3000, {
            onStep: (data) => {
                stepCallback(data.seconds);
            }
        });
        demo.start();
        jest.runAllTimers();
        expect(stepCallback).toHaveReturnedWith(2);
        expect(stepCallback).toHaveReturnedWith(1);
        expect(stepCallback).toHaveReturnedWith(0);
        expect(stepCallback).toHaveBeenCalledTimes(3);
    });

    it("runs onEnd callback when countdown finishes", () => {
        const demo = createCountDown(3000);
        demo.start();
        jest.runAllTimers();
        expect(endCallback).toHaveReturnedWith(zeroedData);
    });

    it("stopped countdown prevents any further updates", () => {
        const demo = createCountDown(3000);
        demo.start();
        jest.advanceTimersByTime(1000);
        demo.stop();
        const stoppedStatus = demo.status();
        jest.advanceTimersByTime(1000);
        expect(demo.status()).toStrictEqual(expect.objectContaining(stoppedStatus));
    });

    it("stopping with reset flag zeroes time units and runs onReset callback", () => {
        const demo = createCountDown(3000);
        demo.stop({ reset: true });
        expect(resetCallback).toHaveReturnedWith(zeroedData);
    });

    // it("should pad values less than 10 with a leading zero", () => {
    //     let startDemo = countDown(data.input, { zeroBased: true });
    //     expect(startDemo.status()).toStrictEqual({
    //         days: 0,
    //         hours: 0,
    //         minutes: 0,
    //         seconds: 0
    //     });
    // });

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
