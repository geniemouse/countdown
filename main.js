// CSS bundle files
import "./css/_theme.css";
import "./css/utilities.css";

// JavaScript bundle files
import APP from "./js/app.js";
import { sumMilliseconds } from "./js/countdown/countdown.js";
import countdownUI, {
	updateDateTimeAttribute,
} from "./js/countdown/countdown.ui.js";

document.querySelector("#project_version").innerHTML = `${APP.VERSION}`;

/**
 * COUNTDOWN EXAMPLE #1
 * How long to New Year's day
 */
const ELEMENT_NYD = document.querySelector(".countdown_newyear");
const NEW_YEAR_TARGET = (function getNewYearsDayInMilliseconds() {
	const NYS_DAY = `${new Date().getFullYear() + 1}-01-01T00:00:00`;
	return new Date(NYS_DAY).getTime() - Date.now();
})();

var newYearCountdown = countdownUI(ELEMENT_NYD, NEW_YEAR_TARGET, {
	name: "[CountdownUI/New Year's Day]",
	onInit(data) {
		this.elements.datetime = ELEMENT_NYD.querySelector(
			".countdown_newyear time[datetime]",
		);
	},
	onStep(data) {
		// Update `<time [datetime]>`
		updateDateTimeAttribute(
			this.elements.datetime,
			"P${days}DT${hours}H${minutes}M${seconds}S",
		)(data);
	},
});

// Expose the countdown instance so it can be played with in DevTools
console.log("New Year Countdown: ", newYearCountdown);
newYearCountdown.start();

/**
 * COUNTDOWN EXAMPLE #2
 * Three minute countdown
 * -- Demonstrates `sumMilliseconds()` utility method
 */
const ELEMENT_3MINS = document.querySelector(".countdown_threeminutes");

var threeMinuteCountdown = countdownUI(
	ELEMENT_3MINS,
	sumMilliseconds({ minutes: 3 }),
	{
		name: "[CountdownUI/3-minutes]",
		endMessage: "has completed!",
		onInit(data) {
			this.elements.datetime = ELEMENT_3MINS.querySelector(
				".countdown_threeminutes time[datetime]",
			);
		},
		onStep(data) {
			// Update `<time [datetime]>`
			updateDateTimeAttribute(
				this.elements.datetime,
				"PT${minutes}M${seconds}S",
			)(data);
		},
		onEnd(data) {
			// Update live region to announce completion
			document.querySelector(
				".countdown_threeminutes--status",
			).textContent = ` ${this.endMessage}`;
			console.log(
				`${this.name} onEnd was called. Three-minute countdown ${this.endMessage}`,
			);
		},
	},
);

// Expose the countdown instance so it can be played with in DevTools
console.log("Three Minute Countdown: ", threeMinuteCountdown);
threeMinuteCountdown.start();
