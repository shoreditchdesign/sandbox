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

//Sitewide Brand Styles
document.addEventListener("DOMContentLoaded", () => {
  function mapSourceToTargets() {
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

  mapSourceToTargets();
});

//Countup Animation
document.querySelectorAll("[data-countup-el]").forEach((element, index) => {
  let thisId = "countup" + index;
  element.id = thisId;

  let startNumber = +element.textContent;
  let endNumber = +element.getAttribute("data-final-number");
  let decimals = 0;
  let duration = element.getAttribute("data-count-duration");
  let delay = element.getAttribute("data-countup-delay") || 0;

  let myCounter = new CountUp(
    thisId,
    startNumber,
    endNumber,
    decimals,
    duration,
  );

  //Scroll out of view trigger
  ScrollTrigger.create({
    trigger: element,
    start: "top bottom",
    end: "bottom top",
    onLeaveBack: () => {
      myCounter.reset();
    },
  });

  // Scroll into view trigger
  ScrollTrigger.create({
    trigger: element,
    start: "top 80%",
    end: "bottom top",
    onEnter: () => {
      setTimeout(() => {
        myCounter.start();
      }, delay);
    },
  });
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
      window.innerWidth < 768
        ? {
            delay: 3000,
            disableOnInteraction: false,
          }
        : false,
    allowTouchMove: window.innerWidth < 768,
  });
  console.log("Reviews swiper initialized with vertical direction");
});

//Benefits Swiper
document.addEventListener("DOMContentLoaded", function () {
  var mySwiper = new Swiper("#benefits-swiper", {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 28,
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
          console.log("Added data-motion-state=blocked to element:", child);
        });
        console.log(
          `Added data-motion-state=blocked to ${childElements.length} children of a data-toc-body element`,
        );
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

      console.log(
        `Creating section for H2: "${h2.textContent}" with ${elementsToGroup.length} elements`,
      );

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
    console.log(
      `${unprocessedElements.length} elements weren't included in any section`,
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

//News Filter Styles
document.addEventListener("DOMContentLoaded", function () {
  const allFilter = document.querySelector('[data-cmsfilter-element="all"]');
  const categoryFilters = document.querySelectorAll(
    '[data-cmsfilter-element]:not([data-cmsfilter-element="all"])',
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
      console.log("All filter activated");
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

  console.log("CMS filter initialization complete");
});
