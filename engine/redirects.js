//404 Redirect Handler
function handleRedirect() {
  const redirectCategories = ["/news"];
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
    // Only redirect if we're at level 2 or deeper (e.g., /news/article-123)
    if (pathInfo.depth <= 1) {
      return null;
    }

    const matchedCategory = redirectCategories.find(
      (category) => category === pathInfo.parentFolder,
    );

    return matchedCategory || null;
  }

  const pathInfo = getPathInfo(currentPath);
  const redirectTarget = shouldRedirect(pathInfo);

  if (redirectTarget) {
    console.warn(
      "Client-side Redirect: Reference source detected, redirecting to parent page",
    );
    window.location.href = redirectTarget;
  } else {
    // Authentic 404 - show the page
    document.addEventListener("DOMContentLoaded", function () {
      document.body.classList.remove("hide");
    });
  }
}

handleRedirect();
