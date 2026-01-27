//Conversion Banner Popup
document.addEventListener("DOMContentLoaded", function () {
  // // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Get the popup element and its height
  const popup = document.querySelector(".c-cta-popup_wrap");

  // Check if popup exists before proceeding
  if (!popup) {
    console.warn("Popup element with class '.c-cta-popup_wrap' not found.");
    return; // Exit if popup element is not found
  }

  // Get the conversion distance multiplier from data attribute
  const conversionDistance =
    parseFloat(popup.getAttribute("data-conversion-distance")) || 1.5; // fallback to 1.5 if not set

  // Set the initial state (hidden below its own height)
  // We do this before getting the height to ensure it's styled correctly for calculation
  gsap.set(popup, { y: "100%", yPercent: 0 }); // Use y:"100%" relative to parent or yPercent:100 if needed
  const popupHeight = popup.offsetHeight;

  // GSAP animation for the popup (target state)
  // Note: We don't define a 'from' state here as we use gsap.set for the initial position
  // The ScrollTrigger will directly control the 'to' state.

  // ScrollTrigger to handle the visibility of the popup based on scroll position
  ScrollTrigger.create({
    trigger: document.body, // or a more appropriate scrollable container if not the body
    start: "top top", // Trigger check starts from the top of the page
    // end: "bottom top", // No specific end needed, we react continuously
    onUpdate: (self) => {
      // Use window.scrollY for current scroll position

      if (window.scrollY > window.innerHeight * conversionDistance) {
        // Show the popup by animating to its visible position
        gsap.to(popup, { y: 0, duration: 0.5 });
      } else {
        // Hide the popup by animating it back below the viewport
        gsap.to(popup, { y: "100%", duration: 0.5 }); // Hide below viewport
      }
    },
  });

  // Get the element that should hide the banner when in view (e.g., footer)
  const hideElement = document.querySelector("[data-conversion-hide]");

  // If hide element exists, create a separate ScrollTrigger to control opacity
  if (hideElement) {
    ScrollTrigger.create({
      trigger: hideElement,
      start: "top bottom", // When top of element enters bottom of viewport
      end: "bottom top", // When bottom of element leaves top of viewport
      onEnter: () => {
        // Fade out banner when footer comes into view
        gsap.to(popup, { opacity: 0, duration: 0.1 });
      },
      onLeave: () => {
        // Fade banner back in when footer leaves viewport (scrolling down past it)
        gsap.to(popup, { opacity: 1, duration: 0.1 });
      },
      onEnterBack: () => {
        // Fade out banner when scrolling back up to footer
        gsap.to(popup, { opacity: 0, duration: 0.1 });
      },
      onLeaveBack: () => {
        // Fade banner back in when leaving footer (scrolling up away from it)
        gsap.to(popup, { opacity: 1, duration: 0.1 });
      },
    });
  }

  // Optional: Handle window resize to update ScrollTrigger if necessary
  // ScrollTrigger.addEventListener("refreshInit", () => {
  //   // Re-calculate heights or positions if needed on refresh
  // });
});

