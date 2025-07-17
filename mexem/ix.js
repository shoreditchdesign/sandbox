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

  function addIndicesPerIsolatedTab() {
    console.log("Adding indices per isolated tab");

    // Get each unique tab element
    const allTabs = document.querySelectorAll("[data-tab-type][data-tab-name]");

    allTabs.forEach((isolatedTab) => {
      const type = isolatedTab.getAttribute("data-tab-type");
      const name = isolatedTab.getAttribute("data-tab-name");

      console.log(`Processing isolated tab: ${type}/${name}`);

      // Get ONLY direct children of data-tab-menu and data-tab-content
      const tabMenu = isolatedTab.querySelector("[data-tab-menu]");
      const tabContent = isolatedTab.querySelector("[data-tab-content]");

      const linksArray = tabMenu
        ? Array.from(tabMenu.children).filter((child) =>
            child.hasAttribute("data-tab-link"),
          )
        : [];
      const panesArray = tabContent
        ? Array.from(tabContent.children).filter((child) =>
            child.hasAttribute("data-tab-pane"),
          )
        : [];

      console.log(
        `Found ${linksArray.length} links and ${panesArray.length} panes in ${type}/${name}`,
      );

      // Set indices based on array position
      linksArray.forEach((link, index) => {
        const linkIndex = index + 1;
        link.setAttribute("data-tab-link", linkIndex);
        console.log(`Set link ${linkIndex} in ${type}/${name}`);
      });

      panesArray.forEach((pane, index) => {
        const paneIndex = index + 1;
        pane.setAttribute("data-tab-pane", paneIndex);
        console.log(`Set pane ${paneIndex} in ${type}/${name}`);
      });

      console.log(`Completed indexing for ${type}/${name}`);
    });
  }

  function initializeAllTabs() {
    console.log("Initializing all tabs - showing first pane/link of each");

    const allTabs = document.querySelectorAll("[data-tab-type][data-tab-name]");

    allTabs.forEach((tab) => {
      const type = tab.getAttribute("data-tab-type");
      const name = tab.getAttribute("data-tab-name");

      console.log(`Initializing ${type}/${name}`);

      // Get menu and content containers
      const tabMenu = tab.querySelector("[data-tab-menu]");
      const tabContent = tab.querySelector("[data-tab-content]");

      // Show first link, hide others
      if (tabMenu && tabMenu.children.length > 0) {
        Array.from(tabMenu.children).forEach((link, index) => {
          if (index === 0) {
            link.setAttribute("data-tab-state", "show");
            link.classList.add("active");
            console.log(`Showing first link in ${type}/${name}`);
          } else {
            link.setAttribute("data-tab-state", "hide");
            link.classList.remove("active");
          }
        });
      }

      // Show first pane, hide others
      if (tabContent && tabContent.children.length > 0) {
        Array.from(tabContent.children).forEach((pane, index) => {
          if (index === 0) {
            pane.setAttribute("data-tab-state", "show");
            console.log(`Showing first pane in ${type}/${name}`);
          } else {
            pane.setAttribute("data-tab-state", "hide");
          }
        });
      }
    });
  }

  function setupIsolatedClickHandlers() {
    console.log("Setting up isolated click handlers");

    const allTabs = document.querySelectorAll("[data-tab-type][data-tab-name]");

    allTabs.forEach((isolatedTab) => {
      const type = isolatedTab.getAttribute("data-tab-type");
      const name = isolatedTab.getAttribute("data-tab-name");

      // Get links from THIS isolated tab only (direct children)
      const tabMenu = isolatedTab.querySelector("[data-tab-menu]");
      const tabLinks = tabMenu
        ? Array.from(tabMenu.children).filter((child) =>
            child.hasAttribute("data-tab-link"),
          )
        : [];
      console.log(
        `Setting up ${tabLinks.length} click handlers for ${type}/${name}`,
      );

      tabLinks.forEach((clickedLink) => {
        clickedLink.addEventListener("click", () => {
          const clickedIndex = clickedLink.getAttribute("data-tab-link");
          console.log(`Clicked link ${clickedIndex} in ${type}/${name}`);

          // Get ALL links and panes from THIS SAME isolated tab ONLY (direct children)
          const tabMenuContainer = isolatedTab.querySelector("[data-tab-menu]");
          const tabContentContainer =
            isolatedTab.querySelector("[data-tab-content]");

          const sameTabLinks = tabMenuContainer
            ? Array.from(tabMenuContainer.children).filter((child) =>
                child.hasAttribute("data-tab-link"),
              )
            : [];
          const sameTabPanes = tabContentContainer
            ? Array.from(tabContentContainer.children).filter((child) =>
                child.hasAttribute("data-tab-pane"),
              )
            : [];

          console.log(
            `Updating ${sameTabLinks.length} links and ${sameTabPanes.length} panes in ${type}/${name}`,
          );

          // Hide all other links in SAME tab, show clicked link
          sameTabLinks.forEach((link) => {
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

          // Hide all panes in SAME tab
          sameTabPanes.forEach((pane) => {
            pane.setAttribute("data-tab-state", "hide");
            console.log(`Hiding pane in ${type}/${name}`);
          });

          // Show corresponding pane in SAME tab (direct children)
          const targetPane =
            tabContentContainer &&
            tabContentContainer.children[clickedIndex - 1];
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

  // Execute in proper order: isolate, make arrays, set indices
  console.log("Starting isolated tab system");
  sortRows();
  addIndicesPerIsolatedTab();
  initializeAllTabs();
  setupIsolatedClickHandlers();
  console.log("Isolated tab system ready");
});

//Swiper
document.addEventListener("DOMContentLoaded", function () {
  const swiperEl = document.querySelector("#benefits-swiper");
  const paginationEl = document.querySelector("#benefits-pagination");
  const nextEl = document.querySelector("#benefits-next");
  const prevEl = document.querySelector("#benefits-prev");

  console.log("swiperEl:", swiperEl ? "found" : "not found");
  console.log("paginationEl:", paginationEl ? "found" : "not found");
  console.log("nextEl:", nextEl ? "found" : "not found");
  console.log("prevEl:", prevEl ? "found" : "not found");

  var mySwiper = new Swiper("#benefits-swiper", {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 16,
    grabCursor: true,
    allowTouchMove: true,
    autoHeight: false,
    watchOverflow: true,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    centeredSlides: false,
    loopedSlides: null,
    resistanceRatio: 0,
    pagination: {
      el: "#benefits-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#benefits-next",
      prevEl: "#benefits-prev",
    },

    // Accessibility module
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous benefit",
      nextSlideMessage: "Next benefit",
      firstSlideMessage: "This is the first benefit",
      lastSlideMessage: "This is the last benefit",
      paginationBulletMessage: "Go to benefit {{index}}",
      notificationClass: "swiper-notification",
      containerMessage: "Benefits carousel",
      containerRoleDescriptionMessage: "carousel",
      itemRoleDescriptionMessage: "benefit slide",
      containerRole: null,
      slideRole: null,
    },

    // Keyboard control
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Focus handling
    watchSlidesProgress: true,
    watchSlidesVisibility: true,

    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      480: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      767: {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      992: {
        slidesPerView: 3,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      1200: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
    },
  });

  console.log("Swiper initialization complete.");
});
