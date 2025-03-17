document.addEventListener("DOMContentLoaded", function () {
  // Changed from jQuery selector to document.querySelectorAll for vanilla JS
  document.querySelectorAll("#swiper-component").forEach(function (component) {
    let loopMode = false;
    if (component.getAttribute("loop-mode") === "true") {
      loopMode = true;
    }

    let sliderDuration = 300;
    if (component.getAttribute("slider-duration") !== undefined) {
      sliderDuration = +component.getAttribute("slider-duration");
    }

    // Changed selector to find swiper element within the component
    const swiperElement = component.querySelector("#swiper");

    const swiper = new Swiper(swiperElement, {
      speed: sliderDuration,
      autoHeight: false,
      centeredSlides: loopMode,
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: false,
      slidesPerView: 1,
      spaceBetween: "4%",
      rewind: false,
      loop: loopMode, // Added explicit loop setting based on attribute
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
          spaceBetween: "4%",
        },
        // tablet
        768: {
          slidesPerView: 2,
          spaceBetween: "4%",
        },
        // desktop
        992: {
          slidesPerView: 3,
          spaceBetween: "2%",
        },
      },
      // Removed pagination config since there's no .swiper-bullet-wrapper in your HTML

      navigation: {
        // Changed to use direct ID selectors matching your HTML
        nextEl: "#swiper-next",
        prevEl: "#swiper-prev",
        disabledClass: "is-disabled",
      },
      scrollbar: {
        // Changed to use direct ID selector matching your HTML
        el: "#swiper-drag-wrapper",
        draggable: true,
        dragClass: "swiper-drag",
        snapOnRelease: true,
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active",
    });
  });
});
