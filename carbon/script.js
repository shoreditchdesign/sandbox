console.log("script deployed, stable release 1");

//Viewport Locker
document.addEventListener("DOMContentLoaded", function () {
  // Remove iOS device check - apply to all devices
  console.log("Initializing viewport height lock (applying to all devices)");
  let currentOrientation = screen.orientation?.angle || window.orientation || 0;

  function lockViewportHeights() {
    const vh = window.innerHeight;
    const elements = document.querySelectorAll("[data-vh-lock]");
    console.log(`Found ${elements.length} elements`);
    console.log(`Viewport height: ${vh}px`);

    elements.forEach((el, index) => {
      const lockType = el.getAttribute("data-vh-lock");
      const vhValue = parseInt(el.getAttribute("data-vh-value")) || 100;
      const pixelValue = (vh * vhValue) / 100;

      // Split comma-separated values and process each one
      const lockTypes = lockType.split(",").map((type) => type.trim());

      lockTypes.forEach((type) => {
        switch (type) {
          case "base":
            el.style.setProperty("height", `${pixelValue}px`, "!important");
            break;
          case "min":
            el.style.setProperty("minHeight", `${pixelValue}px`, "!important");
            break;
          case "max":
            el.style.setProperty("maxHeight", `${pixelValue}px`, "!important");
            break;
          case "all":
            el.style.setProperty("height", `${pixelValue}px`, "!important");
            el.style.setProperty("minHeight", `${pixelValue}px`, "!important");
            el.style.setProperty("maxHeight", `${pixelValue}px`, "!important");
            break;
        }
      });

      // Debug: Check what actually got applied
      console.log(`Element ${index} [${lockTypes.join(",")}]:`);
      console.log(`  Set: ${pixelValue}px`);
      console.log(`  Computed height: ${getComputedStyle(el).height}`);
      console.log(`  Computed minHeight: ${getComputedStyle(el).minHeight}`);
      console.log(`  Computed maxHeight: ${getComputedStyle(el).maxHeight}`);
      console.log(`  Inline style: ${el.style.cssText}`);
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

//Lenis Blockers
document.addEventListener("DOMContentLoaded", function () {
  // Start scroll elements
  const startElements = document.querySelectorAll("[data-lenis-start]");
  console.log("Found start elements:", startElements.length);

  startElements.forEach((element) => {
    element.addEventListener("click", function () {
      console.log("Starting lenis");
      lenis.start();
    });
  });

  // Stop scroll elements
  const stopElements = document.querySelectorAll("[data-lenis-stop]");
  console.log("Found stop elements:", stopElements.length);

  stopElements.forEach((element) => {
    element.addEventListener("click", function () {
      console.log("Stopping lenis");
      lenis.stop();
    });
  });

  // Toggle scroll elements
  const toggleElements = document.querySelectorAll("[data-lenis-toggle]");
  console.log("Found toggle elements:", toggleElements.length);

  toggleElements.forEach((element) => {
    element.addEventListener("click", function () {
      this.classList.toggle("stop-scroll");

      if (this.classList.contains("stop-scroll")) {
        console.log("Toggle: stopping lenis");
        lenis.stop();
      } else {
        console.log("Toggle: starting lenis");
        lenis.start();
      }
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

//Textarea Resizer
document.addEventListener("DOMContentLoaded", () => {
  const textareas = document.querySelectorAll("textarea");

  textareas.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
});
