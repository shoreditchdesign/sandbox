// GSAP Navbar Slide
document.addEventListener("DOMContentLoaded", () => {
  const showAnim = gsap
    .from(".c-navbar", {
      yPercent: -100,
      paused: true,
      duration: 0.2,
    })
    .progress(1);

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      self.direction === -1 ? showAnim.play() : showAnim.reverse();
    },
  });

  setTimeout(() => {
    gsap.set(".c-navbar", { yPercent: 0 });
  }, 10);
});

//GSAP for Headings
window.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }
    document.querySelectorAll("h1, h2, p").forEach((element) => {
      element.setAttribute("data-stagger-fade", "");
    });
    const splitLines = new SplitType("[data-stagger-fade]", {
      tagName: "span",
    });
    document.querySelectorAll("[data-stagger-fade] .line").forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("u-line-mask");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });
    document.querySelectorAll("[data-stagger-fade]").forEach((element) => {
      const tl = gsap.timeline({ paused: true });
      tl.from(element.querySelectorAll(".line"), {
        y: "200%",
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
        stagger: 0.1,
      });
      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        once: true,
      });
    });
    function splitRevert() {
      document.querySelectorAll("[data-stagger-fade] .line").forEach((line) => {
        const wrapper = line.parentNode;
        wrapper.replaceWith(...wrapper.childNodes);
      });
      splitLines.revert();
    }
    gsap.set("[data-stagger-fade]", { opacity: 1 });
  }, 100);
});

//GSAP for Fading Grid
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") {
    return;
  }

  if (typeof ScrollTrigger === "undefined") {
    return;
  }

  const grid = document.querySelector(".s-hm8_grid");
  if (!grid) {
    return;
  }

  const imageContainers = Array.from(grid.querySelectorAll(".s-hm8_image"));
  if (!imageContainers.length) {
    return;
  }

  gsap.set(imageContainers, { autoAlpha: 0 });

  const randomizedImages = [...imageContainers].sort(() => Math.random() - 0.5);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: grid,
      start: "top 80%",
      once: true,
      toggleActions: "play none none none",
      markers: false,
    },
  });

  tl.to(randomizedImages, {
    duration: 0.8,
    autoAlpha: 1,
    ease: "power2.out",
    stagger: {
      each: 0.15,
      from: "random",
    },
  });

  ScrollTrigger.refresh();
});

//GSAP for Swiper
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") {
    return;
  }

  const swiperWrapper = document.querySelector(".swiper-wrapper");
  if (!swiperWrapper) {
    return;
  }

  const cards = Array.from(swiperWrapper.children);
  if (!cards.length) {
    return;
  }

  // Set initial state - hidden and shifted down
  gsap.set(cards, {
    autoAlpha: 0,
    y: 30,
  });

  // Create animation with staggered timing
  gsap.to(cards, {
    duration: 0.8,
    autoAlpha: 1,
    y: 0,
    ease: "power2.out",
    stagger: 0.15, // 0.15 second delay between each card
    delay: 0.3, // Initial delay before animation starts
  });
});

//GSAP for Text Reveal
document.addEventListener("DOMContentLoaded", function () {
  // Make sure GSAP and plugins are loaded
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    typeof SplitType === "undefined"
  ) {
    console.error(
      "Required libraries (GSAP, ScrollTrigger, or SplitType) are not loaded",
    );
    return;
  }

  // Wait a moment to ensure the DOM is fully processed
  setTimeout(() => {
    // Target elements with data-motion-text="reveal" attribute
    const textElements = document.querySelectorAll(
      '[data-motion-text="reveal"]',
    );

    // Debug: Check if elements exist
    if (!textElements || textElements.length === 0) {
      console.error('Could not find elements with data-motion-text="reveal"');
      return;
    }

    console.log(
      `Found ${textElements.length} text elements with data-motion-text="reveal"`,
    );

    // Process each element
    textElements.forEach((textElement, elementIndex) => {
      try {
        // Initialize SplitType to split the text into words
        const splitText = new SplitType(textElement, {
          types: "words",
          tagName: "span",
        });

        // Debug: Check if words were created
        if (!splitText.words || splitText.words.length === 0) {
          console.error(
            "SplitType did not create any word elements for",
            textElement,
          );
          return;
        }

        console.log(
          `Element ${elementIndex + 1}: Split into ${splitText.words.length} words`,
        );

        // Set initial state of all words
        gsap.set(splitText.words, {
          opacity: 0.5,
          y: "0px",
          ease: "power2.out",
        });

        // Create the scroll-triggered animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: textElement,
            start: "top 80%", // Start when top of text reaches 80% of viewport
            end: "bottom 20%", // End when bottom of text reaches 20% of viewport
            scrub: 0.5, // Smooth scrubbing effect
            markers: false, // Enable for debugging
          },
        });

        // Add the animation to the timeline
        tl.to(splitText.words, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "power2.out",
          className: "+=active",
        });
      } catch (error) {
        console.error(
          `Error in text animation setup for element ${elementIndex + 1}:`,
          error,
        );
      }
    });
  }, 500); // Wait 500ms for everything to be properly loaded
});
