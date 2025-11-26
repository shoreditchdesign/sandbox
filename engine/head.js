// Nuclear scroll reset - force to top at earliest possible moment
(function() {
  // Disable scroll restoration immediately
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Force scroll to top immediately (runs before DOMContentLoaded)
  window.scrollTo(0, 0);

  // Also force on load event
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });

  // Force on pageshow (including bfcache)
  window.addEventListener('pageshow', () => {
    window.scrollTo(0, 0);
  });
})();
