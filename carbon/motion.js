console.log("motion deployed");

//GSAP for Banners
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector(".c-nw_share-wrap");
  if (popup) {
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

//GSAP for Graphene Preloader
document.addEventListener("DOMContentLoaded", () => {
  //Variables
  const ANIMATION = {
    duration: 6,
    p1: {
      yStart: "-150vh",
      yEnd: "-80vh",
      startTime: 0,
      endTime: 6,
      ease: "power1.inOut",
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

  //Query Selectors
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

  //Initialisers
  const initPreloader = () => {
    const preloaderComponent = document.querySelector(selectors.component);
    if (!preloaderComponent) {
      console.error("Preloader component not found");
      return null;
    }

    console.log("Preloader component found:", preloaderComponent);

    if (typeof gsap === "undefined") {
      console.error("GSAP library not loaded");
      return null;
    }

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

    //P1 Aniamtion
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

    //P2 Aniamtion
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

    //S1 Aniamtion
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

    //S2 Aniamtion
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

    //Angulars Aniamtion
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

  const preloaderTimeline = initPreloader();
  if (preloaderTimeline) {
    preloaderTimeline.play();
  }
});

//GSAP for Graphene Parallax
document.addEventListener("DOMContentLoaded", () => {
  //Variables
  const PARALLAX = {
    scrollDuration: "100%",
    p1: {
      speed: -0.8,
      ease: "none",
    },
    p2: {
      speed: -0.6,
      ease: "none",
    },
    s1: {
      speed: -0.2,
      ease: "none",
    },
    s2: {
      speed: -0.4,
      ease: "none",
    },
  };

  //Query Selectors
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

  //Initialisers
  const initParallax = () => {
    const parallaxComponent = document.querySelector(selectors.component);
    if (!parallaxComponent) {
      console.error("Parallax component not found");
      return null;
    }

    console.log("Parallax component found:", parallaxComponent);

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error("GSAP or ScrollTrigger library not loaded");
      return null;
    }

    gsap.registerPlugin(ScrollTrigger);

    return createParallaxAnimation(parallaxComponent);
  };

  const createParallaxAnimation = (triggerElement) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top top",
        end: `bottom+=${window.innerHeight * 2} bottom`,
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          const progress = Math.round(self.progress * 100);
          if (progress % 25 === 0) {
            console.log(`Scroll progress: ${progress}%`);
          }
        },
      },
      onStart: () => console.log("Parallax animation started"),
      onComplete: () => console.log("Parallax animation completed"),
    });

    // Add p1 parallax
    addHexParallax(timeline, selectors.hexElements.p1, PARALLAX.p1);

    // Add p2 parallax
    addHexParallax(timeline, selectors.hexElements.p2, PARALLAX.p2);

    // Add s1 parallax
    addHexParallax(timeline, selectors.hexElements.s1, PARALLAX.s1);

    // Add s2 parallax
    addHexParallax(timeline, selectors.hexElements.s2, PARALLAX.s2);

    return timeline;
  };

  // Composable function for hex parallax
  const addHexParallax = (timeline, selector, config) => {
    const element = document.querySelector(selector);
    if (!element) {
      console.error(`Element not found: ${selector}`);
      return;
    }

    const yTravel = config.speed * window.innerHeight;

    timeline.to(
      selector,
      {
        y: `+=${yTravel}`,
        ease: config.ease,
        force3D: true,
      },
      0,
    );

    console.log(`Added parallax for ${selector} with speed ${config.speed}`);
    return timeline;
  };

  // Initialize parallax with a 6-second delay
  setTimeout(() => {
    console.log("Starting parallax animation after 6-second delay");
    const parallaxTimeline = initParallax();

    // Handle window resize to update parallax values
    window.addEventListener("resize", () => {
      if (parallaxTimeline) {
        // Refresh ScrollTrigger and update values
        ScrollTrigger.refresh();
        console.log("Parallax values updated after resize");
      }
    });
  }, 6000);
});

