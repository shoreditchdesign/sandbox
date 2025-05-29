console.log("script deployed");

//Viewport Locker
document.addEventListener("DOMContentLoaded", function () {
  // Check if iOS device
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (!isIOS) {
    console.log("Not an iOS device - skipping viewport height lock");
    return;
  }

  console.log("iOS detected - initializing viewport height lock");

  let currentOrientation = screen.orientation?.angle || window.orientation || 0;

  function lockViewportHeights() {
    const vh = window.innerHeight;
    const elements = document.querySelectorAll("[data-vh-lock]");

    console.log(`Locking ${elements.length} elements to ${vh}px viewport`);

    elements.forEach((el) => {
      const lockType = el.getAttribute("data-vh-lock");
      const vhValue = parseInt(el.getAttribute("data-vh-value")) || 100;
      const pixelValue = (vh * vhValue) / 100;

      switch (lockType) {
        case "base":
          el.style.height = `${pixelValue}px`;
          break;
        case "min":
          el.style.minHeight = `${pixelValue}px`;
          break;
        case "max":
          el.style.maxHeight = `${pixelValue}px`;
          break;
        case "all":
          el.style.height = `${pixelValue}px`;
          el.style.minHeight = `${pixelValue}px`;
          el.style.maxHeight = `${pixelValue}px`;
          break;
      }

      console.log(
        `${el.tagName} [${lockType}] -> ${pixelValue}px (${vhValue}vh)`,
      );
    });
  }

  // Initial lock
  lockViewportHeights();

  // Re-lock on orientation change only
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      const newOrientation =
        screen.orientation?.angle || window.orientation || 0;

      if (
        Math.abs(newOrientation - currentOrientation) === 90 ||
        Math.abs(newOrientation - currentOrientation) === 270
      ) {
        console.log("Orientation changed - re-locking viewport heights");
        lockViewportHeights();
        currentOrientation = newOrientation;
      }
    }, 100);
  });
});

//Lenis Smooth Scroll
document.addEventListener("DOMContentLoaded", function () {
  // Check if Safari browser
  const isSafari = (() => {
    const safariCheck = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent,
    );
    if (safariCheck) {
      console.warn("Lenis has been skipped");
    }
    return safariCheck;
  })();

  if (window.innerWidth >= 992 && !isSafari) {
    // Only initialize on desktop (width >= 992px) and not Safari
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.1,
      wheelMultiplier: 1,
      infinite: false,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  } else if (isSafari) {
    console.warn("Lenis blocker: Safari detected, skipping Lenis");
  }
});

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

//Navigation Pusher
document.addEventListener("DOMContentLoaded", function () {
  const navWrap = document.querySelector('[data-nav-element="navbar-wrap"]');

  function updateNavHeight() {
    if (navWrap) {
      const navHeight = navWrap.offsetHeight;
      document.documentElement.style.setProperty(
        "--global--navigation-height",
        `${navHeight}px`,
      );
    }
  }

  updateNavHeight(); // Initial calculation
  window.addEventListener("resize", updateNavHeight); // Recalculate on resize
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

//Sitewide Brand Styles
document.addEventListener("DOMContentLoaded", () => {
  function mapSourceToTargets() {
    // Clear existing cloned elements to prevent duplicates
    document
      .querySelectorAll("[data-brand-target] [data-brand-source]")
      .forEach((clone) => {
        clone.parentNode.removeChild(clone);
      });

    const sourceElements = document.querySelectorAll("[data-brand-source]");
    const targetElements = document.querySelectorAll("[data-brand-target]");
    const sourceMap = {};

    sourceElements.forEach((source) => {
      const sourceType = source.getAttribute("data-brand-source");
      const sourceCategory = source.getAttribute("data-source-name");

      // Create nested structure if it doesn't exist
      if (!sourceMap[sourceCategory]) {
        sourceMap[sourceCategory] = {};
      }
      if (!sourceMap[sourceCategory][sourceType]) {
        sourceMap[sourceCategory][sourceType] = [];
      }

      // Add source to map
      sourceMap[sourceCategory][sourceType].push(source);
    });

    // Process each target and inject matching sources
    targetElements.forEach((target) => {
      const targetType = target.getAttribute("data-brand-target");
      const targetCategory = target.getAttribute("data-target-name");

      // Check if we have matching sources
      if (sourceMap[targetCategory] && sourceMap[targetCategory][targetType]) {
        const matchingSources = sourceMap[targetCategory][targetType];

        // Inject each matching source into the target
        matchingSources.forEach((source) => {
          const clone = source.cloneNode(true);
          target.appendChild(clone);
        });
      } else {
        console.warn(
          `No matching sources found for ${targetType}/${targetCategory}`,
        );
      }
    });
  }

  // Run the function initially
  mapSourceToTargets();

  // Add event listener for load-more elements
  function setupLoadMoreListeners() {
    const loadMoreButtons = document.querySelectorAll(
      "[data-brand-element='load-more']",
    );

    loadMoreButtons.forEach((button, index) => {
      // Remove existing listeners to prevent duplicates
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // Add new click listener
      newButton.addEventListener("click", () => {
        console.log(`Load more button #${index} clicked`);

        // Wait a short time for the new content to be added to the DOM
        setTimeout(() => {
          console.log("Remapping sources to targets after content load");
          mapSourceToTargets();

          // Set up listeners on any new load-more buttons
          setupLoadMoreListeners();
        }, 300); // Adjust timeout as needed based on your pagination rendering time
      });

      console.log(`Listener added to load more button #${index}`);
    });
  }

  // Set up initial listeners
  setupLoadMoreListeners();

  // Optional: Also listen for any dynamically added load-more buttons using MutationObserver
  const observer = new MutationObserver((mutations) => {
    let shouldRemap = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Check if any added nodes contain our load-more buttons
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            if (
              node.matches &&
              node.matches("[data-brand-element='load-more']")
            ) {
              shouldRemap = true;
            } else if (
              node.querySelector &&
              node.querySelector("[data-brand-element='load-more']")
            ) {
              shouldRemap = true;
            }
          }
        });
      }
    });

    if (shouldRemap) {
      console.log("New load-more buttons detected, setting up listeners");
      setupLoadMoreListeners();
    }
  });

  // Start observing the document for added nodes
  observer.observe(document.body, { childList: true, subtree: true });
});

