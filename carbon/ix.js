console.log("ix deployed");

//Navigation Bar
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector('[data-nav-element="menu"]')
    .addEventListener("click", () => {
      const navbar = document.querySelector('[data-nav-element="navbar"]');
      const currentState = navbar.getAttribute("data-nav-state");
      navbar.setAttribute(
        "data-nav-state",
        currentState === "open" ? "closed" : "open",
      );
    });
});

//Navigation Banner
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector('[data-banner-element="close"]')
    .addEventListener("click", () => {
      const banner = document.querySelector('[data-banner-element="banner"]');
      const currentState = banner.getAttribute("data-banner-state");
      banner.setAttribute(
        "data-banner-state",
        currentState === "visible" ? "hidden" : "visible",
      );
    });
});

//Navbar Border
document.addEventListener("DOMContentLoaded", () => {
  const navbarElement = document.querySelector("[data-navbar-border]");
  const triggerElement = document.querySelector("[data-border-trigger]");

  if (navbarElement && triggerElement) {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 160",
      onEnter: () => {
        navbarElement.setAttribute("data-navbar-border", "on");
      },
      onLeaveBack: () => {
        navbarElement.setAttribute("data-navbar-border", "off");
      },
    });
  }
});

//Swiper (Reviews)
document.addEventListener("DOMContentLoaded", function () {
  var reviewsSwiper = new Swiper("#reviews-swiper", {
    direction: "vertical",
    slidesPerView: 1.2,
    spaceBetween: 20,
    mousewheel: false,
    grabCursor: true,
    loop: true,
    slidesOffsetBefore: 0,
    // Navigation arrows
    navigation: {
      nextEl: "#reviews-next",
      prevEl: "#reviews-prev",
    },
    // Pagination
    pagination: {
      el: "#reviews-pagination",
      clickable: true,
    },
    centeredSlides: false,
    autoplay:
      window.innerWidth >= 768
        ? {
            delay: 3000,
            disableOnInteraction: false,
          }
        : false,
    allowTouchMove: window.innerWidth >= 768,
  });
});