//GSAP for Graphene Marquee
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const config = {
    animation: {
      duration: 1,
      ease: "power1.inOut",
      scrub: true,
    },
    selectors: {
      wrapper: '[data-parallax-marquee="wrap"]',
      rows: '[data-parallax-marquee="row"]',
    },
    translation: {
      distance: 300, // Translation distance in pixels
    },
  };

  // Selectors
  const elements = {
    wrapper: document.querySelector(config.selectors.wrapper),
    row1: document.querySelector('[data-marquee-id="1"]'),
    row2: document.querySelector('[data-marquee-id="2"]'),
  };

  // Initializers
  function initMarqueeAnimation() {
    console.log("Initializing marquee animation");

    // Check if required elements exist
    if (!elements.wrapper || !elements.row1 || !elements.row2) {
      console.error("Required marquee elements not found in DOM");
      return;
    }

    // Set initial state
    gsap.set([elements.row1, elements.row2], { x: 0 });

    // Create scroll-triggered animation
    createMarqueeScrollAnimation();
  }

  // Animation creators
  function createMarqueeScrollAnimation() {
    console.log("Creating marquee scroll animation");

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: elements.wrapper,
        start: "top bottom",
        end: "bottom top",
        scrub: config.animation.scrub,
        onEnter: () => console.log("Marquee wrapper entered viewport"),
        onLeave: () => console.log("Marquee wrapper left viewport"),
        onEnterBack: () =>
          console.log("Marquee wrapper entered viewport from below"),
        onLeaveBack: () =>
          console.log("Marquee wrapper left viewport going up"),
      },
    });

    // Add animations to timeline
    tl.to(
      elements.row1,
      {
        x: -config.translation.distance,
        ease: config.animation.ease,
        duration: config.animation.duration,
      },
      0,
    );

    tl.to(
      elements.row2,
      {
        x: config.translation.distance,
        ease: config.animation.ease,
        duration: config.animation.duration,
      },
      0,
    );

    console.log("Marquee scroll animation timeline created");
  }

  // Initialize
  initMarqueeAnimation();
});

