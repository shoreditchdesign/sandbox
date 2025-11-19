//GSAP for Navbar Tuck
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

//GSAP to Navbar Slide
document.addEventListener("DOMContentLoaded", () => {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.error(
        "Required libraries (GSAP or ScrollTrigger) are not loaded",
      );
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
  }

  function animator() {
    const slideElements = document.querySelectorAll("[data-motion-slide]");

    if (!slideElements || slideElements.length === 0) {
      console.warn("Motion: Slide elements not found");
      return;
    }

    const animatableElements = Array.from(slideElements).filter((element) => {
      return element.getAttribute("data-motion-slide") !== "blocked";
    });

    animatableElements.forEach((element, index) => {
      try {
        const delay = element.getAttribute("data-motion-delay")
          ? parseFloat(element.getAttribute("data-motion-delay"))
          : 0;

        gsap.set(element, {
          opacity: 1,
          y: "-120%",
        });

        const tl = gsap.timeline({
          paused: true,
        });

        tl.to(element, {
          opacity: 1,
          y: "0%",
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
        console.error(`Motion: Slide animation failed at ${index + 1}:`, error);
      }
    });
  }

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-motion-slide")
          ) {
            trigger.kill();
          }
        });
        animator();
      }, 250);
    });
  }

  initialiser();

  // Wait for stacking cards to initialize before measuring content height
  // This ensures we get accurate measurements after dynamic heights are set
  if (window.innerWidth > 768) {
    window.addEventListener(
      "stackCardsInitialized",
      () => {
        animator();
      },
      { once: true },
    );
  } else {
    // On mobile, no stacking cards, initialize immediately
    animator();
  }

  triggers();
});

//GSAP for Navbar Opacity Toggle
document.addEventListener("DOMContentLoaded", function () {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
  }

  function animator() {
    const navbar = document.querySelector("[data-nav-element='navbar']");
    const heroSection = document.querySelector("[data-section-hero]");

    if (!navbar || !heroSection) {
      console.warn("Navbar or hero section not found");
      return;
    }

    // Check if at top of page and set opacity off
    if (window.scrollY === 0) {
      navbar.setAttribute("data-nav-opacity", "off");
    }

    ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        navbar.setAttribute("data-nav-opacity", "on");
      },
      onLeaveBack: () => {
        navbar.setAttribute("data-nav-opacity", "off");
      },
      markers: false,
    });
  }

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-section-hero")
          ) {
            trigger.kill();
          }
        });
        animator();
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  initialiser();
  animator();
  triggers();
});

//GSAP for Ticker
document.addEventListener("DOMContentLoaded", () => {
  const tickerWrap = document.querySelector("[data-ticker-wrap]");
  const tickerItem = document.querySelector("[data-ticker-item]");

  if (!tickerWrap || !tickerItem) {
    console.warn("Ticker elements not found");
    return;
  }

  const originalContent = tickerItem.outerHTML;
  let currentAnimation = null;
  let resizeTimeout;

  function calculateRequiredCopies() {
    const viewportWidth = window.innerWidth;
    // Get fresh reference to first ticker item
    const firstItem = tickerWrap.querySelector("[data-ticker-item]");

    if (!firstItem) {
      console.warn("Ticker: No item found in wrap");
      return null;
    }

    const itemWidth = firstItem.offsetWidth;

    // Prevent infinite loop if itemWidth is 0
    if (itemWidth <= 0) {
      console.warn("Ticker: Item width is 0, cannot calculate copies");
      return null;
    }

    // Create enough copies to fill viewport plus buffer
    const copiesNeeded = Math.ceil(viewportWidth / itemWidth) + 2;

    return {
      viewportWidth,
      itemWidth,
      copiesNeeded,
    };
  }

  function setupTicker() {
    // Kill existing animation if any
    if (currentAnimation) {
      currentAnimation.kill();
      currentAnimation = null;
    }

    const calculations = calculateRequiredCopies();

    if (!calculations) {
      console.warn("Ticker: Unable to setup, invalid calculations");
      return;
    }

    const { copiesNeeded, itemWidth } = calculations;

    tickerWrap.innerHTML = "";

    for (let i = 0; i < copiesNeeded; i++) {
      const clone = document.createElement("div");
      clone.innerHTML = originalContent;
      const clonedItem = clone.firstElementChild;
      tickerWrap.appendChild(clonedItem);
    }

    // Reset position before starting new animation
    gsap.set(tickerWrap, { x: 0 });

    // Animate by one item width for seamless loop
    currentAnimation = gsap.to(tickerWrap, {
      x: -itemWidth,
      duration: itemWidth / 50,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(tickerWrap, { x: 0 });
      },
    });
  }

  // Resize handler function (so we can remove it if needed)
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setupTicker();
    }, 250); // Debounce resize events
  }

  // Initialize the ticker
  setupTicker();

  // Recalculate on window resize
  window.addEventListener("resize", handleResize);

  // Cleanup function (optional - can be called if ticker needs to be destroyed)
  window.destroyTicker = () => {
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimeout);
    if (currentAnimation) {
      currentAnimation.kill();
      currentAnimation = null;
    }
  };
});

