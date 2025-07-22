//GSAP for Tuck
document.addEventListener("DOMContentLoaded", () => {
  const navbars = document.querySelectorAll(
    '[data-nav-element="navbar"]:not([data-tuck-block="blocked"])',
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
      });
    } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
      showAnim.play();
      navbarVisible = true;
      accumulatedScroll = 0;

      // Set attribute to hidden when showing navbar (play animation)
      navbars.forEach((navbar) => {
        navbar.setAttribute("data-tuck-state", "hidden");
      });
    }
    lastScrollTop = scrollTop;
  });
});

//GSAP for Image Sequence
document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const config = {
    selectors: {
      chapter: {
        container: '[data-sq-list="trigger"]',
        items: '[data-sq-index][data-sq-item="trigger"]',
      },
      image: {
        container: '[data-sq-list="image"]',
        items: '[data-sq-index][data-sq-item="image"]',
      },
    },
    animation: {
      duration: 0.75,
      ease: "power2.inOut",
    },
  };

  // Initializers
  function initChapterAnimations() {
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
    const imageItems = document.querySelectorAll(
      `${config.selectors.image.container} ${config.selectors.image.items}`,
    );

    // Validate DOM elements
    if (!chapterItems.length || !imageItems.length) {
      console.warn("Image sequence not found");
      return;
    }

    // Initialize images
    initImageStates(imageItems);

    // Set up scroll triggers for chapters
    createImageScrollTriggers(chapterItems, imageItems);
  }

  function initImageStates(items) {
    // On mobile, show all images
    if (window.innerWidth <= 991) {
      gsap.set(items, { opacity: 1 });
      return;
    }

    gsap.set(items, { opacity: 0 });
    gsap.set(items[0], { opacity: 1 }); // First image visible
  }

  function createImageScrollTriggers(chapterItems, imageItems) {
    if (window.innerWidth <= 991) {
      return;
    }

    const lastIndex = chapterItems.length;

    chapterItems.forEach((chapter, idx) => {
      // Convert to 1-based index to match data-sq-index
      const currentIndex = idx + 1;

      // For scrolling down - use onEnter
      ScrollTrigger.create({
        trigger: chapter,
        start: "top center",
        onEnter: () => {
          handleItemEnter(currentIndex, lastIndex, imageItems);
        },
        markers: false,
        id: `chapter-${currentIndex}-image-enter`,
      });

      // For scrolling up - use onLeave on the next chapter if it exists
      if (currentIndex < lastIndex) {
        ScrollTrigger.create({
          trigger: chapterItems[idx + 1], // Next chapter
          start: "top bottom",
          onLeaveBack: () => {
            handleItemLeaveBack(currentIndex + 1, lastIndex, imageItems);
          },
          markers: false,
          id: `chapter-${currentIndex + 1}-image-leave`,
        });
      }
    });
  }

  function handleItemEnter(currentIndex, lastIndex, items) {
    // Create and play transition animation
    const timeline = createTransitionTimeline(
      items[currentIndex - 2], // Previous item (currentIndex-1)-1 due to 0-based array
      items[currentIndex - 1], // Current item (currentIndex-1) due to 0-based array
    );

    timeline.play();
  }

  function handleItemLeaveBack(currentIndex, lastIndex, items) {
    // Skip animation for first chapter
    if (currentIndex <= 1) {
      return;
    }

    // Create and play transition animation (reverse direction)
    const timeline = createTransitionTimeline(
      items[currentIndex - 1], // Current item
      items[currentIndex - 2], // Previous item
    );

    timeline.play();
  }

  function createTransitionTimeline(fadeOutItem, fadeInItem) {
    const tl = gsap.timeline();

    tl.to(fadeOutItem, {
      opacity: 0,
      duration: config.animation.duration / 2,
      ease: config.animation.ease,
    });

    tl.to(
      fadeInItem,
      {
        opacity: 1,
        duration: config.animation.duration / 2,
        ease: config.animation.ease,
      },
      `-=${config.animation.duration / 4}`,
    ); // Slight overlap for smoother transition

    return tl;
  }

  // Initialize animation
  initChapterAnimations();

  // Cleanup function for SPA environments
  function cleanup() {
    ScrollTrigger.killAll();
  }

  // Expose cleanup for external use if needed
  window.imageSequenceCleanup = cleanup;
});

