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
//Graphene Preloader
document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "%c DOM LOADED ",
    "background: #333; color: #3498db; font-size: 16px;",
  );

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

    // Debug flags
    debug: {
      enabled: true,
      logInterval: 0.1, // Log progress every 10%
    },

    // Set this to true if using transforms instead of direct properties
    useTransform: true,
  };

  /**
   * Creates and returns the preloader animation timeline
   * @returns {gsap.core.Timeline} GSAP Timeline with all animations
   */
  function createPreloaderAnimation() {
    console.log("Creating preloader animation timeline");

    // Check if required elements exist
    const elements = {
      p1: document.querySelector("[data-gpl-hex='p1']"),
      p2: document.querySelector("[data-gpl-hex='p2']"),
      p1Angular: document.querySelector("[data-gpl-ang='p1']"),
      s1Angular: document.querySelector("[data-gpl-ang='s1']"),
      p2Angular: document.querySelector("[data-gpl-ang='p2']"),
      s2Angular: document.querySelector("[data-gpl-ang='s2']"),
    };

    // Validate elements
    let allElementsFound = true;
    for (const [key, element] of Object.entries(elements)) {
      if (!element) {
        console.error(`Element ${key} not found in DOM`);
        console.warn(
          `Missing element for selector [data-gpl-*='${key.replace("Angular", "")}']`,
        );
        allElementsFound = false;
      } else {
        console.log(`Element ${key} found`, element);
      }
    }

    if (!allElementsFound) {
      console.error(
        "Some elements not found, animation may not work correctly",
      );
    }

    // Log initial positions
    console.log(`Setting p1 initial y-position to ${ANIMATION.p1.yStart}vh`);
    console.log(`Setting p2 initial y-position to ${ANIMATION.p2.yStart}vh`);

    // Set initial properties - using transform instead of direct y property
    if (ANIMATION.useTransform) {
      gsap.set("[data-gpl-hex='p1']", {
        y: ANIMATION.p1.yStart + "vh",
        force3D: true,
      });

      gsap.set("[data-gpl-hex='p2']", {
        y: ANIMATION.p2.yStart + "vh",
        force3D: true,
      });
    } else {
      gsap.set("[data-gpl-hex='p1']", {
        y: ANIMATION.p1.yStart + "vh",
      });

      gsap.set("[data-gpl-hex='p2']", {
        y: ANIMATION.p2.yStart + "vh",
      });
    }

    gsap.set(
      "[data-gpl-ang='p1'], [data-gpl-ang='s1'], [data-gpl-ang='p2'], [data-gpl-ang='s2']",
      {
        opacity: 1,
      },
    );

    // Try to confirm the initial values were applied
    elements.p1 &&
      console.log("Initial p1 transform:", elements.p1.style.transform);
    elements.p2 &&
      console.log("Initial p2 transform:", elements.p2.style.transform);

    // Create master timeline
    const tl = gsap.timeline({
      onStart: () => console.log("Preloader animation started"),
      onUpdate: () => {
        const progress = tl.progress();
        const currentTime = tl.time();
        if (
          ANIMATION.debug.enabled &&
          progress % ANIMATION.debug.logInterval < 0.01
        ) {
          console.log(
            `Timeline progress: ${Math.round(progress * 100)}% (${currentTime.toFixed(2)}s / ${ANIMATION.duration}s)`,
          );
        }
      },
      onComplete: () => console.log("Preloader animation completed"),
    });

    // Add p1 y-translation (in two parts)
    tl.to(
      "[data-gpl-hex='p1']",
      {
        y: ANIMATION.p1.yMiddle + "vh",
        duration: ANIMATION.p1.middleTime,
        ease: ANIMATION.p1.ease,
        force3D: true,
        onStart: () =>
          console.log(
            `P1 FIRST MOVEMENT: Starting movement from ${ANIMATION.p1.yStart}vh to ${ANIMATION.p1.yMiddle}vh`,
          ),
        onUpdate: function () {
          if (this.progress() % 0.25 < 0.01) {
            // Log at 0%, 25%, 50%, 75%, 100%
            const p1 = document.querySelector("[data-gpl-hex='p1']");
            console.log(
              `P1 FIRST MOVEMENT: Progress ${Math.round(this.progress() * 100)}%, transform = ${p1?.style.transform || "unknown"}`,
            );
          }
        },
        onComplete: () =>
          console.log(
            `P1 FIRST MOVEMENT: Completed at ${ANIMATION.p1.middleTime}s, y = ${ANIMATION.p1.yMiddle}vh`,
          ),
      },
      0,
    );

    tl.to(
      "[data-gpl-hex='p1']",
      {
        y: ANIMATION.p1.yEnd + "vh",
        duration: ANIMATION.duration - ANIMATION.p1.middleTime,
        ease: ANIMATION.p1.ease,
        force3D: true,
        onStart: () =>
          console.log(
            `P1 SECOND MOVEMENT: Starting movement from ${ANIMATION.p1.yMiddle}vh to ${ANIMATION.p1.yEnd}vh`,
          ),
        onUpdate: function () {
          if (this.progress() % 0.25 < 0.01) {
            const p1 = document.querySelector("[data-gpl-hex='p1']");
            console.log(
              `P1 SECOND MOVEMENT: Progress ${Math.round(this.progress() * 100)}%, transform = ${p1?.style.transform || "unknown"}`,
            );
          }
        },
        onComplete: () =>
          console.log(
            `P1 SECOND MOVEMENT: Completed at ${ANIMATION.duration}s, y = ${ANIMATION.p1.yEnd}vh`,
          ),
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
        force3D: true,
        onStart: () =>
          console.log(
            `P2 MOVEMENT: Starting movement from ${ANIMATION.p2.yStart}vh to ${ANIMATION.p2.yEnd}vh`,
          ),
        onUpdate: function () {
          if (this.progress() % 0.25 < 0.01) {
            const p2 = document.querySelector("[data-gpl-hex='p2']");
            console.log(
              `P2 MOVEMENT: Progress ${Math.round(this.progress() * 100)}%, transform = ${p2?.style.transform || "unknown"}`,
            );
          }
        },
        onComplete: () =>
          console.log(
            `P2 MOVEMENT: Completed at ${ANIMATION.p2.endTime}s, y = ${ANIMATION.p2.yEnd}vh`,
          ),
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
        onStart: () =>
          console.log(
            `P1/S1 ANGULARS: Starting fade out at ${ANIMATION.angulars.p1s1.startFade}s`,
          ),
        onUpdate: function () {
          if (this.progress() % 0.33 < 0.01) {
            const p1Opacity = gsap.getProperty(
              "[data-gpl-ang='p1']",
              "opacity",
            );
            const s1Opacity = gsap.getProperty(
              "[data-gpl-ang='s1']",
              "opacity",
            );
            console.log(
              `P1/S1 ANGULARS: Progress ${Math.round(this.progress() * 100)}%, opacity p1=${p1Opacity.toFixed(2)}, s1=${s1Opacity.toFixed(2)}`,
            );
          }
        },
        onComplete: () => {
          const endTime =
            ANIMATION.angulars.p1s1.startFade +
            ANIMATION.angulars.p1s1.fadeDuration;
          console.log(
            `P1/S1 ANGULARS: Fade completed at ${endTime}s, opacity = 0`,
          );
        },
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
        onStart: () =>
          console.log(
            `P2/S2 ANGULARS: Starting fade out at ${ANIMATION.angulars.p2s2.startFade}s`,
          ),
        onUpdate: function () {
          if (this.progress() % 0.33 < 0.01) {
            const p2Opacity = gsap.getProperty(
              "[data-gpl-ang='p2']",
              "opacity",
            );
            const s2Opacity = gsap.getProperty(
              "[data-gpl-ang='s2']",
              "opacity",
            );
            console.log(
              `P2/S2 ANGULARS: Progress ${Math.round(this.progress() * 100)}%, opacity p2=${p2Opacity.toFixed(2)}, s2=${s2Opacity.toFixed(2)}`,
            );
          }
        },
        onComplete: () => {
          const endTime =
            ANIMATION.angulars.p2s2.startFade +
            ANIMATION.angulars.p2s2.fadeDuration;
          console.log(
            `P2/S2 ANGULARS: Fade completed at ${endTime}s, opacity = 0`,
          );
        },
      },
      ANIMATION.angulars.p2s2.startFade,
    );

    return tl;
  }

  /**
   * Initializes and plays the preloader animation
   */
  function initPreloader() {
    console.log(
      "%c PRELOADER INITIALIZATION ",
      "background: #333; color: #bada55; font-size: 16px;",
    );

    // Validate DOM structure before proceeding
    const preloaderComponent = document.querySelector("[data-gpl-component]");

    if (!preloaderComponent) {
      console.error(
        "CRITICAL ERROR: Preloader component [data-gpl-component] not found in DOM",
      );
      console.warn("Animation cannot start without proper DOM structure");
      return;
    }

    console.log(
      "DOM validation successful, preloader component found:",
      preloaderComponent,
    );

    // Check for required child elements
    const requiredGroups = [
      { selector: "[data-gpl-overlay]", name: "Overlays container" },
      { selector: "[data-gpl-group]", name: "Hexes group" },
    ];

    const missingGroups = requiredGroups.filter(
      (group) => !document.querySelector(group.selector),
    );

    if (missingGroups.length > 0) {
      console.error("CRITICAL ERROR: Missing required container elements:");
      missingGroups.forEach((group) => {
        console.warn(`Missing ${group.name} [${group.selector}]`);
      });
      return;
    }

    // Check GSAP is available
    if (typeof gsap === "undefined") {
      console.error("CRITICAL ERROR: GSAP library not loaded");
      console.warn(
        "Please include the GSAP library before running this animation",
      );
      return;
    }

    // Log animation configuration
    console.log("Animation configuration:", ANIMATION);

    // Create and play the animation
    const preloaderAnimation = createPreloaderAnimation();
    console.log(
      "%c STARTING ANIMATION ",
      "background: #333; color: #bada55; font-size: 16px;",
    );

    // Play the animation
    preloaderAnimation.play();

    // Add extra debugging
    const checkElements = () => {
      const elements = {
        p1: document.querySelector("[data-gpl-hex='p1']"),
        p2: document.querySelector("[data-gpl-hex='p2']"),
      };

      console.log("Current transforms:");
      console.log("P1:", elements.p1?.style.transform || "unknown");
      console.log("P2:", elements.p2?.style.transform || "unknown");
    };

    // Check transforms after a delay to see if they're changing
    setTimeout(checkElements, 500);
    setTimeout(checkElements, 1000);
    setTimeout(checkElements, 2000);

    // Log when animation is complete
    preloaderAnimation.eventCallback("onComplete", () => {
      console.log(
        "%c ANIMATION COMPLETE ",
        "background: #333; color: #2ecc71; font-size: 16px;",
      );
      checkElements(); // Check final state
    });
  }

  // Make sure the animation object is globally available for debugging
  window.preloaderAnimation = null;

  // Allow a short delay to ensure everything is rendered
  setTimeout(() => {
    initPreloader();
  }, 100);
});