//Countup Animation
document.addEventListener("DOMContentLoaded", () => {
  // Configuration Constants
  const CONFIG = {
    defaultDelay: 0,
    defaultScrollTriggerStart: "top 80%",
    defaultScrollTriggerEnd: "bottom top",
  };

  // Initialize countup elements
  function initCountUpElements() {
    const countupElements = document.querySelectorAll("[data-countup-el]");

    if (countupElements.length === 0) {
      console.warn("No countup elements found on page");
      return;
    }

    countupElements.forEach((element, index) => {
      // Create unique ID
      const thisId = "countup" + index;
      element.id = thisId;

      // Extract configuration from attributes
      const startNumber = parseFloat(element.textContent) || 0;
      const endNumber =
        parseFloat(element.getAttribute("data-final-number")) || 0;
      const decimals =
        parseInt(element.getAttribute("data-countup-decimals")) || 0;
      const duration =
        parseFloat(element.getAttribute("data-countup-duration")) || 2;

      // Parse delay and ensure it's a valid number
      let delay = 0;
      const delayAttr = element.getAttribute("data-countup-delay");
      if (delayAttr !== null && delayAttr !== "") {
        delay = parseFloat(delayAttr);
        // Ensure delay is a valid number
        if (isNaN(delay)) {
          console.warn(
            `Invalid delay value "${delayAttr}" for element #${thisId}, using default (0)`,
          );
          delay = CONFIG.defaultDelay;
        }
      }

      // Create counter instance
      const myCounter = new CountUp(
        thisId,
        startNumber,
        endNumber,
        decimals,
        duration,
      );

      // Check if CountUp initialized properly
      if (!myCounter.error) {
        // Initialize scroll triggers
        createCountUpScrollTriggers(element, myCounter, delay);
      } else {
        console.error(
          `Error initializing CountUp for #${thisId}:`,
          myCounter.error,
        );
      }
    });
  }

  // Create scroll triggers for a countup element
  function createCountUpScrollTriggers(element, counter, delay) {
    // Reset trigger - when scrolling back up
    ScrollTrigger.create({
      trigger: element,
      start: "top bottom",
      end: CONFIG.defaultScrollTriggerEnd,
      onLeaveBack: () => {
        counter.reset();
      },
    });

    // Start trigger - when scrolling down
    ScrollTrigger.create({
      trigger: element,
      start: CONFIG.defaultScrollTriggerStart,
      end: CONFIG.defaultScrollTriggerEnd,
      onEnter: () => {
        // Use proper delay implementation with stronger type checking
        if (typeof delay === "number" && delay > 0) {
          window.setTimeout(() => {
            counter.start();
          }, delay);
        } else {
          counter.start();
        }
      },
    });
  }

  // Initialize everything
  initCountUpElements();
});