//GSAP for Sticky Headers
document.addEventListener("DOMContentLoaded", () => {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
  }

  function animator() {
    const featuresWrap = document.querySelector("[data-features-wrap]");
    const featuresHeader = document.querySelector("[data-features-header]");

    if (!featuresWrap || !featuresHeader) {
      console.warn("Features wrap or header not found");
      return;
    }

    gsap.set(featuresHeader, { opacity: 1 });

    ScrollTrigger.create({
      trigger: featuresWrap,
      start: "bottom bottom-=32px",
      end: "bottom bottom-=33px",
      onEnter: () => {
        gsap.to(featuresHeader, {
          opacity: 0,
          duration: 0.1,
          ease: "power2.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(featuresHeader, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      },
      markers: false,
    });
  }

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-features-wrap")
          ) {
            trigger.kill();
          }
        });
        animator();
      }, 250);
    });
  }

  initialiser();
  animator();
  triggers();
});

//GSAP for Stacking Cards
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Track initialization state and store references
  let isInitialized = false;
  let stackTriggers = [];
  let stackTimelines = [];

  function desktopInitializer(scrollSections) {
    scrollSections.forEach((section) => {
      const wrapper = section.querySelector("[data-stack-wrap]");
      const list = wrapper?.querySelector("[data-stack-list]");
      const items = list?.querySelectorAll("[data-stack-card]");

      if (wrapper && list && items && items.length > 0) {
        sectionInitialiser(section, wrapper, items);
      }
    });

    isInitialized = true;

    // Refresh ScrollTrigger to ensure all triggers (including progress bar) recalculate
    // This allows progress bar to remeasure now that stacking cards have set their heights
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      // Dispatch custom event to notify other scripts that layout is ready
      window.dispatchEvent(new CustomEvent("stackCardsInitialized"));
    });
  }

  function domSettler(callback) {
    // Force reflow first to ensure DOM has settled
    document.body.offsetHeight;

    // Wait for browser to complete paint cycles
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        callback();
      });
    });
  }

  function sequenceInitialiser() {
    // Prevent overlapping initializations
    if (isInitialized === "initializing") {
      return;
    }

    // Clean up existing animations first
    animationCleaner();

    if (window.innerWidth <= 768) {
      // Mobile/tablet - reset cards to default state
      mobileInitializer();
      isInitialized = false;
      return;
    }

    const scrollSection = document.querySelectorAll("[data-stack-section]");

    if (scrollSection.length === 0) {
      isInitialized = false;
      return;
    }

    // Mark as initializing to prevent race conditions
    isInitialized = "initializing";

    // Force a full reset before desktop init
    mobileInitializer();

    // Wait for browser to complete paint cycle before initializing
    domSettler(() => {
      desktopInitializer(scrollSection);
    });
  }

  function animationCleaner() {
    // Kill all tracked timelines first (includes their ScrollTriggers)
    stackTimelines.forEach((timeline) => {
      if (timeline && timeline.kill) {
        timeline.kill();
      }
    });
    stackTimelines = [];

    // Kill any remaining tracked ScrollTriggers
    stackTriggers.forEach((trigger) => {
      if (trigger && trigger.kill) {
        trigger.kill();
      }
    });
    stackTriggers = [];

    // Safety net: Only kill orphaned stack-section triggers not in our tracking arrays
    // This prevents killing unrelated triggers (like progress bars)
    const allTriggers = ScrollTrigger.getAll();
    allTriggers.forEach((trigger) => {
      if (
        trigger.vars &&
        trigger.vars.trigger &&
        trigger.vars.trigger.hasAttribute &&
        trigger.vars.trigger.hasAttribute("data-stack-section")
      ) {
        // Only kill if not already killed by our tracked arrays
        if (!trigger.killed) {
          trigger.kill();
        }
      }
    });
  }

  function mobileInitializer() {
    const scrollSection = document.querySelectorAll("[data-stack-section]");

    // Batch DOM operations to minimize reflows
    scrollSection.forEach((section) => {
      const wrapper = section.querySelector("[data-stack-wrap]");
      const list = wrapper?.querySelector("[data-stack-list]");
      const items = list?.querySelectorAll("[data-stack-card]");

      if (wrapper && items) {
        // Reset wrapper height to auto
        wrapper.style.height = "auto";

        // Reset all card styles to default
        items.forEach((item) => {
          // Clear all GSAP properties
          gsap.set(item, {
            clearProps: "all",
          });

          // Explicitly reset transform-related properties
          item.style.transformOrigin = "";
          item.style.removeProperty("transform");
        });
      }
    });

    // Force single reflow after all sections processed (performance optimization)
    document.body.offsetHeight;
  }

  function sectionInitialiser(section, wrapper, items) {
    // Calculate dynamic height with current viewport
    const dynamicHeight = `${(items.length + 1) * 100}lvh`;
    wrapper.style.height = dynamicHeight;

    // Force reflow after setting height
    wrapper.offsetHeight;

    // Set initial positions with explicit values
    items.forEach((item, index) => {
      if (index !== 0) {
        gsap.set(item, { yPercent: 100 });
      } else {
        gsap.set(item, { yPercent: 0, opacity: 1, scale: 1 });
      }
    });

    // Create timeline with ScrollTrigger
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: "top top",
        end: () => `+=${items.length * 100}%`,
        scrub: true,
        invalidateOnRefresh: true,
        markers: false,
      },
      defaults: { ease: "none" },
    });

    // Store timeline reference
    stackTimelines.push(timeline);

    // Build animation sequence
    items.forEach((item, index) => {
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

    // Store the ScrollTrigger instance (only once)
    if (timeline.scrollTrigger) {
      stackTriggers.push(timeline.scrollTrigger);
    }
  }

  // Initial setup
  sequenceInitialiser();

  function thresholdChecker(currentWidth, prevWidth) {
    const crossedThreshold =
      (prevWidth > 768 && currentWidth <= 768) ||
      (prevWidth <= 768 && currentWidth > 768);

    // Only reinitialize if we crossed the 768px threshold
    if (crossedThreshold) {
      sequenceInitialiser();

      // Refresh ScrollTrigger after a brief delay to ensure DOM has settled
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }

    return currentWidth; // Return new width to update previousWidth
  }

  // Resize handler with debouncing
  let resizeTimeout;
  let previousWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      previousWidth = thresholdChecker(window.innerWidth, previousWidth);
    }, 300); // Increased debounce to allow viewport units to settle
  });

  // Cleanup on page unload (prevent memory leaks)
  window.addEventListener("beforeunload", () => {
    animationCleaner();
  });

  // Prevent bfcache from caching this page (Safari and other browsers)
  window.addEventListener("unload", () => {
    // Empty handler - presence of unload listener prevents bfcache
  });

  // Backup: Also handle any bfcache restoration attempts
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      // Force full page reload if bfcache somehow still activated
      window.location.reload();
    }
  });
});

