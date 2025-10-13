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
  console.log("DOM loaded, starting news grid extended class operation");

  // Find all news grids
  const newsGrids = document.querySelectorAll("[data-news-grid]");
  if (newsGrids.length === 0) {
    console.log("News grid element not found, returning");
    return;
  }
  console.log(`Found ${newsGrids.length} news grids`);

  // Process each news grid
  newsGrids.forEach((newsGrid, gridIndex) => {
    console.log(`Processing news grid ${gridIndex + 1}:`, newsGrid);

    // Get all direct children of the news grid
    let gridItems = Array.from(newsGrid.children);
    console.log(
      `Found ${gridItems.length} grid items in grid ${gridIndex + 1}`,
    );

    // Check for data-news-offset attribute
    const offset = newsGrid.getAttribute("data-news-offset");
    if (offset) {
      const offsetNum = parseInt(offset, 10);
      if (!isNaN(offsetNum) && offsetNum > 0) {
        console.log(
          `Removing first ${offsetNum - 1} items from grid ${gridIndex + 1}`,
        );
        // Remove the first (offset - 1) items from the DOM
        // If offset is 9, we remove items 0-7 (first 8 items)
        const itemsToRemove = gridItems.slice(0, offsetNum - 1);
        itemsToRemove.forEach((item) => item.remove());

        // Update gridItems array to reflect remaining items
        gridItems = Array.from(newsGrid.children);
        console.log(
          `${gridItems.length} items remaining in grid ${gridIndex + 1} after removal`,
        );
      }
    }

    // Add 'extended' class to every 9th item starting at index 0 (indexes 0, 9, 18, 27, etc.)
    gridItems.forEach((item, index) => {
      if (index % 9 === 0) {
        item.classList.add("extended");
        console.log(
          `Added 'extended' class to item at index ${index} in grid ${gridIndex + 1}`,
        );
      }
    });
  });

  console.log("News grid extended class operation complete");
});
