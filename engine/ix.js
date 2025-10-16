//Navigation Bar
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector('[data-nav-element="menu"]');

  menuButton.addEventListener("click", () => {
    const navbar = document.querySelector('[data-nav-element="navbar"]');
    const currentState = navbar.getAttribute("data-nav-state");
    navbar.setAttribute(
      "data-nav-state",
      currentState === "open" ? "closed" : "open",
    );

    const staticNav = document.querySelector('[data-nav-element="static"]');
    if (staticNav) {
      staticNav.classList.toggle("active");
    }
  });
});

//Navigation Overlays
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth > 991) {
    return;
  }
  console.log("Mobile navigation initialized");

  const toggles = document.querySelectorAll('[data-nav-dd="toggle"]');
  const openButtons = document.querySelectorAll("[data-dd-open]");
  const menu = document.querySelector('[data-nav-element="menu"]');
  const backButtons = document.querySelectorAll("[data-dd-back]");
  let activeToggle = null;

  function hideAllDropdowns() {
    console.log("Hiding all dropdowns");
    toggles.forEach((toggle) => {
      const drawer = toggle.nextElementSibling;
      if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
        toggle.setAttribute("data-dd-state", "hide");
        console.log("Drawer hidden");
      }
    });
    activeToggle = null;
  }

  function showDropdown(toggle, drawer) {
    console.log("Showing dropdown");
    if (activeToggle && activeToggle !== toggle) {
      hideAllDropdowns();
    }

    activeToggle = toggle;
    toggle.setAttribute("data-dd-state", "show");
    console.log("Drawer shown");
  }

  function hideDropdown(toggle, drawer) {
    console.log("Hiding dropdown");
    toggle.setAttribute("data-dd-state", "hide");
    if (activeToggle === toggle) {
      activeToggle = null;
    }
    console.log("Drawer hidden");
  }

  // Open button click handlers
  openButtons.forEach((openButton) => {
    // Find the associated toggle element
    const toggle =
      openButton.closest('[data-nav-dd="toggle"]') ||
      openButton.parentElement.querySelector('[data-nav-dd="toggle"]');
    if (toggle) {
      const drawer = toggle.nextElementSibling;
      if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
        openButton.addEventListener("click", () => {
          console.log("Open button clicked");
          const currentState = toggle.getAttribute("data-dd-state");
          if (currentState === "show") {
            hideDropdown(toggle, drawer);
          } else {
            showDropdown(toggle, drawer);
          }
        });
      }
    }
  });

  // Back button handlers
  backButtons.forEach((backButton) => {
    backButton.addEventListener("click", () => {
      console.log("Back button clicked");
      // Traverse up to find parent toggle
      let parentToggle = backButton.closest('[data-nav-dd="drawer"]');
      if (parentToggle) {
        parentToggle = parentToggle.previousElementSibling;
        if (
          parentToggle &&
          parentToggle.getAttribute("data-nav-dd") === "toggle"
        ) {
          const drawer = parentToggle.nextElementSibling;
          hideDropdown(parentToggle, drawer);
          console.log("Parent toggle found and drawer closed");
        }
      }
    });
  });

  // Menu click handler
  if (menu) {
    menu.addEventListener("click", () => {
      console.log("Menu clicked");
      if (activeToggle) {
        const currentState = activeToggle.getAttribute("data-dd-state");
        if (currentState === "show") {
          const drawer = activeToggle.nextElementSibling;
          hideDropdown(activeToggle, drawer);
          console.log("Active drawer closed via menu click");
        }
      }
    });
  }
});

