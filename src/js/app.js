import countDown, { countDownTime } from "./countdown/countdown.js";

function getDateTarget(datetime) {
    const date = new Date(datetime);
    return {
        date,
        milliseconds: date.getTime()
    };
}

function getCountDownElements(parentSelector) {
    const element = document.querySelector(parentSelector);
    return {
        container: element,
        days: element.querySelector(".days"),
        hours: element.querySelector(".hours"),
        minutes: element.querySelector(".minutes"),
        seconds: element.querySelector(".seconds")
    };
}

function compareValues(previousValue, nextValue, element) {
    if (element && nextValue !== previousValue) {
        element.textContent = nextValue;
    }
}

function updateTimeElements(elements = {}, next = {}, prev = {}) {
    requestAnimationFrame(() => {
        ["days", "hours", "minutes", "seconds"].map((unit) => {
            compareValues(prev[unit], next[unit], elements[unit]);
        });
    });
}

/**
 * COUNTDOWN EXAMPLE #1
 * How long to New Year's day
 */
const newYearDateTime = `${new Date().getFullYear() + 1}-01-01T00:00:00`;
const newYearCountDownElements = getCountDownElements(".newyear-countdown");
const newYearTarget = getDateTarget(newYearDateTime);
const newYearTimeElement = document.querySelector(".newyear-date");
newYearTimeElement.setAttribute("datetime", newYearDateTime);

const newYearCountDown = countDown(newYearTarget.milliseconds - Date.now(), {
    onInit: (data) => updateTimeElements(newYearCountDownElements, data),
    onStep: (prev, next) => updateTimeElements(newYearCountDownElements, next, prev),
    onReset: (data) => {
        console.log("[Countdown #1] onReset was called");
        updateTimeElements(newYearCountDownElements, data);
    }
});

console.log("newYearCountDown: ", newYearCountDown);
newYearCountDown.start();

/**
 * COUNTDOWN EXAMPLE #2
 * Three minute countdown
 * -- Demonstrates `countDownTime()`
 */
const threeMinsTarget = countDownTime({ minutes: 3 }); // e.g. 180000
const threeMinsCountDownElements = getCountDownElements(".threeminute-countdown");

const threeMinsCountDown = countDown(threeMinsTarget, {
    onStep: (prev, next) => updateTimeElements(threeMinsCountDownElements, next, prev),
    onEnd: (data) => {
        console.log("[Countdown #2] onEnd was called. Your three minutes are up!");
        updateTimeElements(threeMinsCountDownElements, data);
    }
});

console.log("threeMinsCountDown: ", threeMinsCountDown);
threeMinsCountDown.start();