//GSAP for Progress Bar
document.addEventListener("DOMContentLoaded", function () {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    window.barAnimator = function (
      bar,
      trigger,
      start = "top top",
      end = "bottom 70%",
    ) {
      gsap.set(bar, { width: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: start,
          end: end,
          scrub: true,
        },
      });

      tl.to(bar, {
        width: "100%",
        ease: "none",
      });

      return tl;
    };

    window.cellAnimator = function (
      cells,
      trigger,
      start = "top top",
      end = "bottom 70%",
    ) {
      if (!cells || cells.length === 0) return null;

      const cellCount = cells.length;

      ScrollTrigger.create({
        trigger: trigger,
        start: start,
        end: end,
        scrub: true,
        onUpdate: (self) => {
          const currentSegment = Math.min(
            Math.floor(self.progress * cellCount),
            cellCount - 1,
          );

          cells.forEach((cell, index) => {
            if (index === currentSegment) {
              cell.setAttribute("data-progress-cell", "on");
            } else {
              cell.setAttribute("data-progress-cell", "off");
            }
          });
        },
      });
    };
  }

  function animator() {
    const progressContainer = document.querySelector("[data-progress-wrap]");
    const progressBar = document.querySelector("[data-progress-bar]");
    const scrollContent = document.querySelector("[data-progress-section]");
    const progressArray = document.querySelector("[data-progress-array]");

    if (!scrollContent || !progressBar) {
      console.warn("Progress Bar: Required elements not found");
      return;
    }

    const contentHeight = scrollContent.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (contentHeight < viewportHeight * 1.2) {
      gsap.set(progressBar, { width: 0 });
      if (progressContainer) {
        progressContainer.style.display = "none";
      }
      return;
    }

    window.barAnimator(progressBar, scrollContent);

    if (progressArray) {
      const progressCells = progressArray.querySelectorAll(
        "[data-progress-cell]",
      );
      window.cellAnimator(progressCells, scrollContent);
    }
  }

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-progress-section")
          ) {
            trigger.kill();
          }
        });
        animator();
      }, 250);
    });
  }

  initialiser();

  // Wait for stacking cards to initialize before measuring content height
  // This ensures we get accurate measurements after dynamic heights are set
  if (window.innerWidth > 768) {
    window.addEventListener(
      "stackCardsInitialized",
      () => {
        animator();
      },
      { once: true },
    );
  } else {
    // On mobile, no stacking cards, initialize immediately
    animator();
  }

  triggers();
});

