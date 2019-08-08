import countDown from "./modules/countdown.js";

// DOM elements
const $target = document.querySelector(".target-date");
const $countdown = document.querySelector(".countdown");
const $days = $countdown.querySelector(".days");
const $hours = $countdown.querySelector(".hours");
const $minutes = $countdown.querySelector(".minutes");
const $seconds = $countdown.querySelector(".seconds");

function getDateTarget(datetime) {
    const date = new Date(datetime);
    return {
        date,
        milliseconds: date.getTime()
    };
}

const { date, milliseconds } = getDateTarget($countdown.getAttribute("datetime"));
const demoCountDown = countDown(milliseconds - Date.now());
// const demoCountDown = countDown(123456789);
console.log("demoCountDown: ", demoCountDown);

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

demoCountDown.start({
    func: (data) => {
        requestAnimationFrame(() => updateCountDown(data));
    }
});