//Swiper (Benefits)
document.addEventListener("DOMContentLoaded", function () {
  var mySwiper = new Swiper("#benefits-swiper", {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 16,
    grabCursor: true,
    allowTouchMove: true,
    autoHeight: false,
    watchOverflow: true, // Added: Disable navigation when not needed
    slidesOffsetBefore: 0, // Added: Ensure slides start at container edge
    slidesOffsetAfter: 0, // Added: Ensure slides end at container edge
    centeredSlides: false, // Added: Keep slides aligned to left
    loopedSlides: null, // Added: Prevent loop issues
    resistanceRatio: 0, // Added: Prevent overscroll
    pagination: {
      el: "#benefits-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#benefits-next",
      prevEl: "#benefits-prev",
    },
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
});

// Marquee
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const OPEN_CARD_INTERVAL = 4;

  // Mobile detection
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function shouldBlockMotionOnMobile() {
    const marqueeWrap = document.querySelector("[data-marquee-wrap]");
    return (
      marqueeWrap && marqueeWrap.getAttribute("data-motion-block") === "mobile"
    );
  }

  // Clone cards function
  function cloneCards() {
    const marqueeWrap = document.querySelector("[data-marquee-wrap]");
    const marqueeItem = document.querySelector("[data-marquee-item]");

    if (!marqueeWrap || !marqueeItem) {
      console.warn("Marquee elements not found");
      return;
    }

    const originalContent = marqueeItem.outerHTML;

    function calculateRequiredCopies() {
      // On mobile with motion block, use fixed number of copies
      if (isMobile() && shouldBlockMotionOnMobile()) {
        return {
          viewportWidth: window.innerWidth,
          itemWidth: marqueeItem.offsetWidth,
          copiesNeeded: 3,
        };
      }

      // Original logic for desktop
      const viewportWidth = window.innerWidth;
      const itemWidth = marqueeItem.offsetWidth;
      // Create a sequence 5 times the viewport width
      const copiesNeeded = Math.ceil((viewportWidth * 5) / itemWidth) + 2;

      return {
        viewportWidth,
        itemWidth,
        copiesNeeded,
      };
    }

    const { copiesNeeded, itemWidth } = calculateRequiredCopies();
    marqueeWrap.innerHTML = "";

    for (let i = 0; i < copiesNeeded; i++) {
      const clone = document.createElement("div");
      clone.innerHTML = originalContent;
      const clonedItem = clone.firstElementChild;
      marqueeWrap.appendChild(clonedItem);
    }

    return { itemWidth, copiesNeeded };
  }

  // Move cards function (desktop only)
  function moveCards(itemWidth, copiesNeeded) {
    // Check if we should block motion on mobile
    if (isMobile()) {
      return;
    }

    const marqueeWrap = document.querySelector("[data-marquee-wrap]");
    if (!marqueeWrap) {
      console.warn("News Marquee not found");
      return;
    }

    // Total width of the sequence
    const totalWidth = itemWidth * copiesNeeded;

    gsap.to(marqueeWrap, {
      x: -totalWidth + itemWidth, // Subtract one item width to ensure smooth loop
      duration: totalWidth / 25, // Slowed down the speed for longer animation
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(marqueeWrap, { x: 0 });
      },
    });
  }

  // Open cards function
  function openCards() {
    const cards = document.querySelectorAll("[data-marquee-card]");
    if (!cards.length) {
      console.warn("No marquee cards found");
      return;
    }

    cards.forEach((card, index) => {
      // Set default state
      card.setAttribute("data-marquee-card", "off");

      // Open cards at indices 0, 4, 8, 12, etc.
      if (index % 4 === 0) {
        card.setAttribute("data-marquee-card", "on");
      }
    });
  }

  // Main initialization
  function runCards() {
    const cloneData = cloneCards();
    if (!cloneData) return;

    const { itemWidth, copiesNeeded } = cloneData;

    if (isMobile()) {
      if (shouldBlockMotionOnMobile()) {
      }
    } else {
      moveCards(itemWidth, copiesNeeded);
    }

    // Set card states for both mobile and desktop
    openCards();
  }

  // Start the initialization
  runCards();
});

