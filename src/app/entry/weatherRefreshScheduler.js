(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.WeatherRefreshScheduler = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function getWeatherRefreshIntervalMs() {
    return 15 * 60 * 1000;
  }

  function scheduleWeatherRefresh(callback, intervalMs, timerApi) {
    if (typeof callback !== 'function') {
      return null;
    }

    const api = timerApi || globalThis;
    if (typeof api.setInterval !== 'function') {
      return null;
    }

    return api.setInterval(
      callback,
      intervalMs || getWeatherRefreshIntervalMs(),
    );
  }

  function clearWeatherRefreshTimer(timerId, timerApi) {
    const api = timerApi || globalThis;
    if (timerId && typeof api.clearInterval === 'function') {
      api.clearInterval(timerId);
    }
  }

  return {
    getWeatherRefreshIntervalMs,
    scheduleWeatherRefresh,
    clearWeatherRefreshTimer,
  };
});
