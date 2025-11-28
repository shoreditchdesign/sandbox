//Query Parameter Redirect Handler for news-single page
(function () {
  // Wait for DOM to be ready to check redirect flag
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    // Wait 20 seconds for all articles to load via Finsweet pagination
    setTimeout(() => {
      // Check redirect flag for testing purposes
      const redirectFlag = document.querySelector("[data-post-redirect]");
      const flagValue = redirectFlag
        ? redirectFlag.getAttribute("data-post-redirect")
        : null;
      const shouldRedirect = !flagValue || flagValue !== "0";

      console.log("Redirect flag found:", redirectFlag);
      console.log("Redirect flag value:", flagValue || "not found");
      console.log("Should redirect:", shouldRedirect);

      // Get the postId from the query parameter
      const urlParams = new URLSearchParams(window.location.search);
      const postId = urlParams.get("postId");

      // If no postId, redirect to news homepage (unless flag is 0)
      if (!postId) {
        console.warn("No postId found in query parameters");
        if (shouldRedirect) {
          window.location.href = "/news";
        } else {
          console.log(
            "Redirect disabled for testing - staying on /news-single",
          );
        }
        return;
      }

      // Find the parent item with data-post-target that contains the matching postId
      const allPostTargets = document.querySelectorAll("[data-post-target]");
      let articleSlug = null;

      for (const item of allPostTargets) {
        const postIdElement = item.querySelector("[data-post-id]");
        const postSlugElement = item.querySelector("[data-post-slug]");

        if (postIdElement && postIdElement.textContent.trim() === postId) {
          if (postSlugElement) {
            articleSlug = postSlugElement.textContent.trim();
            break;
          }
        }
      }

      if (!articleSlug) {
        console.warn(`No article found for postId: ${postId}`);
        // Redirect to news homepage if postId not found (unless flag is 0)
        if (shouldRedirect) {
          window.location.href = "/news";
        } else {
          console.log(
            "Redirect disabled for testing - staying on /news-single",
          );
        }
        return;
      }

      // Construct the full article URL
      const articleLink = `/news/${articleSlug}`;

      // Redirect to the article
      console.log(`Redirecting postId ${postId} to article: ${articleLink}`);
      window.location.href = articleLink;
    }, 20000);
  }
})();
