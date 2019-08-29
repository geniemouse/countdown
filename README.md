# Countdown API

<!-- MarkdownTOC -->

1. [Initialising](#initialising)
1. [Options](#options)
    1. [`zeroBased` \(boolean\)](#zerobased-boolean)
    1. [`onInit` \(function\)](#oninit-function)
    1. [`onStep` \(function\)](#onstep-function)
    1. [`onEnd` \(function\)](#onend-function)
    1. [`onReset` \(function\)](#onreset-function)
1. [Methods](#methods)
    1. [`status()`](#status)
    1. [`start()`](#start)
    1. [`stop(options)`](#stopoptions)
    1. [`pause()`](#pause)
    1. [`resume()`](#resume)
1. [Additional exported utilities](#additional-exported-utilities)
    1. [`countDownTime(units)`](#countdowntimeunits)
    1. [`getCountDownData(millisecond_time)`](#getcountdowndatamillisecond_time)
1. [Install this demo project](#install-this-demo-project)

<!-- /MarkdownTOC -->

# Initialising

```
countDown(DATETIME_TARGET_MILLISECONDS [, options])

// EXAMPLE
import countDown from "./PROJECT_JAVASCRIPT_LOCATION/countdown/countdown";

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

## `zeroBased` (boolean)

Default: `true`

Determines if the countdown values should return as strings or integers.

When `true`, values between 0 and 10 return with a leading zero.

This setting remains for all further countdown API calls on a particular instance.

```
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

Callback function that triggers once, when a `countDown` has reached zero.

## `onReset` (function)

Default: Empty function

Callback function that triggers once, when a `countDown` has been stopped with the reset flag set to `true` (e.g. `myCountDown.stop({ reset: true })`).

---

# Methods

## `status()`

Returns an object containing the current state of the countdown timer.

```
aCountDown.status()
// { days: "01", hours: "02", minutes: "03", seconds: "04", target: "93784000" }
```

## `start()`

Starts the countdown timer.

```
aCountDown.start()
```

## `stop(options)`

Stops the countdown timer.

`stop` can receive one optional parameter, an object with a `reset` property/`boolean` to zero-out all the time unit values of the countdown timer.

```
aCountDown.stop();

aCountDown.stop({ reset: true });
// { days: "00", hours: "00", minutes: "00", seconds: "00", target: "00" }
```

## `pause()`

Pauses the countdown timer; it can be restarted by calling `resume()`.

```
aCountDown.pause()
```

## `resume()`

Resume a previously `paused()` countdown timer.

```
aCountDown.resume()
```

---

# Additional exported utilities

## `countDownTime(units)`

A utility function to calculate time in milliseconds when passed an object of time units:

-   days
-   hours
-   minutes
-   seconds

Any properties omitted from the options default to zero.

```
import { countDownTime } from "./PROJECT_JAVASCRIPT_LOCATION/countdown/countdown";

const countDownTargetTime = countDownTime({ days: 1, hours: 2, minutes: 3, seconds: 4 });
// 93784000
```

## `getCountDownData(millisecond_time)`

A recursive function that calculates and returns an object containing the time unit breakdown of a millisecond target time (without the rest of countdown API).

Equivalent to using [`aCountDown.status()`](#status) from the API.

```
import { getCountDownData } from "./PROJECT_JAVASCRIPT_LOCATION/countdown/countdown";

const data = getCountDownData(93784000);
// { days: "01", hours: "02", minutes: "03", seconds: "04", target: "93784000" }
```

---

# Install this demo project

```
# Install project (one-time operation)
git clone https://github.com/geniemouse/countdown.git
cd countdown
yarn install

# ---

# Then, from inside the countdown directory
# Serve & run the countdown
yarn start
```
