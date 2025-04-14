console.log("motion deployed");

// Conversion Pop-up
gsap.registerPlugin(ScrollTrigger);

const popup = document.querySelector(".c-nw_share-wrap");
const popupHeight = popup.offsetHeight;

const conversionDistance =
  parseFloat(popup.getAttribute("data-conversion-distance")) || 1.5; // fallback to 1.5 if not set

gsap.fromTo(popup, { y: popupHeight }, { y: 0, duration: 0.5, paused: true });

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

//Graphene Preloader
// Configuration variables for the animation
const ANIMATION = {
  duration: 3, // Total duration in seconds

  // Y Translation values
  p1: {
    yStart: -150, // vh
    yMiddle: -100, // vh
    yEnd: -50, // vh
    middleTime: 1.8, // seconds
    ease: "power2.inOut", // Slow start, fast middle, slow end
  },

  p2: {
    yStart: 80, // vh
    yEnd: -10, // vh
    endTime: 1.2, // seconds
    ease: "power1.out", // Slow deceleration
  },

  // Opacity fade values
  angulars: {
    p1s1: {
      startFade: 1.5, // seconds
      fadeDuration: 0.3, // seconds
      ease: "power2.out",
    },
    p2s2: {
      startFade: 2.0, // seconds
      fadeDuration: 0.4, // seconds
      ease: "power2.out",
    },
  },
};

/**
 * Creates and returns the preloader animation timeline
 * @returns {gsap.core.Timeline} GSAP Timeline with all animations
 */
function createPreloaderAnimation() {
  console.log("Creating preloader animation timeline");

  // Set initial properties
  gsap.set("[data-gpl-hex='p1']", {
    y: ANIMATION.p1.yStart + "vh",
  });

  gsap.set("[data-gpl-hex='p2']", {
    y: ANIMATION.p2.yStart + "vh",
  });

  gsap.set(
    "[data-gpl-ang='p1'], [data-gpl-ang='s1'], [data-gpl-ang='p2'], [data-gpl-ang='s2']",
    {
      opacity: 1,
    },
  );

  // Create master timeline
  const tl = gsap.timeline({
    onStart: () => console.log("Preloader animation started"),
    onComplete: () => console.log("Preloader animation completed"),
  });

  // Add p1 y-translation (in two parts)
  tl.to(
    "[data-gpl-hex='p1']",
    {
      y: ANIMATION.p1.yMiddle + "vh",
      duration: ANIMATION.p1.middleTime,
      ease: ANIMATION.p1.ease,
      onStart: () => console.log("p1 first movement started"),
      onComplete: () => console.log("p1 first movement completed"),
    },
    0,
  );

  tl.to(
    "[data-gpl-hex='p1']",
    {
      y: ANIMATION.p1.yEnd + "vh",
      duration: ANIMATION.duration - ANIMATION.p1.middleTime,
      ease: ANIMATION.p1.ease,
      onStart: () => console.log("p1 second movement started"),
      onComplete: () => console.log("p1 second movement completed"),
    },
    ANIMATION.p1.middleTime,
  );

  // Add p2 y-translation (single movement then hold)
  tl.to(
    "[data-gpl-hex='p2']",
    {
      y: ANIMATION.p2.yEnd + "vh",
      duration: ANIMATION.p2.endTime,
      ease: ANIMATION.p2.ease,
      onStart: () => console.log("p2 movement started"),
      onComplete: () => console.log("p2 movement completed"),
    },
    0,
  );

  // Add angular opacity animations
  // p1 and s1 angulars fade
  tl.to(
    "[data-gpl-ang='p1'], [data-gpl-ang='s1']",
    {
      opacity: 0,
      duration: ANIMATION.angulars.p1s1.fadeDuration,
      ease: ANIMATION.angulars.p1s1.ease,
      onStart: () => console.log("p1 and s1 angular fade started"),
      onComplete: () => console.log("p1 and s1 angular fade completed"),
    },
    ANIMATION.angulars.p1s1.startFade,
  );

  // p2 and s2 angulars fade
  tl.to(
    "[data-gpl-ang='p2'], [data-gpl-ang='s2']",
    {
      opacity: 0,
      duration: ANIMATION.angulars.p2s2.fadeDuration,
      ease: ANIMATION.angulars.p2s2.ease,
      onStart: () => console.log("p2 and s2 angular fade started"),
      onComplete: () => console.log("p2 and s2 angular fade completed"),
    },
    ANIMATION.angulars.p2s2.startFade,
  );

  return tl;
}

/**
 * Initializes and plays the preloader animation
 */
function initPreloader() {
  console.log("Initializing preloader");
  const preloaderAnimation = createPreloaderAnimation();

  // Play the animation
  preloaderAnimation.play();

  // Log animation progress periodically
  preloaderAnimation.eventCallback("onUpdate", () => {
    if (preloaderAnimation.progress() % 0.25 < 0.01) {
      console.log(
        `Animation progress: ${Math.round(preloaderAnimation.progress() * 100)}%`,
      );
    }
  });
}

// Run the preloader animation when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, starting preloader animation");
  initPreloader();
});