//Navigation Dropdowns
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 991) {
    return;
  }
  const toggles = document.querySelectorAll('[data-nav-dd="toggle"]');
  const overlay = document.querySelector("[data-nav-dd='overlay']");
  let activeToggle = null;
  let hideTimeout = null;

  function initialiser() {
    // Create overlay quickTo
    const overlayQuickTo = overlay
      ? gsap.quickTo(overlay, "opacity", { duration: 0.15, ease: "power2.out" })
      : null;

    // Store timeline references for drawers
    const drawerTimelines = new Map();

    // Define playDropdown function with timeline logic
    window.playDropdown = function (drawer, show = true) {
      let timeline = drawerTimelines.get(drawer);
      if (!timeline) {
        // Create fresh timeline for drawer animation
        gsap.set(drawer, { opacity: 0, y: 5 });
        timeline = gsap.timeline({ paused: true }).to(drawer, {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: "power2.out",
        });
        drawerTimelines.set(drawer, timeline);
      }
      show ? timeline.play() : timeline.reverse();
    };

    // Expose overlay function
    window.overlayQuickTo = overlayQuickTo;
  }

  function showOverlay() {
    const hasActiveDropdown = Array.from(toggles).some(
      (toggle) => toggle.getAttribute("data-dd-state") === "show",
    );
    if (!hasActiveDropdown && window.overlayQuickTo) {
      window.overlayQuickTo(0);
    }
  }

  function hideAllDropdowns() {
    toggles.forEach((toggle) => {
      const drawer = toggle.nextElementSibling;
      if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
        toggle.setAttribute("data-dd-state", "hide");
        drawer.style.pointerEvents = "none";
        window.playDropdown(drawer, false);
      }
    });
    activeToggle = null;
    if (window.overlayQuickTo) {
      window.overlayQuickTo(0);
    }
  }

  function showDropdown(toggle, drawer) {
    if (activeToggle && activeToggle !== toggle) {
      hideAllDropdowns();
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    activeToggle = toggle;
    toggle.setAttribute("data-dd-state", "show");
    drawer.style.pointerEvents = "auto";
    window.playDropdown(drawer, true);

    if (window.overlayQuickTo) {
      window.overlayQuickTo(1);
    }
  }

  function hideDropdown(toggle, drawer) {
    hideTimeout = setTimeout(() => {
      toggle.setAttribute("data-dd-state", "hide");
      drawer.style.pointerEvents = "none";
      window.playDropdown(drawer, false);

      if (activeToggle === toggle) {
        activeToggle = null;
      }
      showOverlay();
    }, 150);
  }

  // Initialize animations first
  initialiser();

  toggles.forEach((toggle, index) => {
    const drawer = toggle.nextElementSibling;
    if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
      toggle.addEventListener("mouseenter", () => {
        showDropdown(toggle, drawer);
      });
      toggle.addEventListener("mouseleave", () => {
        hideDropdown(toggle, drawer);
      });
      drawer.addEventListener("mouseenter", () => {
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }

        activeToggle = toggle;
        toggle.setAttribute("data-dd-state", "show");
        drawer.style.pointerEvents = "auto";
        window.playDropdown(drawer, true);

        if (window.overlayQuickTo) {
          window.overlayQuickTo(1);
        }
      });
      drawer.addEventListener("mouseleave", () => {
        hideDropdown(toggle, drawer);
      });
    }
  });
});

//Navigation Drawer Links
document.addEventListener("DOMContentLoaded", function () {
  function drawerImageInitialiser() {
    const drawerArrays = document.querySelectorAll("[data-drawer-array]");

    drawerArrays.forEach((drawer) => {
      const images = drawer
        .closest('[data-nav-dd="drawer"]')
        .querySelectorAll("[data-drawer-image]");

      images.forEach((image, index) => {
        if (index === 0) {
          image.setAttribute("data-drawer-image", "show");
        } else {
          image.setAttribute("data-drawer-image", "hide");
        }
      });
    });
  }

  function handleDrawerLinkHover(link) {
    const linkIndex = link.getAttribute("data-link-index");
    const drawer = link.closest('[data-nav-dd="drawer"]');

    if (drawer) {
      const allImages = drawer.querySelectorAll("[data-drawer-image]");

      allImages.forEach((image) => {
        const imageIndex = image.getAttribute("data-image-index");

        if (imageIndex === linkIndex) {
          image.setAttribute("data-drawer-image", "show");
        } else {
          image.setAttribute("data-drawer-image", "hide");
        }
      });
    }
  }

  function setupDrawerListeners() {
    const drawerLinks = document.querySelectorAll("[data-drawer-link]");

    drawerLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        handleDrawerLinkHover(link);
      });
    });
  }

  setTimeout(function () {
    drawerImageInitialiser();
    setupDrawerListeners();
  }, 100);
});