/* document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing unified marquee/ticker script");

  // Configuration
  const OPEN_CARD_INTERVAL = 4;

  // Mobile detection
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function shouldBlockMotionOnMobile() {
    const marqueeWrap = document.querySelector("[data-marquee-wrap]");
    return (
      marqueeWrap && marqueeWrap.getAttribute("data-motion-block") === "mobile"
    );
  }

  // Card initialization
  function initializeMarqueeCards() {
    console.log("Initializing card dimensions");
    try {
      const cards = document.querySelectorAll("[data-marquee-card]");
      if (!cards.length) {
        console.warn("No marquee cards found");
        return;
      }

      cards.forEach((card) => {
        if (card && card.parentElement) {
          const parentHeight = card.parentElement.offsetHeight;
          const width = Math.floor(parentHeight * 0.3 + 24);
          card.style.width = `${width}px`;
        }
      });

      console.log(`Initialized ${cards.length} cards`);
    } catch (error) {
      console.error("Marquee card calculation error:", error);
    }
  }

  // Desktop marquee setup
  function setupDesktopMarquee() {
    console.log("Setting up desktop marquee");

    const marqueeWrap = document.querySelector("[data-marquee-wrap]");
    const marqueeItem = document.querySelector("[data-marquee-item]");

    if (!marqueeWrap || !marqueeItem) {
      console.error("Marquee elements not found");
      return;
    }

    const originalContent = marqueeItem.outerHTML;

    function calculateRequiredCopies() {
      const viewportWidth = window.innerWidth;
      const itemWidth = marqueeItem.offsetWidth;
      const copiesNeeded = Math.ceil((viewportWidth * 5) / itemWidth) + 2;

      return { viewportWidth, itemWidth, copiesNeeded };
    }

    const { copiesNeeded, itemWidth } = calculateRequiredCopies();
    marqueeWrap.innerHTML = "";

    for (let i = 0; i < copiesNeeded; i++) {
      const clone = document.createElement("div");
      clone.innerHTML = originalContent;
      const clonedItem = clone.firstElementChild;
      marqueeWrap.appendChild(clonedItem);
    }

    const totalWidth = itemWidth * copiesNeeded;

    gsap.to(marqueeWrap, {
      x: -totalWidth + itemWidth,
      duration: totalWidth / 25,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(marqueeWrap, { x: 0 });
      },
    });

    console.log("Desktop marquee animation started");
  }

  // Mobile ticker setup
  function setupMobileTicker() {
    console.log("Setting up mobile ticker");

    const tickerList = document.querySelector("[data-ticker-list]");
    if (!tickerList) {
      console.warn("Ticker list not found");
      return;
    }

    const tickerCards = tickerList.querySelectorAll(
      ".w-dyn-items [data-ticker-card]",
    );
    if (!tickerCards.length) {
      console.warn("No ticker cards found");
      return;
    }

    Array.from(tickerCards).forEach((card, index) => {
      if (index % 4 === 0) {
        card.setAttribute("data-ticker-card", "on");
      }
    });

    console.log(
      `Mobile ticker setup complete - ${tickerCards.length} cards processed`,
    );
  }

  // Card interaction functions
  function openCard(card, initialWidth, getHoverWidth, quickAnims) {
    const targetWidth = getHoverWidth();
    quickAnims.width(targetWidth);
    quickAnims.bg(0);
    quickAnims.textOpacity(1);
    card.setAttribute("data-marquee-state", "hover");
  }

  function closeCard(card, initialWidth, quickAnims) {
    quickAnims.width(initialWidth);
    quickAnims.bg(1);
    quickAnims.textOpacity(0);
    card.setAttribute("data-marquee-state", "default");
  }

  // Main initialization
  function initializeCards() {
    console.log("Initializing card interactions");

    initializeMarqueeCards();

    if (isMobile()) {
      console.log("Mobile detected - setting up ticker");
      if (shouldBlockMotionOnMobile()) {
        console.log("Motion blocked on mobile - static display");
      }
      setupMobileTicker();
    } else {
      console.log("Desktop detected - setting up marquee");
      setupDesktopMarquee();
    }

    // Setup card interactions for both desktop and mobile
    const cards = document.querySelectorAll("[data-marquee-card]");
    console.log(`Setting up interactions for ${cards.length} cards`);

    cards.forEach((card, index) => {
      const bgLayer = card.querySelector("[data-marquee-bg]");
      const textLayer = card.querySelector("[data-marquee-text]");
      const easeDuration =
        parseFloat(card.getAttribute("data-marquee-ease")) || 0.4;

      if (!bgLayer || !textLayer) {
        console.warn(`Missing layers for card ${index}`);
        return;
      }

      gsap.set(textLayer, { opacity: 0 });

      const initialWidth = card.offsetWidth;
      const getHoverWidth = () => {
        const currentHeight = card.offsetHeight;
        return (currentHeight * 16) / 9;
      };

      const quickAnims = {
        width: gsap.quickTo(card, "width", {
          duration: easeDuration,
          ease: "power2.inOut",
        }),
        bg: gsap.quickTo(bgLayer, "opacity", {
          duration: easeDuration,
          ease: "power2.inOut",
        }),
        textOpacity: gsap.quickTo(textLayer, "opacity", {
          duration: easeDuration,
          ease: "power2.inOut",
        }),
      };

      // Desktop-only: Open every 4th card
      if (!isMobile() && (index + 1) % OPEN_CARD_INTERVAL === 0) {
        openCard(card, initialWidth, getHoverWidth, quickAnims);
        console.log(`Opened card ${index + 1} (desktop interval)`);
      }
    });

    console.log("Card initialization complete");
  }

  // Start the initialization
  initializeCards();
}); */