//GSAP for Scroll Cards
document.addEventListener("DOMContentLoaded", () => {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
  }

  function setMobileStyles() {
    // On mobile, set all cards to active state
    const scrollLists = document.querySelectorAll("[data-scroll-list]");

    scrollLists.forEach((list) => {
      const cards = list.querySelectorAll("[data-scroll-card]");

      cards.forEach((card) => {
        gsap.set(card, {
          opacity: 1,
          scale: 1,
        });
        card.setAttribute("data-scroll-state", "active");
      });
    });
  }

  function animator() {
    // Only run on desktop (above 768px)
    if (window.innerWidth <= 768) {
      console.warn("Scroll Cards: Disabled on tablet and mobile");
      setMobileStyles();
      return;
    }

    const scrollLists = document.querySelectorAll("[data-scroll-list]");

    if (!scrollLists || scrollLists.length === 0) {
      console.warn("Scroll Cards: No scroll lists found");
      return;
    }

    scrollLists.forEach((list) => {
      const cards = list.querySelectorAll("[data-scroll-card]");

      if (!cards || cards.length === 0) {
        console.warn("Scroll Cards: No cards found in list");
        return;
      }

      // Set initial state for all cards (default state)
      cards.forEach((card) => {
        gsap.set(card, {
          opacity: 0.4,
          scale: 0.95,
        });
        card.setAttribute("data-scroll-state", "default");
      });

      // Create ScrollTrigger for each card
      cards.forEach((card, index) => {
        const isFirstCard = index === 0;
        const isLastCard = index === cards.length - 1;

        // First card: stays active when at/above viewport, fades out when scrolling down
        if (isFirstCard) {
          ScrollTrigger.create({
            trigger: card,
            start: "top 70%",
            end: "center 30%",
            scrub: 0.5,
            markers: false,
            onUpdate: (self) => {
              const progress = self.progress;

              // First card: stays at 1 until it starts leaving center
              // Only fades out as it leaves (no fade in)
              const opacity = gsap.utils.interpolate(1, 0.4, progress);
              const scale = gsap.utils.interpolate(1, 0.95, progress);

              gsap.to(card, {
                opacity: opacity,
                scale: scale,
                duration: 0.1,
                ease: "none",
              });

              if (progress < 0.4) {
                card.setAttribute("data-scroll-state", "active");
              } else {
                card.setAttribute("data-scroll-state", "default");
              }
            },
          });
        }
        // Last card: stays active after reaching center
        else if (isLastCard) {
          ScrollTrigger.create({
            trigger: card,
            start: "center 70%",
            end: "center 50%",
            scrub: 0.5,
            markers: false,
            onUpdate: (self) => {
              const progress = self.progress;

              // Last card only goes from default → active (no fade out)
              const opacity = gsap.utils.interpolate(0.4, 1, progress);
              const scale = gsap.utils.interpolate(0.95, 1, progress);

              gsap.to(card, {
                opacity: opacity,
                scale: scale,
                duration: 0.1,
                ease: "none",
              });

              if (progress > 0.6) {
                card.setAttribute("data-scroll-state", "active");
              } else {
                card.setAttribute("data-scroll-state", "default");
              }
            },
          });
        }
        // Middle cards: normal behavior
        else {
          ScrollTrigger.create({
            trigger: card,
            start: "center 70%",
            end: "center 30%",
            scrub: 0.5,
            markers: false,
            onUpdate: (self) => {
              const progress = self.progress;

              let opacity, scale;

              if (progress <= 0.5) {
                const t = progress * 2;
                opacity = gsap.utils.interpolate(0.4, 1, t);
                scale = gsap.utils.interpolate(0.95, 1, t);
              } else {
                const t = (progress - 0.5) * 2;
                opacity = gsap.utils.interpolate(1, 0.4, t);
                scale = gsap.utils.interpolate(1, 0.95, t);
              }

              gsap.to(card, {
                opacity: opacity,
                scale: scale,
                duration: 0.1,
                ease: "none",
              });

              if (progress > 0.3 && progress < 0.7) {
                card.setAttribute("data-scroll-state", "active");
              } else {
                card.setAttribute("data-scroll-state", "default");
              }
            },
          });
        }
      });
    });
  }

  initialiser();
  animator();

  // Refresh on resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Kill all scroll card triggers and reinitialize
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.vars &&
          trigger.vars.trigger &&
          trigger.vars.trigger.hasAttribute("data-scroll-card")
        ) {
          trigger.kill();
        }
      });
      animator();
    }, 250);
  });
});