//Reviews Swiper
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

//Benefits Swiper
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

//Table of Contents
document.addEventListener("DOMContentLoaded", function () {
  let allH3s = [];

  function contentSetup() {
    // Add data-motion-state to children of data-toc-body elements
    const tocBodyElements = document.querySelectorAll("[data-toc-body]");
    if (tocBodyElements.length === 0) {
      console.warn("News rich text not found");
      return;
    } else {
      tocBodyElements.forEach(function (tocBody) {
        const childElements = tocBody.children;
        if (childElements.length === 0) {
          console.log("No children found for a data-toc-body element");
        } else {
          Array.from(childElements).forEach(function (child) {
            child.setAttribute("data-motion-state", "blocked");
          });
        }
      });
    }

    // Create sections and collect H3s
    const richTextBodies = document.querySelectorAll("[data-toc-body]");

    // First collect all H3s
    richTextBodies.forEach((body) => {
      const h3s = body.querySelectorAll("h3");
      allH3s = [...allH3s, ...h3s];
    });

    // If no H3s are found, hide TOC wrappers and exit
    if (allH3s.length === 0) {
      const tocWrappers = document.querySelectorAll("[data-toc-wrap]");
      tocWrappers.forEach((tocWrapper) => {
        const templateCell = tocWrapper.querySelector("[data-toc-cell]");
        if (templateCell) {
          templateCell.remove();
        }
        tocWrapper.style.display = "none";
      });
      return false; // Signal no content to process
    }

    // Process each data-toc-body container separately
    richTextBodies.forEach((body) => {
      const allChildren = Array.from(body.children);
      const h3sInBody = Array.from(body.querySelectorAll("h3"));

      if (h3sInBody.length === 0) return;

      const processedElements = new Set();

      // Process each H3
      h3sInBody.forEach((h3, index) => {
        const sectionId = `toc-${index + 1}`;
        const sectionDiv = document.createElement("div");
        sectionDiv.setAttribute("id", sectionId);
        sectionDiv.setAttribute("data-toc-section", "");

        const elementsToGroup = [h3];
        processedElements.add(h3);

        const h3Index = allChildren.indexOf(h3);

        let nextIndex = h3Index + 1;
        while (nextIndex < allChildren.length) {
          const nextElement = allChildren[nextIndex];
          if (nextElement.tagName === "H3") break;
          elementsToGroup.push(nextElement);
          processedElements.add(nextElement);
          nextIndex++;
        }

        const fragment = document.createDocumentFragment();
        elementsToGroup.forEach((el) => fragment.appendChild(el));

        sectionDiv.appendChild(fragment);

        if (
          h3Index > 0 &&
          allChildren[h3Index - 1] &&
          !processedElements.has(allChildren[h3Index - 1])
        ) {
          body.insertBefore(sectionDiv, allChildren[h3Index - 1].nextSibling);
        } else {
          body.appendChild(sectionDiv);
        }
      });
    });

    return true; // Signal successful content setup
  }

  function linkSetup() {
    const tocWrappers = document.querySelectorAll("[data-toc-wrap]");

    tocWrappers.forEach((tocWrapper) => {
      const templateCell = tocWrapper.querySelector("[data-toc-cell]");
      if (!templateCell || allH3s.length === 0) {
        tocWrapper.style.display = "none";
        return;
      }

      const existingCells = tocWrapper.querySelectorAll("[data-toc-cell]");
      existingCells.forEach((cell, index) => {
        if (index !== 0) cell.remove();
      });

      allH3s.forEach((h3, index) => {
        const newCell = templateCell.cloneNode(true);
        const textElement = newCell.querySelector("[data-toc-text]");
        const id = `toc-${index + 1}`;

        newCell.setAttribute("data-toc-target", id);
        newCell.setAttribute("href", `#${id}`);

        if (textElement) {
          textElement.textContent = h3.textContent;
        }

        newCell.addEventListener("click", (e) => {
          e.preventDefault();

          document.querySelectorAll("[data-toc-target]").forEach((cell) => {
            cell.classList.remove("active");
          });

          newCell.classList.add("active");

          const targetSection = document.getElementById(id);
          if (targetSection) {
            const rect = targetSection.getBoundingClientRect();
            const currentScroll = window.pageYOffset;
            const targetPosition =
              currentScroll + rect.top - window.innerHeight * 0.3;

            gsap.to(window, {
              scrollTo: targetPosition,
              duration: 1.2,
              ease: "power2.inOut",
            });
          }
        });

        tocWrapper.appendChild(newCell);
      });

      templateCell.remove();
    });
  }

  function scrollSetup() {
    // Prevent default behavior for TOC links
    document.addEventListener("click", function (e) {
      const tocLink = e.target.closest("[data-toc-target]");
      if (tocLink) {
        e.preventDefault();
      }
    });

    // GSAP ScrollTrigger Integration
    function initScrollTriggers() {
      const tocSections = document.querySelectorAll("[data-toc-section]");
      const tocLinks = document.querySelectorAll("[data-toc-target]");

      if (tocSections.length === 0) {
        console.warn("No TOC sections found for ScrollTrigger");
        return;
      }

      tocSections.forEach((section) => {
        const sectionId = section.id;
        const correspondingLink = document.querySelector(
          `[data-toc-target="${sectionId}"]`,
        );

        if (!correspondingLink) {
          console.warn(`No corresponding link found for section ${sectionId}`);
          return;
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            tocLinks.forEach((link) => link.classList.remove("active"));
            correspondingLink.classList.add("active");
          },
          onEnterBack: () => {
            tocLinks.forEach((link) => link.classList.remove("active"));
            correspondingLink.classList.add("active");
          },
        });
      });
    }

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      initScrollTriggers();
    } else {
      console.warn("GSAP or ScrollTrigger not available");
    }
  }

  // Execute functions in sequence
  const hasContent = contentSetup();
  if (hasContent) {
    linkSetup();
    scrollSetup();
  }
});

