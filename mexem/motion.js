//GSAP for Navbar Tuck
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

    console.log(`Created ${chapterItems.length * 2 - 1} scroll triggers`);
  }

  function handleItemEnter(currentIndex, lastIndex, items) {
    console.log(`Chapter ${currentIndex} entered`);
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

    console.log(`Chapter ${currentIndex} left back`);
    // Create and play transition animation (reverse direction)
    const timeline = createTransitionTimeline(
      items[currentIndex - 1], // Current item
      items[currentIndex - 2], // Previous item
    );

    timeline.play();
  }

  function createTransitionTimeline(fadeOutItem, fadeInItem) {
    const tl = gsap.timeline({
      onStart: () => console.log("Video transition started"),
      onComplete: () => console.log("Video transition completed"),
    });

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