//Accordions
document.addEventListener("DOMContentLoaded", function () {
  // Heights storage object
  const drawerHeights = {};

  // Make functions globally accessible
  window.initializeAccordions = function () {
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
  };

  window.openFirstAccordion = function () {
    const components = document.querySelectorAll("[data-acc-component]");
    components.forEach((component) => {
      const firstToggle = component.querySelector("[data-acc-toggle]");
      if (firstToggle) {
        openAccordion(firstToggle);
      }
    });
  };

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
    console.log("Closing other accordions in same component");
    // Find the parent component of the current toggle
    const parentComponent = currentToggle.closest("[data-acc-component]");
    if (parentComponent) {
      // Find all open accordions only within this component
      const openTogglesInComponent = parentComponent.querySelectorAll(
        '[data-acc-toggle][data-toggle-state="open"]',
      );
      openTogglesInComponent.forEach((toggle) => {
        if (toggle !== currentToggle) {
          closeAccordion(toggle);
        }
      });
    }
  }

  // Add 200ms delay to ensure DOM is fully rendered
  setTimeout(function () {
    // Initialize accordions on page load
    window.initializeAccordions();
    window.openFirstAccordion();
  }, 200);

  // Add click event listener for pagination button
  document.addEventListener("click", function (event) {
    if (
      event.target.hasAttribute("data-acc-load") ||
      event.target.closest("[data-acc-load]")
    ) {
      // When pagination button is clicked, reinitialize accordions
      // after a small delay to allow for DOM updates
      setTimeout(function () {
        window.initializeAccordions();
        window.openFirstAccordion();
      }, 300);
    }
  });
});

