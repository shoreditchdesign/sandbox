console.log("motion deployed");

//GSAP for Popups
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector("[data-share-popup]");
  if (popup) {
    gsap.registerPlugin(ScrollTrigger);
    const popupHeight = popup.offsetHeight;
    const conversionDistance =
      parseFloat(popup.getAttribute("data-popup-distance")) || 1.5;
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
          console.log("Banner moving up");
        } else {
          gsap.to(popup, { y: 2 * popupHeight });
        }
      },
    });
  } else {
    console.warn("Share banner not found");
  }
});

//GSAP for Navbar Slide
document.addEventListener("DOMContentLoaded", () => {
  const navbars = document.querySelectorAll(
    '[data-nav-element="navbar-wrap"]:not([data-tuck-block="blocked"])',
  );
  if (navbars.length === 0) {
    console.warn("No navbar elements found - animation aborted");
    return;
  }

  // Set initial attribute state
  navbars.forEach((navbar) => {
    navbar.setAttribute("data-tuck-state", "default");
  });

  gsap.set(navbars, { yPercent: 0, translateY: "0%" });
  const showAnim = gsap
    .from(navbars, {
      yPercent: -100,
      paused: true,
      duration: 0.2,
    })
    .progress(1);
  let lastScrollTop = 0;
  const downScrollThreshold = 200;
  const upScrollThreshold = 200;
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

      // Set attribute to default when hiding navbar (reverse animation)
      navbars.forEach((navbar) => {
        navbar.setAttribute("data-tuck-state", "default");
        console.log("Navbar state changed to: default");
      });
    } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
      showAnim.play();
      navbarVisible = true;
      accumulatedScroll = 0;

      // Set attribute to hidden when showing navbar (play animation)
      navbars.forEach((navbar) => {
        navbar.setAttribute("data-tuck-state", "hidden");
        console.log("Navbar state changed to: hidden");
      });
    }
    lastScrollTop = scrollTop;
  });
});