//GSAP for Quote Cards
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-review-wrap]").forEach(function (component) {
    const prevButton = document.querySelector("[data-review-prev]");
    const nextButton = document.querySelector("[data-review-next]");
    const duration = 0.5;
    const delay = 6;
    const dd = duration + delay;
    const cardsPerView = 3;
    let items = Array.from(component.querySelectorAll("[data-review-card]"));

    if (items.length > 0 && items.length <= cardsPerView) {
      const list = items[0].parentNode;
      const originalItems = items.slice();

      originalItems.forEach((item) => {
        list.appendChild(item.cloneNode(true));
      });

      items = Array.from(component.querySelectorAll("[data-review-card]"));
    }

    let activeIndex = -1;
    let zIndex = 12;

    const tl = gsap.timeline({
      defaults: { duration: duration, ease: "power1.inOut" },
    });

    for (let i = 0; i < items.length + cardsPerView; i++) {
      activeIndex++;
      if (activeIndex === items.length) activeIndex = 0;
      const item = items[activeIndex];
      zIndex--;
      tl.set(
        item,
        {
          scale: 1,
          yPercent: 0,
          "--background-opacity": 0.2,
          opacity: 1,
          filter: "blur(0rem)",
          delay: 0,
          zIndex: zIndex,
        },
        i * dd,
      );
      tl.to(
        item,
        { scale: 1.1, yPercent: -15, "--background-opacity": 0.1 },
        "<" + dd,
      );
      tl.to(
        item,
        { scale: 1.2, yPercent: -30, "--background-opacity": 0 },
        "<" + dd,
      );
      tl.to(
        item,
        {
          scale: 1.3,
          yPercent: -45,
          opacity: 0,
          filter: "blur(0.2rem)",
        },
        "<" + dd,
      );
    }

    const mainTl = gsap.timeline({
      repeat: -1,
      onUpdate: () => {
        const offset = dd * cardsPerView;
        if (tl.time() < offset - delay || tl.time() > tl.duration() - offset) {
          tl.time(offset - delay);
        }
      },
    });
    mainTl.to(tl, { duration: tl.duration(), ease: "none" });

    // Button click handlers
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        console.log("Next button clicked.");
        const currentTime = tl.time();
        const offset = dd * cardsPerView;
        const minTime = offset - delay;
        const maxTime = tl.duration() - offset;
        const validRange = maxTime - minTime;

        // Calculate the start time of the *next* animation segment
        let newTime = (Math.floor(currentTime / dd) + 1) * dd;

        // If we're already at the end, the next logical step is the beginning of the loop.
        if (currentTime >= maxTime) {
          newTime = minTime;
        } else if (newTime > maxTime) {
          // Otherwise, if the calculated jump overshoots, wrap it using the original modulo logic.
          newTime = minTime + ((newTime - minTime) % validRange);
        }

        console.log(
          `Jumping from ${currentTime.toFixed(2)}s to ${newTime.toFixed(2)}s`,
        );
        tl.time(newTime);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        console.log("Prev button clicked.");
        const currentTime = tl.time();
        const offset = dd * cardsPerView;
        const minTime = offset - delay;
        const maxTime = tl.duration() - offset;
        const validRange = maxTime - minTime;

        // Calculate the start time of the *previous* animation segment
        let newTime = (Math.floor(currentTime / dd) - 1) * dd;

        // If we're already at the start, the prev click should go to the end of the loop.
        if (currentTime <= minTime) {
          newTime = maxTime;
        } else if (newTime < minTime) {
          // Otherwise, if the calculated jump undershoots, wrap it using the original modulo logic.
          newTime = maxTime - ((minTime - newTime) % validRange);
        }

        console.log(
          `Jumping from ${currentTime.toFixed(2)}s to ${newTime.toFixed(2)}s`,
        );
        tl.time(newTime);
      });
    }
  });
});

