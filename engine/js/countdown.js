// Countdown timer for post redirect
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const countdownElement = document.querySelector("[data-post-time]");
    if (!countdownElement) return;

    const startTime =
      parseInt(countdownElement.getAttribute("data-time-start")) || 20;
    let timeRemaining = startTime;
    countdownElement.textContent = timeRemaining;

    const interval = setInterval(() => {
      timeRemaining--;
      countdownElement.textContent = timeRemaining;

      if (timeRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
})();
