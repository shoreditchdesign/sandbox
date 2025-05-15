console.log("script deployed");

//Lenis Smooth Scroll
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth >= 992) {
    // Only initialize on desktop (width >= 992px)
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
  }
});

//Navigation Bar
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
        console.log(
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
        console.log(`Counter ${element.id} reset`);
        counter.reset();
      },
    });

    // Start trigger - when scrolling down
    ScrollTrigger.create({
      trigger: element,
      start: CONFIG.defaultScrollTriggerStart,
      end: CONFIG.defaultScrollTriggerEnd,
      onEnter: () => {
        console.log(`Counter ${element.id} triggered with ${delay}ms delay`);

        // Use proper delay implementation with stronger type checking
        if (typeof delay === "number" && delay > 0) {
          console.log(`Setting timeout for ${delay}ms`);
          window.setTimeout(() => {
            console.log(
              `Counter ${element.id} starting after ${delay}ms delay`,
            );
            counter.start();
          }, delay);
        } else {
          console.log(`Counter ${element.id} starting immediately`);
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
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
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
    //loop: true,
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
        slidesPerView: 1.1,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      480: {
        slidesPerView: 2.3,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      767: {
        slidesPerView: 2.2,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
      992: {
        slidesPerView: 3.2,
        slidesPerGroup: 1,
        spaceBetween: 16,
      },
    },
  });
});

//Table of Contents
document.addEventListener("DOMContentLoaded", function () {
  // Part 1: Add data-stagger-block to children of data-toc-body elements
  const tocBodyElements = document.querySelectorAll("[data-toc-body]");
  if (tocBodyElements.length === 0) {
    console.warn("No elements with [data-toc-body] found");
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

  // Part 2: Create table of contents and wrap H2 sections
  const richTextBodies = document.querySelectorAll("[data-toc-body]");
  let allH2s = [];

  // First collect all H2s
  richTextBodies.forEach((body) => {
    const h2s = body.querySelectorAll("h2");
    allH2s = [...allH2s, ...h2s];
  });

  // If no H2s are found, remove template cells from all TOC wrappers
  if (allH2s.length === 0) {
    const tocWrappers = document.querySelectorAll("[data-toc-wrap]");
    tocWrappers.forEach((tocWrapper) => {
      const templateCell = tocWrapper.querySelector("[data-toc-cell]");
      if (templateCell) {
        templateCell.remove();
      }
      tocWrapper.style.display = "none";
    });
    return; // Exit early if no H2s found
  }

  // Process each data-toc-body container separately
  richTextBodies.forEach((body) => {
    // Get all children of the body
    const allChildren = Array.from(body.children);
    // Get H2s within this specific body
    const h2sInBody = Array.from(body.querySelectorAll("h2"));

    // Skip if no H2s in this body
    if (h2sInBody.length === 0) return;

    // Track processed elements to avoid duplicates
    const processedElements = new Set();

    // Process each H2
    h2sInBody.forEach((h2, index) => {
      const sectionId = `toc-${index + 1}`;
      const sectionDiv = document.createElement("div");
      sectionDiv.setAttribute("id", sectionId);
      sectionDiv.setAttribute("data-toc-section", "");

      // Start with the H2
      const elementsToGroup = [h2];
      processedElements.add(h2);

      // Find the index of current H2 in allChildren
      const h2Index = allChildren.indexOf(h2);

      // Find all elements until the next H2 or the end
      let nextIndex = h2Index + 1;
      while (nextIndex < allChildren.length) {
        const nextElement = allChildren[nextIndex];
        // Stop if we hit another H2
        if (nextElement.tagName === "H2") break;
        elementsToGroup.push(nextElement);
        processedElements.add(nextElement);
        nextIndex++;
      }

      // Create a document fragment for better performance
      const fragment = document.createDocumentFragment();
      elementsToGroup.forEach((el) => fragment.appendChild(el));

      // Add the fragment to the section div
      sectionDiv.appendChild(fragment);

      // Insert the section div where the H2 was
      if (
        h2Index > 0 &&
        allChildren[h2Index - 1] &&
        !processedElements.has(allChildren[h2Index - 1])
      ) {
        body.insertBefore(sectionDiv, allChildren[h2Index - 1].nextSibling);
      } else {
        body.appendChild(sectionDiv);
      }
    });

    // Handle elements before the first H2 (leave them as is)
    // Handle elements that weren't processed (shouldn't be any with our approach)
    const unprocessedElements = allChildren.filter(
      (el) => !processedElements.has(el),
    );
  });

  // Create TOC using the new section IDs
  const tocWrappers = document.querySelectorAll("[data-toc-wrap]");
  tocWrappers.forEach((tocWrapper) => {
    const templateCell = tocWrapper.querySelector("[data-toc-cell]");
    if (!templateCell || allH2s.length === 0) {
      tocWrapper.style.display = "none";
      return;
    }

    const existingCells = tocWrapper.querySelectorAll("[data-toc-cell]");
    existingCells.forEach((cell, index) => {
      if (index !== 0) cell.remove();
    });

    allH2s.forEach((h2, index) => {
      const newCell = templateCell.cloneNode(true);
      const textElement = newCell.querySelector("[data-toc-text]");
      const id = `toc-${index + 1}`;

      // Store the id as a data attribute
      newCell.setAttribute("data-toc-target", id);
      // Add href attribute with format #toc-1
      newCell.setAttribute("href", `#${id}`);

      if (textElement) {
        textElement.textContent = h2.textContent;
      }

      // Prevent default anchor behavior for ALL clicks on these elements
      newCell.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Scroll click triggered for ID:", id);
        const targetSection = document.getElementById(id);
        if (targetSection) {
          console.log("Target section found:", targetSection);
          requestAnimationFrame(() => {
            const offset = 200;
            const targetPosition =
              targetSection.getBoundingClientRect().top +
              window.scrollY -
              offset;
            console.log("Scrolling to position:", targetPosition);
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          });
        }
      });

      tocWrapper.appendChild(newCell);
    });

    templateCell.remove();
  });

  // NEW ADDITION: Prevent default behavior for all links with data-toc-target attribute
  document.addEventListener("click", function (e) {
    const tocLink = e.target.closest("[data-toc-target]");
    if (tocLink) {
      e.preventDefault();
      console.log("Prevented default anchor behavior");
    }
  });
});

