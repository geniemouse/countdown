import * as countDown from "./modules/countdown.js";

const $countdown = document.querySelector(".countdown");
const $days = $countdown.querySelector(".days");
const $hours = $countdown.querySelector(".hours");
const $minutes = $countdown.querySelector(".minutes");
const $seconds = $countdown.querySelector(".seconds");

var dateTarget = new Date($countdown.getAttribute("datetime"));
var target = dateTarget.getTime();
// var target = Date.now() + 1000 * 65;

console.log("What is target date? ", new Date(target));

let prev = countDown.getCountDownUnits(target - Date.now());

$days.textContent = prev.days;
$hours.textContent = prev.hours;
$minutes.textContent = prev.minutes;
$seconds.textContent = prev.seconds;

function updateUnit(previous, next, element) {
    if (next !== previous) {
        element.textContent = next;
    }
}

function updateCountDown(data) {
    updateUnit(prev.days, data.days, $days);
    updateUnit(prev.hours, data.hours, $hours);
    updateUnit(prev.minutes, data.minutes, $minutes);
    $seconds.textContent = data.seconds;
    prev = { ...data };
}

countDown.startCountDown(target - Date.now(), {
    func: (data) => {
        requestAnimationFrame(() => updateCountDown(data));
    }
});