//GSAP for Headings
document.addEventListener("DOMContentLoaded", () => {
  let viewportChecker;

  function initialiser() {
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

              // Check if element has gradient text styles
              const hasGradient = element.classList.contains("u-grad-heading");

              gsap.set(element, { opacity: 1 });

              // If gradient, apply gradient styles to each line div
              if (hasGradient) {
                const gradientImage = getComputedStyle(element).backgroundImage;
                self.lines.forEach((line) => {
                  line.style.backgroundImage = gradientImage;
                  line.style.webkitBackgroundClip = "text";
                  line.style.backgroundClip = "text";
                  line.style.webkitTextFillColor = "transparent";
                });
              }

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

              ScrollTrigger.create({
                trigger: element,
                start: scrollTriggerOffset,
                once: true,
                onEnter: () => {
                  setTimeout(() => {
                    tl.play(0);
                  }, delay * 1000);
                },
              });

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
    // allH1s.forEach((h1) => {
    //   h1.setAttribute("data-motion-text", "");
    // });
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

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-motion-text")
          ) {
            trigger.kill();
          }
        });
        document.fonts.ready.then(() => {
          animator();
        });
      }, 250);
    });
  }

  initialiser();
  selectors();
  animator();
  triggers();
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

      const childElements = Array.from(container.children).filter(
        (child) => !child.hasAttribute("data-motion-block"),
      );

      if (childElements.length === 0) {
        console.warn(
          "Motion for Arrays: No animatable children found or all are blocked.",
        );
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

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-motion-array")
          ) {
            trigger.kill();
          }
        });
        animator();
      }, 250);
    });
  }

  initialiser();
  animator();
  triggers();
});