//GSAP for Preloader
document.addEventListener("DOMContentLoaded", () => {
  // Animation Constants
  const ANIMATION = {
    shader: {
      initialOpacity: 1,
      finalOpacity: 0,
      initialX: 0,
      finalX: "0px",
      shaderDelay: 2.2,
      shaderFadeOutDuration: 0.6,
      bgDelay: -0.6,
      bgFadeOutDuration: 2.4,
      ease: "power2.inOut",
    },
    hero: {
      swoosh: {
        duration: 0.3,
        initialPosition: "100%",
        finalPosition: "0%",
        ease: "power2.out",
        initialDelay: 4.3,
        staggerDelay: 0.3,
        fadeInDuration: 0.1,
      },
      fade: {
        duration: 0.8,
        initialPosition: "-40px",
        finalPosition: "0px",
        initialOpacity: 0,
        finalOpacity: 1,
        ease: "power2.out",
        initialDelay: 4.9,
        staggerDelay: 0.3,
      },
      text: {
        letterDuration: 0.06,
        initialDelay: 0.1,
        staggerDelay: 0.3,
        ease: "power1.inOut",
      },
    },
  };

  // Selectors
  const selectors = {
    shader: {
      wrap: '[data-pl-shader="wrap"]',
      canvas: '[data-pl-shader="canvas"]',
      bg: '[data-pl-shader="bg"]',
    },
    hero: {
      headingContainer: "[data-pl-text]",
      headings: "[data-pl-heading]",
      spans: "[data-pl-span]",
      arrows: "[data-pl-arrow]",
    },
  };

  function createShaderAnimation() {
    const shaderWrap = document.querySelector(selectors.shader.wrap);
    const shaderCanvas = document.querySelector(selectors.shader.canvas);
    const shaderBg = document.querySelector(selectors.shader.bg);

    if (!shaderWrap || !shaderCanvas) {
      console.error("Shader elements not found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Set initial state
    gsap.set(shaderWrap, { opacity: 1 });
    gsap.set(shaderCanvas, {
      x: ANIMATION.shader.initialX,
      opacity: ANIMATION.shader.initialOpacity,
      visibility: "visible",
    });

    if (shaderBg) {
      gsap.set(shaderBg, { opacity: 1 });
    }

    // Hold the shader in view for specified duration
    tl.to(shaderCanvas, {
      duration: ANIMATION.shader.shaderDelay,
      onStart: () => {},
    });

    // Then translate and fade out
    tl.to(shaderCanvas, {
      x: ANIMATION.shader.finalX,
      opacity: ANIMATION.shader.finalOpacity,
      duration: ANIMATION.shader.shaderFadeOutDuration,
      ease: ANIMATION.shader.ease,
      onStart: () => {},
    });

    // Wait before fading out background
    if (shaderBg) {
      tl.to({}, { duration: ANIMATION.shader.bgDelay });

      tl.to(shaderBg, {
        opacity: 0,
        duration: ANIMATION.shader.bgFadeOutDuration,
        ease: ANIMATION.shader.ease,
        onStart: () => {},
      });
    }

    return tl;
  }
  // Create text animation functions
  function createTextAnimation() {
    const headingContainer = document.querySelector(
      selectors.hero.headingContainer,
    );
    const headings = document.querySelectorAll(selectors.hero.headings);
    const spans = document.querySelectorAll(selectors.hero.spans);

    if (!headingContainer || !headings.length || !spans.length) {
      console.error("Hero text elements not found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Store original widths and split text
    spans.forEach((span) => {
      const width = span.offsetWidth;
      gsap.set(span, { width: width });
    });

    // Split headings into characters
    headings.forEach((heading) => {
      const splitText = new SplitType(heading, { types: "chars" });
      if (splitText.chars) {
        gsap.set(splitText.chars, { opacity: 0 });
      }
    });

    return tl;
  }

  function playSwooshAnimations() {
    const arrows = document.querySelectorAll(selectors.hero.arrows);

    if (!arrows.length) {
      console.error("No arrows found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Set initial state for all arrows
    gsap.set(arrows, {
      right: ANIMATION.hero.swoosh.initialPosition,
      opacity: 0,
    });

    // Animate each arrow with stagger
    arrows.forEach((arrow, index) => {
      // Create individual swoosh animation
      const swooshTl = gsap.timeline();

      // First fade in the arrow
      swooshTl.to(arrow, {
        opacity: 1,
        duration: ANIMATION.hero.swoosh.fadeInDuration,
        onStart: () => {},
      });

      // Then animate from right to left
      swooshTl.to(arrow, {
        right: ANIMATION.hero.swoosh.finalPosition,
        duration: ANIMATION.hero.swoosh.duration,
        ease: ANIMATION.hero.swoosh.ease,
        onStart: () => {},
      });

      // Add to main timeline with stagger
      tl.add(swooshTl, index * ANIMATION.hero.swoosh.staggerDelay);
    });

    return tl;
  }

  function playTextScrambleAnimations() {
    const headings = document.querySelectorAll(selectors.hero.headings);

    if (!headings.length) {
      console.error("No headings found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Animate each heading with stagger
    headings.forEach((heading, index) => {
      // Get split characters
      const chars = heading.querySelectorAll(".char");

      if (!chars.length) {
        console.error(`No characters found in heading ${index + 1}`);
        return;
      }

      // Randomize characters for animation order
      const randomChars = [...chars].sort(() => Math.random() - 0.5);

      // Create individual text animation timeline
      const textTl = gsap.timeline({
        onStart: () => {},
      });

      // Animate each character with fade in
      randomChars.forEach((char, charIndex) => {
        textTl.to(
          char,
          {
            opacity: 1,
            duration: ANIMATION.hero.text.letterDuration,
            ease: ANIMATION.hero.text.ease,
          },
          charIndex * ANIMATION.hero.text.letterDuration,
        );
      });

      // Add to main timeline with stagger after corresponding swoosh
      tl.add(textTl, index * ANIMATION.hero.text.staggerDelay);
    });

    return tl;
  }

  function playTextFadeAnimations() {
    const headings = document.querySelectorAll(selectors.hero.headings);

    if (!headings.length) {
      console.error("No headings found");
      return gsap.timeline();
    }

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    // Set initial state for all headings
    gsap.set(headings, {
      translateX: ANIMATION.hero.fade.initialPosition,
      opacity: ANIMATION.hero.fade.initialOpacity,
    });

    // Animate each heading with stagger
    headings.forEach((heading, index) => {
      // Create individual fade animation
      const fadeTl = gsap.timeline();

      fadeTl.to(heading, {
        translateX: ANIMATION.hero.fade.finalPosition,
        opacity: ANIMATION.hero.fade.finalOpacity,
        duration: ANIMATION.hero.fade.duration,
        ease: ANIMATION.hero.fade.ease,
        onStart: () => {},
      });

      // Add to main timeline with stagger
      tl.add(fadeTl, index * ANIMATION.hero.fade.staggerDelay);
    });

    return tl;
  }

  // Create master timeline
  const masterTimeline = gsap.timeline();

  masterTimeline.add(createShaderAnimation(), 0);
  masterTimeline.add(
    playSwooshAnimations(),
    ANIMATION.hero.swoosh.initialDelay,
  );
  masterTimeline.add(
    playTextFadeAnimations(),
    ANIMATION.hero.fade.initialDelay,
  );

  // masterTimeline.add(playTextScrambleAnimations(), ANIMATION.hero.text.initialDelay);

  masterTimeline.play();
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
      onStart: () => {},
      onComplete: () => {},
      onUpdate: () => {},
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
        onStart: () => {},
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
        onStart: () => {},
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
      speed: -0.6,
      ease: "none",
    },
    p2: {
      speed: -0.8,
      ease: "none",
    },
    s1: {
      speed: -1,
      ease: "none",
    },
    s2: {
      speed: -0.8,
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
    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: elements.wrapper,
        start: "top bottom",
        end: "bottom top",
        scrub: config.animation.scrub,
        onEnter: () => {},
        onLeave: () => {},
        onEnterBack: () => {},
        onLeaveBack: () => {},
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
  }

  // Initialize
  initMarqueeAnimation();
});

//GSAP for Graphene Flow
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const config = {
    selectors: {
      chapter: {
        container: '[data-sq-list="trigger"]',
        items: '[data-sq-index][data-sq-item="trigger"]',
      },
      video: {
        container: '[data-sq-list="video"]',
        items: '[data-sq-index][data-sq-item="video"]',
      },
      orb: {
        container: '[data-sq-list="trigger"]',
        items: '[data-sq-index][data-sq-item="orb"]',
      },
    },
    animation: {
      duration: 0.75,
      ease: "power2.inOut",
    },
  };

  // Initializers
  function initChapterVideoAnimation() {
    // Check if GSAP and ScrollTrigger are available
    if (!window.gsap) {
      console.error("GSAP not found. Please ensure it is loaded.");
      return;
    }

    // Register ScrollTrigger plugin
    if (!window.ScrollTrigger) {
      console.error(
        "ScrollTrigger plugin not found. Please ensure it is loaded.",
      );
      return;
    }

    // Register the ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Get DOM elements
    const chapterItems = document.querySelectorAll(
      `${config.selectors.chapter.container} ${config.selectors.chapter.items}`,
    );
    const videoItems = document.querySelectorAll(
      `${config.selectors.video.container} ${config.selectors.video.items}`,
    );
    const orbItems = document.querySelectorAll(
      `${config.selectors.orb.container} ${config.selectors.orb.items}`,
    );

    // Validate DOM elements
    if (!chapterItems.length || !videoItems.length || !orbItems.length) {
      console.error(
        "Required DOM elements not found for chapter video animation",
      );
      return;
    }

    // Initialize videos and orbs (set all except first to opacity 0)
    initVideoStates(videoItems);
    initVideoStates(orbItems);

    // Set up scroll triggers for each chapter
    createChapterScrollTriggers(chapterItems, videoItems, orbItems);
  }

  function initVideoStates(items) {
    gsap.set(items, { opacity: 0 });
    gsap.set(items[0], { opacity: 1 });
  }

  // Animation creators
  function createChapterScrollTriggers(chapterItems, videoItems, orbItems) {
    const lastIndex = chapterItems.length;

    chapterItems.forEach((chapter, idx) => {
      // Convert to 1-based index to match data-sq-index
      const currentIndex = idx + 1;

      // For scrolling down - use onEnter
      ScrollTrigger.create({
        trigger: chapter,
        start: "top center",
        onEnter: () => {
          handleChapterEnter(currentIndex, lastIndex, videoItems);
          handleChapterEnter(currentIndex, lastIndex, orbItems);
        },
        markers: false,
        id: `chapter-${currentIndex}-enter`,
      });

      // For scrolling up - use onLeave on the next chapter if it exists
      if (currentIndex < lastIndex) {
        ScrollTrigger.create({
          trigger: chapterItems[idx + 1], // Next chapter
          start: "top bottom",
          onLeaveBack: () => {
            handleChapterLeaveBack(currentIndex + 1, lastIndex, videoItems);
            handleChapterLeaveBack(currentIndex + 1, lastIndex, orbItems);
          },
          markers: false,
          id: `chapter-${currentIndex + 1}-leave`,
        });
      }
    });
  }

  function handleChapterEnter(currentIndex, lastIndex, items) {
    // Skip animation for first chapter (already visible)
    if (currentIndex === 1) {
      return;
    }

    // Create and play transition animation
    const timeline = createVideoTransitionTimeline(
      items[currentIndex - 2], // Previous item (currentIndex-1)-1 due to 0-based array
      items[currentIndex - 1], // Current item (currentIndex-1) due to 0-based array
    );

    timeline.play();
  }

  function handleChapterLeaveBack(currentIndex, lastIndex, items) {
    // Skip animation for first chapter
    if (currentIndex <= 1) {
      return;
    }

    // Create and play transition animation (reverse direction)
    const timeline = createVideoTransitionTimeline(
      items[currentIndex - 1], // Current item
      items[currentIndex - 2], // Previous item
    );

    timeline.play();
  }

  function createVideoTransitionTimeline(fadeOutItem, fadeInItem) {
    // Get indices for logging (add 1 to convert from 0-based to 1-based)
    const fadeOutIndex =
      Array.from(fadeOutItem.parentNode.children).indexOf(fadeOutItem) + 1;
    const fadeInIndex =
      Array.from(fadeInItem.parentNode.children).indexOf(fadeInItem) + 1;

    const tl = gsap.timeline({
      onStart: () => {},
      onComplete: () => {},
    });

    tl.to(fadeOutItem, {
      opacity: 0,
      duration: config.animation.duration / 2,
      ease: config.animation.ease,
      onStart: () => {},
    });

    tl.to(
      fadeInItem,
      {
        opacity: 1,
        duration: config.animation.duration / 2,
        ease: config.animation.ease,
        onStart: () => {},
      },
      `-=${config.animation.duration / 4}`,
    ); // Slight overlap for smoother transition

    return tl;
  }

  // Initialize animation
  initChapterVideoAnimation();
});

//GSAP for Graphene Cursor
document.addEventListener("DOMContentLoaded", () => {
  // Animation Constants
  const ANIMATION = {
    cursor: {
      // Tracking settings
      duration: 0.6, // Animation duration
      ease: "power3", // Easing function
      fadeInDelay: 0.3, // Delay before fading in
      fadeInDuration: 0.8, // Duration for fade in

      // Pulsating effect
      pulseDuration: 2, // Duration of one pulse cycle
      pulseMinScale: 0.95, // Min scale during pulse
      pulseMaxScale: 1.05, // Max scale during pulse
      pulseMinOpacity: 0.85, // Min opacity during pulse
      pulseMaxOpacity: 1, // Max opacity during pulse
      pulseEase: "sine.inOut", // Smooth sine wave for pulsating
    },
  };

  // Selectors
  const selectors = {
    cursor: {
      wrap: "[data-cursor-wrap]",
      orb: "[data-cursor-orb]",
    },
  };

  // Initialize cursor tracking
  function initCursorTracking() {
    const cursorWrap = document.querySelector(selectors.cursor.wrap);
    const cursorOrb = document.querySelector(selectors.cursor.orb);

    if (!cursorWrap || !cursorOrb) {
      console.error("Cursor elements not found");
      return;
    }

    // Set initial state - hide cursor wrap
    gsap.set(cursorWrap, {
      opacity: 0,
    });

    // Center alignment for the orb
    gsap.set(cursorOrb, {
      xPercent: -50,
      yPercent: -50,
    });

    // Create optimized animation functions using quickTo for the orb
    const xTo = gsap.quickTo(cursorOrb, "x", {
      duration: ANIMATION.cursor.duration,
      ease: ANIMATION.cursor.ease,
    });

    const yTo = gsap.quickTo(cursorOrb, "y", {
      duration: ANIMATION.cursor.duration,
      ease: ANIMATION.cursor.ease,
    });

    // Get initial cursor position (center of screen if not available)
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;

    // Position orb at initial position immediately
    xTo(initialX);
    yTo(initialY);

    // Add mouse tracking
    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    // Fade in cursor wrap after a short delay
    gsap.to(cursorWrap, {
      opacity: 1,
      duration: ANIMATION.cursor.fadeInDuration,
      delay: ANIMATION.cursor.fadeInDelay,
      ease: "power2.out",
    });

    // Create pulsating animation for the orb
    createCursorPulseAnimation(cursorOrb);
  }

  // Create the pulsating animation
  function createCursorPulseAnimation(cursorElement) {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });

    tl.to(cursorElement, {
      scale: ANIMATION.cursor.pulseMaxScale,
      opacity: ANIMATION.cursor.pulseMaxOpacity,
      duration: ANIMATION.cursor.pulseDuration / 2,
      ease: ANIMATION.cursor.pulseEase,
    }).to(cursorElement, {
      scale: ANIMATION.cursor.pulseMinScale,
      opacity: ANIMATION.cursor.pulseMinOpacity,
      duration: ANIMATION.cursor.pulseDuration / 2,
      ease: ANIMATION.cursor.pulseEase,
    });

    return tl;
  }

  // Initialize the animations
  initCursorTracking();
});

//GSAP for Headings
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }
    document.querySelectorAll("h1, h2, p").forEach((element) => {
      if (element.getAttribute("data-motion-state") !== "blocked") {
        element.setAttribute("data-motion-text", "");
      }
    });
  }, 0);
});
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, starting text animation setup");

  // Helper function to check if element is above the fold
  function isAboveFold(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    console.log("Element position check:", {
      elementTop: rect.top,
      elementBottom: rect.bottom,
      windowHeight: windowHeight,
      isVisible: rect.top < windowHeight && rect.bottom > 0,
    });
    return rect.top < windowHeight && rect.bottom > 0;
  }

  setTimeout(() => {
    if (
      typeof gsap === "undefined" ||
      typeof SplitType === "undefined" ||
      typeof ScrollTrigger === "undefined"
    ) {
      console.error(
        "Required libraries (GSAP, SplitType, or ScrollTrigger) are not loaded",
      );
      return;
    }

    console.log("Libraries loaded successfully, registering ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    console.log("Initializing SplitType for text elements");
    const splitLines = new SplitType("[data-motion-text]", {
      types: "lines",
      tagName: "span",
    });

    console.log("Creating line wrappers");
    document
      .querySelectorAll("[data-motion-text] .line")
      .forEach((line, index) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("u-line-mask");
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
        console.log(`Created wrapper for line ${index + 1}`);
      });

    const textElements = document.querySelectorAll("[data-motion-text]");
    console.log(`Found ${textElements.length} text elements to animate`);

    textElements.forEach((element, index) => {
      console.log(`Processing text element ${index + 1}`);

      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      console.log(`Text element ${index + 1} delay: ${delay} seconds`);

      const tl = gsap.timeline({
        paused: true,
        onStart: () =>
          console.log(`Animation starting for text element ${index + 1}`),
        onComplete: () =>
          console.log(`Animation complete for text element ${index + 1}`),
      });

      tl.from(element.querySelectorAll(".line"), {
        y: "0%",
        opacity: 0,
        duration: 0.8,
        ease: "power1.out",
        stagger: 0.3,
      });

      // Check if element is above the fold
      const isAbove = isAboveFold(element);
      console.log(`Text element ${index + 1} is above fold: ${isAbove}`);

      if (isAbove) {
        console.log(
          `Text element ${index + 1} - Setting up DOM load animation with ${delay}s delay`,
        );
        // For above-fold elements, play with delay after DOM load
        setTimeout(() => {
          console.log(
            `Playing animation for above-fold text element ${index + 1}`,
          );
          tl.play();
        }, delay * 1000);
      } else {
        console.log(`Text element ${index + 1} - Setting up ScrollTrigger`);
        // For below-fold elements, use ScrollTrigger
        ScrollTrigger.create({
          trigger: element,
          start: "top 90%",
          markers: false,
          once: true,
          onEnter: () => {
            console.log(
              `ScrollTrigger fired for text element ${index + 1}, playing immediately`,
            );
            tl.play(); // No delay for below-fold elements
          },
        });
        console.log(`ScrollTrigger created for text element ${index + 1}`);
      }
    });

    function splitRevert() {
      console.log("Reverting SplitType text elements");
      document.querySelectorAll("[data-motion-text] .line").forEach((line) => {
        const wrapper = line.parentNode;
        wrapper.replaceWith(...wrapper.childNodes);
      });
      splitLines.revert();
    }

    gsap.set("[data-motion-text]", { opacity: 1 });
    console.log("Text elements opacity set to 1");
  }, 0);
});