//Banner Injection
document.addEventListener("DOMContentLoaded", function () {
  console.log("Starting banner injection process");

  // Find all parent elements with class w-richtext
  const richTextElements = document.querySelectorAll(".w-richtext");
  console.log(`Found ${richTextElements.length} rich text elements`);

  // Find the banner element that we'll use as a replacement
  const bannerElement = document.querySelector("[data-blog-banner]");
  console.log("Looking for banner element");
  console.log("Banner element found:", bannerElement ? "YES" : "NO");

  // If there's no banner element, exit early
  if (!bannerElement) {
    console.warn("No element with data-blog-banner attribute found");
    return;
  }
  console.log("Banner element found successfully");

  let bannerTargetFound = false;

  richTextElements.forEach(function (parent, index) {
    console.log(`Processing rich text element ${index + 1}`);

    // Look for paragraphs inside each rich text element
    const paragraphs = parent.querySelectorAll("p");
    console.log(
      `Found ${paragraphs.length} paragraphs in rich text element ${index + 1}`,
    );

    paragraphs.forEach(function (paragraph, pIndex) {
      const content = paragraph.textContent.trim();
      console.log(`Checking paragraph ${pIndex + 1} content: "${content}"`);

      // Check if paragraph contains exactly "{{banner}}"
      if (content === "{{banner}}") {
        bannerTargetFound = true;
        console.log(`Found banner placeholder in paragraph ${pIndex + 1}`);

        try {
          // Clone the banner element to insert
          const bannerClone = bannerElement.cloneNode(true);
          console.log("Banner element cloned successfully");

          // Store reference to the paragraph's parent
          const paragraphParent = paragraph.parentNode;
          console.log("Got paragraph parent:", paragraphParent?.tagName);

          // Insert the banner clone before the paragraph
          paragraphParent.insertBefore(bannerClone, paragraph);
          console.log("Banner clone inserted into document");

          // Remove the original paragraph
          paragraph.remove();
          console.log("Original placeholder paragraph removed");

          // Hide the original banner element
          bannerElement.style.display = "none";
          console.log("Original banner hidden");
        } catch (error) {
          console.error("Error during banner replacement:", error);
        }
      }
    });
  });

  console.log("Banner injection process complete");
});

