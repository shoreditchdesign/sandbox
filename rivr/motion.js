document.addEventListener("DOMContentLoaded", function () {
  // Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error("GSAP library is required for this animation");
    return;
  }

  // Check if ScrollTrigger plugin is loaded
  if (typeof ScrollTrigger === "undefined") {
    console.error("GSAP ScrollTrigger plugin is required for this animation");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Find the grid element
  const grid = document.querySelector(".s-hm8_grid");

  if (!grid) {
    console.warn("Grid element .s-hm8_grid not found");
    return;
  }

  // Get all image elements
  const images = Array.from(grid.querySelectorAll(".s-hm6-uimage"));

  if (!images.length) {
    console.warn("No image elements found within the grid");
    return;
  }

  // Set initial state - all images invisible
  gsap.set(images, { autoAlpha: 0 });

  // Randomize the array order
  const randomizedImages = [...images].sort(() => Math.random() - 0.5);

  // Create the animation
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: grid,
      start: "top 80%", // Trigger when the top of the grid is 80% from the top of the viewport
      once: true, // Only trigger once
      toggleActions: "play none none none",
    },
  });

  // Add staggered animation with randomized order
  tl.to(randomizedImages, {
    duration: 0.8,
    autoAlpha: 1,
    ease: "power2.out",
    stagger: {
      each: 0.15,
      from: "random", // Start the stagger from a random position
    },
  });
});
