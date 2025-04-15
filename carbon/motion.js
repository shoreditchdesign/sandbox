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
      yEnd: "-80vh",
      startTime: 0,
      endTime: 6,
      ease: "power1.inOut", // Slower first half, faster second half
    },
    p2: {
      yStart: "80vh",
      yEnd: "-10vh",
      startTime: 0,
      endTime: 4,
      ease: "power2.out",
    },
    s1: {
      yStart: "30vh",
      yEnd: "0vh",
      startTime: 0,
      endTime: 5,
      ease: "power1.inOut",
    },
    s2: {
      yStart: "0vh",
      yEnd: "0vh",
      startTime: 0,
      endTime: 5,
      ease: "power1.inOut",
    },
    angulars: {
      p1s1: {
        startFade: 0,
        endFade: 12,
        ease: "power2.out",
      },
      p2s2: {
        startFade: 2,
        endFade: 6,
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
    gsap.set(selectors.hexElements.s1, { y: ANIMATION.s1.yStart });
    gsap.set(selectors.hexElements.s2, { y: ANIMATION.s2.yStart });
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

    // S1 animation
    timeline.to(
      selectors.hexElements.s1,
      {
        y: ANIMATION.s1.yEnd,
        duration: ANIMATION.s1.endTime - ANIMATION.s1.startTime,
        ease: ANIMATION.s1.ease,
        force3D: true,
      },
      ANIMATION.s1.startTime,
    );

    // S2 animation
    timeline.to(
      selectors.hexElements.s2,
      {
        y: ANIMATION.s2.yEnd,
        duration: ANIMATION.s2.endTime - ANIMATION.s2.startTime,
        ease: ANIMATION.s2.ease,
        force3D: true,
      },
      ANIMATION.s2.startTime,
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

// GSAP Navbar Slide
document.addEventListener("DOMContentLoaded", () => {
  // Check if desktop (screen width >= 992px)
  const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;
  // Only run on desktop
  if (isDesktop()) {
    // Select navbars that don't have the blocked attribute
    const navbars = document.querySelectorAll(
      '[data-nav-element="navbar-wrap"]:not([data-slide-block="blocked"])',
    );
    if (navbars.length === 0) return;
    const showAnim = gsap
      .from(navbars, {
        yPercent: -100,
        paused: true,
        duration: 0.2,
      })
      .progress(1);
    // Track scroll position and direction
    let lastScrollTop = 0;
    const downScrollThreshold = 200; // Pixels to scroll down before hiding
    const upScrollThreshold = 800; // Pixels to scroll up before showing
    let accumulatedScroll = 0; // Track accumulated scroll in each direction
    let navbarVisible = true;
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
      // Calculate scroll amount since last check
      const scrollAmount = Math.abs(scrollTop - lastScrollTop);

      console.log(`Direction: ${scrollDirection}, Amount: ${scrollAmount}`);

      // If direction changed, reset accumulated scroll
      if (
        (scrollDirection === "down" && accumulatedScroll < 0) ||
        (scrollDirection === "up" && accumulatedScroll > 0)
      ) {
        accumulatedScroll = 0;
        console.log("Direction changed, reset accumulated scroll");
      }
      // Accumulate scroll in the appropriate direction
      accumulatedScroll +=
        scrollDirection === "down" ? scrollAmount : -scrollAmount;

      console.log(`Accumulated: ${accumulatedScroll}`);

      // Check if we've scrolled enough in each direction with separate thresholds
      if (accumulatedScroll > downScrollThreshold && navbarVisible) {
        showAnim.reverse();
        navbarVisible = false;
        accumulatedScroll = 0; // Reset after action
        console.log("Navbar hidden");
      } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
        showAnim.play();
        navbarVisible = true;
        accumulatedScroll = 0; // Reset after action
        console.log("Navbar shown");
      }
      lastScrollTop = scrollTop;
    });
    setTimeout(() => {
      gsap.set(navbars, { yPercent: 0 });
    }, 10);
  }
});

