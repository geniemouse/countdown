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
const newYearTarget = getDateTarget(newYearDateTime);
const newYearTimeElement = document.querySelector(".newyear-date");
newYearTimeElement.setAttribute("datetime", newYearDateTime);

const newYearCountDown = countDown(newYearTarget.milliseconds - Date.now(), {
    elements: getCountDownElements(".newyear-countdown"),
    prevData: null,
    onInit: function(data) {
        this.prevData = { ...data };
        updateTimeElements(this.elements, data);
    },
    onStep: function(data) {
        updateTimeElements(this.elements, data, this.prevData);
        this.prevData = { ...data };
    },
    onReset: function(data) {
        console.log("[Countdown #1] onReset was called");
        updateTimeElements(this.elements, data);
        this.prevData = null;
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
const threeMinsCountDown = countDown(threeMinsTarget, {
    elements: getCountDownElements(".threeminute-countdown"),
    prevData: null,
    onInit: function(data) {
        this.prevData = { ...data };
    },
    onStep: function(data) {
        updateTimeElements(this.elements, data, this.prevData);
        this.prevData = { ...data };
    },
    onEnd: function(data) {
        console.log("[Countdown #2] onEnd was called. Your three minutes are up!");
        updateTimeElements(this.elements, data);
        this.prevData = null;
    }
});

console.log("threeMinsCountDown: ", threeMinsCountDown);
threeMinsCountDown.start();
