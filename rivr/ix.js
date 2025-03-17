document.addEventListener("DOMContentLoaded", function () {
  const component = document.getElementById("swiper-component");

  if (component) {
    let loopMode = false;
    if (component.getAttribute("loop-mode") === "true") {
      loopMode = true;
    }

    let sliderDuration = 300;
    if (component.getAttribute("slider-duration") !== undefined) {
      sliderDuration = +component.getAttribute("slider-duration");
    }

    const swiperElement = document.getElementById("swiper");

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
      loop: loopMode,
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

      navigation: {
        nextEl: "#swiper-next",
        prevEl: "#swiper-prev",
        disabledClass: "is-disabled",
      },
      scrollbar: {
        el: "#swiper-drag-wrapper",
        draggable: true,
        dragClass: "swiper-drag",
        snapOnRelease: true,
        dragSize: "auto",
        dragStartPositionRatio: 0,
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active",
    });
  }
});