// Cards Overlays
document.addEventListener("DOMContentLoaded", () => {
  // Animation Constants
  const ANIMATION = {
    duration: 0.4,
    opacityDuration: 0.3,
    ease: "power2.out",
  };

  // Select all card elements using data attribute
  const cards = document.querySelectorAll("[data-ab-card='card']");

  // Track currently open card
  let currentlyOpenCard = null;

  // Store previous window width to detect actual layout changes
  let prevWidth = window.innerWidth;

  // Check if device is mobile
  const isMobile = () => window.innerWidth <= 767;

  // Setup for each card
  cards.forEach((card, index) => {
    const overlay = card.querySelector("[data-ab-card='overlay']");
    const content = card.querySelector("[data-ab-card='content']");
    const button = card.querySelector("[data-ab-card='button']");

    // Check if elements exist
    if (!overlay) {
      console.error(
        `Card #${index} is missing overlay element ([data-ab-card='overlay'])`,
      );
      return;
    }
    if (!content) {
      console.error(
        `Card #${index} is missing content element ([data-ab-card='content'])`,
      );
      return;
    }
    if (!button) {
      console.error(
        `Card #${index} is missing button element ([data-ab-card='button'])`,
      );
      return;
    }

    // Initial state - check data-card-state attribute
    let isOpen = overlay.getAttribute("data-card-state") === "open";

    // Height variables
    let initialOverlayHeight;
    let finalOverlayHeight;
    let contentHeight;

    // Function to calculate heights - different for mobile vs desktop
    const calculateHeights = () => {
      initialOverlayHeight = parseFloat(
        window.getComputedStyle(overlay).height,
      );

      // For mobile: initialHeight + contentHeight
      // For desktop: use card's full height
      if (isMobile()) {
        // Make content temporarily visible to measure height
        const contentDisplay = window.getComputedStyle(content).display;
        const contentOpacity = window.getComputedStyle(content).opacity;

        gsap.set(content, { display: "flex", opacity: 0 });
        contentHeight = parseFloat(window.getComputedStyle(content).height);

        // Reset content to original state
        gsap.set(content, { display: contentDisplay, opacity: contentOpacity });

        finalOverlayHeight = initialOverlayHeight + contentHeight;
      } else {
        // Desktop behavior - use card's full height
        finalOverlayHeight = parseFloat(window.getComputedStyle(card).height);
      }
    };

    // Calculate on page load
    calculateHeights();

    // Set initial styles
    gsap.set(content, {
      display: isOpen ? "flex" : "none",
      opacity: isOpen ? 1 : 0,
    });

    gsap.set(overlay, {
      height: isOpen ? finalOverlayHeight : initialOverlayHeight,
      overflow: isOpen && !isMobile() ? "scroll" : "hidden",
    });

    // Create quickTo function for the overlay height
    const animateHeight = gsap.quickTo(overlay, "height", {
      duration: ANIMATION.duration,
      ease: ANIMATION.ease,
    });

    // Create quickTo function for content opacity
    const animateOpacity = gsap.quickTo(content, "opacity", {
      duration: ANIMATION.opacityDuration,
      ease: ANIMATION.ease,
    });

    // Function to open the card
    const openCard = () => {
      if (overlay.getAttribute("data-card-state") === "open") return;

      // If another card is open, close it first
      if (currentlyOpenCard && currentlyOpenCard !== card) {
        currentlyOpenCard.closeCard();
      }

      // Recalculate heights to ensure correct measurements
      calculateHeights();

      // Update card state attribute
      overlay.setAttribute("data-card-state", "open");

      // Animate overlay height using quickTo
      animateHeight(finalOverlayHeight);

      // Show content and animate opacity
      gsap.set(content, { display: "flex" });
      animateOpacity(1);

      // Set overflow to scroll ONLY on desktop
      if (!isMobile()) {
        gsap.delayedCall(ANIMATION.opacityDuration, () => {
          gsap.set(overlay, { overflowY: "scroll" });
        });
      }

      currentlyOpenCard = card;
      console.log(
        `Card #${index} opened (${isMobile() ? "Mobile" : "Desktop"} mode)`,
      );
    };

    // Function to close the card
    const closeCard = () => {
      if (overlay.getAttribute("data-card-state") === "closed") return;

      // Update card state attribute
      overlay.setAttribute("data-card-state", "closed");

      // Reset overflow immediately
      gsap.set(overlay, { overflowY: "hidden" });

      // Animate overlay back to initial height using quickTo
      animateHeight(initialOverlayHeight);

      // Fade out content
      animateOpacity(0);

      // Hide content after fade completes
      gsap.delayedCall(ANIMATION.opacityDuration, () => {
        gsap.set(content, { display: "none" });
      });

      if (currentlyOpenCard === card) {
        currentlyOpenCard = null;
      }

      console.log(`Card #${index} closed`);
    };

    // Attach the functions to the card object so they can be called externally
    card.openCard = openCard;
    card.closeCard = closeCard;

    // Button click handler
    button.addEventListener("click", () => {
      if (overlay.getAttribute("data-card-state") === "open") {
        closeCard();
      } else {
        openCard();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth !== prevWidth) {
        const wasMobile = overlay.hasAttribute("data-mobile");
        const nowMobile = isMobile();

        if (wasMobile !== nowMobile) {
          if (nowMobile) {
            overlay.setAttribute("data-mobile", "true");
          } else {
            overlay.removeAttribute("data-mobile");
          }

          if (overlay.getAttribute("data-card-state") === "open") {
            gsap.set(overlay, { overflowY: nowMobile ? "hidden" : "auto" });
          }
        }

        calculateHeights();

        if (overlay.getAttribute("data-card-state") === "open") {
          gsap.set(overlay, { height: finalOverlayHeight });
        } else {
          gsap.set(overlay, { height: initialOverlayHeight });
        }

        prevWidth = window.innerWidth;
      }
    });

    if (isMobile()) {
      overlay.setAttribute("data-mobile", "true");
    }
  });
});

