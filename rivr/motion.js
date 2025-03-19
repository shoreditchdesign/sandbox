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

// Initialize SplitType to split text into words
const textElement = document.querySelector(".s-hm2_text");
const splitText = new SplitType(textElement, {
  types: "words",
  tagName: "span",
});

// Create the scroll-triggered animation
gsap
  .timeline({
    scrollTrigger: {
      trigger: textElement,
      start: "top 80%", // Starts when the top of the text hits 80% of viewport
      end: "bottom 20%", // Ends when the bottom of the text hits 20% of viewport
      scrub: true, // Ties animation progress to scroll position
      // markers: true, // Uncomment for debugging
    },
  })
  .to(splitText.words, {
    opacity: 1,
    className: "+=active", // Adds the 'active' class
    stagger: 0.05, // Time between each word animation
    ease: "power2.out", // Subtle easing for smooth animation
    duration: 0.5,
  });

// Make sure all words start with opacity 0.5 (in case CSS isn't set)
gsap.set(splitText.words, {
  opacity: 0.5,
});
