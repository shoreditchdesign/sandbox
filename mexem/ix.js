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
  function initializeTabs() {
    const tabLinks = document.querySelectorAll("[data-tab-link]");
    const tabPanes = document.querySelectorAll("[data-tab-pane]");

    tabLinks.forEach((tabLink, index) => {
      tabLink.setAttribute("data-tab-link", index + 1);
    });

    tabPanes.forEach((tabPane, index) => {
      tabPane.setAttribute("data-tab-pane", index + 1);
    });
  }

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
