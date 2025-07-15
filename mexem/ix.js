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

  function discoverUniqueTabNames() {
    const uniqueTabs = new Map();

    document
      .querySelectorAll("[data-tab-type][data-tab-name]")
      .forEach((element) => {
        const tabType = element.getAttribute("data-tab-type");
        const tabName = element.getAttribute("data-tab-name");
        const key = `${tabType}/${tabName}`;

        if (!uniqueTabs.has(key)) {
          uniqueTabs.set(key, { type: tabType, name: tabName });
        }
      });

    console.log("Discovered unique tabs:", Array.from(uniqueTabs.keys()));
    return uniqueTabs;
  }

  function addIndices() {
    console.log("Adding indices to tabs");

    const uniqueTabs = discoverUniqueTabNames();

    uniqueTabs.forEach((tabData, tabKey) => {
      const { type, name } = tabData;
      const selector = `[data-tab-type="${type}"][data-tab-name="${name}"]`;

      // Get links and panes for THIS specific tab only
      const tabLinks = document.querySelectorAll(`${selector} [data-tab-link]`);
      const tabPanes = document.querySelectorAll(`${selector} [data-tab-pane]`);

      console.log(
        `Processing ${tabKey}: ${tabLinks.length} links, ${tabPanes.length} panes`,
      );

      // Store in arrays and assign indices based on array order
      const linksArray = Array.from(tabLinks);
      const panesArray = Array.from(tabPanes);

      linksArray.forEach((link, index) => {
        const linkIndex = index + 1;
        link.setAttribute("data-tab-link", linkIndex);
        console.log(`Set link ${linkIndex} in ${tabKey}`);
      });

      panesArray.forEach((pane, index) => {
        const paneIndex = index + 1;
        pane.setAttribute("data-tab-pane", paneIndex);
        console.log(`Set pane ${paneIndex} in ${tabKey}`);
      });
    });
  }

  function initializeByType() {
    console.log("Initializing by tab type");

    const tabTypes = new Set();
    document.querySelectorAll("[data-tab-type]").forEach((el) => {
      tabTypes.add(el.getAttribute("data-tab-type"));
    });

    tabTypes.forEach((type) => {
      console.log(`Initializing type: ${type}`);

      // Get all tabs of this type
      const tabsOfType = document.querySelectorAll(`[data-tab-type="${type}"]`);
      const tabsArray = Array.from(tabsOfType);

      tabsArray.forEach((tab, index) => {
        const tabName = tab.getAttribute("data-tab-name");
        const selector = `[data-tab-type="${type}"][data-tab-name="${tabName}"]`;

        if (index === 0) {
          // First tab of this type - show first pane
          const firstPane = tab.querySelector('[data-tab-pane="1"]');
          const firstLink = tab.querySelector('[data-tab-link="1"]');

          if (firstPane) {
            firstPane.setAttribute("data-tab-state", "show");
            console.log(`Showing first pane in ${type}/${tabName}`);
          }

          if (firstLink) {
            firstLink.setAttribute("data-tab-state", "show");
            firstLink.classList.add("active");
            console.log(`Showing first link in ${type}/${tabName}`);
          }

          // Hide other panes in this tab
          const otherPanes = tab.querySelectorAll(
            '[data-tab-pane]:not([data-tab-pane="1"])',
          );
          otherPanes.forEach((pane) => {
            pane.setAttribute("data-tab-state", "hide");
          });

          // Hide other links in this tab
          const otherLinks = tab.querySelectorAll(
            '[data-tab-link]:not([data-tab-link="1"])',
          );
          otherLinks.forEach((link) => {
            link.setAttribute("data-tab-state", "hide");
            link.classList.remove("active");
          });
        }
      });
    });
  }

  function setupClickHandlers() {
    console.log("Setting up click handlers");

    const uniqueTabs = discoverUniqueTabNames();

    uniqueTabs.forEach((tabData, tabKey) => {
      const { type, name } = tabData;
      const selector = `[data-tab-type="${type}"][data-tab-name="${name}"]`;

      const tabLinks = document.querySelectorAll(`${selector} [data-tab-link]`);
      console.log(`Setting up ${tabLinks.length} click handlers for ${tabKey}`);

      tabLinks.forEach((clickedLink) => {
        clickedLink.addEventListener("click", () => {
          const clickedIndex = clickedLink.getAttribute("data-tab-link");
          console.log(`Clicked link ${clickedIndex} in ${tabKey}`);

          // Get ALL links and panes in SAME tab
          const sameTabLinks = document.querySelectorAll(
            `${selector} [data-tab-link]`,
          );
          const sameTabPanes = document.querySelectorAll(
            `${selector} [data-tab-pane]`,
          );

          // Hide all other links in SAME tab
          sameTabLinks.forEach((link) => {
            if (link === clickedLink) {
              link.setAttribute("data-tab-state", "show");
              link.classList.add("active");
              console.log(`Showing clicked link ${clickedIndex}`);
            } else {
              link.setAttribute("data-tab-state", "hide");
              link.classList.remove("active");
              console.log(`Hiding other link in ${tabKey}`);
            }
          });

          // Hide all panes in SAME tab
          sameTabPanes.forEach((pane) => {
            pane.setAttribute("data-tab-state", "hide");
            console.log(`Hiding pane in ${tabKey}`);
          });

          // Show corresponding pane
          const targetPane = document.querySelector(
            `${selector} [data-tab-pane="${clickedIndex}"]`,
          );
          if (targetPane) {
            targetPane.setAttribute("data-tab-state", "show");
            console.log(`Showing pane ${clickedIndex} in ${tabKey}`);
          } else {
            console.log(`ERROR: No pane ${clickedIndex} found in ${tabKey}`);
          }
        });
      });
    });
  }

  // Execute in proper order
  console.log("Starting tab system");
  sortRows();
  addIndices();
  initializeByType();
  setupClickHandlers();
  console.log("Tab system ready");
});