//GSAP for Stagger
document.addEventListener("DOMContentLoaded", () => {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    window.staggerAnimator = function (
      container,
      scrollTriggerOffset = "top 95%",
    ) {
      const delay = container.getAttribute("data-motion-delay")
        ? parseFloat(container.getAttribute("data-motion-delay"))
        : 0;

      const childElements = Array.from(container.children).filter(
        (child) => !child.hasAttribute("data-motion-block"),
      );

      if (childElements.length === 0) {
        console.warn(
          "Motion for Stagger: No animatable children found or all are blocked.",
        );
        return null;
      }

      if (window.innerWidth <= 991) {
        gsap.set(childElements, {
          opacity: 1,
        });
        return null;
      }

      gsap.set(childElements, {
        opacity: 0,
      });
      let tl = gsap.timeline({
        paused: true,
      });
      tl.to(childElements, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
      ScrollTrigger.create({
        trigger: container,
        start: scrollTriggerOffset,
        once: true,
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
        "[data-motion-stagger]:not([data-motion-block])",
      );
      if (containers.length === 0) {
        console.warn("Motion for Stagger: Stagger not found");
        return;
      }
      containers.forEach((container) => {
        window.staggerAnimator(container);
      });
    }, 200);
  }

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-motion-stagger")
          ) {
            trigger.kill();
          }
        });
        animator();
      }, 250);
    });
  }

  initialiser();
  animator();
  triggers();
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

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-motion-element")
          ) {
            trigger.kill();
          }
        });
        animator();
      }, 250);
    });
  }

  initialiser();
  animator();
  triggers();
});

//GSAP for Glow Elements
document.addEventListener("DOMContentLoaded", () => {
  function initialiser() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      console.warn("Script terminated due to missing libraries");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
  }

  function animator() {
    const glowElements = document.querySelectorAll(
      "[data-motion-glow]:not([data-motion-block])",
    );

    if (!glowElements || glowElements.length === 0) {
      console.warn("Motion: Glow elements not found");
      return;
    }

    glowElements.forEach((element, index) => {
      try {
        const delay = element.getAttribute("data-motion-delay")
          ? parseFloat(element.getAttribute("data-motion-delay"))
          : 0;

        // Set initial state
        gsap.set(element, {
          width: "0%",
        });

        const tl = gsap.timeline({
          paused: true,
        });

        // CRT shimmer effect animation
        tl.to(element, {
          width: "100%",
          duration: 2,
          ease: "power4.out",
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
        console.error(`Motion: Glow animation failed at ${index + 1}:`, error);
      }
    });
  }

  function triggers() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.vars &&
            trigger.vars.trigger &&
            trigger.vars.trigger.hasAttribute("data-motion-glow")
          ) {
            trigger.kill();
          }
        });
        animator();
      }, 250);
    });
  }

  initialiser();
  animator();
  triggers();
});