//GSAP for Arrays
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, starting GSAP array animation setup");

  // Helper function to check if element is above the fold
  function isAboveFold(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    console.log("Element position check:", {
      elementTop: rect.top,
      elementBottom: rect.bottom,
      windowHeight: windowHeight,
      isVisible: rect.top < windowHeight && rect.bottom > 0,
    });
    return rect.top < windowHeight && rect.bottom > 0;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  console.log("GSAP and ScrollTrigger loaded successfully");
  gsap.registerPlugin(ScrollTrigger);

  setTimeout(() => {
    console.log("Starting animation setup after 200ms delay");

    const cardContainers = document.querySelectorAll(
      '[data-motion-element="array"]',
    );

    console.log(
      `Found ${cardContainers.length} containers with data-motion-element="array"`,
    );

    if (!cardContainers || cardContainers.length === 0) {
      console.error('Could not find elements with data-motion-element="array"');
      return;
    }

    cardContainers.forEach((container, containerIndex) => {
      console.log(`Processing container ${containerIndex + 1}`);

      try {
        const delay = container.getAttribute("data-motion-delay")
          ? parseFloat(container.getAttribute("data-motion-delay"))
          : 0;

        console.log(`Container ${containerIndex + 1} delay: ${delay} seconds`);

        const cardElements = Array.from(container.children);

        console.log(
          `Container ${containerIndex + 1} has ${cardElements.length} child elements`,
        );

        if (!cardElements || cardElements.length === 0) {
          console.error(
            `Container ${containerIndex + 1} has no child elements`,
          );
          return;
        }

        // Set initial state
        gsap.set(cardElements, {
          opacity: 0,
          y: 0,
        });
        console.log(
          `Set initial state for container ${containerIndex + 1} children`,
        );

        // Create timeline
        const tl = gsap.timeline({
          paused: true,
        });

        tl.to(cardElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.3,
          ease: "power2.out",
        });

        console.log(`Created timeline for container ${containerIndex + 1}`);

        // Check if element is above the fold
        const isAbove = isAboveFold(container);
        console.log(
          `Container ${containerIndex + 1} is above fold: ${isAbove}`,
        );

        if (isAbove) {
          console.log(
            `Container ${containerIndex + 1} - Setting up DOM load animation with ${delay}s delay`,
          );
          // For above-fold elements, wait delay seconds after DOM load
          setTimeout(() => {
            console.log(
              `Playing animation for above-fold container ${containerIndex + 1}`,
            );
            tl.play(0);
          }, delay * 1000);
        } else {
          console.log(
            `Container ${containerIndex + 1} - Setting up ScrollTrigger (no delay)`,
          );
          // For below-fold elements, use ScrollTrigger with NO DELAY
          ScrollTrigger.create({
            trigger: container,
            start: "top 95%",
            markers: false,
            once: true,
            onEnter: () => {
              console.log(
                `ScrollTrigger fired for container ${containerIndex + 1}, playing immediately`,
              );
              tl.play(0); // No delay here!
            },
          });
          console.log(
            `ScrollTrigger created for container ${containerIndex + 1}`,
          );
        }
      } catch (error) {
        console.error(
          `Error in card animation setup for container ${containerIndex + 1}:`,
          error,
        );
      }
    });

    console.log("Finished processing all containers");
  }, 200);
});

