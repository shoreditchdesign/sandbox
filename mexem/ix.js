//Navigation Dropdowns
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing dropdown animations");

  const toggles = document.querySelectorAll('[data-nav-dd="toggle"]');
  const overlay = document.querySelector("[data-nav-dd='overlay']");
  console.log("Found toggles:", toggles.length);
  console.log("Found overlay:", overlay ? "yes" : "no");

  const overlayQuickToShow = overlay
    ? gsap.quickTo(overlay, "opacity", { duration: 0.3, ease: "power2.out" })
    : null;
  const overlayQuickToHide = overlay
    ? gsap.quickTo(overlay, "opacity", { duration: 0.3, ease: "power2.out" })
    : null;

  toggles.forEach((toggle, index) => {
    console.log(`Setting up toggle ${index + 1}`);

    const drawer = toggle.nextElementSibling;

    if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
      console.log(`Found matching drawer for toggle ${index + 1}`);

      const drawerQuickToShow = gsap.quickTo(drawer, "opacity", {
        duration: 0.3,
        ease: "power2.out",
      });
      const drawerQuickToHide = gsap.quickTo(drawer, "opacity", {
        duration: 0.3,
        ease: "power2.out",
      });

      toggle.addEventListener("mouseenter", () => {
        console.log(`Showing drawer ${index + 1}`);
        toggle.setAttribute("data-dd-state", "show");
        drawerQuickToShow(1);
        if (overlayQuickToShow) {
          overlayQuickToShow(1);
        }
      });

      toggle.addEventListener("mouseleave", () => {
        console.log(`Hiding drawer ${index + 1}`);
        toggle.setAttribute("data-dd-state", "hide");
        drawerQuickToHide(0);
        if (overlayQuickToHide) {
          overlayQuickToHide(0);
        }
      });
    }
  });
});

//Accordions
document.addEventListener("DOMContentLoaded", function () {
  // Heights storage object
  const drawerHeights = {};

  function initializeAccordions() {
    const toggles = document.querySelectorAll("[data-acc-toggle]");
    toggles.forEach((toggle, index) => {
      // Get drawer element
      const drawer = toggle.querySelector("[data-acc-drawer]");
      if (drawer) {
        // Store the drawer's content height
        const drawerContent = drawer.firstElementChild;
        const height = drawerContent.offsetHeight;
        // Store height in our object using a unique key
        const drawerId = "drawer-" + index;
        drawerHeights[drawerId] = height;
        // Set initial height to 0
        drawer.style.height = "0px";
        drawer.style.overflow = "hidden";
        drawer.style.transition = "height 0.3s ease-in-out";
        // Add data attribute to link toggle with drawer
        toggle.setAttribute("data-drawer-id", drawerId);
      }
      // Add click event listener
      toggle.addEventListener("click", handleAccordionClick);
    });
  }

  function openAccordion(toggle) {
    const drawerId = toggle.getAttribute("data-drawer-id");
    const drawer = toggle.querySelector("[data-acc-drawer]");
    // Update toggle state
    toggle.setAttribute("data-toggle-state", "open");
    // Animate height
    drawer.style.height = drawerHeights[drawerId] + "px";
  }

  function closeAccordion(toggle) {
    const drawer = toggle.querySelector("[data-acc-drawer]");
    // Update toggle state
    toggle.setAttribute("data-toggle-state", "closed");
    // Animate height back to 0
    drawer.style.height = "0px";
  }

  function handleAccordionClick(event) {
    const toggle = event.currentTarget;

    const toggleState = toggle.getAttribute("data-toggle-state");
    if (toggleState === "closed") {
      // Close all other accordions in all components
      closeAllOtherAccordions(toggle);
      // Open this accordion
      openAccordion(toggle);
    } else {
      // Close this accordion
      closeAccordion(toggle);
    }
  }

  function closeAllOtherAccordions(currentToggle) {
    // Find all open accordions across all components
    const allOpenToggles = document.querySelectorAll(
      '[data-acc-toggle][data-toggle-state="open"]',
    );
    allOpenToggles.forEach((toggle) => {
      if (toggle !== currentToggle) {
        closeAccordion(toggle);
      }
    });
  }

  // Initialize accordions on page load
  initializeAccordions();

  // Add click event listener for pagination button
  document.addEventListener("click", function (event) {
    if (
      event.target.hasAttribute("data-acc-load") ||
      event.target.closest("[data-acc-load]")
    ) {
      // When pagination button is clicked, reinitialize accordions
      // after a small delay to allow for DOM updates
      setTimeout(function () {
        initializeAccordions();
      }, 300);
    }
  });
});

//Tab Switchers
document.addEventListener("DOMContentLoaded", function () {
  function sortRows() {
    const tabTables = document.querySelectorAll("[data-tab-table]");

    tabTables.forEach((table) => {
      const rows = Array.from(table.querySelectorAll("[data-tab-row]"));

      // Sort rows by data-tab-row attribute value (as numbers)
      rows.sort((a, b) => {
        const aValue = parseInt(a.getAttribute("data-tab-row"), 10);
        const bValue = parseInt(b.getAttribute("data-tab-row"), 10);
        return aValue - bValue;
      });

      // Re-append rows in sorted order
      rows.forEach((row) => {
        table.appendChild(row);
      });
    });
  }

  function initializeTabs() {
    const tabLinks = document.querySelectorAll("[data-tab-link]");
    const tabPanes = document.querySelectorAll("[data-tab-pane]");

    tabLinks.forEach((tabLink, index) => {
      tabLink.setAttribute("data-tab-link", index + 1);
      if (index === 0) {
        tabLink.setAttribute("data-tab-state", "show");
      } else {
        tabLink.setAttribute("data-tab-state", "hide");
      }
    });

    tabPanes.forEach((tabPane, index) => {
      tabPane.setAttribute("data-tab-pane", index + 1);
      if (index === 0) {
        tabPane.setAttribute("data-tab-state", "show");
      } else {
        tabPane.setAttribute("data-tab-state", "hide");
      }
    });
  }

  sortRows();
  initializeTabs();

  const tabLinks = document.querySelectorAll("[data-tab-link]");

  tabLinks.forEach((tabLink) => {
    tabLink.addEventListener("click", () => {
      const tabIndex = tabLink.getAttribute("data-tab-link");
      console.log("Tab clicked:", tabIndex);

      const allTabLinks = document.querySelectorAll("[data-tab-link]");
      const allTabPanes = document.querySelectorAll("[data-tab-pane]");

      allTabLinks.forEach((link) => {
        link.setAttribute("data-tab-state", "hide");
      });

      allTabPanes.forEach((pane) => {
        pane.setAttribute("data-tab-state", "hide");
      });

      tabLink.setAttribute("data-tab-state", "show");
      console.log("Showing tab link:", tabIndex);

      const correspondingPane = document.querySelector(
        `[data-tab-pane="${tabIndex}"]`,
      );
      if (correspondingPane) {
        correspondingPane.setAttribute("data-tab-state", "show");
        console.log("Showing tab pane:", tabIndex);
      } else {
        console.log("No matching tab pane found for index:", tabIndex);
      }
    });
  });
});
