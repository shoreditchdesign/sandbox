//Navigation Dropdowns
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing dropdown animations");
  if (window.innerWidth <= 991) {
    return;
  }

  const toggles = document.querySelectorAll('[data-nav-dd="toggle"]');
  const overlay = document.querySelector("[data-nav-dd='overlay']");
  console.log("Found toggles:", toggles.length);
  console.log("Found overlay:", overlay ? "yes" : "no");

  let activeToggle = null;
  let hideTimeout = null;

  const overlayQuickToShow = overlay
    ? gsap.quickTo(overlay, "opacity", { duration: 0.3, ease: "power2.out" })
    : null;
  const overlayQuickToHide = overlay
    ? gsap.quickTo(overlay, "opacity", { duration: 0.3, ease: "power2.out" })
    : null;

  function checkOverlayVisibility() {
    console.log("Checking overlay visibility");
    const hasActiveDropdown = Array.from(toggles).some(
      (toggle) => toggle.getAttribute("data-dd-state") === "show",
    );

    if (!hasActiveDropdown && overlayQuickToHide) {
      console.log("No active dropdowns, hiding overlay");
      overlayQuickToHide(0);
    }
  }

  function hideAllDropdowns() {
    console.log("Hiding all dropdowns");
    toggles.forEach((toggle, index) => {
      const drawer = toggle.nextElementSibling;
      if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
        console.log(`Hiding dropdown ${index + 1}`);
        toggle.setAttribute("data-dd-state", "hide");
        drawer.style.pointerEvents = "none";
        const drawerQuickToHide = gsap.quickTo(drawer, "opacity", {
          duration: 0.3,
          ease: "power2.out",
        });
        drawerQuickToHide(0);
      }
    });
    activeToggle = null;
    if (overlayQuickToHide) {
      overlayQuickToHide(0);
    }
  }

  function showDropdown(toggle, drawer, index) {
    console.log(`Showing dropdown ${index + 1}`);

    if (activeToggle && activeToggle !== toggle) {
      console.log("Switching to new dropdown, hiding previous instantly");
      hideAllDropdowns();
    }

    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    activeToggle = toggle;
    toggle.setAttribute("data-dd-state", "show");
    drawer.style.pointerEvents = "auto";

    const drawerQuickToShow = gsap.quickTo(drawer, "opacity", {
      duration: 0.3,
      ease: "power2.out",
    });
    drawerQuickToShow(1);

    if (overlayQuickToShow) {
      overlayQuickToShow(1);
    }
  }

  function hideDropdown(toggle, drawer, index) {
    console.log(`Hiding dropdown ${index + 1}`);
    hideTimeout = setTimeout(() => {
      toggle.setAttribute("data-dd-state", "hide");
      drawer.style.pointerEvents = "none";

      const drawerQuickToHide = gsap.quickTo(drawer, "opacity", {
        duration: 0.3,
        ease: "power2.out",
      });
      drawerQuickToHide(0);

      if (activeToggle === toggle) {
        activeToggle = null;
      }

      checkOverlayVisibility();
    }, 400);
  }

  toggles.forEach((toggle, index) => {
    console.log(`Setting up toggle ${index + 1}`);
    const drawer = toggle.nextElementSibling;

    if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
      console.log(`Found matching drawer for toggle ${index + 1}`);

      toggle.addEventListener("mouseenter", () => {
        showDropdown(toggle, drawer, index);
      });

      toggle.addEventListener("mouseleave", () => {
        hideDropdown(toggle, drawer, index);
      });

      drawer.addEventListener("mouseenter", () => {
        console.log(`Keeping drawer ${index + 1} visible`);
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }
        activeToggle = toggle;
        toggle.setAttribute("data-dd-state", "show");
        drawer.style.pointerEvents = "auto";

        const drawerQuickToShow = gsap.quickTo(drawer, "opacity", {
          duration: 0.3,
          ease: "power2.out",
        });
        drawerQuickToShow(1);

        if (overlayQuickToShow) {
          overlayQuickToShow(1);
        }
      });

      drawer.addEventListener("mouseleave", () => {
        hideDropdown(toggle, drawer, index);
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
    console.log("Sorting rows in tables");

    tabTables.forEach((table) => {
      const rows = Array.from(table.querySelectorAll("[data-tab-row]"));
      rows.sort((a, b) => {
        const aValue = parseInt(a.getAttribute("data-tab-row"), 10);
        const bValue = parseInt(b.getAttribute("data-tab-row"), 10);
        return aValue - bValue;
      });
      rows.forEach((row) => {
        table.appendChild(row);
      });
    });
  }

  function addIndicesPerTab() {
    console.log("Adding indices per individual tab");

    // Find each unique tab container
    const tabContainers = document.querySelectorAll(
      "[data-tab-type][data-tab-name]",
    );

    tabContainers.forEach((container) => {
      const type = container.getAttribute("data-tab-type");
      const name = container.getAttribute("data-tab-name");

      // Get links and panes ONLY within THIS specific container
      const links = container.querySelectorAll("[data-tab-link]");
      const panes = container.querySelectorAll("[data-tab-pane]");

      console.log(
        `Processing ${type}/${name}: ${links.length} links, ${panes.length} panes`,
      );

      // Assign indices based on order within THIS container only
      links.forEach((link, index) => {
        link.setAttribute("data-tab-link", index + 1);
        console.log(`Set link ${index + 1} in ${type}/${name}`);
      });

      panes.forEach((pane, index) => {
        pane.setAttribute("data-tab-pane", index + 1);
        console.log(`Set pane ${index + 1} in ${type}/${name}`);
      });
    });
  }

  function initializeFirstPanes() {
    console.log("Initializing first panes per tab");

    const tabContainers = document.querySelectorAll(
      "[data-tab-type][data-tab-name]",
    );

    tabContainers.forEach((container) => {
      const type = container.getAttribute("data-tab-type");
      const name = container.getAttribute("data-tab-name");

      // Find first link and first pane in THIS container
      const firstLink = container.querySelector('[data-tab-link="1"]');
      const firstPane = container.querySelector('[data-tab-pane="1"]');

      // Show first link and pane
      if (firstLink) {
        firstLink.setAttribute("data-tab-state", "show");
        firstLink.classList.add("active");
        console.log(`Showing first link in ${type}/${name}`);
      }

      if (firstPane) {
        firstPane.setAttribute("data-tab-state", "show");
        console.log(`Showing first pane in ${type}/${name}`);
      }

      // Hide all other links and panes in THIS container
      const otherLinks = container.querySelectorAll(
        '[data-tab-link]:not([data-tab-link="1"])',
      );
      const otherPanes = container.querySelectorAll(
        '[data-tab-pane]:not([data-tab-pane="1"])',
      );

      otherLinks.forEach((link) => {
        link.setAttribute("data-tab-state", "hide");
        link.classList.remove("active");
      });

      otherPanes.forEach((pane) => {
        pane.setAttribute("data-tab-state", "hide");
      });
    });
  }

  function setupLocalizedClickHandlers() {
    console.log("Setting up localized click handlers");

    const tabContainers = document.querySelectorAll(
      "[data-tab-type][data-tab-name]",
    );

    tabContainers.forEach((container) => {
      const type = container.getAttribute("data-tab-type");
      const name = container.getAttribute("data-tab-name");

      // Get links ONLY from THIS specific container
      const links = container.querySelectorAll("[data-tab-link]");
      console.log(
        `Setting up ${links.length} click handlers for ${type}/${name}`,
      );

      links.forEach((clickedLink) => {
        clickedLink.addEventListener("click", () => {
          const clickedIndex = clickedLink.getAttribute("data-tab-link");
          console.log(`Clicked link ${clickedIndex} in ${type}/${name}`);

          // Get ALL links and panes from THIS SAME container ONLY
          const containerLinks = container.querySelectorAll("[data-tab-link]");
          const containerPanes = container.querySelectorAll("[data-tab-pane]");

          console.log(
            `Updating ${containerLinks.length} links and ${containerPanes.length} panes in ${type}/${name}`,
          );

          // Update links - show clicked, hide others
          containerLinks.forEach((link) => {
            if (link === clickedLink) {
              link.setAttribute("data-tab-state", "show");
              link.classList.add("active");
              console.log(`Activated link ${clickedIndex} in ${type}/${name}`);
            } else {
              link.setAttribute("data-tab-state", "hide");
              link.classList.remove("active");
              console.log(`Deactivated other link in ${type}/${name}`);
            }
          });

          // Hide all panes in THIS container
          containerPanes.forEach((pane) => {
            pane.setAttribute("data-tab-state", "hide");
            console.log(`Hiding pane in ${type}/${name}`);
          });

          // Show corresponding pane in THIS container
          const targetPane = container.querySelector(
            `[data-tab-pane="${clickedIndex}"]`,
          );
          if (targetPane) {
            targetPane.setAttribute("data-tab-state", "show");
            console.log(`Showing pane ${clickedIndex} in ${type}/${name}`);
          } else {
            console.log(
              `ERROR: No pane ${clickedIndex} found in ${type}/${name}`,
            );
          }
        });
      });
    });
  }

  // Execute in proper order
  console.log("Starting tab system");
  sortRows();
  addIndicesPerTab();
  initializeFirstPanes();
  setupLocalizedClickHandlers();
  console.log("Tab system ready");
});
