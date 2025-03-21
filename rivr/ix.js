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

//Navigation Bar Dropdown
// Store the initial wrap height
let initialWrapHeight = null;

document
  .querySelector('[data-nav-element="toggle"]')
  .addEventListener("click", () => {
    // Get all required elements
    const toggle = document.querySelector('[data-nav-element="toggle"]');
    // Check if wrap element exists, if not, look for navbar or other parent container
    let wrap = document.querySelector('[data-nav-element="wrap"]');
    if (!wrap) {
      console.log("Wrap element not found, trying navbar instead");
      wrap = document.querySelector('[data-nav-element="navbar"]');
      if (!wrap) {
        console.log("Navbar not found either, trying c-navbar class");
        wrap = document.querySelector(".c-navbar");
      }
    }
    console.log("Target element for animation:", wrap);
    const drawer = document.querySelector('[data-nav-element="drawer"]');

    // Calculate drawer height
    const drawerHeight = drawer.offsetHeight;
    console.log("Drawer height:", drawerHeight);

    // Get current state and determine new state
    const currentState = toggle.getAttribute("data-toggle-state");
    const newState = currentState === "open" ? "closed" : "open";

    // Store initial wrap height if not already stored
    if (initialWrapHeight === null) {
      initialWrapHeight = wrap.offsetHeight;
      console.log("Initial wrap height:", initialWrapHeight);
    }

    // Set toggle state
    toggle.setAttribute("data-toggle-state", newState);

    if (newState === "open") {
      // Opening the drawer
      console.log("Opening drawer");
      // Force repaint to ensure height is applied properly
      wrap.style.display = "block";
      wrap.style.height = initialWrapHeight + "px";
      wrap.style.overflow = "hidden";

      // Force browser to recognize the style changes before transition
      wrap.getBoundingClientRect();

      wrap.style.transition = "height 0.3s ease";
      wrap.style.height = initialWrapHeight + drawerHeight + "px";
      console.log("New wrap height:", initialWrapHeight + drawerHeight);

      // Verify height change
      setTimeout(() => {
        console.log(
          "Actual element height after transition:",
          wrap.offsetHeight,
        );
      }, 350);
    } else {
      // Closing the drawer
      console.log("Closing drawer");
      wrap.style.height = initialWrapHeight + drawerHeight + "px";
      wrap.style.overflow = "hidden";

      // Force browser to recognize the style changes before transition
      wrap.getBoundingClientRect();

      wrap.style.transition = "height 0.3s ease";
      setTimeout(() => {
        wrap.style.height = initialWrapHeight + "px";
        console.log("Reverting to initial height:", initialWrapHeight);
      }, 10);

      // Verify height change
      setTimeout(() => {
        console.log(
          "Actual element height after transition:",
          wrap.offsetHeight,
        );
      }, 350);
    }
  });

//Swiper Component
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

//Blog Articles Filters
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
  // Find all open accordions across all components
  const allOpenToggles = document.querySelectorAll(
    '[data-faq-toggle][data-toggle-state="open"]',
  );

  console.log("Found", allOpenToggles.length, "open accordions to close");

  allOpenToggles.forEach((toggle) => {
    if (toggle !== currentToggle) {
      closeAccordion(toggle);
    }
  });
}

//Blog Share Snippet
document.addEventListener("DOMContentLoaded", () => {
  // Find all elements with data-blog-share attribute
  const shareElements = document.querySelectorAll("[data-blog-share]");
  console.log("Found share elements:", shareElements.length);

  // Add click event listeners to each element
  shareElements.forEach((element) => {
    element.addEventListener("click", function () {
      const shareType = this.getAttribute("data-blog-share");
      console.log("Share type clicked:", shareType);

      if (shareType === "copy") {
        // Copy current URL to clipboard
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            console.log("URL copied to clipboard");
            showToast("Copied to clipboard");
          })
          .catch((err) => {
            console.error("Failed to copy URL:", err);
          });
      } else if (shareType === "mail") {
        // Create mailto link and trigger it
        const mailtoUrl = `mailto:?subject=Check this out&body=${window.location.href}`;
        console.log("Opening mailto link");
        window.location.href = mailtoUrl;
      }
    });
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
  console.log("Toast notification shown");

  // Remove the toast after 3 seconds
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}
