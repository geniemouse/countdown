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
  - [`countDownTime(units)`](#countdowntimeunits)
  - [`getCountDownData(millisecond_time)`](#getcountdowndatamillisecond_time)
- [Install this demo project](#install-this-demo-project)

---

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

_NOTE:_ The options object is returned as the context (`this`) inside the callback functions scope, allowing for additional user-defined properties to be passed through and accessed. For example, in the demo, an `elements` property is added to store the instance's `DOM` elements.

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

Callback function that triggers once, when a `countDown` has been reset.

---

# Methods

## `status()`

Returns an object containing the current state of the countdown timer.

```
aCountDown.status()
// { days: "01", hours: "02", minutes: "03", seconds: "04", target: "93784000" }
```

## `start()`

Starts (or restarts) the countdown timer from the countdown target time remaining. At this point, the `onStep` callbacks begin, firing once every second.

```
aCountDown.start()
```

## `stop()`

Stops (or pauses) the countdown timer. At this point, the `onStep` callbacks cease.

```
aCountDown.stop();
```

## `reset()`

Resets a countdown timer data to zero and fires the `onReset` callback.

A reset countdown can't be restarted.

```
aCountDown.reset()
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
