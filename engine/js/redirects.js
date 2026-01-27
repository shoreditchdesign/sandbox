//404 Redirect Handler
function handleRedirect() {
  const redirectCategories = ["/news"];

  // Old article category slugs from the previous site structure
  const oldArticleCategories = [
    "general-news",
    "fuel-quality",
    "availability",
    "alternative-fuels",
    "bunkering-info",
    "regulations",
  ];

  const currentPath = window.location.pathname;

  if (currentPath === "/" || currentPath === "") {
    document.addEventListener("DOMContentLoaded", function () {
      document.body.classList.remove("hide");
    });
    return;
  }

  function getPathInfo(path) {
    const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
    const segments = cleanPath.split("/").filter((segment) => segment !== "");

    return {
      segments: segments,
      depth: segments.length,
      parentFolder: segments.length > 0 ? `/${segments[0]}` : null,
    };
  }

  function shouldRedirect(pathInfo) {
    // Special case: /news-single should redirect to /news
    if (pathInfo.segments[0] === "news-single") {
      return "/news";
    }

    // Only redirect if we're at level 2 or deeper (e.g., /news/article-123)
    if (pathInfo.depth <= 1) {
      return null;
    }

    // Check if this is a /news path
    if (pathInfo.parentFolder !== "/news") {
      return null;
    }

    // Check if this is depth 3 with an old article category
    // Pattern: /news/[old-category]/[article-slug]
    if (pathInfo.depth === 3 && pathInfo.segments[0] === "news") {
      const categorySlug = pathInfo.segments[1];
      const articleSlug = pathInfo.segments[2];

      // If the middle segment is a known old category, redirect to /news/article-slug
      if (oldArticleCategories.includes(categorySlug)) {
        return `/news/${articleSlug}`;
      }
    }

    // Default behavior: redirect to /news for any other news sub-paths
    return "/news";
  }

  const pathInfo = getPathInfo(currentPath);
  const redirectTarget = shouldRedirect(pathInfo);

  if (redirectTarget) {
    console.warn("Client-side Redirect: Redirecting to", redirectTarget);
    window.location.href = redirectTarget;
  } else {
    // Authentic 404 - show the page
    document.addEventListener("DOMContentLoaded", function () {
      document.body.classList.remove("hide");
    });
  }
}

handleRedirect();
