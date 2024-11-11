# Countdown API <!-- omit in toc -->

- [Initialising](#initialising)
- [Options](#options)
	- [`zeroBased` (boolean)](#zerobased-boolean)
	- [`onInit` (function)](#oninit-function)
	- [`onStep` (function)](#onstep-function)
	- [`onEnd` (function)](#onend-function)
	- [`onReset` (function)](#onreset-function)
- [Methods](#methods)
	- [`status()`](#status)
	- [`start()`](#start)
	- [`stop()`](#stop)
	- [`reset()`](#reset)
- [Additional exported utilities](#additional-exported-utilities)
	- [`calculateCountdown(millisecond_time)`](#calculatecountdownmillisecond_time)
	- [`sumMilliseconds(units)`](#summillisecondsunits)
- [Install this demo project](#install-this-demo-project)
- [Other commands](#other-commands)

---

# Initialising

```javascript
countDown(DATETIME_TARGET_MILLISECONDS [, options])

// EXAMPLE
import countDown from "./PROJECT_JAVASCRIPT_LOCATION/countdown/countdown.js";

const aCountDown = countDown(93784000, {
    zeroBased: true,
    onInit: (data) => {
        // Fire `init` event
        console.log(data);
        // { days: "01", hours: "02", minutes: "03", seconds: "04", target: "93784000" }
    },
    onStep: (data) => { /* Fire `step` event */ },
    onEnd: (data) => { /* Fire `end` event */ },
    onReset: (data) => { /* Fire `reset` event */ }
});
```

---

# Options

_NOTE:_ The options object is returned as the context (`this`) inside the callback functions scope, allowing for additional user-defined properties to be passed through and accessed. For example, in the demo, an `elements` property is added to store the instance's `DOM` elements.

## `zeroBased` (boolean)

Default: `true`

Determines if the countdown values should return as strings or integers.

When `true`, values between 0 and 10 return with a leading zero.

This setting remains for all further countdown API calls on a particular instance.

```javascript
// zeroBased: true
{ days: "01", hours: "02", minutes: "03", seconds: "04", target: "93784000" }

// zeroBased: false
{ days: 1, hours: 2, minutes: 3, seconds: 4, target: 93784000 }
```

## `onInit` (function)

Default: Empty function

Callback function that triggers once, on initialisation of a `countDown` instance.

## `onStep` (function)

Default: Empty function

Callback function that triggers once every second, while a `countDown` is running (i.e. started/resumed).

## `onEnd` (function)

Default: Empty function

Callback function that triggers once, when a `countDown` reaches zero.

## `onReset` (function)

Default: Empty function

Callback function that triggers once, when a `countDown` is reset. Once reset, it can't be restarted; a new initialisation would be required.

---

# Methods

## `status()`

Returns an object containing the current state of the countdown timer.

```javascript
aCountDown.status()
// { days: "01", hours: "02", minutes: "03", seconds: "04", target: "93784000" }
```

## `start()`

Starts (or restarts) the countdown timer from the target time remaining. At this point, `onStep` callbacks begin/resume, firing once every second.

```javascript
aCountDown.start()
```

## `stop()`

Stops (or pauses) the countdown timer. At this point, `onStep` callbacks cease.

```javascript
aCountDown.stop();
```

## `reset()`

Resets a countdown timer data to zero and fires the `onReset` callback.

A reset countdown can't be restarted.

```javascript
aCountDown.reset()
```

---

# Additional exported utilities

## `calculateCountdown(millisecond_time)`

A recursive function that calculates and returns an object containing the time unit breakdown of a millisecond target time (without the rest of countdown API).

Equivalent to using [`aCountDown.status()`](#status) from the API.

```javascript
import { calculateCountdown } from "./PROJECT_LOCATION/countdown/countdown.js";

const data = calculateCountdown(93784000);
// { days: "01", hours: "02", minutes: "03", seconds: "04", target: "93784000" }
```

## `sumMilliseconds(units)`

A utility function that totals the time (in milliseconds) from a specified 
unit/value object input:

-   "days"
-   "hours"
-   "minutes"
-   "seconds"

Any properties omitted from the options object default to zero.

```javascript
import { sumMilliseconds } from "./PROJECT_LOCATION/countdown/countdown.js";

var threeMinuteTotal = sumMilliseconds({ minutes: 3 });
// => 180000 (ms)

var threeDayTotal =  sumMilliseconds({ minutes: 62, seconds: 5 });
// => 3725000 (ms)
```

---

# Install this demo project

This project is best run using `bun`. For instructions on installation, visit the [Bun website](https://bun.sh/).

```bash
# Install project (one-time operation)
git clone https://github.com/geniemouse/countdown.git
cd countdown
bun install

# ---

# Then, from inside the countdown directory
# Run & serve the countdown demo in developer mode
bun start
```

# Other commands

```bash
# Developer mode: run & serve demo, including live reload/hot-module replacement
bun start

# ---
# Run unit tests:
bun test
# Or
bun test:watch

# Final build/preview bundling, etc.
bun preview
bun build
```