//Tab Switchers
document.addEventListener("DOMContentLoaded", function () {
  function rowInitialiser() {
    const tabTables = document.querySelectorAll("[data-tab-table]");

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

  function indexInitialiser() {
    // Get each unique tab element
    const allTabs = document.querySelectorAll("[data-tab-type][data-tab-name]");

    allTabs.forEach((isolatedTab) => {
      const type = isolatedTab.getAttribute("data-tab-type");
      const name = isolatedTab.getAttribute("data-tab-name");

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

      // Set indices based on array position
      linksArray.forEach((link, index) => {
        const linkIndex = index + 1;
        link.setAttribute("data-tab-link", linkIndex);
      });

      panesArray.forEach((pane, index) => {
        const paneIndex = index + 1;
        pane.setAttribute("data-tab-pane", paneIndex);
      });
    });
  }

  function tabInitialiser() {
    const allTabs = document.querySelectorAll("[data-tab-type][data-tab-name]");

    allTabs.forEach((tab) => {
      const type = tab.getAttribute("data-tab-type");
      const name = tab.getAttribute("data-tab-name");

      // Get menu and content containers
      const tabMenu = tab.querySelector("[data-tab-menu]");
      const tabContent = tab.querySelector("[data-tab-content]");

      // Show first link, hide others
      if (tabMenu && tabMenu.children.length > 0) {
        Array.from(tabMenu.children).forEach((link, index) => {
          if (index === 0) {
            link.setAttribute("data-tab-state", "show");
            link.classList.add("active");
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
            // ANIMATE FIRST PANE ON LOAD
            if (window.elementAnimator) {
              window.elementAnimator(pane, "top 100%");
            }
          } else {
            pane.setAttribute("data-tab-state", "hide");
          }
        });
      }
    });

    // Initialize accordions after tab setup
    if (window.initializeAccordions) {
      window.initializeAccordions();
    }
    if (window.openFirstAccordion) {
      window.openFirstAccordion();
    }
  }

  // Unified function to switch tabs - used by both clicks and autoplay
  function switchToTab(isolatedTab, targetIndex, duration = null) {
    const type = isolatedTab.getAttribute("data-tab-type");
    const name = isolatedTab.getAttribute("data-tab-name");

    // Get ALL links and panes from THIS isolated tab ONLY (direct children)
    const tabMenuContainer = isolatedTab.querySelector("[data-tab-menu]");
    const tabContentContainer = isolatedTab.querySelector("[data-tab-content]");

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

    // Find the target link
    const targetLink = sameTabLinks.find(
      (link) => link.getAttribute("data-tab-link") === String(targetIndex),
    );

    // Hide all other links in SAME tab, show target link
    sameTabLinks.forEach((link) => {
      if (link === targetLink) {
        link.setAttribute("data-tab-state", "show");
        link.classList.add("active");

        // PROGRESS BAR ANIMATION - Reset and animate if data-tab-border exists
        const progressBar = link.querySelector("[data-tab-border]");
        if (progressBar && duration && window.gsap) {
          // Kill any ongoing animation first
          window.gsap.killTweensOf(progressBar);
          // Reset to 0 width
          window.gsap.set(progressBar, { width: "0%" });
          // Animate to 100% over the duration
          window.gsap.to(progressBar, {
            width: "100%",
            duration: duration / 1000, // Convert ms to seconds
            ease: "linear",
          });
        }
      } else {
        link.setAttribute("data-tab-state", "hide");
        link.classList.remove("active");

        // Kill ongoing animations and reset other progress bars to 0
        const otherProgressBar = link.querySelector("[data-tab-border]");
        if (otherProgressBar && window.gsap) {
          window.gsap.killTweensOf(otherProgressBar);
          window.gsap.set(otherProgressBar, { width: "0%" });
        }
      }
    });

    // Hide all panes in SAME tab
    sameTabPanes.forEach((pane) => {
      pane.setAttribute("data-tab-state", "hide");
    });

    // Show corresponding pane in SAME tab (direct children)
    const targetPane =
      tabContentContainer && tabContentContainer.children[targetIndex - 1];
    if (targetPane) {
      targetPane.setAttribute("data-tab-state", "show");

      // ANIMATE THE TAB PANE WHEN IT BECOMES ACTIVE
      if (window.elementAnimator) {
        // Reset any existing GSAP properties first
        if (window.gsap) {
          window.gsap.set(targetPane, { clearProps: "all" });
        }

        // Animate the newly active pane
        window.elementAnimator(targetPane, "top 100%");
      } else {
        console.warn(
          "elementAnimator not available - ensure animation script loads first",
        );
      }

      // Reinitialize accordions for the newly visible tab pane
      setTimeout(() => {
        if (window.initializeAccordions) {
          window.initializeAccordions();
        }
        if (window.openFirstAccordion) {
          window.openFirstAccordion();
        }
      }, 50);
    } else {
      console.log(`ERROR: No pane ${targetIndex} found in ${type}/${name}`);
    }
  }

  function clickInitialiser() {
    const allTabs = document.querySelectorAll("[data-tab-type][data-tab-name]");

    allTabs.forEach((isolatedTab) => {
      // Get links from THIS isolated tab only (direct children)
      const tabMenu = isolatedTab.querySelector("[data-tab-menu]");
      const tabLinks = tabMenu
        ? Array.from(tabMenu.children).filter((child) =>
            child.hasAttribute("data-tab-link"),
          )
        : [];

      tabLinks.forEach((clickedLink) => {
        clickedLink.addEventListener("click", () => {
          const clickedIndex = parseInt(
            clickedLink.getAttribute("data-tab-link"),
            10,
          );

          // Get autoplay duration for progress bar animation
          const autoplayAttr = isolatedTab.getAttribute("data-tab-autoplay");
          const duration =
            autoplayAttr !== null
              ? autoplayAttr === ""
                ? 5000
                : parseInt(autoplayAttr, 10)
              : null;

          // Switch to the clicked tab
          switchToTab(isolatedTab, clickedIndex, duration);

          // Reset autoplay timer if autoplay is enabled
          if (autoplayAttr !== null && isolatedTab._autoplayTimer) {
            clearInterval(isolatedTab._autoplayTimer);
            startAutoplay(isolatedTab, duration);
          }
        });
      });
    });
  }

  function startAutoplay(isolatedTab, duration) {
    const tabMenu = isolatedTab.querySelector("[data-tab-menu]");
    const tabLinks = tabMenu
      ? Array.from(tabMenu.children).filter((child) =>
          child.hasAttribute("data-tab-link"),
        )
      : [];

    if (tabLinks.length === 0) return;

    isolatedTab._autoplayTimer = setInterval(() => {
      // Find current active tab
      const currentActive = tabLinks.find((link) =>
        link.classList.contains("active"),
      );
      const currentIndex = currentActive
        ? parseInt(currentActive.getAttribute("data-tab-link"), 10)
        : 1;

      // Calculate next index (loop back to 1 after last tab)
      const nextIndex = currentIndex >= tabLinks.length ? 1 : currentIndex + 1;

      // Switch to next tab
      switchToTab(isolatedTab, nextIndex, duration);
    }, duration);
  }

  function autoplayInitialiser() {
    const allTabs = document.querySelectorAll("[data-tab-type][data-tab-name]");

    allTabs.forEach((isolatedTab) => {
      const autoplayAttr = isolatedTab.getAttribute("data-tab-autoplay");

      // Only initialize autoplay if attribute exists
      if (autoplayAttr !== null) {
        // Parse duration: empty string = 5000, otherwise parse the value
        const duration =
          autoplayAttr === "" ? 5000 : parseInt(autoplayAttr, 10) || 5000;

        // Start autoplay for this tab instance
        startAutoplay(isolatedTab, duration);

        // Trigger initial progress bar animation for the first active tab
        const tabMenu = isolatedTab.querySelector("[data-tab-menu]");
        const firstLink = tabMenu ? tabMenu.children[0] : null;
        if (firstLink) {
          const progressBar = firstLink.querySelector("[data-tab-border]");
          if (progressBar && window.gsap) {
            window.gsap.set(progressBar, { width: "0%" });
            window.gsap.to(progressBar, {
              width: "100%",
              duration: duration / 1000,
              ease: "linear",
            });
          }
        }
      }
    });
  }

  setTimeout(() => {
    rowInitialiser();
    indexInitialiser();
    tabInitialiser();
    clickInitialiser();
    autoplayInitialiser();
  }, 100);
});

//Gallery Swiper
document.addEventListener("DOMContentLoaded", function () {
  function galleryInitializer() {
    const galleryWrapper = document.querySelector("[data-gallery-wrap]");
    if (!galleryWrapper) return;

    const galleryList = galleryWrapper.querySelector("[data-gallery-list]");
    const slides = galleryWrapper.querySelectorAll("[data-gallery-slide]");
    const paginationContainer = document.getElementById("gallery-pagination");

    if (!galleryList || slides.length === 0 || !paginationContainer) return;

    let currentIndex = 0;
    let autoplayTimer = null;

    // Get autoplay duration from data attribute (default 3000ms)
    const autoplayAttr = galleryList.getAttribute("data-gallery-autoplay");
    const autoplayDuration =
      autoplayAttr !== null
        ? autoplayAttr === ""
          ? 3000
          : parseInt(autoplayAttr, 10) || 3000
        : 3000;

    // Function to switch to a specific slide
    function switchToSlide(index) {
      // Hide all slides
      slides.forEach((slide) => {
        slide.style.display = "none";
      });

      // Show target slide
      slides[index].style.display = "block";

      // Update pagination dots
      const dots = paginationContainer.querySelectorAll("[data-gallery-dot]");
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.setAttribute("data-gallery-dot", "active");
        } else {
          dot.setAttribute("data-gallery-dot", "inactive");
        }
      });

      currentIndex = index;
    }

    // Generate pagination dots
    function generatePagination() {
      paginationContainer.innerHTML = "";

      slides.forEach((slide, index) => {
        const dot = document.createElement("div");
        dot.setAttribute(
          "data-gallery-dot",
          index === 0 ? "active" : "inactive",
        );
        dot.style.cursor = "pointer";

        // Add click handler
        dot.addEventListener("click", () => {
          switchToSlide(index);
          resetAutoplay();
        });

        paginationContainer.appendChild(dot);
      });
    }

    // Autoplay function
    function startAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
      }

      autoplayTimer = setInterval(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        switchToSlide(nextIndex);
      }, autoplayDuration);
    }

    // Reset autoplay timer
    function resetAutoplay() {
      startAutoplay();
    }

    // Initialize
    generatePagination();
    switchToSlide(0);
    startAutoplay();
  }

  // Initialize gallery after a short delay
  setTimeout(() => {
    galleryInitializer();
  }, 100);
});

