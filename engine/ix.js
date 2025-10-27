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

//Glowing Cards
document.addEventListener("DOMContentLoaded", function () {
  // Store card states
  const cardStates = new Map();
  let isInitialized = false;
  let resizeTimeout = null;
  let globalAnimationFrame = null;
  let lastMousePosition = { x: 0, y: 0 };
  let isDOMStable = false; // Prevent running during DOM mutations

  /**
   * Main initialization function - finds all [data-glow-card] and sets up glow effects
   */
  function glowCardsInitialiser() {
    if (window.innerWidth < 768) {
      return;
    }

    // Guard against multiple initializations
    if (isInitialized) {
      return;
    }

    // Wait for DOM to stabilize (prevent conflicts with other scripts)
    if (!isDOMStable) {
      return;
    }

    // Convert to array to avoid live collection issues
    const cards = Array.from(document.querySelectorAll("[data-glow-card]"));

    if (cards.length === 0) {
      return;
    }

    // Process cards in a stable way
    cards.forEach((card) => {
      // Skip if element is no longer in DOM
      if (!card.isConnected) {
        return;
      }

      // Skip if already wrapped
      if (card.parentElement?.classList.contains("o-glow-wrapper")) {
        return;
      }

      // Skip if already processed (marked with attribute)
      if (card.hasAttribute("data-glow-initialized")) {
        return;
      }

      // Mark as being processed
      card.setAttribute("data-glow-initialized", "true");

      // Check if disabled
      const state = card.getAttribute("data-glow-state");
      if (state === "disabled") {
        // Still wrap but don't initialize glow
        wrapCardWithGlow(card);
        return;
      }

      // Wrap and initialize
      const wrapper = wrapCardWithGlow(card);
      initializeGlowEffect(wrapper, card);
    });

    // Add global event listeners (only once)
    if (cardStates.size > 0) {
      document.body.addEventListener("pointermove", handleGlobalMouseMove, {
        passive: true,
      });
      window.addEventListener("scroll", handleGlobalScroll, { passive: true });
    }

    isInitialized = true;
  }

  /**
   * Cleanup function - removes glow effects and event listeners
   */
  function glowCardsCleanup() {
    if (!isInitialized) return;

    // Remove global event listeners
    document.body.removeEventListener("pointermove", handleGlobalMouseMove);
    window.removeEventListener("scroll", handleGlobalScroll);

    // Cancel any pending animation frame
    if (globalAnimationFrame) {
      cancelAnimationFrame(globalAnimationFrame);
      globalAnimationFrame = null;
    }

    // Remove glow containers from DOM and clean up markers
    cardStates.forEach((state, wrapper) => {
      const glowContainer = wrapper.querySelector(".o-glow-container");
      if (glowContainer) {
        glowContainer.remove();
      }

      // Remove initialization marker from card
      const card = wrapper.querySelector("[data-glow-initialized]");
      if (card) {
        card.removeAttribute("data-glow-initialized");
      }
    });

    // Clear card states
    cardStates.clear();

    isInitialized = false;
  }

  /**
   * Handle scroll events - update cards with last known mouse position
   */
  function handleGlobalScroll() {
    if (globalAnimationFrame) {
      cancelAnimationFrame(globalAnimationFrame);
    }

    globalAnimationFrame = requestAnimationFrame(() => {
      updateAllCards(lastMousePosition.x, lastMousePosition.y);
    });
  }

  /**
   * Wraps a card element with .o-glow-wrapper
   * @param {HTMLElement} cardElement - The card to wrap
   * @returns {HTMLElement} The wrapper element
   */
  function wrapCardWithGlow(cardElement) {
    // Create wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "o-glow-wrapper";

    // Get border-radius from card and apply to wrapper
    const computedStyle = window.getComputedStyle(cardElement);
    const borderRadius = computedStyle.borderRadius;
    if (borderRadius && borderRadius !== "0px") {
      wrapper.style.borderRadius = borderRadius;
    }

    // Copy data-glow-theme attribute to wrapper if it exists
    const theme = cardElement.getAttribute("data-glow-theme");
    if (theme) {
      wrapper.setAttribute("data-glow-theme", theme);
    }

    // Insert wrapper before card
    cardElement.parentNode.insertBefore(wrapper, cardElement);

    // Move card inside wrapper
    wrapper.appendChild(cardElement);

    return wrapper;
  }

  /**
   * Creates the glow DOM elements
   * @returns {Object} Object with container and effect element references
   */
  function createGlowElements() {
    const container = document.createElement("div");
    container.className = "o-glow-container";

    const effect = document.createElement("div");
    effect.className = "o-glow-effect";

    container.appendChild(effect);

    return { container, effect };
  }

  /**
   * Initialize glow effect for a wrapped card
   * @param {HTMLElement} wrapper - The wrapper element
   * @param {HTMLElement} cardElement - The original card element
   */
  function initializeGlowEffect(wrapper, cardElement) {
    // Read config from card attributes
    const config = {
      spread: parseFloat(cardElement.getAttribute("data-glow-spread")) || 40,
      proximity:
        parseFloat(cardElement.getAttribute("data-glow-proximity")) || 64,
      deadzone:
        parseFloat(cardElement.getAttribute("data-glow-deadzone")) || 0.6,
      duration:
        parseFloat(cardElement.getAttribute("data-glow-duration")) || 0.6,
      borderWidth:
        parseFloat(cardElement.getAttribute("data-glow-border")) || 1,
    };

    // Create glow elements
    const { container, effect } = createGlowElements();

    // Set CSS variables
    container.style.setProperty("--glow-start", "0");
    container.style.setProperty("--glow-active", "0");
    container.style.setProperty("--glow-spread", config.spread);
    container.style.setProperty(
      "--glow-border-width",
      `${config.borderWidth}px`,
    );

    // Inject into wrapper (as first child, before card)
    wrapper.insertBefore(container, wrapper.firstChild);

    // Store card state
    cardStates.set(wrapper, {
      glowContainer: container,
      config: config,
      currentAngle: 0,
    });
  }

  /**
   * Global mouse move handler - updates all cards at once
   */
  function handleGlobalMouseMove(e) {
    try {
      lastMousePosition = { x: e.clientX, y: e.clientY };

      if (globalAnimationFrame) {
        cancelAnimationFrame(globalAnimationFrame);
      }

      globalAnimationFrame = requestAnimationFrame(() => {
        try {
          updateAllCards(lastMousePosition.x, lastMousePosition.y);
        } catch (error) {
          // Silently fail to prevent crashes during animation
          console.error("Glow Cards: Update failed", error);
        }
      });
    } catch (error) {
      console.error("Glow Cards: Mouse handler failed", error);
    }
  }

  /**
   * Update all card glow effects based on mouse position
   */
  function updateAllCards(mouseX, mouseY) {
    cardStates.forEach((state, wrapper) => {
      updateCardGlow(wrapper, state, mouseX, mouseY);
    });
  }

  /**
   * Update a single card's glow effect
   */
  function updateCardGlow(wrapper, state, mouseX, mouseY) {
    const { glowContainer, config } = state;

    const rect = wrapper.getBoundingClientRect();
    const { left, top, width, height } = rect;

    // Calculate center
    const centerX = left + width * 0.5;
    const centerY = top + height * 0.5;

    // Calculate distance from center
    const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);

    // Check inactive zone (deadzone)
    const inactiveRadius = 0.5 * Math.min(width, height) * config.deadzone;

    if (distanceFromCenter < inactiveRadius) {
      glowContainer.style.setProperty("--glow-active", "0");
      return;
    }

    // Check proximity
    const isActive =
      mouseX > left - config.proximity &&
      mouseX < left + width + config.proximity &&
      mouseY > top - config.proximity &&
      mouseY < top + height + config.proximity;

    glowContainer.style.setProperty("--glow-active", isActive ? "1" : "0");

    if (!isActive) return;

    // Calculate angle
    const targetAngle =
      (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI + 90;

    // Calculate shortest rotation path
    const angleDiff = ((targetAngle - state.currentAngle + 180) % 360) - 180;
    const newAngle = state.currentAngle + angleDiff;

    // Update angle immediately - CSS transition will smooth it
    glowContainer.style.setProperty("--glow-start", String(newAngle));
    state.currentAngle = newAngle;
  }

  /**
   * Handle responsive behavior on window resize
   */
  function handleResize() {
    // Don't run if DOM is not stable yet
    if (!isDOMStable) {
      return;
    }

    // Clear previous timeout
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    // Debounce resize events with longer delay to avoid conflicts
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth >= 768 && !isInitialized) {
        // Switched to desktop - initialize
        glowCardsInitialiser();
      } else if (window.innerWidth < 768 && isInitialized) {
        // Switched to mobile - cleanup
        glowCardsCleanup();
      }
    }, 300); // Increased from 200ms to avoid conflicts
  }

  // Delay initialization to run AFTER all other scripts
  // This prevents conflicts with MutationObservers and other DOM manipulation
  setTimeout(() => {
    try {
      isDOMStable = true; // Mark DOM as stable
      glowCardsInitialiser();
    } catch (error) {
      console.error("Glow Cards: Initialization failed", error);
      // Fail silently to not break other scripts
    }
  }, 500);

  // Add resize listener with error handling
  window.addEventListener(
    "resize",
    () => {
      try {
        handleResize();
      } catch (error) {
        console.error("Glow Cards: Resize handler failed", error);
      }
    },
    { passive: true },
  );
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
  function indexInitialiser() {
    const allTabs = document.querySelectorAll("[data-tab-name]");

    allTabs.forEach((isolatedTab) => {
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
        link.setAttribute("data-tab-link", index + 1);
      });

      panesArray.forEach((pane, index) => {
        pane.setAttribute("data-tab-pane", index + 1);
      });
    });
  }

  function tabInitialiser() {
    const allTabs = document.querySelectorAll("[data-tab-name]");

    allTabs.forEach((tab) => {
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
            if (window.elementAnimator) {
              window.elementAnimator(pane, "top 100%");
            }
          } else {
            pane.setAttribute("data-tab-state", "hide");
          }
        });
      }
    });
  }

  function switchToTab(isolatedTab, targetIndex, duration = null) {
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

    const targetLink = sameTabLinks.find(
      (link) => link.getAttribute("data-tab-link") === String(targetIndex),
    );

    // Update links and progress bars
    sameTabLinks.forEach((link) => {
      if (link === targetLink) {
        link.setAttribute("data-tab-state", "show");
        link.classList.add("active");

        const progressBar = link.querySelector("[data-tab-border]");
        if (progressBar && duration && window.gsap) {
          window.gsap.killTweensOf(progressBar);
          window.gsap.set(progressBar, { width: "0%" });
          window.gsap.to(progressBar, {
            width: "100%",
            duration: duration / 1000,
            ease: "linear",
          });
        }
      } else {
        link.setAttribute("data-tab-state", "hide");
        link.classList.remove("active");

        const otherProgressBar = link.querySelector("[data-tab-border]");
        if (otherProgressBar && window.gsap) {
          window.gsap.killTweensOf(otherProgressBar);
          window.gsap.set(otherProgressBar, { width: "0%" });
        }
      }
    });

    // Reset all videos in all panes to t=0 and pause
    sameTabPanes.forEach((pane) => {
      const videos = pane.querySelectorAll("video");
      videos.forEach((video) => {
        video.currentTime = 0;
        video.pause();
      });
    });

    // Reset all glow elements to 0% width
    sameTabPanes.forEach((pane) => {
      const glows = pane.querySelectorAll("[data-tab-glow]");
      if (window.gsap) {
        glows.forEach((glow) => {
          window.gsap.killTweensOf(glow);
          window.gsap.set(glow, { width: "0%" });
        });
      }
    });

    // Hide all panes
    sameTabPanes.forEach((pane) => {
      pane.setAttribute("data-tab-state", "hide");
    });

    // Show target pane
    const targetPane =
      tabContentContainer && tabContentContainer.children[targetIndex - 1];
    if (targetPane) {
      targetPane.setAttribute("data-tab-state", "show");

      if (window.elementAnimator) {
        if (window.gsap) {
          window.gsap.set(targetPane, { clearProps: "all" });
        }
        window.elementAnimator(targetPane, "top 100%");
      }

      // Animate glow effect for the active pane (CRT shimmer effect)
      const glows = targetPane.querySelectorAll("[data-tab-glow]");
      if (glows.length > 0 && window.gsap) {
        glows.forEach((glow) => {
          window.gsap.fromTo(
            glow,
            { width: "0%" },
            {
              width: "100%",
              duration: 2,
              ease: "power4.out",
            },
          );
        });
      }

      // Play videos in the active panes
      const activeVideos = targetPane.querySelectorAll("video");
      activeVideos.forEach((video) => {
        video.play().catch((error) => {
          console.warn("Hero Video: Video autoplay prevented:", error);
        });
      });
    }
  }

  function clickInitialiser() {
    const allTabs = document.querySelectorAll("[data-tab-name]");

    allTabs.forEach((isolatedTab) => {
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

          const autoplayAttr = isolatedTab.getAttribute("data-tab-autoplay");
          const duration =
            autoplayAttr !== null
              ? autoplayAttr === ""
                ? 5000
                : parseInt(autoplayAttr, 10)
              : null;

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
      const currentActive = tabLinks.find((link) =>
        link.classList.contains("active"),
      );
      const currentIndex = currentActive
        ? parseInt(currentActive.getAttribute("data-tab-link"), 10)
        : 1;

      const nextIndex = currentIndex >= tabLinks.length ? 1 : currentIndex + 1;

      switchToTab(isolatedTab, nextIndex, duration);
    }, duration);
  }

  function autoplayInitialiser() {
    const allTabs = document.querySelectorAll("[data-tab-name]");

    allTabs.forEach((isolatedTab) => {
      const autoplayAttr = isolatedTab.getAttribute("data-tab-autoplay");

      if (autoplayAttr !== null) {
        const duration =
          autoplayAttr === "" ? 5000 : parseInt(autoplayAttr, 10) || 5000;

        startAutoplay(isolatedTab, duration);

        // Trigger initial progress bar animation
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
    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 16,
    grabCursor: true,
    allowTouchMove: true,
    autoHeight: false,
    watchOverflow: true,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    centeredSlides: false,
    loop: false,
    resistanceRatio: 0,
    effect: "creative",
    creativeEffect: {
      limitProgress: 3,
      prev: {
        opacity: 0.4,
        scale: 0.9,
        translate: [0, 0, 0],
      },
      next: {
        opacity: 0.6,
        scale: 0.95,
        translate: [0, 0, 0],
      },
    },
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
    watchSlidesProgress: false,
    watchSlidesVisibility: false,
    breakpoints: {
      992: {
        slidesPerView: 2.5,
        spaceBetween: 16,
      },
    },
    on: {
      init: function () {
        filterYearNavigation(this);
        updateSlideAttributes(this);
        updateYearNavigation(this);
        initializeYearNavigation(this);
      },
      slideChange: function () {
        updateSlideAttributes(this);
        updateYearNavigation(this);
      },
      resize: function () {
        updateSlideAttributes(this);
      },
    },
  });

  // Update slide visual states (active, next, base)
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

  // Get year from active slide
  function getActiveSlideYear(swiper) {
    const activeSlide = swiper.slides[swiper.activeIndex];
    if (!activeSlide) return null;

    const yearSourceElement = activeSlide.querySelector("[data-year-source]");
    return yearSourceElement
      ? yearSourceElement.getAttribute("data-year-source")
      : null;
  }

  // Update year navigation to match active slide
  function updateYearNavigation(swiper) {
    const activeYear = getActiveSlideYear(swiper);
    if (!activeYear) return;

    const yearItems = document.querySelectorAll("[data-timeline-year]");

    yearItems.forEach((yearItem) => {
      const yearValue = yearItem.getAttribute("data-year-target");

      if (yearValue === activeYear) {
        yearItem.setAttribute("data-year-state", "active");
      } else {
        yearItem.setAttribute("data-year-state", "inactive");
      }
    });
  }

  // Find first slide index with matching year
  function findSlideIndexByYear(swiper, targetYear) {
    const slides = swiper.slides;

    for (let i = 0; i < slides.length; i++) {
      const yearSourceElement = slides[i].querySelector("[data-year-source]");
      if (yearSourceElement) {
        const slideYear = yearSourceElement.getAttribute("data-year-source");
        if (slideYear === targetYear) {
          return i;
        }
      }
    }

    return -1;
  }

  // Handle year navigation click
  function handleYearClick(swiper, targetYear) {
    const slideIndex = findSlideIndexByYear(swiper, targetYear);

    if (slideIndex !== -1) {
      swiper.slideTo(slideIndex);
    }
  }

  // Get all unique years from swiper slides
  function getAvailableYears(swiper) {
    const years = new Set();
    const slides = swiper.slides;

    slides.forEach((slide) => {
      const yearSourceElement = slide.querySelector("[data-year-source]");
      if (yearSourceElement) {
        const year = yearSourceElement.getAttribute("data-year-source");
        if (year) {
          years.add(year);
        }
      }
    });

    return years;
  }

  // Remove year navigation items that don't have corresponding slides
  function filterYearNavigation(swiper) {
    const availableYears = getAvailableYears(swiper);
    const yearItems = document.querySelectorAll("[data-timeline-year]");

    yearItems.forEach((yearItem) => {
      const yearValue = yearItem.getAttribute("data-year-target");

      if (!availableYears.has(yearValue)) {
        yearItem.remove();
      }
    });
  }

  // Initialize click handlers for year navigation
  function initializeYearNavigation(swiper) {
    const yearItems = document.querySelectorAll("[data-timeline-year]");

    yearItems.forEach((yearItem) => {
      yearItem.style.cursor = "pointer";

      yearItem.addEventListener("click", function () {
        const targetYear = this.getAttribute("data-year-target");
        handleYearClick(swiper, targetYear);
      });
    });
  }
});

//Blog Share Snippet
document.addEventListener("DOMContentLoaded", () => {
  // Find all elements with data-blog-share attribute
  const shareElements = document.querySelectorAll("[data-blog-share]");

  // Add click event listeners to each element
  shareElements.forEach((element) => {
    element.addEventListener("click", function () {
      const shareType = this.getAttribute("data-blog-share");

      if (shareType === "copy") {
        // Copy current URL to clipboard
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            showToast("Copied to clipboard");
          })
          .catch((err) => {
            console.error("Failed to copy URL:", err);
          });
      } else if (shareType === "mail") {
        // Create mailto link and trigger it
        const mailtoUrl = `mailto:?subject=Check this out&body=${window.location.href}`;
        window.location.href = mailtoUrl;
      }
    });
  });

  // Simple toast notification function
  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.padding = "10px 20px";
    toast.style.backgroundColor = "#1c1c24";
    toast.style.color = "#fff";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";

    document.body.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
});