//Logo Grid
document.addEventListener("DOMContentLoaded", () => {
  const logoList = document.querySelector(".c-logo_list");
  logoList.setAttribute("data-logo-list", "");
  const logoSlots = document.querySelectorAll(".c-logo_slot");

  logoSlots.forEach((slot, index) => {
    slot.setAttribute("data-logo-slot", index.toString());
  });

  let maxIndex = 0;
  logoSlots.forEach((slot) => {
    const icons = slot.querySelectorAll(".c-logo_icon");
    maxIndex = Math.max(maxIndex, icons.length - 1);
    icons.forEach((icon, index) => {
      icon.setAttribute("data-logo-icon", index.toString());
    });
  });

  const FADE_IN_DURATION = 0.4;
  const FADE_OUT_DURATION = 0.05;
  const STAGGER_DELAY = 0.2;
  const HOLD_DURATION = 1;
  const EASE = "power1.inOut";
  let firstRun = false;

  // Set initial states
  gsap.set("[data-logo-icon]", { opacity: 0, scale: 0.95 });
  const initialIcons = document.querySelectorAll('[data-logo-icon="0"]');
  gsap.set(initialIcons, { opacity: 1 });

  const createMainTimeline = () => {
    const timeline = gsap.timeline();
    const slots = Array.from(logoSlots);

    // Reset scale for all logos at start of timeline
    slots.forEach((slot) => {
      const icons = slot.querySelectorAll(".c-logo_icon");
      gsap.set(icons, { scale: 0.95 });
    });

    if (firstRun) {
      const initialSequence = gsap.timeline();
      slots.forEach((slot, slotIndex) => {
        const icon = slot.querySelector('[data-logo-icon="0"]');
        initialSequence.to(
          icon,
          {
            opacity: 1,
            scale: 1,
            duration: FADE_IN_DURATION,
            ease: EASE,
          },
          slotIndex === 0 ? ">" : `>+${STAGGER_DELAY}`,
        );
      });
      initialSequence.to({}, { duration: HOLD_DURATION }, ">");
      timeline.add(initialSequence);
    }

    for (let currentIndex = 0; currentIndex <= maxIndex; currentIndex++) {
      const transitionSequence = gsap.timeline();

      slots.forEach((slot, slotIndex) => {
        const currentIcon = slot.querySelector(
          `[data-logo-icon="${currentIndex}"]`,
        );
        const nextIcon = slot.querySelector(
          `[data-logo-icon="${currentIndex === maxIndex ? 0 : currentIndex + 1}"]`,
        );

        // Reset scale for next icon before animation
        gsap.set(nextIcon, { scale: 0.95 });

        transitionSequence.to(
          [currentIcon, nextIcon],
          {
            opacity: (i) => (i === 0 ? 0 : 1),
            scale: (i) => (i === 0 ? 0.95 : 1),
            duration: FADE_IN_DURATION,
            ease: EASE,
          },
          slotIndex === 0 ? ">" : `>+${STAGGER_DELAY}`,
        );
      });

      transitionSequence.to({}, { duration: HOLD_DURATION }, ">");
      timeline.add(transitionSequence);
    }

    firstRun = false;
    return timeline;
  };

  const masterTimeline = gsap.timeline({
    repeat: -1,
    onRepeat: () => {
      const newTimeline = createMainTimeline();
      masterTimeline.add(newTimeline);
    },
  });

  masterTimeline.add(createMainTimeline());
  masterTimeline.play();
});

//Navbar Slide
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".c-navbar");
  var prevScrollpos = window.scrollY;
  const navbarHeight = navbar.offsetHeight; // Get navbar height test 1

  window.onscroll = function () {
    var currentScrollPos = window.scrollY;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("navbar").style.top = "0";
    } else {
      document.getElementById("navbar").style.top = "-" + navbarHeight + "px";
    }
    prevScrollpos = currentScrollPos;
  };

  window.addEventListener("load", function () {
    setTimeout(function () {
      var navbarLinks = document.querySelectorAll(".c-navbar_link");
      navbarLinks.forEach(function (link) {
        link.style.opacity = "1";
      });
    }, 5000); // 5000 milliseconds = 5 seconds
  });
});

//Headings
document.addEventListener("DOMContentLoaded", () => {
  //window.scrollTo(0, 0);

  // Delay execution for preloader animation
  setTimeout(() => {
    // Ensure GSAP and plugins are loaded
    if (
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined" ||
      typeof SplitType === "undefined"
    ) {
      console.error("GSAP, ScrollTrigger, or SplitType is not loaded.");
      return;
    }

    // Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Stagger Up Animation
    document.querySelectorAll("h1, h2").forEach((element) => {
      element.setAttribute("a-stagger-up", "");
    });

    // Split text into spans
    new SplitType("[a-stagger-up]", {
      tagName: "span",
    });

    function createScrollTrigger(triggerElement, timeline) {
      let hasPlayed = false;

      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top 80%", // Start the animation when the top of the element is at the bottom
        onEnter: () => {
          if (!hasPlayed) {
            timeline.play();
            hasPlayed = true;
          }
        },
        onEnterBack: () => {
          if (!hasPlayed) {
            timeline.play();
            hasPlayed = true;
          }
        },
        once: true, // Ensures the animation runs only once
      });
    }

    document.querySelectorAll("[a-stagger-up]").forEach((element) => {
      let tl = gsap.timeline({ paused: true });
      tl.from(element.querySelectorAll(".word"), {
        opacity: 0,
        duration: 0.4,
        yPercent: 110,
        ease: "power1.Out",
        stagger: { each: 0.1 }, // Stagger each element by 100 ms
      });
      createScrollTrigger(element, tl);
    });

    // Avoid flash of unstyled content
    gsap.set("[a-stagger-up]", { opacity: 1 });
  }, 1400); // 1000ms delay for preloader animation
});
