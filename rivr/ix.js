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
  // Get all filter elements
  const filterElements = document.querySelectorAll("[data-cmsfilter-element]");
  const allFilter = document.querySelector('[data-cmsfilter-element="all"]');

  // Add click event listeners to all filter elements
  filterElements.forEach((filter) => {
    filter.addEventListener("click", function () {
      // Handle the clicked filter
      handleFilterClick(this);

      // Check if any category filters are active
      const anyActiveCategories = Array.from(filterElements).some(
        (el) =>
          el.getAttribute("data-cmsfilter-element") !== "all" &&
          el.classList.contains("is-active"),
      );

      // Manage the "all" filter's active class
      if (anyActiveCategories) {
        // If any category is active, remove is-active from "all"
        allFilter.classList.remove("is-active");
      } else {
        // If no categories are active, ensure "all" is active
        allFilter.classList.add("is-active");
      }
    });
  });

  // Function to handle individual filter click
  function handleFilterClick(clickedFilter) {
    // If clicking the "all" filter, deactivate all category filters
    if (clickedFilter.getAttribute("data-cmsfilter-element") === "all") {
      filterElements.forEach((el) => {
        if (el.getAttribute("data-cmsfilter-element") !== "all") {
          el.classList.remove("is-active");
        }
      });
      clickedFilter.classList.add("is-active");
    } else {
      // Toggle the is-active class on the clicked category filter
      clickedFilter.classList.toggle("is-active");
    }
  }
});
