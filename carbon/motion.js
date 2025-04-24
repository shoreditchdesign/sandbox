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

console.log("home sequence deployed");
// GSAP Chapter Scroll Sequence
document.addEventListener("DOMContentLoaded", () => {
  // Animation Constants
  const ANIMATION = {
    duration: 0.5,
    ease: "power2.out",
    entryPoints: {
      title: 0,
      heading: 0.1,
      text: 0.2,
      image: 0.3,
    },
    exitPoint: 0.8,
    stagger: 0.1,
  };

  // Selectors
  const selectors = {
    chapters: '[data-ft-seq="chapter"]',
    titles: '[data-ft-seq="title"]',
    headings: '[data-ft-seq="heading"]',
    texts: '[data-ft-seq="text"]',
    images: '[data-ft-seq="image"]',
    triggers: '[data-ft-seq="trigger"]',
    byIndex: (seq, index) =>
      `[data-ft-seq="${seq}"][data-seq-index="${index}"]`,
  };

  // Check GSAP and ScrollTrigger availability
  if (typeof gsap === "undefined") {
    console.error("GSAP library not loaded");
    return;
  }

  if (!gsap.plugins || !gsap.plugins.ScrollTrigger) {
    console.error("ScrollTrigger plugin not loaded");
    return;
  }

  console.log("GSAP and ScrollTrigger loaded successfully");

  // Verify DOM elements exist
  const chapters = document.querySelectorAll(selectors.chapters);
  const triggers = document.querySelectorAll(selectors.triggers);

  if (chapters.length === 0) {
    console.error("No chapter elements found");
    return;
  }

  if (triggers.length === 0) {
    console.error("No trigger elements found");
    return;
  }

  console.log(
    `Found ${chapters.length} chapters and ${triggers.length} triggers`,
  );

  // Animation Functions
  const createFadeIn = (element, startPoint) => {
    return gsap.fromTo(
      element,
      { opacity: 0 },
      {
        opacity: 1,
        duration: ANIMATION.duration,
        ease: ANIMATION.ease,
        onStart: () =>
          console.log(
            `Fade in started for: ${element.getAttribute("data-ft-seq")}`,
          ),
      },
    );
  };

  const createFadeOut = (element) => {
    return gsap.to(element, {
      opacity: 0,
      duration: ANIMATION.duration,
      ease: ANIMATION.ease,
      onStart: () =>
        console.log(
          `Fade out started for: ${element.getAttribute("data-ft-seq")}`,
        ),
    });
  };

  // Create Chapter Timelines
  const createChapterTimeline = (index) => {
    const timeline = gsap.timeline();

    const title = document.querySelector(selectors.byIndex("title", index));
    const heading = document.querySelector(selectors.byIndex("heading", index));
    const text = document.querySelector(selectors.byIndex("text", index));
    const image = document.querySelector(selectors.byIndex("image", index));

    // Check each element individually and log if missing
    if (!title) {
      console.error(`Chapter ${index}: Title element not found`);
    }
    if (!heading) {
      console.error(`Chapter ${index}: Heading element not found`);
    }
    if (!text) {
      console.error(`Chapter ${index}: Text element not found`);
    }
    if (!image) {
      console.error(`Chapter ${index}: Image element not found`);
    }

    if (!title && !heading && !text && !image) {
      console.error(`Chapter ${index}: All elements missing, skipping chapter`);
      return timeline;
    }

    // Set initial states for found elements
    const foundElements = [title, heading, text, image].filter(Boolean);
    gsap.set(foundElements, { opacity: 0 });

    // Add cascading animations to timeline
    if (title) timeline.add(createFadeIn(title), 0);
    if (heading) timeline.add(createFadeIn(heading), ANIMATION.stagger);
    if (text) timeline.add(createFadeIn(text), ANIMATION.stagger * 2);
    if (image) timeline.add(createFadeIn(image), ANIMATION.stagger * 3);

    console.log(
      `Created timeline for chapter ${index} with ${timeline.getChildren().length} animations`,
    );

    return timeline;
  };

  // Create Master Timeline with ScrollTrigger
  const initScrollSequence = () => {
    const masterTimeline = gsap.timeline();

    triggers.forEach((trigger, i) => {
      const index = i + 1; // Assuming indexes start at 1
      console.log(`Processing trigger for chapter ${index}`);

      const chapterTimeline = createChapterTimeline(index);

      // Find all elements for this chapter
      const titleEl = document.querySelector(selectors.byIndex("title", index));
      const headingEl = document.querySelector(
        selectors.byIndex("heading", index),
      );
      const textEl = document.querySelector(selectors.byIndex("text", index));
      const imageEl = document.querySelector(selectors.byIndex("image", index));

      const chapterElements = [titleEl, headingEl, textEl, imageEl].filter(
        Boolean,
      );

      if (chapterElements.length === 0) {
        console.error(`Chapter ${index}: No elements found, skipping trigger`);
        return;
      }

      // Exit animations for previous chapter
      if (index > 1) {
        const prevIndex = index - 1;
        const prevTitleEl = document.querySelector(
          selectors.byIndex("title", prevIndex),
        );
        const prevHeadingEl = document.querySelector(
          selectors.byIndex("heading", prevIndex),
        );
        const prevTextEl = document.querySelector(
          selectors.byIndex("text", prevIndex),
        );
        const prevImageEl = document.querySelector(
          selectors.byIndex("image", prevIndex),
        );

        const prevElements = [
          prevTitleEl,
          prevHeadingEl,
          prevTextEl,
          prevImageEl,
        ].filter(Boolean);

        if (prevElements.length === 0) {
          console.warn(
            `Chapter ${prevIndex}: No elements found for exit animations`,
          );
        } else {
          prevElements.forEach((el) => {
            masterTimeline.add(createFadeOut(el), ANIMATION.exitPoint);
          });
        }
      }

      // Create ScrollTrigger for this chapter
      try {
        gsap.ScrollTrigger.create({
          trigger: trigger,
          start: "top center",
          end: "bottom center",
          animation: chapterTimeline,
          toggleActions: "play none none reverse",
          onEnter: () => console.log(`Chapter ${index} entered`),
          onLeave: () => console.log(`Chapter ${index} left`),
          onEnterBack: () =>
            console.log(`Chapter ${index} entered from bottom`),
          onLeaveBack: () => console.log(`Chapter ${index} left from bottom`),
          markers: false,
          id: `chapter-${index}`,
        });

        console.log(
          `ScrollTrigger created for chapter ${index} with trigger:`,
          trigger,
        );
      } catch (error) {
        console.error(
          `Error creating ScrollTrigger for chapter ${index}:`,
          error,
        );
      }
    });

    return masterTimeline;
  };

  // Set initial states - first chapter visible, others hidden
  const initializeStates = () => {
    // Hide all elements first
    document
      .querySelectorAll(
        '[data-ft-seq="title"], [data-ft-seq="heading"], [data-ft-seq="text"], [data-ft-seq="image"]',
      )
      .forEach((el) => gsap.set(el, { opacity: 0 }));

    // Show first chapter elements
    const firstChapterElements = [
      document.querySelector(selectors.byIndex("title", 1)),
      document.querySelector(selectors.byIndex("heading", 1)),
      document.querySelector(selectors.byIndex("text", 1)),
      document.querySelector(selectors.byIndex("image", 1)),
    ].filter(Boolean);

    firstChapterElements.forEach((el) => gsap.set(el, { opacity: 1 }));
    console.log("Initial states set - first chapter visible");
  };

  // Initialize everything
  initializeStates();
  const scrollSequence = initScrollSequence();
  console.log("Scroll sequence initialized");
});

console.log("home sequence done");

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

//GSAP tp Slide Down
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
