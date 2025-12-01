//Query Parameter Redirect Handler for news-single page
document.addEventListener("DOMContentLoaded", function () {
  // Check redirect flag once
  const redirectFlag = document.querySelector("[data-post-redirect]");
  const shouldRedirect =
    !redirectFlag || redirectFlag.getAttribute("data-post-redirect") !== "0";

  // Get postId from URL once
  const postId = new URLSearchParams(window.location.search).get("postId");

  // Wait for tab focus, then start countdown and wait for Finsweet pagination to load
  waitForFocus(() => {
    startCountdown();
    setTimeout(() => {
      performRedirect(postId, shouldRedirect);
    }, 3000);
  });

  function performRedirect(postId, shouldRedirect) {
    // Single nested if-else logic tree
    if (!postId) {
      // No postId in URL
      if (shouldRedirect) {
        window.location.href = "/news";
      }
    } else {
      // PostId exists, try to find article
      const articleSlug = findArticleSlug(postId);

      if (!articleSlug) {
        // Article not found in DOM
        if (shouldRedirect) {
          window.location.href = "/news";
        }
      } else {
        // Article found
        if (shouldRedirect) {
          window.location.href = `/news/${articleSlug}`;
        }
      }
    }
  }

  function findArticleSlug(postId) {
    const allPostTargets = document.querySelectorAll("[data-post-target]");

    for (const item of allPostTargets) {
      const postIdElement = item.querySelector("[data-post-id]");
      const postSlugElement = item.querySelector("[data-post-slug]");

      if (postIdElement && postIdElement.textContent.trim() === postId) {
        return postSlugElement ? postSlugElement.textContent.trim() : null;
      }
    }

    return null;
  }

  function waitForFocus(callback) {
    if (document.hasFocus()) {
      callback();
    } else {
      window.addEventListener("focus", function onFocus() {
        window.removeEventListener("focus", onFocus);
        callback();
      });
    }
  }

  function startCountdown() {
    const countdownElement = document.querySelector("[data-post-time]");
    if (!countdownElement) return;

    const startTime =
      parseInt(countdownElement.getAttribute("data-time-start")) || 3;
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
});
