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

  // Debug the HTML content
  console.log("HTML content of text element:", textElement.innerHTML);
  console.log("Text content of text element:", textElement.textContent);

  // Make sure the element exists
  if (!textElement) {
    console.log("Text element not found - exiting animation setup");
    return;
  }

  // Try a different approach with SplitType
  console.log("Initializing SplitType with more specific settings");
  const splitText = new SplitType(textElement, {
    types: "words",
    tagName: "span",
    // Force splitting all text nodes
    splitClass: "split-word",
    wordClass: "word",
    absolute: false,
  });

  console.log("SplitType result:", splitText);
  console.log("Words created:", splitText.words ? splitText.words.length : 0);

  // If SplitType didn't work properly, try a manual split
  if (!splitText.words || splitText.words.length <= 1) {
    console.log("SplitType didn't split properly, trying manual split");

    // Clear existing content
    const originalText = textElement.textContent.trim();
    textElement.innerHTML = "";

    // Split text manually and create word spans
    const words = originalText.split(/\s+/);
    console.log("Manually split into words:", words);

    // Create spans for each word
    words.forEach((word) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";
      wordSpan.textContent = word;
      textElement.appendChild(wordSpan);
      textElement.appendChild(document.createTextNode(" ")); // Add space between words
    });

    // Re-select the word elements
    splitText.words = textElement.querySelectorAll(".word");
    console.log("Manually created word elements:", splitText.words.length);
  }

  // If we still don't have words, exit
  if (!splitText.words || splitText.words.length === 0) {
    console.log("No words to animate - exiting animation setup");
    return;
  }

  // Set initial opacity for all words
  console.log("Setting initial state for all words");
  gsap.set(splitText.words, {
    opacity: 0.5,
    y: "20px",
  });
  console.log("Initial word states set - opacity: 0.5, y: 20px");

  // Create ScrollTrigger animation
  console.log("Creating ScrollTrigger animations for each word");
  splitText.words.forEach((word, index) => {
    console.log(
      `Setting up word ${index + 1}/${splitText.words.length}: "${word.textContent}"`,
    );

    gsap.to(word, {
      scrollTrigger: {
        trigger: textElement,
        start: "top 80%", // When the top of the element hits 80% from the top of viewport
        end: "top 20%", // When the top of the element hits 20% from the top of viewport
        scrub: 0.5, // Smooth scrubbing effect with a slight delay for better feel
        markers: true, // Set to true for debugging
        onUpdate: (self) => {
          // Calculate when this specific word should be revealed based on its position in the text
          const wordProgress = index / (splitText.words.length - 1);
          console.log(
            `Word "${word.textContent}" - Progress: ${self.progress.toFixed(2)}, Threshold: ${wordProgress.toFixed(2)}`,
          );

          // If scroll progress passes the threshold for this word, add active class
          if (self.progress >= wordProgress) {
            if (!word.classList.contains("active")) {
              console.log(
                `Activating word "${word.textContent}" - animation starting`,
              );
              gsap.to(word, {
                opacity: 1,
                y: "0px",
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                  word.classList.add("active");
                  console.log(
                    `Word "${word.textContent}" - active class added, animation complete`,
                  );
                },
              });
            }
          } else {
            // If we scroll back up, remove active class
            if (word.classList.contains("active")) {
              console.log(
                `Deactivating word "${word.textContent}" - reversing animation`,
              );
              word.classList.remove("active");
              gsap.to(word, {
                opacity: 0.5,
                y: "20px",
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                  console.log(
                    `Word "${word.textContent}" - deactivation complete`,
                  );
                },
              });
            }
          }
        },
      },
    });
  });
  console.log("Word animations setup complete");
});
