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

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Starting text reveal animation setup");

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  console.log("ScrollTrigger plugin registered");

  // Target the text element
  const textElement = document.querySelector(".s-hm2_text");
  console.log("Targeting text element:", textElement);

  // Debug the content
  console.log("Original content:", textElement.textContent);

  // Check if SplitType is available
  if (typeof SplitType === "undefined") {
    console.error("SplitType library is not loaded! Loading it dynamically...");

    // Attempt to load SplitType dynamically
    const script = document.createElement("script");
    script.src = "https://unpkg.com/split-type@0.3.3/umd/index.min.js";
    script.onload = initializeSplitAndAnimation;
    script.onerror = () => console.error("Failed to load SplitType library!");
    document.head.appendChild(script);
    return;
  } else {
    initializeSplitAndAnimation();
  }

  function initializeSplitAndAnimation() {
    console.log("Initializing split and animation");

    // Manually split the text into words
    const originalText = textElement.textContent.trim();
    const words = originalText.split(/\s+/);
    console.log("Text split into", words.length, "words:", words);

    // Clear the text element
    textElement.innerHTML = "";

    // Create spans for each word
    words.forEach((word) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";
      wordSpan.textContent = word;
      wordSpan.style.opacity = "0.5";
      wordSpan.style.display = "inline-block";
      wordSpan.style.transform = "translateY(20px)";
      textElement.appendChild(wordSpan);
      // Add a space after each word (except the last one)
      textElement.appendChild(document.createTextNode(" "));
    });

    // Select all the word spans
    const wordElements = textElement.querySelectorAll(".word");
    console.log("Created", wordElements.length, "word elements");

    // Create the ScrollTrigger animation
    console.log("Setting up ScrollTrigger for each word");
    wordElements.forEach((word, index) => {
      console.log(
        `Setting up word ${index + 1}/${wordElements.length}: "${word.textContent}"`,
      );

      gsap.to(word, {
        scrollTrigger: {
          trigger: textElement,
          start: "top 80%", // When the top of the element hits 80% from the top of viewport
          end: "top 20%", // When the top of the element hits 20% from the top of viewport
          scrub: 0.5, // Smooth scrubbing effect
          markers: true, // Set to true for debugging, false for production
          onUpdate: (self) => {
            // Calculate when this specific word should be revealed
            const wordThreshold = index / (wordElements.length - 1);

            // Only log occasionally to prevent console flooding
            if (Math.random() < 0.05) {
              console.log(
                `Word "${word.textContent}" - Scroll: ${self.progress.toFixed(2)}, Threshold: ${wordThreshold.toFixed(2)}`,
              );
            }

            // If scroll progress passes the threshold for this word, reveal it
            if (self.progress >= wordThreshold) {
              if (!word.classList.contains("active")) {
                console.log(`Activating word "${word.textContent}"`);
                gsap.to(word, {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power2.out",
                  onComplete: () => {
                    word.classList.add("active");
                  },
                });
              }
            } else {
              // If we scroll back up, hide the word again
              if (word.classList.contains("active")) {
                console.log(`Deactivating word "${word.textContent}"`);
                word.classList.remove("active");
                gsap.to(word, {
                  opacity: 0.5,
                  y: 20,
                  duration: 0.3,
                  ease: "power2.in",
                });
              }
            }
          },
        },
      });
    });

    console.log("Animation setup complete");
  }
});