//Banner Injection
document.addEventListener("DOMContentLoaded", function () {
  // Find all parent elements with class w-richtext
  const richTextElements = document.querySelectorAll(".w-richtext");

  // Find the banner element that we'll use as a replacement
  const bannerElement = document.querySelector("[data-blog-banner]");

  // If there's no banner element, exit early
  if (!bannerElement) {
    console.warn("News banner not found");
    return;
  }

  let bannerTargetFound = false;

  richTextElements.forEach(function (parent) {
    // Look for paragraphs inside each rich text element
    const paragraphs = parent.querySelectorAll("p");

    paragraphs.forEach(function (paragraph) {
      const content = paragraph.textContent.trim();

      // Check if paragraph contains exactly "{{banner}}"
      if (content === "{{banner}}") {
        bannerTargetFound = true;

        try {
          // Clone the banner element to insert
          const bannerClone = bannerElement.cloneNode(true);

          // Store reference to the paragraph's parent
          const paragraphParent = paragraph.parentNode;

          // Insert the banner clone before the paragraph
          paragraphParent.insertBefore(bannerClone, paragraph);

          // Remove the original paragraph
          paragraph.remove();

          // Hide the original banner element
          bannerElement.style.display = "none";
        } catch (error) {
          console.error("Error during banner replacement:", error);
        }
      }
    });
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

//Scroll Blocker
document.addEventListener("DOMContentLoaded", () => {
  // Check if an element with the data-pl-shader attribute exists
  const shaderElement = document.querySelector("[data-pl-shader]");

  if (shaderElement) {
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden"; // For cross-browser compatibility
    window.scrollTo(0, 0);

    // Re-enable scrolling after 4 seconds
    setTimeout(() => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }, 4000); // 4000 milliseconds = 4 seconds
  }
});

//Card Resizer
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const config = {
    desktopBreakpoint: 1024,
    selectors: {
      imageCards: '[data-news-card="image"]',
      fillCards: '[data-news-card="fill"]',
    },
  };

  function isDesktop() {
    return window.innerWidth >= config.desktopBreakpoint;
  }

  function cardResizer() {
    if (!isDesktop()) {
      console.warn("Card resizer skipped");
      return;
    }

    const imageCards = document.querySelectorAll(config.selectors.imageCards);
    const fillCards = document.querySelectorAll(config.selectors.fillCards);

    if (imageCards.length === 0) {
      return;
    }

    // Get heights of all image cards (excluding 0 heights)
    const heights = Array.from(imageCards)
      .map((card) => card.offsetHeight)
      .filter((height) => height > 0);

    if (heights.length === 0) {
      return;
    }

    const minHeight = Math.min(...heights);

    // Apply min-height to all fill cards
    fillCards.forEach((card) => {
      card.style.minHeight = `${minHeight}px`;
    });
  }

  // Initialize
  cardResizer();

  // Rerun on window resize
  window.addEventListener("resize", cardResizer);
});
