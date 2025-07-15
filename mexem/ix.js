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

  function discoverTabGroups() {
    const tabGroups = new Map();

    document
      .querySelectorAll("[data-tab-type][data-tab-name]")
      .forEach((element) => {
        const tabType = element.getAttribute("data-tab-type");
        const tabName = element.getAttribute("data-tab-name");
        const groupKey = `${tabType}/${tabName}`;

        if (!tabGroups.has(groupKey)) {
          tabGroups.set(groupKey, { type: tabType, name: tabName });
        }
      });

    console.log("Discovered tab groups:", Array.from(tabGroups.keys()));
    return tabGroups;
  }

  function initTabGroup(groupKey, groupData) {
    const { type, name } = groupData;
    const selector = `[data-tab-type="${type}"][data-tab-name="${name}"]`;

    const tabLinks = document.querySelectorAll(`${selector} [data-tab-link]`);
    const tabPanes = document.querySelectorAll(`${selector} [data-tab-pane]`);

    console.log(
      `Initializing ${groupKey}: ${tabLinks.length} links, ${tabPanes.length} panes`,
    );

    tabLinks.forEach((tabLink, index) => {
      const linkIndex = index + 1;
      tabLink.setAttribute("data-tab-link", linkIndex);

      if (index === 0) {
        tabLink.setAttribute("data-tab-state", "show");
        tabLink.classList.add("active");
        console.log(`Showing first link in ${groupKey}`);
      } else {
        tabLink.setAttribute("data-tab-state", "hide");
        tabLink.classList.remove("active");
        console.log(`Hiding link ${linkIndex} in ${groupKey}`);
      }
    });

    tabPanes.forEach((tabPane, index) => {
      const paneIndex = index + 1;
      tabPane.setAttribute("data-tab-pane", paneIndex);

      if (index === 0) {
        tabPane.setAttribute("data-tab-state", "show");
        console.log(`Showing first pane in ${groupKey}`);
      } else {
        tabPane.setAttribute("data-tab-state", "hide");
        console.log(`Hiding pane ${paneIndex} in ${groupKey}`);
      }
    });
  }

  function setupTabClickListener(groupKey, groupData) {
    const { type, name } = groupData;
    const selector = `[data-tab-type="${type}"][data-tab-name="${name}"]`;

    const tabLinks = document.querySelectorAll(`${selector} [data-tab-link]`);
    console.log(
      `Setting up clicks for ${groupKey}: found ${tabLinks.length} links with selector: ${selector} [data-tab-link]`,
    );

    tabLinks.forEach((tabLink) => {
      tabLink.addEventListener("click", () => {
        const tabIndex = tabLink.getAttribute("data-tab-link");
        console.log(
          `Click handler executing for ${groupKey}, selector: ${selector}`,
        );
        console.log(`Tab clicked: ${tabIndex} in ${groupKey}`);

        const groupTabLinks = document.querySelectorAll(
          `${selector}[data-tab-link]`,
        );
        const groupTabPanes = document.querySelectorAll(
          `${selector}[data-tab-pane]`,
        );

        groupTabLinks.forEach((link) => {
          if (link === tabLink) {
            link.setAttribute("data-tab-state", "show");
            link.classList.add("active");
          } else {
            link.setAttribute("data-tab-state", "hide");
            link.classList.remove("active");
          }
        });

        groupTabPanes.forEach((pane) => {
          pane.setAttribute("data-tab-state", "hide");
        });

        const correspondingPane = document.querySelector(
          `${selector} [data-tab-pane="${tabIndex}"]`,
        );

        if (correspondingPane) {
          correspondingPane.setAttribute("data-tab-state", "show");
          console.log(`Showing tab pane: ${tabIndex} in ${groupKey}`);
        } else {
          console.log(
            `No matching pane found for index: ${tabIndex} in ${groupKey}`,
          );
        }
      });
    });
  }

  function initTabs() {
    console.log("Starting tab initialization");
    const tabGroups = discoverTabGroups();

    tabGroups.forEach((groupData, groupKey) => {
      initTabGroup(groupKey, groupData);
    });

    console.log("Tab initialization complete");
    return tabGroups;
  }

  function setupTabs(tabGroups) {
    console.log("Starting tab click listener setup");

    tabGroups.forEach((groupData, groupKey) => {
      setupTabClickListener(groupKey, groupData);
    });

    console.log("Tab click listener setup complete");
  }

  // Initialize everything
  console.log("Starting tab system");
  sortRows();
  const tabGroups = initTabs();
  setupTabs(tabGroups);
  console.log("Tab system ready");
});