//GSAP for Text Reveal
document.addEventListener("DOMContentLoaded", function () {
  // Debug: Check what's actually available
  console.log("GSAP available:", typeof gsap !== "undefined");
  console.log("ScrollTrigger available:", typeof ScrollTrigger !== "undefined");
  console.log("SplitText available:", typeof SplitText !== "undefined");

  // More detailed check
  if (typeof gsap !== "undefined") {
    console.log("GSAP version:", gsap.version);
  }
  if (typeof ScrollTrigger !== "undefined") {
    console.log("ScrollTrigger loaded");
  }
  if (typeof SplitText !== "undefined") {
    console.log("SplitText loaded");
  } else {
    console.error(
      "SplitText is NOT available - this might still be a premium plugin",
    );
  }

  // Make sure GSAP and plugins are loaded
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    typeof SplitText === "undefined"
  ) {
    console.error(
      "Required libraries (GSAP, ScrollTrigger, or SplitText) are not loaded",
    );
    return;
  }

  // Register ScrollTrigger and SplitText plugins with GSAP
  gsap.registerPlugin(ScrollTrigger, SplitText);

  console.log("GSAP SplitText animation initializing...");

  // Wait a moment to ensure the DOM is fully processed
  setTimeout(() => {
    // Target elements with data-motion-text="reveal" attribute
    const textElements = document.querySelectorAll("[data-motion-reveal]");

    // Debug: Check if elements exist
    if (!textElements || textElements.length === 0) {
      console.error("Could not find elements with data-motion-reveal");
      return;
    }

    console.log(`Found ${textElements.length} text elements to animate`);

    // Process each element
    textElements.forEach((textElement, elementIndex) => {
      try {
        console.log(`Processing element ${elementIndex + 1}:`, textElement);

        // Initialize GSAP SplitText to split the text into words
        const splitText = new SplitText(textElement, {
          type: "words",
          wordsClass: "split-word",
        });

        // Debug: Check if words were created
        if (!splitText.words || splitText.words.length === 0) {
          console.error(
            "SplitText did not create any word elements for",
            textElement,
          );
          return;
        }

        console.log(`Split into ${splitText.words.length} words`);

        // Set initial state of all words - maintaining the 0.5 opacity
        gsap.set(splitText.words, {
          opacity: 0.5, // Match the CSS opacity
          y: "0px",
          ease: "power2.out",
        });

        // Set parent back to full opacity since children now have the opacity
        gsap.set(textElement, {
          opacity: 1,
        });

        // Get start and end values from data attributes or use defaults
        const startValue =
          textElement.getAttribute("data-motion-start") || "80";
        const endValue = textElement.getAttribute("data-motion-end") || "5";
        const startTrigger = `top ${startValue}%`;
        const endTrigger = `bottom ${endValue}%`;

        console.log(
          `Setting scroll trigger with start: ${startTrigger}, end: ${endTrigger}`,
        );

        // Create the scroll-triggered animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: textElement,
            start: startTrigger,
            end: endTrigger,
            scrub: 0.5,
            markers: false,
            onUpdate: (self) => {
              console.log(
                `Element ${elementIndex + 1} scroll progress: ${(self.progress * 100).toFixed(1)}%`,
              );
            },
            onEnter: () => {
              console.log(
                `Element ${elementIndex + 1}: Animation started (entered trigger zone)`,
              );
            },
            onLeave: () => {
              console.log(
                `Element ${elementIndex + 1}: Animation complete (left trigger zone)`,
              );
            },
            onEnterBack: () => {
              console.log(
                `Element ${elementIndex + 1}: Re-entered trigger zone (scrolling up)`,
              );
            },
            onLeaveBack: () => {
              console.log(
                `Element ${elementIndex + 1}: Left trigger zone backwards`,
              );
            },
          },
        });

        // Add the animation to the timeline - animate from 0.5 to 1
        tl.to(splitText.words, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          className: "+=active",
        });

        console.log(`Animation setup complete for element ${elementIndex + 1}`);
      } catch (error) {
        console.error(
          `Error in text animation setup for element ${elementIndex + 1}:`,
          error,
        );
      }
    });
  }, 100);
});

//GSAP for Stacking Cards
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);
  function sequenceInitialiser() {
    if (window.innerWidth <= 768) {
      console.log("Tablet/mobile detected - skipping sequence initialization");
      return;
    }

    console.log("Initializing all sections...");
    const scrollSection = document.querySelectorAll("[data-stack-section]");
    scrollSection.forEach((section) => {
      const wrapper = section.querySelector("[data-stack-wrap]");
      const list = wrapper.querySelector("[data-stack-list]");
      const items = list.querySelectorAll("[data-stack-card]");
      console.log("Initializing section:", section);
      console.log("Found items:", items.length);
      sectionInitialiser(section, items);
    });
  }

  sequenceInitialiser();
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      console.log("Screen resized - reinitializing all ScrollTriggers");
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      sequenceInitialiser();
    }, 250);
  });

  function sectionInitialiser(section, items) {
    console.log("Setting up vertical scroll for", items.length, "items");
    const wrapper = section.querySelector("[data-stack-wrap]");
    const dynamicHeight = `${(items.length + 1) * 100}lvh`;
    wrapper.style.height = dynamicHeight;
    console.log("Set wrapper height to:", dynamicHeight);
    items.forEach((item, index) => {
      if (index !== 0) {
        gsap.set(item, { yPercent: 100 });
        console.log("Set item", index, "to yPercent: 100");
      }
    });
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: "top top",
        end: () => `+=${items.length * 100}%`,
        scrub: 1,
        invalidateOnRefresh: true,
        // markers: true,
      },
      defaults: { ease: "none" },
    });

    items.forEach((item, index) => {
      console.log("Adding animation for item", index);
      if (index < items.length - 1) {
        timeline.to(item, {
          opacity: 0,
          scale: 0.9,
          borderRadius: "10px",
        });
        timeline.to(
          items[index + 1],
          {
            yPercent: 0,
          },
          "<",
        );
      }
    });
  }
});