//GSAP for Headings

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }
    document.querySelectorAll("h1, h2").forEach((element) => {
      if (element.getAttribute("data-motion-state") !== "blocked") {
        element.setAttribute("data-stagger-text", "");
      }
    });
  }, 0);
});

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }
    // Split text by lines
    const splitLines = new SplitType("[data-stagger-text]", {
      types: "lines",
      tagName: "span",
    });
    // Create wrappers for each line
    document.querySelectorAll("[data-stagger-text] .line").forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("u-line-mask");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
    // Create animations
    document.querySelectorAll("[data-stagger-text]").forEach((element) => {
      // Get delay value from data attribute or use 0 as default
      const delay = element.getAttribute("data-stagger-delay")
        ? parseFloat(element.getAttribute("data-stagger-delay"))
        : 0;
      console.log(`Animation for element with delay: ${delay}s`, element);

      const tl = gsap.timeline({ paused: true, delay: delay });
      tl.from(element.querySelectorAll(".line"), {
        y: "200%",
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        stagger: 0.1,
      });
      ScrollTrigger.create({
        trigger: element,
        start: "top 90%",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        once: true,
      });
    });
    // Function to revert split
    function splitRevert() {
      document.querySelectorAll("[data-stagger-text] .line").forEach((line) => {
        const wrapper = line.parentNode;
        wrapper.replaceWith(...wrapper.childNodes);
      });
      splitLines.revert();
    }
    // Ensure elements are visible
    gsap.set("[data-stagger-text]", { opacity: 1 });
  }, 0);
});

//GSAP for Array
document.addEventListener("DOMContentLoaded", function () {
  // Make sure GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  // Wait a moment to ensure everything is loaded
  setTimeout(() => {
    // Target all elements with data-motion-element="array" attribute
    const cardContainers = document.querySelectorAll(
      '[data-motion-element="array"]',
    );
    if (!cardContainers || cardContainers.length === 0) {
      console.error('Could not find elements with data-motion-element="array"');
      return;
    }
    // Process each card container
    cardContainers.forEach((container, containerIndex) => {
      try {
        // Get all direct children
        const cardElements = Array.from(container.children);
        if (!cardElements || cardElements.length === 0) {
          console.error(
            `Container ${containerIndex + 1} has no child elements`,
          );
          return;
        }
        // Set initial state - all cards invisible
        gsap.set(cardElements, {
          opacity: 0,
          y: 20,
        });
        // Create the animation timeline (paused until scrolled to)
        const tl = gsap.timeline({
          paused: true,
        });
        // Add the staggered animation
        tl.to(cardElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
        });
        // Create ScrollTrigger
        ScrollTrigger.create({
          trigger: container,
          start: "top 95%", // Start when the top of the container reaches 75% of viewport
          markers: false, // Set to true for debugging
          once: true, // Add once: true to prevent replaying the animation
          onEnter: () => {
            tl.play(0); // Play from the beginning
          },
          // Deliberately NOT using onRefresh to avoid playing for elements already in view
        });
      } catch (error) {
        console.error(
          `Error in card animation setup for container ${containerIndex + 1}:`,
          error,
        );
      }
    });
  }, 200);
});

//GSAP for single elememts
document.addEventListener("DOMContentLoaded", function () {
  // Make sure GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Target all elements with data-motion-element="single" attribute
  const singleElements = document.querySelectorAll(
    '[data-motion-element="single"]',
  );

  if (!singleElements || singleElements.length === 0) {
    console.error('Could not find elements with data-motion-element="single"');
    return;
  }

  // Filter elements that don't have data-motion-state="blocked"
  const animatableElements = Array.from(singleElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  // Process each eligible element
  animatableElements.forEach((element, index) => {
    try {
      // Set initial state - invisible and slightly moved down
      gsap.set(element, {
        opacity: 0,
        y: 20,
      });

      // Create the animation timeline (paused until scrolled to)
      const tl = gsap.timeline({
        paused: true,
      });

      // Add the animation
      tl.to(element, {
        opacity: 1,
        delay: 0.2,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Create ScrollTrigger
      ScrollTrigger.create({
        trigger: element,
        start: "top 95%", // Start when the top of the element reaches 80% of viewport
        markers: false, // Set to true for debugging
        once: true, // Set replay to false by using once: true
        onEnter: () => {
          tl.play(0); // Play from the beginning
        },
      });
    } catch (error) {
      console.error(
        `Error in animation setup for element ${index + 1}:`,
        error,
      );
    }
  });
});
