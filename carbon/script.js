console.log("script deployed");

document.addEventListener("DOMContentLoaded", function () {
  initReviewsSwiper();
  initBenefitsSwiper();
  initBrandStyles();
  initNavigationBar();
  initRichTextToc();
  initCmsFilterStyles();
});

// Reviews Swiper
function initReviewsSwiper() {
  var reviewsSwiper = new Swiper("#reviews-swiper", {
    direction: "vertical",
    slidesPerView: 2,
    spaceBetween: 20,
    mousewheel: true,
    grabCursor: true,
    loop: true,
    navigation: {
      nextEl: "#reviews-next",
      prevEl: "#reviews-prev",
    },
    pagination: {
      el: "#reviews-pagination",
      clickable: true,
    },
  });
}

// Benefits Swiper
function initBenefitsSwiper() {
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
}

// Brand styles
function initBrandStyles() {
  function mapSourceToTargets() {
    const sourceElements = document.querySelectorAll("[data-brand-source]");
    const targetElements = document.querySelectorAll("[data-brand-target]");
    const sourceMap = {};

    sourceElements.forEach((source) => {
      const sourceType = source.getAttribute("data-brand-source");
      const sourceCategory = source.getAttribute("data-source-name");

      if (!sourceMap[sourceCategory]) {
        sourceMap[sourceCategory] = {};
      }

      if (!sourceMap[sourceCategory][sourceType]) {
        sourceMap[sourceCategory][sourceType] = [];
      }

      sourceMap[sourceCategory][sourceType].push(source);
    });

    targetElements.forEach((target) => {
      const targetType = target.getAttribute("data-brand-target");
      const targetCategory = target.getAttribute("data-target-name");

      if (sourceMap[targetCategory] && sourceMap[targetCategory][targetType]) {
        const matchingSources = sourceMap[targetCategory][targetType];

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

  const bannerCloseBtn = document.querySelector(
    '[data-banner-element="close"]',
  );
  if (bannerCloseBtn) {
    bannerCloseBtn.addEventListener("click", () => {
      const banner = document.querySelector('[data-banner-element="banner"]');
      const currentState = banner.getAttribute("data-banner-state");
      banner.setAttribute(
        "data-banner-state",
        currentState === "visible" ? "hidden" : "visible",
      );
    });
  }
}

// Navigation Bar
function initNavigationBar() {
  const menuBtn = document.querySelector('[data-nav-element="menu"]');
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const navbar = document.querySelector('[data-nav-element="navbar"]');
      const currentState = navbar.getAttribute("data-nav-state");
      navbar.setAttribute(
        "data-nav-state",
        currentState === "open" ? "closed" : "open",
      );
    });
  }
}

// Rich Text Table of Contents
function initRichTextToc() {
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

      newCell.setAttribute("data-toc-target", id);
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
}

// CMS Filter Styles
function initCmsFilterStyles() {
  const allFilter = document.querySelector('[data-cmsfilter-element="all"]');
  const categoryFilters = document.querySelectorAll(
    '[data-cmsfilter-element]:not([data-cmsfilter-element="all"])',
  );

  if (!allFilter) {
    console.log("CMS filter 'all' element not found");
    return;
  }

  allFilter.addEventListener(
    "click",
    function () {
      if (!allFilter.classList.contains("active")) {
        allFilter.classList.add("active");
      }
      categoryFilters.forEach((el) => el.classList.remove("active"));
    },
    true,
  );

  const observer = new MutationObserver(function (mutations) {
    const categoryMutations = mutations.filter(
      (m) => m.target !== allFilter && m.attributeName === "class",
    );

    if (categoryMutations.length > 0) {
      const anyActiveCategories = Array.from(categoryFilters).some((el) =>
        el.classList.contains("active"),
      );

      if (anyActiveCategories && allFilter.classList.contains("active")) {
        allFilter.classList.remove("active");
      }
    }
  });

  categoryFilters.forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  });
}
