import countDown from "./countdown/countdown.js";

// DOM elements
const $target = document.querySelector(".target-date");
const $countdown = document.querySelector(".countdown");
const $days = $countdown.querySelector(".days");
const $hours = $countdown.querySelector(".hours");
const $minutes = $countdown.querySelector(".minutes");
const $seconds = $countdown.querySelector(".seconds");

const $target2 = document.querySelector(".target-date2");
const $countdown2 = document.querySelector(".countdown2");
const $days2 = $countdown2.querySelector(".days");
const $hours2 = $countdown2.querySelector(".hours");
const $minutes2 = $countdown2.querySelector(".minutes");
const $seconds2 = $countdown2.querySelector(".seconds");

function getDateTarget(datetime) {
    const date = new Date(datetime);
    return {
        date,
        milliseconds: date.getTime()
    };
}

const { date, milliseconds } = getDateTarget($countdown.getAttribute("datetime"));

// const demoCountDown = countDown(milliseconds - Date.now(), {
//     onStep: (data) => {
//         requestAnimationFrame(() => updateCountDown(data));
//     },
//     onReset: (data) => {
//         console.log("[Countdown #1] onReset was called");
//         requestAnimationFrame(() => updateCountDown(data));
//     }
// });

// 123456
const demoCountDown2 = countDown(5000, {
    onInit: (data) => {
        console.log("[Countdown #2] onInit was called", data);
        requestAnimationFrame(() => updateCountDown2(data));
    },
    onEnd: (data) => {
        console.log("[Countdown #2] onEnd was called", data);
    },
    onStep: (data) => {
        requestAnimationFrame(() => updateCountDown2(data));
    },
    onReset: (data) => {
        console.log("[Countdown #2] onReset was called");
        requestAnimationFrame(() => updateCountDown2(data));
    }
});

// console.log("demoCountDown: ", demoCountDown);
console.log("demoCountDown2: ", demoCountDown2);

// Update DOM elements
$target.textContent = date;

function updateUnit(previous, next, element) {
    if (next !== previous) {
        element.textContent = next;
    }
}

function updateCountDown(data) {
    // updateUnit(prev.days, data.days, $days);
    // updateUnit(prev.hours, data.hours, $hours);
    // updateUnit(prev.minutes, data.minutes, $minutes);

    $days.textContent = data.days;
    $hours.textContent = data.hours;
    $minutes.textContent = data.minutes;

    $seconds.textContent = data.seconds;
    // prev = { ...data };
}

function updateCountDown2(data) {
    $days2.textContent = data.days;
    $hours2.textContent = data.hours;
    $minutes2.textContent = data.minutes;
    $seconds2.textContent = data.seconds;
}

// const sum1 = demoCountDown.status();
// console.log("sum1: ", sum1);

// demoCountDown.start();
demoCountDown2.start();

// setTimeout(() => {
//     console.log("Stop countdown #1");
//     demoCountDown.stop();
// }, 4000);