//Timeline Swiper
document.addEventListener("DOMContentLoaded", function () {
  var mySwiper = new Swiper("#timeline-swiper", {
    slidesPerGroup: 1,
    grabCursor: true,
    allowTouchMove: true,
    autoHeight: false,
    watchOverflow: true,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    centeredSlides: false,
    loop: false,
    resistanceRatio: 0,
    pagination: {
      el: "#timeline-pagination",
      clickable: true,
      bulletClass: "timeline-bullet",
      bulletActiveClass: "timeline-bullet-active",
    },
    navigation: {
      nextEl: "#timeline-next",
      prevEl: "#timeline-prev",
      disabledClass: "timeline-nav-disabled",
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "Previous slide",
      nextSlideMessage: "Next slide",
      firstSlideMessage: "This is the first slide",
      lastSlideMessage: "This is the last slide",
      paginationBulletMessage: "Go to slide {{index}}",
      notificationClass: "swiper-notification",
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 16,
      },
      992: {
        slidesPerView: 2.5,
        spaceBetween: 16,
      },
    },
    on: {
      init: function () {
        updateSlideAttributes(this);
      },
      slideChange: function () {
        updateSlideAttributes(this);
      },
      resize: function () {
        updateSlideAttributes(this);
      },
    },
  });

  function updateSlideAttributes(swiper) {
    const slides = swiper.slides;
    const activeIndex = swiper.activeIndex;

    slides.forEach((slide, index) => {
      // Remove all custom attributes first
      slide.removeAttribute("data-timeline-active");
      slide.removeAttribute("data-timeline-next");
      slide.removeAttribute("data-timeline-base");

      // Active slide
      if (index === activeIndex) {
        slide.setAttribute("data-timeline-active", "");
      }
      // Next slide
      else if (index === activeIndex + 1) {
        slide.setAttribute("data-timeline-next", "");
      }
      // All other slides (base state)
      else {
        slide.setAttribute("data-timeline-base", "");
      }
    });
  }
});
