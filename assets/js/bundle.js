(function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * Time constants (commented sums to show workings)
   * @type {Number}
   */
  var MILLISECOND_DAY = 86400000; // 1000ms * 60s * 60mins * 24hrs

  var MILLISECOND_HOUR = 3600000; // 1000ms * 60s * 60mins

  var MILLISECOND_MINUTE = 60000; // 1000ms * 60s

  var MILLISECOND_SECOND = 1000; // 1000ms * 1s

  /**
   * Helper function:
   * Return an array of time unit key/values, suitable for iterating over
   */

  function setUnitMap() {
    return [{
      name: "days",
      value: MILLISECOND_DAY
    }, {
      name: "hours",
      value: MILLISECOND_HOUR
    }, {
      name: "minutes",
      value: MILLISECOND_MINUTE
    }, {
      name: "seconds",
      value: MILLISECOND_SECOND
    }];
  }
  /**
   * Calculate a countdown target time from an object of units/values
   * @param  {Object} units -- e.g. { "days": 3, "hours": 12, "minutes": 5, "seconds": 0 }
   * @return {Number}       -- time (in milliseconds)
   */


  function countDownTime() {
    var units = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return setUnitMap().reduce(function (target, mapItem) {
      var name = mapItem.name,
          value = mapItem.value;

      if (units[name]) {
        target += units[name] * value;
      }

      return target;
    }, 0);
  }
  /**
   * Break the countdown (millisecond) time value down into an object of units of time
   * @param  {Number} time -- Time in milliseconds
   * @return {Object}      -- e.g. { "target": 123456789, "days": 1, "hours": 10, "minutes": 17, "seconds": 36 }
   */


  function getCountDownData(time) {
    var units = setUnitMap();
    var result = {};
    /**
     * Recursive function: calculate per unit; add to result
     * @param  {Number} time      -- Time in milliseconds
     * @param  {Number} remainder -- (Optional) Remaining millisecond value after current unit calculation.
     *                                 Added on recursive calls
     * @param  {Number} index     -- (Optional) Added on recursive calls
     */

    function calculateUnits(time, remainder) {
      var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var unit = units[index].value;
      var nextIndex = index + 1; // First time through, remainder needs a neutral value; divide initial time value by 1

      if (typeof remainder === "undefined") {
        remainder = time / 1;
        result.target = time;
      }

      var division = remainder / unit;
      var unitResult = division >= 0 ? Math.floor(division) : 0;
      result[units[index].name] = unitResult;

      if (nextIndex < units.length) {
        calculateUnits(unitResult, remainder % unit, nextIndex);
      }
    }

    calculateUnits(time);
    return result;
  }
  /**
   * Countdown API wrapper
   * @param  {Number} milliseconds    -- Time in milliseconds
   * @return {Object}                 -- cf. Example usage section at file top
   */


  function countDown(milliseconds) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var countDownSettings = _objectSpread2({
      zeroBased: true,
      onInit: function onInit() {},
      onStep: function onStep() {},
      onReset: function onReset() {},
      onEnd: function onEnd() {}
    }, options);

    var data = {};
    var pausedTimeStamp = null;
    var timerExpired = null;
    var timerId = null;

    function addZero(units) {
      var zeroBased = countDownSettings.zeroBased;

      if (!zeroBased) {
        return units;
      }

      return Object.keys(units).reduce(function (zeroedUnits, unit) {
        var value = Number(units[unit]);
        zeroedUnits[unit] = value >= 0 && value < 10 ? "0".concat(value) : "".concat(value);
        return zeroedUnits;
      }, {});
    }

    function hasTimeLeft() {
      var _data = data,
          target = _data.target;
      return target / MILLISECOND_SECOND >= 1;
    }

    function advanceTimerData() {
      // Manually countdown seconds; avoids need need to call `getData(...)`
      // (four recursive calls) every second
      data.target -= MILLISECOND_SECOND;

      if (data.seconds > 0) {
        data.seconds -= 1;
      } else {
        // Call `getData(...)` once a minute
        data = getCountDownData(data.target);
      }
    }

    function tick() {
      var onEnd = countDownSettings.onEnd,
          onStep = countDownSettings.onStep;

      if (!hasTimeLeft()) {
        stopTimer();
        onEnd.call(countDownSettings, addZero(data));
        timerExpired = true;
        return;
      }

      advanceTimerData();
      onStep.call(countDownSettings, addZero(data)); // Using nested `setTimeout` calls for accuracy & efficiency;
      // more breathing space for garbage collection, etc
      // (e.g. `setInterval` does not guarantee one second time intervals)

      timerId = setTimeout(tick, MILLISECOND_SECOND);
    }

    function startTimer(time) {
      // Quick get-out clauses:
      // Countdown is already over, or timer already in progress
      if (!hasTimeLeft() || timerId || timerExpired) {
        return;
      }

      tick();
      pausedTimeStamp = null;
      return data;
    }

    function stopTimer() {
      clearTimeout(timerId);
      timerId = null;
    }

    function status() {
      return addZero(data);
    }

    function start() {
      if (!pausedTimeStamp) {
        return startTimer();
      }

      return startTimer();
    }

    function stop() {
      stopTimer();
      pausedTimeStamp = data.target;
      return data;
    }

    function reset() {
      var onReset = countDownSettings.onReset;
      stopTimer();
      pausedTimeStamp = null;
      timerExpired = true;
      data = getCountDownData(0);
      onReset.call(countDownSettings, addZero(data));
      return data;
    }

    (function init() {
      var onInit = countDownSettings.onInit;
      data = getCountDownData(milliseconds);
      onInit.call(countDownSettings, addZero(data));
    })(); // PUBLIC API


    return {
      status: status,
      start: start,
      stop: stop,
      reset: reset
    };
  }

  function getDateTarget(datetime) {
    var date = new Date(datetime);
    return {
      date: date,
      milliseconds: date.getTime()
    };
  }

  function getCountDownElements(parentSelector) {
    var element = document.querySelector(parentSelector);
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

  function updateTimeElements() {
    var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var prev = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    requestAnimationFrame(function () {
      ["days", "hours", "minutes", "seconds"].map(function (unit) {
        compareValues(prev[unit], next[unit], elements[unit]);
      });
    });
  }
  /**
   * COUNTDOWN EXAMPLE #1
   * How long to New Year's day
   */


  var newYearDateTime = "".concat(new Date().getFullYear() + 1, "-01-01T00:00:00");
  var newYearTarget = getDateTarget(newYearDateTime);
  var newYearTimeElement = document.querySelector(".newyear-date");
  newYearTimeElement.setAttribute("datetime", newYearDateTime);
  var newYearCountDown = countDown(newYearTarget.milliseconds - Date.now(), {
    elements: getCountDownElements(".newyear-countdown"),
    prevData: null,
    onInit: function onInit(data) {
      this.prevData = _objectSpread2({}, data);
      updateTimeElements(this.elements, data);
    },
    onStep: function onStep(data) {
      updateTimeElements(this.elements, data, this.prevData);
      this.prevData = _objectSpread2({}, data);
    },
    onReset: function onReset(data) {
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

  var threeMinsTarget = countDownTime({
    minutes: 3
  }); // e.g. 180000

  var threeMinsCountDown = countDown(threeMinsTarget, {
    elements: getCountDownElements(".threeminute-countdown"),
    prevData: null,
    onInit: function onInit(data) {
      this.prevData = _objectSpread2({}, data);
    },
    onStep: function onStep(data) {
      updateTimeElements(this.elements, data, this.prevData);
      this.prevData = _objectSpread2({}, data);
    },
    onEnd: function onEnd(data) {
      var status = document.querySelector(".threeminute-countdown--status");
      updateTimeElements(this.elements, data);
      console.log("[Countdown #2] onEnd was called. Your three minutes are up!");
      status.textContent = "Your three minutes are up!";
      this.prevData = null;
    }
  });
  console.log("threeMinsCountDown: ", threeMinsCountDown);
  threeMinsCountDown.start();

}());
