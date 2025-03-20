//Navigation Bar Mobile
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

//Check Pushæ
//Navigation Bar Dropdown
document
  .querySelector('[data-nav-element="toggle"]')
  .addEventListener("click", () => {
    const toggle = document.querySelector('[data-nav-element="toggle"]');
    const drawer = document.querySelector('[data-nav-element="drawer"]');
    const grid = drawer.querySelector('[data-nav-element="grid"]');
    const finalHeight = grid.offsetHeight;

    const currentState = toggle.getAttribute("data-toggle-state");
    const newState = currentState === "open" ? "closed" : "open";

    toggle.setAttribute("data-toggle-state", newState);

    if (newState === "open") {
      // Animate from 0 to final height
      drawer.style.height = "0px";
      drawer.style.overflow = "hidden";
      setTimeout(() => {
        drawer.style.transition = "height 0.3s ease";
        drawer.style.height = finalHeight + "px";
      }, 10);
    } else {
      // Animate from final height to 0
      drawer.style.height = finalHeight + "px";
      drawer.style.overflow = "hidden";
      drawer.style.transition = "height 0.3s ease";
      setTimeout(() => {
        drawer.style.height = "0px";
      }, 10);
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const component = document.getElementById("swiper-component");
  if (component) {
    // Force loop mode to false for finite swiper
    const loopMode = false;

    let sliderDuration = 300;
    if (component.getAttribute("slider-duration") !== undefined) {
      sliderDuration = +component.getAttribute("slider-duration");
    }

    const swiperElement = document.getElementById("swiper");
    const swiper = new Swiper(swiperElement, {
      speed: sliderDuration,
      autoHeight: false,
      centeredSlides: false, // Don't center - align to left
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: true, // Allow clicking on slides to navigate
      slidesPerView: 1,
      spaceBetween: "4%",
      rewind: false,
      loop: false, // Set to false for finite swiper
      direction: "horizontal",
      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      breakpoints: {
        // mobile landscape
        480: {
          slidesPerView: 1,
          spaceBetween: 8,
        },
        // tablet
        768: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        // desktop
        992: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
      },
      navigation: {
        nextEl: "#swiper-next",
        prevEl: "#swiper-prev",
        disabledClass: "is-disabled", // Will be applied at start/end
      },
      scrollbar: {
        el: "#swiper-drag-wrapper",
        draggable: true,
        dragClass: "swiper-drag",
        snapOnRelease: true,
        dragSize: "auto",
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active",
    });
  }
});

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
      if (!allFilter.classList.contains("is-active")) {
        allFilter.classList.add("is-active");
      }

      // Optional: Deactivate all categories when "all" is clicked
      categoryFilters.forEach((el) => el.classList.remove("is-active"));
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
      // Check if any category has the is-active class
      const anyActiveCategories = Array.from(categoryFilters).some((el) =>
        el.classList.contains("is-active"),
      );

      // If any category is active, remove is-active from "all"
      if (anyActiveCategories && allFilter.classList.contains("is-active")) {
        allFilter.classList.remove("is-active");
      }
    }
  });

  // Observe category filters for class changes
  categoryFilters.forEach((el) => {
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  });
});

//FAQ Accordions
// Store drawer heights and initialize accordions
document.addEventListener("DOMContentLoaded", function () {
  initializeAccordions();
});

// Heights storage object
const drawerHeights = {};

function initializeAccordions() {
  const toggles = document.querySelectorAll("[data-faq-toggle]");
  console.log("Initializing", toggles.length, "accordions");

  toggles.forEach((toggle, index) => {
    // Get drawer element
    const drawer = toggle.querySelector("[data-faq-drawer]");
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

      console.log("Stored height for accordion", index, ":", height, "px");
    }

    // Add click event listener
    toggle.addEventListener("click", handleAccordionClick);
  });
}

function openAccordion(toggle) {
  const drawerId = toggle.getAttribute("data-drawer-id");
  const drawer = toggle.querySelector("[data-faq-drawer]");

  // Update toggle state
  toggle.setAttribute("data-toggle-state", "open");

  // Animate height
  drawer.style.height = drawerHeights[drawerId] + "px";

  console.log("Opened accordion with drawer ID:", drawerId);
}

function closeAccordion(toggle) {
  const drawer = toggle.querySelector("[data-faq-drawer]");

  // Update toggle state
  toggle.setAttribute("data-toggle-state", "closed");

  // Animate height back to 0
  drawer.style.height = "0px";

  console.log(
    "Closed accordion with drawer ID:",
    toggle.getAttribute("data-drawer-id"),
  );
}

function handleAccordionClick(event) {
  const toggle = event.currentTarget;
  const toggleState = toggle.getAttribute("data-toggle-state");

  console.log("Accordion clicked, current state:", toggleState);

  if (toggleState === "closed") {
    // Close all siblings
    const siblingToggles = getSiblingToggles(toggle);
    siblingToggles.forEach((siblingToggle) => {
      if (siblingToggle.getAttribute("data-toggle-state") === "open") {
        closeAccordion(siblingToggle);
      }
    });

    // Open this accordion
    openAccordion(toggle);
  } else {
    // Close this accordion
    closeAccordion(toggle);
  }
}

function getSiblingToggles(toggle) {
  const parent = toggle.parentNode;
  const siblings = Array.from(parent.querySelectorAll("[data-faq-toggle]"));
  return siblings.filter((sibling) => sibling !== toggle);
}
