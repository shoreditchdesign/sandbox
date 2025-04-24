console.log("script deployed");

//Reviews Swiper
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the vertical swiper
  var reviewsSwiper = new Swiper("#reviews-swiper", {
    direction: "vertical",
    slidesPerView: 2,
    spaceBetween: 20,
    mousewheel: true,
    grabCursor: true,
    loop: true,
    // Use CSS Mode - this lets the browser handle the scrolling mechanics
    cssMode: true,
    // Prevent auto height calculation that causes centering
    autoHeight: false,
    // Set initial slide to 0 to start at the top
    initialSlide: 0,
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

//Brand styles
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

//Rich Text Table of Contents
document.addEventListener("DOMContentLoaded", function () {
  const richTextBodies = document.querySelectorAll("[data-toc-body]");
  let allH2s = [];

  richTextBodies.forEach((body) => {
    const h2s = body.querySelectorAll("h2");
    allH2s = [...allH2s, ...h2s];
  });

  allH2s.forEach((h2, index) => {
    const id = `id-toc-link-${index + 1}`;
    h2.setAttribute("id", id);
  });

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
      const id = `id-toc-link-${index + 1}`;

      // Store the id as a data attribute instead of href
      newCell.setAttribute("data-toc-target", id);
      // Remove href to prevent default behavior
      newCell.removeAttribute("href");

      if (textElement) {
        textElement.textContent = h2.textContent;
      }

      newCell.addEventListener("click", (e) => {
        e.preventDefault();
        const targetH2 = document.getElementById(id);
        if (targetH2) {
          const offset = 200;
          const targetPosition =
            targetH2.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });

      tocWrapper.appendChild(newCell);
    });

    templateCell.remove();
  });
});

// CMS Filter Styles
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
