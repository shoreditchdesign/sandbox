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

//GSAP to Slide
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

  initialiser();
  animator();
});

//GSAP for Ticker
document.addEventListener("DOMContentLoaded", () => {
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
        markers: false,
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
      start: "bottom bottom",
      end: "bottom bottom-=1",
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

  initialiser();
  animator();
});

//GSAP for Opacity Toggle
document.addEventListener("DOMContentLoaded", function () {
  let scrollTriggerInstance = null;

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

    // Kill existing ScrollTrigger if it exists
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    // Check if at top of page and set opacity off
    if (window.scrollY === 0) {
      navbar.setAttribute("data-nav-opacity", "off");
    }

    scrollTriggerInstance = ScrollTrigger.create({
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

  initialiser();
  animator();

  // Reinitialize on window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      console.log(
        "Window resized - reinitializing navbar transparency ScrollTrigger",
      );
      animator();
      ScrollTrigger.refresh();
    }, 250);
  });
});

//GSAP for Review Cards
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-review-wrap]").forEach(function (component) {
    const prevButton = document.querySelector("[data-review-prev]");
    const nextButton = document.querySelector("[data-review-next]");
    const duration = 0.5;
    const delay = 2;
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
          filter: "blur(0.5rem)",
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
