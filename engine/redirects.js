//404 Redirect Handler
document.addEventListener("DOMContentLoaded", function () {
  // Configuration: Add parent folders that should redirect to their landing page
  const redirectCategories = ["/news"];

  // Get the current URL that led to this 404 page
  const currentPath = window.location.pathname;

  // Exit early if we're on the homepage or root
  if (currentPath === "/" || currentPath === "") {
    return;
  }

  // Extract the parent folder from the current path
  function getParentFolder(path) {
    // Remove trailing slash if present
    const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;

    // Split path into segments and filter out empty strings
    const segments = cleanPath.split("/").filter((segment) => segment !== "");

    // If we have at least one segment, return the first segment as parent folder
    if (segments.length > 0) {
      return `/${segments[0]}`;
    }

    return null;
  }

  // Check if parent folder matches any redirect category
  function shouldRedirect(parentFolder) {
    if (!parentFolder) return null;

    // Check if the parent folder exists in our redirect categories
    const matchedCategory = redirectCategories.find(
      (category) => category === parentFolder,
    );

    return matchedCategory || null;
  }

  // Perform the redirect
  function redirectToParent(targetPath) {
    console.log(`Redirecting from ${currentPath} to ${targetPath}`);
    window.location.href = targetPath;
  }

  // Main execution
  const parentFolder = getParentFolder(currentPath);
  const redirectTarget = shouldRedirect(parentFolder);

  if (redirectTarget) {
    redirectToParent(redirectTarget);
  } else {
    console.log(
      `No redirect rule found for path: ${currentPath} (parent: ${parentFolder})`,
    );
  }
});
