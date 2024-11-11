/**
 * APP API Manifest
 * ================
 */

import countdown, {
	calculateCountdown,
	sumMilliseconds,
} from "./countdown/countdown.js";

import pkg from "../package.json";

// Create basic APP API structure & expose it on the global `window` object
window.APP = {
	VERSION: `v${pkg.version}`,
	API: {
		countdown,
		calculateCountdown,
		sumMilliseconds,
	},
};

export default window.APP;