//Gsap for Graphene Flow
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const config = {
    selectors: {
      chapter: {
        container: '[data-sq-list="trigger"]',
        items: '[data-sq-item="trigger"]',
      },
      video: {
        container: '[data-sq-list="videos"]',
        items: '[data-sq-item="video"]',
      },
    },
    animation: {
      duration: 0.75,
      ease: "power2.inOut",
    },
  };

  // Initializers
  function initChapterVideoAnimation() {
    console.log("Initializing Chapter Video Animation");

    // Get DOM elements
    const chapterItems = document.querySelectorAll(
      `${config.selectors.chapter.container} ${config.selectors.chapter.items}`,
    );
    const videoItems = document.querySelectorAll(
      `${config.selectors.video.container} ${config.selectors.video.items}`,
    );

    // Validate DOM elements
    if (!chapterItems.length || !videoItems.length) {
      console.error(
        "Required DOM elements not found for chapter video animation",
      );
      return;
    }

    // Check if GSAP and ScrollTrigger are available
    if (!window.gsap || !window.ScrollTrigger) {
      console.error(
        "GSAP or ScrollTrigger not found. Please ensure both are loaded.",
      );
      return;
    }

    console.log(
      `Found ${chapterItems.length} chapters and ${videoItems.length} videos`,
    );

    // Initialize videos (set all except first to opacity 0)
    initVideoStates(videoItems);

    // Set up scroll triggers for each chapter
    createChapterScrollTriggers(chapterItems, videoItems);

    console.log("Chapter Video Animation initialized successfully");
  }

  function initVideoStates(videoItems) {
    console.log("🎞️ Setting initial video states");

    gsap.set(videoItems, { opacity: 0 });
    gsap.set(videoItems[0], { opacity: 1 });

    console.log("✅ First video set to visible, all others hidden");

    // Log the state of each video for debugging
    videoItems.forEach((video, idx) => {
      console.log(`📺 Video ${idx + 1} initial opacity: ${idx === 0 ? 1 : 0}`);
    });
  }

  // Animation creators
  function createChapterScrollTriggers(chapterItems, videoItems) {
    const lastIndex = chapterItems.length;

    console.log(`📋 Creating scroll triggers for ${lastIndex} chapters`);

    chapterItems.forEach((chapter, idx) => {
      // Convert to 1-based index to match data-sq-index
      const currentIndex = idx + 1;
      console.log(`🔧 Setting up scroll trigger for chapter ${currentIndex}`);

      ScrollTrigger.create({
        trigger: chapter,
        start: "top center",
        onEnter: () => handleChapterEnter(currentIndex, lastIndex, videoItems),
        onEnterBack: () =>
          handleChapterEnterBack(currentIndex, lastIndex, videoItems),
        markers: true, // Set to true for debugging
        id: `chapter-${currentIndex}`,
      });

      console.log(`✅ Scroll trigger created for chapter ${currentIndex}`);
    });
  }

  function handleChapterEnter(currentIndex, lastIndex, videoItems) {
    console.log(
      `🔽 TRIGGER: Chapter ${currentIndex} entered view (scrolling DOWN) 🔽`,
    );

    // Skip animation for first chapter (already visible)
    if (currentIndex === 1) {
      console.log("⏭️ First chapter already visible, skipping animation");
      return;
    }

    console.log(
      `🎬 ANIMATING: Fade out video ${currentIndex - 1} and fade in video ${currentIndex}`,
    );

    // Create and play transition animation
    const timeline = createVideoTransitionTimeline(
      videoItems[currentIndex - 2], // Previous video (currentIndex-1)-1 due to 0-based array
      videoItems[currentIndex - 1], // Current video (currentIndex-1) due to 0-based array
    );

    timeline.play();
    console.log(`✅ Animation started for Chapter ${currentIndex} entry`);
  }

  function handleChapterEnterBack(currentIndex, lastIndex, videoItems) {
    console.log(
      `🔼 TRIGGER: Chapter ${currentIndex} entered view (scrolling UP) 🔼`,
    );

    // Skip animation for first chapter
    if (currentIndex === 1) {
      console.log("⏭️ First chapter already visible, skipping animation");
      return;
    }

    console.log(
      `🎬 ANIMATING: Fade out video ${currentIndex} and fade in video ${currentIndex - 1}`,
    );

    // Create and play transition animation (reverse direction)
    const timeline = createVideoTransitionTimeline(
      videoItems[currentIndex - 1], // Current video
      videoItems[currentIndex - 2], // Previous video
    );

    timeline.play();
    console.log(`✅ Animation started for Chapter ${currentIndex} enterBack`);
  }

  function createVideoTransitionTimeline(fadeOutVideo, fadeInVideo) {
    console.log("⏱️ Creating video transition timeline");

    // Get indices for logging (add 1 to convert from 0-based to 1-based)
    const fadeOutIndex =
      Array.from(fadeOutVideo.parentNode.children).indexOf(fadeOutVideo) + 1;
    const fadeInIndex =
      Array.from(fadeInVideo.parentNode.children).indexOf(fadeInVideo) + 1;

    console.log(`🔄 Transition: Video ${fadeOutIndex} → Video ${fadeInIndex}`);

    const tl = gsap.timeline({
      onStart: () => console.log(`▶️ Starting transition animation`),
      onComplete: () =>
        console.log(
          `✅ Completed transition: Video ${fadeInIndex} now visible`,
        ),
    });

    tl.to(fadeOutVideo, {
      opacity: 0,
      duration: config.animation.duration / 2,
      ease: config.animation.ease,
      onStart: () => console.log(`⬇️ Fading out Video ${fadeOutIndex}`),
    });

    tl.to(
      fadeInVideo,
      {
        opacity: 1,
        duration: config.animation.duration / 2,
        ease: config.animation.ease,
        onStart: () => console.log(`⬆️ Fading in Video ${fadeInIndex}`),
      },
      `-=${config.animation.duration / 4}`,
    ); // Slight overlap for smoother transition

    return tl;
  }

  console.log("🚀 DOM loaded - initializing chapter video animation");
  initChapterVideoAnimation();
});

