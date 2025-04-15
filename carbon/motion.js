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

//GSAP for Navbar slide
document.addEventListener("DOMContentLoaded", () => {
  const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;

  if (isDesktop()) {
    console.log("Desktop view detected - initializing navbar animation");

    const navbars = document.querySelectorAll(
      '[data-nav-element="navbar-wrap"]:not([data-tuck-block="blocked"])',
    );
    if (navbars.length === 0) {
      console.log("No navbar elements found - animation aborted");
      return;
    }

    console.log(`Found ${navbars.length} navbar elements to animate`);
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
      console.log(`Direction: ${scrollDirection}, Amount: ${scrollAmount}`);
      if (
        (scrollDirection === "down" && accumulatedScroll < 0) ||
        (scrollDirection === "up" && accumulatedScroll > 0)
      ) {
        accumulatedScroll = 0;
        console.log("Direction changed, reset accumulated scroll");
      }

      accumulatedScroll +=
        scrollDirection === "down" ? scrollAmount : -scrollAmount;
      console.log(`Accumulated: ${accumulatedScroll}`);

      if (accumulatedScroll > downScrollThreshold && navbarVisible) {
        console.log("Hiding navbar - threshold reached");
        showAnim.reverse();
        navbarVisible = false;
        accumulatedScroll = 0;
        console.log("Navbar hidden");
      } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
        console.log("Showing navbar - threshold reached");
        showAnim.play();
        navbarVisible = true;
        accumulatedScroll = 0;
        console.log("Navbar shown");
      }

      lastScrollTop = scrollTop;
    });
    console.log("Navbar animation setup complete");
  } else {
    console.log("Mobile view detected - navbar animation not applied");
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

    console.log(`Found ${cardContainers.length} array containers`);

    cardContainers.forEach((container, containerIndex) => {
      try {
        const delay = container.getAttribute("data-motion-delay")
          ? parseFloat(container.getAttribute("data-motion-delay"))
          : 0;

        console.log(
          `Container ${containerIndex + 1} delay value: ${delay}s`,
          container,
        );

        const cardElements = Array.from(container.children);

        if (!cardElements || cardElements.length === 0) {
          console.error(
            `Container ${containerIndex + 1} has no child elements`,
          );
          return;
        }

        console.log(
          `Container ${containerIndex + 1} has ${cardElements.length} elements to animate`,
        );

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
            console.log(
              `Triggering animation for container ${containerIndex + 1} with delay: ${delay}s`,
            );
            setTimeout(() => {
              console.log(
                `Playing animation for container ${containerIndex + 1} after delay`,
              );
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

  console.log(`Found ${singleElements.length} single motion elements`);

  const animatableElements = Array.from(singleElements).filter((element) => {
    const motionState = element.getAttribute("data-motion-state");
    const isBlocked = motionState === "blocked";
    return !isBlocked;
  });

  console.log(`Found ${animatableElements.length} animatable elements`);

  animatableElements.forEach((element, index) => {
    try {
      const delay = element.getAttribute("data-motion-delay")
        ? parseFloat(element.getAttribute("data-motion-delay"))
        : 0;

      console.log(`Element ${index + 1} delay value: ${delay}s`, element);

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
        duration: 0.5,
        ease: "power2.out",
      });

      ScrollTrigger.create({
        trigger: element,
        start: "top 95%",
        markers: false,
        once: true,
        onEnter: () => {
          console.log(
            `Triggering animation for element ${index + 1} with delay: ${delay}s`,
          );
          setTimeout(() => {
            console.log(
              `Playing animation for element ${index + 1} after delay`,
            );
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