//GSAP for Single Elements
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, starting GSAP single element animation setup");

  // Helper function to check if element is above the fold
  function isAboveFold(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    console.log("Element position check:", {
      elementTop: rect.top,
      elementBottom: rect.bottom,
      windowHeight: windowHeight,
      isVisible: rect.top < windowHeight && rect.bottom > 0,
    });
    return rect.top < windowHeight && rect.bottom > 0;
  }

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("Required libraries (GSAP or ScrollTrigger) are not loaded");
    return;
  }

  console.log("GSAP and ScrollTrigger loaded successfully");
  gsap.registerPlugin(ScrollTrigger);

  const singleElements = document.querySelectorAll(
    '[data-motion-element="single"]',
  );

  console.log(
    `Found ${singleElements.length} elements with data-motion-element="single"`,
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

  console.log(
    `${animatableElements.length} elements are animatable (not blocked)`,
  );

  animatableElements.forEach((element, index) => {
    try {
      console.log(`Processing element ${index + 1}`);

      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      console.log(`Element ${index + 1} delay: ${delay} seconds`);

      // Set initial state
      gsap.set(element, {
        opacity: 0,
        y: 0,
      });
      console.log(`Set initial state for element ${index + 1}`);

      // Create timeline
      const tl = gsap.timeline({
        paused: true,
      });

      tl.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      console.log(`Created timeline for element ${index + 1}`);

      // Check if element is above the fold
      const isAbove = isAboveFold(element);
      console.log(`Element ${index + 1} is above fold: ${isAbove}`);

      if (isAbove) {
        console.log(
          `Element ${index + 1} - Setting up DOM load animation with ${delay}s delay`,
        );
        // For above-fold elements, wait delay seconds after DOM load
        setTimeout(() => {
          console.log(`Playing animation for above-fold element ${index + 1}`);
          tl.play(0);
        }, delay * 1000);
      } else {
        console.log(
          `Element ${index + 1} - Setting up ScrollTrigger (no delay)`,
        );
        // For below-fold elements, use ScrollTrigger with NO DELAY
        ScrollTrigger.create({
          trigger: element,
          start: "top 95%",
          markers: false,
          once: true,
          onEnter: () => {
            console.log(
              `ScrollTrigger fired for element ${index + 1}, playing immediately`,
            );
            tl.play(0); // No delay here!
          },
        });
        console.log(`ScrollTrigger created for element ${index + 1}`);
      }
    } catch (error) {
      console.error(
        `Error in animation setup for element ${index + 1}:`,
        error,
      );
    }
  });

  console.log("Finished processing all single elements");
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

//GSAP for Ticker
document.addEventListener("DOMContentLoaded", () => {
  console.log("Ticker animation initializing");

  const isMobile = window.innerWidth <= 991;

  if (!isMobile) {
    console.log("Not mobile, ticker animation aborted");
    return;
  }

  const tickerWrap = document.querySelector("[data-ticker-wrap]");
  const tickerItem = document.querySelector("[data-ticker-item]");

  if (!tickerWrap || !tickerItem) {
    console.warn("Ticker elements not found");
    return;
  }

  console.log("Found ticker elements");
  const originalContent = tickerItem.outerHTML;

  function calculateRequiredCopies() {
    const viewportWidth = window.innerWidth;
    const itemWidth = tickerItem.offsetWidth;
    // Create a sequence 5 times the viewport width
    const copiesNeeded = Math.ceil((viewportWidth * 5) / itemWidth) + 2;

    console.log(
      `Viewport width: ${viewportWidth}, Item width: ${itemWidth}, Copies needed: ${copiesNeeded}`,
    );

    return {
      viewportWidth,
      itemWidth,
      copiesNeeded,
    };
  }

  function setupTicker() {
    if (!isMobile) {
      console.log("Not mobile, ticker setup aborted");
      return;
    }

    console.log("Setting up ticker");
    const { copiesNeeded, itemWidth } = calculateRequiredCopies();

    tickerWrap.innerHTML = "";

    for (let i = 0; i < copiesNeeded; i++) {
      const clone = document.createElement("div");
      clone.innerHTML = originalContent;
      const clonedItem = clone.firstElementChild;
      tickerWrap.appendChild(clonedItem);
    }

    // Total width of the sequence
    const totalWidth = itemWidth * copiesNeeded;
    console.log(`Total ticker width: ${totalWidth}px`);

    gsap.to(tickerWrap, {
      x: -totalWidth + itemWidth, // Subtract one item width to ensure smooth loop
      duration: totalWidth / 100, // Increased speed by reducing duration divisor from 25 to 100
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(tickerWrap, { x: 0 });
      },
    });

    console.log("Ticker animation started");
  }

  // Initialize the ticker
  setupTicker();

  // Optional: Reinitialize on window resize to adjust for new viewport size
  window.addEventListener("resize", () => {
    const newIsMobile = window.innerWidth <= 991;
    if (newIsMobile) {
      console.log("Window resized, reinitializing ticker");
      setupTicker();
    }
  });
});
