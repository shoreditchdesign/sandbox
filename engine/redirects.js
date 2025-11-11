//404 Redirect Handler
function handleRedirect() {
  // Configuration: Add parent folders that should redirect to their landing page
  const redirectCategories = ["/news"];

  // Get the current URL that led to this 404 page
  const currentPath = window.location.pathname;

  // Exit early if we're on the homepage or root - show the page
  if (currentPath === "/" || currentPath === "") {
    document.body.classList.remove("hide");
    return;
  }

  // Extract path segments and check depth
  function getPathInfo(path) {
    // Remove trailing slash if present
    const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;

    // Split path into segments and filter out empty strings
    const segments = cleanPath.split("/").filter((segment) => segment !== "");

    return {
      segments: segments,
      depth: segments.length,
      parentFolder: segments.length > 0 ? `/${segments[0]}` : null,
    };
  }

  // Check if we should perform redirect
  function shouldRedirect(pathInfo) {
    // Only redirect if we're at level 2 or deeper (e.g., /news/article-123)
    // Exit early for level 0 (/) or level 1 (/news, /resources, etc.)
    if (pathInfo.depth <= 1) {
      return null;
    }

    // Check if the parent folder exists in our redirect categories
    const matchedCategory = redirectCategories.find(
      (category) => category === pathInfo.parentFolder,
    );

    return matchedCategory || null;
  }

  // Main execution
  const pathInfo = getPathInfo(currentPath);
  const redirectTarget = shouldRedirect(pathInfo);

  if (redirectTarget) {
    // Redirect to parent folder - keep page hidden, no style changes needed
    console.log(`Redirecting from ${currentPath} to ${redirectTarget}`);
    window.location.href = redirectTarget;
  } else {
    // Authentic 404 - show the 404 page
    document.body.classList.remove("hide");
    console.log(
      `No redirect rule found for path: ${currentPath} (depth: ${pathInfo.depth}, parent: ${pathInfo.parentFolder})`,
    );
  }
}

handleRedirect();