//GSAP for Navbar slide
document.addEventListener("DOMContentLoaded", () => {
  const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;

  if (isDesktop()) {
    const navbars = document.querySelectorAll(
      '[data-nav-element="navbar-wrap"]:not([data-tuck-block="blocked"])',
    );
    if (navbars.length === 0) {
      console.warn("No navbar elements found - animation aborted");
      return;
    }

    gsap.set(navbars, { yPercent: 0 });
    const showAnim = gsap
      .from(navbars, {
        yPercent: -100,
        paused: true,
        duration: 0.2,
      })
      .progress(1);

    let lastScrollTop = 0;
    const downScrollThreshold = 200;
    const upScrollThreshold = 800;
    let accumulatedScroll = 0;
    let navbarVisible = true;

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
      const scrollAmount = Math.abs(scrollTop - lastScrollTop);

      if (
        (scrollDirection === "down" && accumulatedScroll < 0) ||
        (scrollDirection === "up" && accumulatedScroll > 0)
      ) {
        accumulatedScroll = 0;
      }

      accumulatedScroll +=
        scrollDirection === "down" ? scrollAmount : -scrollAmount;

      if (accumulatedScroll > downScrollThreshold && navbarVisible) {
        showAnim.reverse();
        navbarVisible = false;
        accumulatedScroll = 0;
      } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
        showAnim.play();
        navbarVisible = true;
        accumulatedScroll = 0;
      }

      lastScrollTop = scrollTop;
    });
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
        element.setAttribute("data-motion-text", "");
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
    const splitLines = new SplitType("[data-motion-text]", {
      types: "lines",
      tagName: "span",
    });

    document.querySelectorAll("[data-motion-text] .line").forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("u-line-mask");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    document.querySelectorAll("[data-motion-text]").forEach((element) => {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      const tl = gsap.timeline({ paused: true, delay: delay });
      tl.from(element.querySelectorAll(".line"), {
        y: "200%",
        opacity: 0,
        duration: 0.8,
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
    function splitRevert() {
      document.querySelectorAll("[data-motion-text] .line").forEach((line) => {
        const wrapper = line.parentNode;
        wrapper.replaceWith(...wrapper.childNodes);
      });
      splitLines.revert();
    }
    gsap.set("[data-motion-text]", { opacity: 1 });
  }, 0);
});

//GSAP for Arrays
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  setTimeout(() => {
    const cardContainers = document.querySelectorAll(
      '[data-motion-element="array"]',
    );

    if (!cardContainers || cardContainers.length === 0) {
      console.error('Could not find elements with data-motion-element="array"');
      return;
    }

    cardContainers.forEach((container, containerIndex) => {
      try {
        const delay = container.getAttribute("data-motion-delay")
          ? parseFloat(container.getAttribute("data-motion-delay"))
          : 0;

        const cardElements = Array.from(container.children);

        if (!cardElements || cardElements.length === 0) {
          console.error(
            `Container ${containerIndex + 1} has no child elements`,
          );
          return;
        }

        gsap.set(cardElements, {
          opacity: 0,
          y: 20,
        });

        const tl = gsap.timeline({
          paused: true,
        });

        tl.to(cardElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
        });

        ScrollTrigger.create({
          trigger: container,
          start: "top 95%",
          markers: false,
          once: true,
          onEnter: () => {
            setTimeout(() => {
              tl.play(0);
            }, delay * 1000);
          },
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

//GSAP for Single Elements
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const singleElements = document.querySelectorAll(
    '[data-motion-element="single"]',
  );
  if (!singleElements || singleElements.length === 0) {
    console.error('Could not find elements with data-motion-element="single"');
    return;
  }

  const animatableElements = Array.from(singleElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  animatableElements.forEach((element, index) => {
    try {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      gsap.set(element, {
        opacity: 0,
        y: 20,
      });

      const tl = gsap.timeline({
        paused: true,
      });

      tl.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      ScrollTrigger.create({
        trigger: element,
        start: "top 95%",
        markers: false,
        once: true,
        onEnter: () => {
          setTimeout(() => {
            tl.play(0);
          }, delay * 1000);
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

//GSAP to Slide Down
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const slideElements = document.querySelectorAll(
    '[data-motion-element="slide"]',
  );

  if (!slideElements || slideElements.length === 0) {
    console.error('Could not find elements with data-motion-element="slide"');
    return;
  }

  const animatableElements = Array.from(slideElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  animatableElements.forEach((element, index) => {
    try {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      gsap.set(element, {
        opacity: 1,
        yPercent: -120,
      });

      const tl = gsap.timeline({
        paused: true,
      });

      tl.to(element, {
        opacity: 1,
        yPercent: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      ScrollTrigger.create({
        trigger: element,
        start: "top 95%",
        markers: false,
        once: true,
        onEnter: () => {
          setTimeout(() => {
            tl.play(0);
          }, delay * 1000);
        },
      });
    } catch (error) {
      console.error(
        `Error in slide animation setup for element ${index + 1}:`,
        error,
      );
    }
  });
});
