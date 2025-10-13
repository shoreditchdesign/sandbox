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
  // Find all news grids
  const newsGrids = document.querySelectorAll("[data-news-grid]");
  if (newsGrids.length === 0) {
    return;
  }

  // Process each news grid
  newsGrids.forEach((newsGrid, gridIndex) => {
    // Get all direct children of the news grid
    let gridItems = Array.from(newsGrid.children);

    // Check for data-news-offset attribute
    const offset = newsGrid.getAttribute("data-news-offset");
    if (offset) {
      const offsetNum = parseInt(offset, 10);
      if (!isNaN(offsetNum) && offsetNum > 0) {
        // Remove the first (offset - 1) items from the DOM
        // If offset is 9, we remove items 0-7 (first 8 items)
        const itemsToRemove = gridItems.slice(0, offsetNum - 1);
        itemsToRemove.forEach((item) => item.remove());

        // Update gridItems array to reflect remaining items
        gridItems = Array.from(newsGrid.children);
      }
    }

    // Get the interval from data-news-grid attribute (default to 10)
    const intervalAttr = newsGrid.getAttribute("data-news-grid");
    const interval =
      intervalAttr && !isNaN(parseInt(intervalAttr, 10))
        ? parseInt(intervalAttr, 10)
        : 10;
    console.log(`Using interval of ${interval} for grid ${gridIndex + 1}`);

    // Add 'wide' class to every nth item starting at index 0
    // If interval is 10: indexes 0, 9, 18, 27, etc. (1st, 10th, 19th, 28th cards)
    // If interval is 5: indexes 0, 4, 8, 12, etc. (1st, 5th, 9th, 13th cards)
    gridItems.forEach((item, index) => {
      if (index % (interval - 1) === 0 && index === 0) {
        // First item always gets wide
        item.classList.add("wide");
      } else if (index > 0 && (index + 1) % interval === 0) {
        // Every nth item after that (10th, 20th, etc.)
        item.classList.add("wide");
      }
    });
  });
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
