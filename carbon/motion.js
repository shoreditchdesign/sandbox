console.log("motion deployed");

document.addEventListener("DOMContentLoaded", () => {
  // Only execute popup code if the element exists
  const popup = document.querySelector(".c-nw_share-wrap");
  if (popup) {
    // Conversion Pop-up
    gsap.registerPlugin(ScrollTrigger);
    const popupHeight = popup.offsetHeight;
    const conversionDistance =
      parseFloat(popup.getAttribute("data-conversion-distance")) || 1.5;
    gsap.fromTo(
      popup,
      { y: popupHeight },
      { y: 0, duration: 0.5, paused: true },
    );
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.scroll() > window.innerHeight * conversionDistance) {
          gsap.to(popup, { y: 0 });
        } else {
          gsap.to(popup, { y: 2 * popupHeight });
        }
      },
    });
    console.log("Popup initialized");
  }
});

//Graphene Preloader
console.log("grapehene deployed");
document.addEventListener("DOMContentLoaded", () => {
  // Configuration Variables
  const ANIMATION = {
    duration: 6,
    p1: {
      yStart: "-150vh",
      yEnd: "-50vh",
      startTime: 0,
      endTime: 6,
      ease: "power1.inOut", // Slower first half, faster second half
    },
    p2: {
      yStart: "80vh",
      yEnd: "-10vh",
      startTime: 0,
      endTime: 1.2,
      ease: "power2.out",
    },
    angulars: {
      p1s1: {
        startFade: 0,
        endFade: 1.5,
        ease: "power2.out",
      },
      p2s2: {
        startFade: 2,
        endFade: 3,
        ease: "power2.out",
      },
    },
  };

  // DOM Selectors
  const selectors = {
    component: "[data-gpl-component]",
    hexGroup: "[data-gpl-group]",
    hexElements: {
      p1: '[data-gpl-hex="p1"]',
      p2: '[data-gpl-hex="p2"]',
      s1: '[data-gpl-hex="s1"]',
      s2: '[data-gpl-hex="s2"]',
    },
    angElements: {
      p1: '[data-gpl-ang="p1"]',
      p2: '[data-gpl-ang="p2"]',
      s1: '[data-gpl-ang="s1"]',
      s2: '[data-gpl-ang="s2"]',
    },
  };

  // Initialization Function
  const initPreloader = () => {
    // Check if component exists
    const preloaderComponent = document.querySelector(selectors.component);
    if (!preloaderComponent) {
      console.error("Preloader component not found");
      return null;
    }

    console.log("Preloader component found:", preloaderComponent);

    // Check if GSAP is available
    if (typeof gsap === "undefined") {
      console.error("GSAP library not loaded");
      return null;
    }

    // Set initial states
    gsap.set(selectors.hexElements.p1, { y: ANIMATION.p1.yStart });
    gsap.set(selectors.hexElements.p2, { y: ANIMATION.p2.yStart });
    gsap.set(
      [
        selectors.angElements.p1,
        selectors.angElements.p2,
        selectors.angElements.s1,
        selectors.angElements.s2,
      ],
      { opacity: 1 },
    );

    return createPreloaderAnimation();
  };

  // Timeline Creation
  const createPreloaderAnimation = () => {
    const timeline = gsap.timeline({
      onStart: () => console.log("Animation started"),
      onComplete: () => console.log("Animation completed"),
      onUpdate: () => {
        const progress = Math.round(timeline.progress() * 100);
        if (progress % 25 === 0) {
          console.log(`Animation progress: ${progress}%`);
        }
      },
    });

    // P1 animation (single animation with custom ease)
    timeline.to(
      selectors.hexElements.p1,
      {
        y: ANIMATION.p1.yEnd,
        duration: ANIMATION.p1.endTime - ANIMATION.p1.startTime,
        ease: ANIMATION.p1.ease,
        force3D: true,
      },
      ANIMATION.p1.startTime,
    );

    // P2 animation
    timeline.to(
      selectors.hexElements.p2,
      {
        y: ANIMATION.p2.yEnd,
        duration: ANIMATION.p2.endTime - ANIMATION.p2.startTime,
        ease: ANIMATION.p2.ease,
        force3D: true,
      },
      ANIMATION.p2.startTime,
    );

    // Angular fade animations
    timeline.to(
      [selectors.angElements.p1, selectors.angElements.s1],
      {
        opacity: 0,
        duration:
          ANIMATION.angulars.p1s1.endFade - ANIMATION.angulars.p1s1.startFade,
        ease: ANIMATION.angulars.p1s1.ease,
        onStart: () => console.log("P1/S1 angular fade started"),
      },
      ANIMATION.angulars.p1s1.startFade,
    );

    timeline.to(
      [selectors.angElements.p2, selectors.angElements.s2],
      {
        opacity: 0,
        duration:
          ANIMATION.angulars.p2s2.endFade - ANIMATION.angulars.p2s2.startFade,
        ease: ANIMATION.angulars.p2s2.ease,
        onStart: () => console.log("P2/S2 angular fade started"),
      },
      ANIMATION.angulars.p2s2.startFade,
    );

    return timeline;
  };

  // Execution
  const preloaderTimeline = initPreloader();
  if (preloaderTimeline) {
    preloaderTimeline.play();
  }
});