//GSAP for Headings
document.addEventListener("DOMContentLoaded", () => {
  let viewportChecker;

  function initialiser() {
    viewportChecker = function (element) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      return rect.top < windowHeight && rect.bottom > 0;
    };
    if (
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined" ||
      typeof SplitText === "undefined"
    ) {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Expose global textAnimator
    window.textAnimator = function (element, scrollTriggerOffset = "top 85%") {
      return new Promise((resolve) => {
        document.fonts.ready.then(() => {
          const delay = element.getAttribute("data-motion-delay")
            ? parseFloat(element.getAttribute("data-motion-delay"))
            : 0;

          let split = new SplitText(element, {
            type: "lines",
            autoSplit: true,
            onSplit(self) {
              if (element.hasAttribute("data-motion-hide")) {
                element.removeAttribute("data-motion-hide");
              }

              gsap.set(element, { opacity: 1 });
              gsap.set(self.lines, {
                opacity: 0,
                y: 20,
                filter: "blur(5px)",
              });

              let tl = gsap.timeline({
                paused: true,
              });

              tl.to(self.lines, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.1,
                duration: 0.6,
              });

              const isAbove = viewportChecker(element);

              if (isAbove) {
                setTimeout(() => {
                  tl.play(0);
                }, delay * 1000);
              } else {
                ScrollTrigger.create({
                  trigger: element,
                  start: scrollTriggerOffset,
                  once: true,
                  onEnter: () => {
                    tl.play(0);
                  },
                });
              }

              resolve(tl);
              return tl;
            },
          });
        });
      });
    };
  }

  function selectors() {
    const allH1s = document.querySelectorAll("h1");
    allH1s.forEach((h1) => {
      h1.setAttribute("data-motion-text", "");
    });
  }

  function animator() {
    document.fonts.ready.then(() => {
      const headings = document.querySelectorAll(
        "[data-motion-text]:not([data-motion-block])",
      );
      if (headings.length === 0) {
        return;
      }
      headings.forEach((heading) => {
        window.textAnimator(heading);
      });
    });
  }

  initialiser();
  selectors();
  animator();
});

//GSAP for Arrays
document.addEventListener("DOMContentLoaded", () => {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    window.arrayAnimator = function (
      container,
      scrollTriggerOffset = "top 95%",
    ) {
      const delay = container.getAttribute("data-motion-delay")
        ? parseFloat(container.getAttribute("data-motion-delay"))
        : 0;
      const childElements = Array.from(container.children);
      if (childElements.length === 0) {
        console.warn("Motion for Arrays: Children not found");
        return null;
      }

      if (window.innerWidth <= 991) {
        gsap.set(childElements, {
          opacity: 1,
          y: 0,
        });
        return null;
      }

      gsap.set(childElements, {
        opacity: 0,
        y: 5,
      });
      let tl = gsap.timeline({
        paused: true,
      });
      tl.to(childElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
      ScrollTrigger.create({
        trigger: container,
        start: scrollTriggerOffset,
        once: true,
        markers: true,
        onEnter: () => {
          setTimeout(() => {
            tl.play(0);
          }, delay * 1000);
        },
      });
      return tl;
    };
  }

  function animator() {
    setTimeout(() => {
      const containers = document.querySelectorAll(
        "[data-motion-array]:not([data-motion-block])",
      );
      if (containers.length === 0) {
        console.warn("Motion for Arrays: Array not found");
        return;
      }
      containers.forEach((container) => {
        window.arrayAnimator(container);
      });
    }, 200);
  }
  initialiser();
  animator();
});

//GSAP for Single Elements
document.addEventListener("DOMContentLoaded", () => {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    window.elementAnimator = function (
      element,
      scrollTriggerOffset = "top 95%",
    ) {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      if (window.innerWidth <= 991) {
        gsap.set(element, {
          opacity: 1,
          y: 0,
        });
        return null;
      }

      gsap.set(element, {
        opacity: 0,
        y: 5,
      });
      let tl = gsap.timeline({
        paused: true,
      });
      tl.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isAbove = rect.top < windowHeight && rect.bottom > 0;

      if (isAbove) {
        setTimeout(() => {
          tl.play(0);
        }, delay * 1000);
      } else {
        ScrollTrigger.create({
          trigger: element,
          start: scrollTriggerOffset,
          once: true,
          onEnter: () => {
            tl.play(0);
          },
        });
      }
      return tl;
    };
  }

  function animator() {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        "[data-motion-element]:not([data-motion-block])",
      );
      if (elements.length === 0) {
        console.warn("Motion for Elements: Elements not found");
        return;
      }
      elements.forEach((element) => {
        window.elementAnimator(element);
      });
    }, 200);
  }
  initialiser();
  animator();
});
