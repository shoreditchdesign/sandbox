//Textarea Resizer
document.addEventListener("DOMContentLoaded", () => {
  const textareas = document.querySelectorAll("textarea");

  textareas.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
});

//Tab Injection
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, starting clone operation");

  // Find wrapper element
  const wrapper = document.querySelector('[data-clone-source="wrap"]');
  if (!wrapper) {
    console.log("Wrapper element not found, returning");
    return;
  }
  console.log("Wrapper found:", wrapper);

  // Find source elements inside wrapper
  const sourceLink = wrapper.querySelector('[data-clone-source="link"]');
  const sourcePane = wrapper.querySelector('[data-clone-source="pane"]');

  if (!sourceLink) {
    console.log("Source link element not found, returning");
    return;
  }
  if (!sourcePane) {
    console.log("Source pane element not found, returning");
    return;
  }
  console.log("Source elements found - link:", sourceLink, "pane:", sourcePane);

  // Find ALL target elements
  const targetLinks = document.querySelectorAll('[data-clone-target="link"]');
  const targetPanes = document.querySelectorAll('[data-clone-target="pane"]');

  if (targetLinks.length === 0) {
    console.log("No target link elements found, returning");
    return;
  }
  if (targetPanes.length === 0) {
    console.log("No target pane elements found, returning");
    return;
  }
  console.log(
    `Found ${targetLinks.length} target links and ${targetPanes.length} target panes`,
  );

  // Clone source link to all target links
  targetLinks.forEach((targetLink, index) => {
    const clonedLink = sourceLink.cloneNode(true);
    targetLink.appendChild(clonedLink);
    console.log(`Cloned source link to target link ${index + 1}`);
  });

  // Clone source pane to all target panes
  targetPanes.forEach((targetPane, index) => {
    const clonedPane = sourcePane.cloneNode(true);
    targetPane.appendChild(clonedPane);
    console.log(`Cloned source pane to target pane ${index + 1}`);
  });

  // Delete wrapper
  wrapper.remove();
  console.log("Clone operation complete, wrapper deleted");
});

//Dynamic Layouts
document.addEventListener("DOMContentLoaded", function () {
  // Remove offset items from grid
  function remove(grid) {
    const offset = grid.getAttribute("data-news-offset");
    if (!offset) return;

    const offsetNum = parseInt(offset, 10);
    if (isNaN(offsetNum) || offsetNum <= 0) return;

    const gridItems = Array.from(grid.children);
    const itemsToRemove = gridItems.slice(0, offsetNum - 1);
    itemsToRemove.forEach((item) => item.remove());
  }

  // Add 'wide' class to specific items based on interval
  function layout(grid) {
    const gridItems = Array.from(grid.children);
    const intervalAttr = grid.getAttribute("data-news-grid");
    const interval =
      intervalAttr && !isNaN(parseInt(intervalAttr, 10))
        ? parseInt(intervalAttr, 10)
        : 10;

    gridItems.forEach((item, index) => {
      if (index % (interval - 1) === 0 && index === 0) {
        item.classList.add("wide");
      } else if (index > 0 && (index + 1) % interval === 0) {
        item.classList.add("wide");
      }
    });
  }

  // Remove all 'wide' classes from grid
  function reset(grid) {
    const gridItems = Array.from(grid.children);
    gridItems.forEach((item) => item.classList.remove("wide"));
  }

  // Check device and setup responsive behavior
  function checkDevice(grid) {
    const hasMobileAttr = grid.hasAttribute("data-grid-mobile");

    // Check if should apply layout based on device
    const shouldApply = () => {
      if (!hasMobileAttr) return true;
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      return mediaQuery.matches;
    };

    // Apply or reset layout based on device check
    if (!shouldApply()) {
      reset(grid);
      return;
    }
    reset(grid);
    layout(grid);

    // Setup responsive listener if mobile attribute exists
    if (hasMobileAttr) {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      const handleMediaQueryChange = (e) => {
        if (e.matches) {
          layout(grid);
        } else {
          reset(grid);
        }
      };
      mediaQuery.addEventListener("change", handleMediaQueryChange);
    }
  }

  // Process a single grid
  function initialiseLayout(grid) {
    remove(grid);
    checkDevice(grid);
  }

  // Check pagination and setup load more buttons
  function checkPagination() {
    const loadMoreButtons = document.querySelectorAll("[data-news-load]");

    loadMoreButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Find associated grid (assumes button is near/in grid context)
        const grid = document.querySelector("[data-news-grid]");
        if (!grid) return;

        // Wait for new content to be added, then reprocess
        setTimeout(() => {
          checkDevice(grid);
        }, 100);
      });
    });
  }

  // Main execution
  const newsGrids = document.querySelectorAll("[data-news-grid]");
  if (newsGrids.length === 0) return;

  newsGrids.forEach((grid) => initialiseLayout(grid));
  checkPagination();
});

//Query Parameters
document.addEventListener("DOMContentLoaded", function () {
  const newsQueryElement = document.querySelector("[data-search-query]");

  //Check if attribute exists
  if (!newsQueryElement) {
    return;
  }

  const currentUrl = window.location.href;
  const queryMatch = currentUrl.match(/[?&]query=([^&]+)/);

  if (queryMatch && queryMatch[1]) {
    const decodedQuery = decodeURIComponent(queryMatch[1].replace(/\+/g, " "));
    newsQueryElement.textContent = decodedQuery;
  } else {
  }
});

//Sidebar Injection
document.addEventListener("DOMContentLoaded", function () {
  // Check for data-sidebar-source and data-sidebar-target
  const sidebarSource = document.querySelector("[data-sidebar-source]");
  const sidebarTarget = document.querySelector("[data-sidebar-target]");

  if (!sidebarSource || !sidebarTarget) {
    return;
  }

  // Store the original parent and next sibling to restore position later
  const originalParent = sidebarSource.parentNode;
  const originalNextSibling = sidebarSource.nextSibling;

  // Define a media query for tablet and below (max-width 768px)
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  const handleMediaQueryChange = (e) => {
    if (e.matches) {
      // If screen is tablet or below, move the sidebar to the target
      if (sidebarSource.parentNode !== sidebarTarget) {
        sidebarTarget.appendChild(sidebarSource);
      }
    } else {
      // If screen is larger than tablet, move it back to original position
      if (sidebarSource.parentNode !== originalParent) {
        if (originalNextSibling) {
          originalParent.insertBefore(sidebarSource, originalNextSibling);
        } else {
          originalParent.appendChild(sidebarSource);
        }
      }
    }
  };

  // Initial check
  handleMediaQueryChange(mediaQuery);

  // Listen for changes in the media query
  mediaQuery.addEventListener("change", handleMediaQueryChange);
});