//Paginations + Filters
document.addEventListener("DOMContentLoaded", function () {
  const allFilter = document.querySelector('[data-filter-element="all"]');
  const radioFilters = document.querySelectorAll(
    '[data-filter-element="radio"]',
  );
  const checkboxFilters = document.querySelectorAll(
    '[data-filter-element="checkbox"]',
  );

  const listPaginate = document.querySelector(
    '[data-pagination-element="list"]',
  );
  const loaderPaginate = document.querySelector(
    '[data-pagination-element="loader"]',
  );
  const loadPaginate = document.querySelector(
    '[data-pagination-element="load"]',
  );

  // PAGINATION CODE

  // Function to initialize and handle pagination
  function initializePagination() {
    // Set initial opacity to 0
    listPaginate.style.opacity = 0;

    // Get current items (might have changed due to filtering)
    const items = listPaginate.querySelectorAll("[data-pagination-item]");

    if (!items || items.length === 0) {
      console.warn("Pagination element not found");
      return;
    }

    // Get configuration from list element attributes
    const INITIAL_ITEMS =
      parseInt(listPaginate.getAttribute("data-pagination-initial")) || 6;
    const ITEMS_PER_LOAD =
      parseInt(listPaginate.getAttribute("data-pagination-unit")) || 3;
    console.log("Pagination: Initial items:", INITIAL_ITEMS);
    console.log("Pagination: Items per load:", ITEMS_PER_LOAD);

    // Initialize data attributes
    const totalItems = items.length;
    listPaginate.setAttribute("data-pagination-total", totalItems);
    listPaginate.setAttribute("data-pagination-visible", INITIAL_ITEMS);

    // Set up items with index and initial visibility
    items.forEach((item, index) => {
      item.setAttribute("data-pagination-index", index);
      item.setAttribute(
        "data-item-state",
        index < INITIAL_ITEMS ? "show" : "hide",
      );
    });

    // Set initial button visibility
    if (INITIAL_ITEMS >= totalItems) {
      loadPaginate.setAttribute("data-load-state", "hide");
    } else {
      loadPaginate.setAttribute("data-load-state", "show");
    }

    // Clear previous click handler if any
    loadPaginate.removeEventListener("click", runPagination);

    // Add click handler
    loadPaginate.addEventListener("click", runPagination);

    // Update filter counts
    filterCount();

    // Fade in with ease after filterCount
    setTimeout(() => {
      listPaginate.style.transition = "opacity 0.3s ease-in";
      listPaginate.style.opacity = 1;
    }, 100);

    console.log("Pagination:", totalItems, "total items");
  }

  // Function to reset pagination visibility
  function resetPagination() {
    console.log("Resetting pagination");

    // Get all items
    const items = listPaginate.querySelectorAll("[data-pagination-item]");

    // Reset all items visibility to hide
    items.forEach((item) => {
      item.setAttribute("data-item-state", "hide");
    });

    // Reset visible count to 0
    listPaginate.setAttribute("data-pagination-visible", "0");

    // Reset button states
    if (loadPaginate) {
      loadPaginate.disabled = false;
      loadPaginate.setAttribute("data-load-state", "show");
    }

    if (loaderPaginate) {
      loaderPaginate.setAttribute("data-load-state", "hide");
    }

    console.log("Pagination reset complete");
  }

  // Function to handle loading more items
  function runPagination(e) {
    e.preventDefault();
    console.log("Load button clicked");

    // Get current items
    const items = listPaginate.querySelectorAll("[data-pagination-item]");
    const ITEMS_PER_LOAD =
      parseInt(listPaginate.getAttribute("data-pagination-unit")) || 3;

    // Disable button during loading
    loadPaginate.disabled = true;

    // Show loader if it exists
    if (loaderPaginate) {
      loaderPaginate.setAttribute("data-load-state", "show");
    }

    // Get current state
    const currentVisible = parseInt(
      listPaginate.getAttribute("data-pagination-visible"),
    );
    const totalItems = parseInt(
      listPaginate.getAttribute("data-pagination-total"),
    );

    // Calculate next batch
    const newVisible = Math.min(currentVisible + ITEMS_PER_LOAD, totalItems);
    console.log("Showing items from", currentVisible, "to", newVisible);

    // Show next items
    for (let i = currentVisible; i < newVisible; i++) {
      if (items[i]) {
        items[i].setAttribute("data-item-state", "show");
      }
    }

    // Update count
    listPaginate.setAttribute("data-pagination-visible", newVisible);

    // Hide button immediately if all items are shown
    if (newVisible >= totalItems) {
      loadPaginate.setAttribute("data-load-state", "hide");
    }

    // Add delay for loader animation only
    setTimeout(() => {
      // Hide loader
      if (loaderPaginate) {
        loaderPaginate.setAttribute("data-load-state", "hide");
      }
      // Re-enable button only if there are more items
      if (newVisible < totalItems) {
        loadPaginate.disabled = false;
      }
    }, 500);
  }

  // Initialize pagination on load with delay to avoid race condition with Finsweet
  setTimeout(() => {
    initializePagination();
  }, 500);

  // FILTER CODE

  // Function to handle filter reset when "all" is clicked
  function filterReset() {
    // Ensure "all" is active when clicked
    if (!allFilter.classList.contains("active")) {
      allFilter.classList.add("active");
    }
    // Deactivate all categories when "all" is clicked
    radioFilters.forEach((el) => el.classList.remove("active"));

    // Simulate clicks on all checkboxes with delay to avoid race condition
    setTimeout(() => {
      checkboxFilters.forEach((checkbox) => {
        checkbox.click();
        console.log("Simulated click on checkbox:", checkbox.id);
      });
    }, 100);
  }

  // Add a direct click handler for the all filter
  allFilter.addEventListener("click", filterReset, true);

  // Function to handle automatic "all" filter deactivation
  function allReset(mutations) {
    // Process mutations to check if any category became active
    const categoryMutations = mutations.filter(
      (m) => m.target !== allFilter && m.attributeName === "class",
    );
    if (categoryMutations.length > 0) {
      // Check if any category has the active class
      const anyActiveCategories = Array.from(radioFilters).some((el) =>
        el.classList.contains("active"),
      );
      // If any category is active, remove active from "all"
      if (anyActiveCategories && allFilter.classList.contains("active")) {
        allFilter.classList.remove("active");
        console.log("All filter deactivated due to category selection");
      }
    }
  }

  const observer = new MutationObserver(allReset);

  // Observe category filters for class changes
  radioFilters.forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  });

  // Function to handle individual checkbox changes
  function checkboxReset() {
    const parentLabel = this.closest("label");
    if (
      this.checked &&
      !parentLabel.classList.contains("fs-cmsfilter_active")
    ) {
      parentLabel.classList.add("fs-cmsfilter_active");
    } else if (
      !this.checked &&
      parentLabel.classList.contains("fs-cmsfilter_active")
    ) {
      parentLabel.classList.remove("fs-cmsfilter_active");
    }
    console.log("Checkbox toggled:", this.id, "Checked:", this.checked);
  }

  //Commented out checkboxReset() eventListener

  // Function to count checked checkboxes and update dropdown counts
  function filterCount() {
    console.log("Pagination: Updating filter counts");

    // Find all dropdown containers with count indices
    const dropdowns = document.querySelectorAll(
      '[data-filter-element="dropdown"]',
    );

    dropdowns.forEach((dropdown) => {
      // Get the count index for this dropdown
      const countIndex = dropdown.getAttribute("data-count-index");

      // Count checkboxes with w--redirected-checked class within this dropdown
      const checkedBoxes = dropdown.querySelectorAll(
        ".w-checkbox-input.w--redirected-checked",
      );
      const checkedCount = checkedBoxes.length;

      // Find the corresponding count display element
      const countDisplay = document.querySelector(
        `[data-filter-element="count"][data-count-index="${countIndex}"]`,
      );

      if (countDisplay) {
        countDisplay.textContent = checkedCount;
        console.log(
          `Pagination: Updated count for Dropdown ${countIndex}: ${checkedCount}`,
        );
      }
    });
  }

  // Function to handle pagination reset and reinitialization when filters change
  function renderPaginate() {
    console.log("Filter changed, updating pagination");
    // Reset pagination to initial state
    resetPagination();
    // Reinitialize with new filtered items after delay
    setTimeout(() => {
      initializePagination();
    }, 100);
  }

  // Add click listeners to all filters for pagination updates
  allFilter.addEventListener("click", () => {
    console.log("All filter clicked, rendering pagination");
    renderPaginate();
  });
  radioFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      console.log("Radio filter clicked, rendering pagination");
      renderPaginate();
    });
  });
  checkboxFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      console.log("Checkbox filter changed, rendering pagination");
      renderPaginate();
    });
  });
});

//Share Snippet
document.addEventListener("DOMContentLoaded", () => {
  // Find all elements with data-blog-share attribute
  const shareElements = document.querySelectorAll("[data-news-share]");

  // Add click event listeners to each element
  shareElements.forEach((element) => {
    element.addEventListener("click", function () {
      const shareType = this.getAttribute("data-news-share");

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
    toast.style.backgroundColor = "#333";
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