//News Filters
document.addEventListener("DOMContentLoaded", function () {
  const allFilter = document.querySelector('[data-news-element="all"]');
  const categoryFilters = document.querySelectorAll(
    '[data-news-element="radio"]',
  );
  // Add a direct click handler for the all filter to ensure it becomes active when clicked
  allFilter.addEventListener(
    "click",
    function () {
      // Ensure "all" is active when clicked
      if (!allFilter.classList.contains("active")) {
        allFilter.classList.add("active");
      }
      // Optional: Deactivate all categories when "all" is clicked
      categoryFilters.forEach((el) => el.classList.remove("active"));
      // Check all filter checkboxes and apply Webflow styling
      document
        .querySelectorAll('[data-news-element="checkbox"]')
        .forEach((checkbox) => {
          // Set semantic checked state
          checkbox.checked = true;
          // Update Webflow styling classes
          const customCheckbox = checkbox.previousElementSibling;
          if (
            customCheckbox &&
            customCheckbox.classList.contains("w-checkbox-input")
          ) {
            customCheckbox.classList.add("w--redirected-checked");
          }
          // Update parent label with active class
          const parentLabel = checkbox.closest("label");
          if (parentLabel) {
            parentLabel.classList.add("fs-cmsfilter_active");
          }
          console.log("Checkbox updated:", checkbox.id);
        });
    },
    true,
  ); // Using capture phase to try to run before other handlers
  // Set up a MutationObserver to watch for class changes on categories
  const observer = new MutationObserver(function (mutations) {
    // Process mutations to check if any category became active
    const categoryMutations = mutations.filter(
      (m) => m.target !== allFilter && m.attributeName === "class",
    );
    if (categoryMutations.length > 0) {
      // Check if any category has the active class
      const anyActiveCategories = Array.from(categoryFilters).some((el) =>
        el.classList.contains("active"),
      );
      // If any category is active, remove active from "all"
      if (anyActiveCategories && allFilter.classList.contains("active")) {
        allFilter.classList.remove("active");
        console.log("All filter deactivated due to category selection");
      }
    }
  });
  // Observe category filters for class changes
  categoryFilters.forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  });
  // Optional: Add click listeners to individual checkboxes to ensure proper styling
  document
    .querySelectorAll('[data-news-element="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const customCheckbox = this.previousElementSibling;
        const parentLabel = this.closest("label");
        if (this.checked) {
          if (customCheckbox)
            customCheckbox.classList.add("w--redirected-checked");
          if (parentLabel) parentLabel.classList.add("fs-cmsfilter_active");
        } else {
          if (customCheckbox)
            customCheckbox.classList.remove("w--redirected-checked");
          if (parentLabel) parentLabel.classList.remove("fs-cmsfilter_active");
        }
        console.log("Checkbox toggled:", this.id, "Checked:", this.checked);
      });
    });
});

//News Pagination
document.addEventListener("DOMContentLoaded", function () {
  // Configuration constants
  const INITIAL_ITEMS = 3;
  const ITEMS_PER_LOAD = 3;
  const CLICK_DELAY = 500;

  // Get DOM elements
  const listElement = document.querySelector("[data-news-list]");
  const items = listElement.querySelectorAll("[data-news-item]");
  const loadButton = document.querySelector('[data-news-element="load"]');
  const loader = document.querySelector('[data-news-element="loader"]');

  // Initialize data attributes
  const totalItems = items.length;
  listElement.setAttribute("data-news-total", totalItems);
  listElement.setAttribute("data-news-visible", INITIAL_ITEMS);

  // Set up items with index and initial visibility
  items.forEach((item, index) => {
    item.setAttribute("data-news-index", index);
    item.setAttribute(
      "data-news-show",
      index < INITIAL_ITEMS ? "true" : "false",
    );
  });

  // Set initial button visibility
  if (INITIAL_ITEMS >= totalItems) {
    loadButton.setAttribute("data-load-state", "hide");
  } else {
    loadButton.setAttribute("data-load-state", "show");
  }

  // Add click handler
  loadButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Disable button during loading
    loadButton.disabled = true;

    // Show loader if it exists
    if (loader) {
      loader.setAttribute("data-load-state", "show");
    }

    // Get current state
    const currentVisible = parseInt(
      listElement.getAttribute("data-news-visible"),
    );
    const totalItems = parseInt(listElement.getAttribute("data-news-total"));

    // Calculate next batch
    const newVisible = Math.min(currentVisible + ITEMS_PER_LOAD, totalItems);

    // Show next items
    for (let i = currentVisible; i < newVisible; i++) {
      if (items[i]) {
        items[i].setAttribute("data-news-show", "true");
      }
    }

    // Update count
    listElement.setAttribute("data-news-visible", newVisible);

    // Hide button immediately if all items are shown
    if (newVisible >= totalItems) {
      loadButton.setAttribute("data-load-state", "hide");
    }

    // Add delay for loader animation only
    setTimeout(() => {
      // Hide loader
      if (loader) {
        loader.setAttribute("data-load-state", "hide");
      }

      // Re-enable button only if there are more items
      if (newVisible < totalItems) {
        loadButton.disabled = false;
      }
    }, CLICK_DELAY);
  });
});
