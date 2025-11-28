//Query Parameter Redirect Handler for news-single page
(function () {
  // Get the postId from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");

  // If no postId, do nothing
  if (!postId) {
    console.warn("No postId found in query parameters");
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
    // Redirect to news homepage as fallback
    window.location.href = "/news";
    return;
  }

  // Construct the full article URL
  const articleLink = `/news/${articleSlug}`;

  // Redirect to the article
  console.log(`Redirecting postId ${postId} to article: ${articleLink}`);
  window.location.href = articleLink;
})();
