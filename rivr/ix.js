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

//Table of Contents
console.log("generating table of content");

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
            targetH2.getBoundingClientRect().top + window.scrollY - offset;
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
