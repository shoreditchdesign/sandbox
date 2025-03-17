document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing animation...");

  // Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error("GSAP library is required for this animation");
    return;
  } else {
    console.log("GSAP is loaded correctly");
  }

  // Check if ScrollTrigger plugin is loaded
  if (typeof ScrollTrigger === "undefined") {
    console.error("GSAP ScrollTrigger plugin is required for this animation");
    return;
  } else {
    console.log("ScrollTrigger plugin is loaded correctly");
  }

  // Find the grid element - using the correct class from your HTML
  const grid = document.querySelector(".s-hm8_grid");
  console.log("Looking for grid element .s-hm8_grid");

  if (!grid) {
    console.error("Grid element .s-hm8_grid not found - animation cannot run");
    return;
  } else {
    console.log("Grid element found:", grid);
  }

  // Get all image elements - using the correct structure from your HTML
  // Looking for .s-hm8_image instead of .s-hm6-uimage
  const imageContainers = Array.from(grid.querySelectorAll(".s-hm8_image"));
  console.log("Looking for image containers .s-hm8_image inside grid");

  if (!imageContainers.length) {
    console.error(
      "No image containers found within the grid - nothing to animate",
    );
    return;
  } else {
    console.log(
      `Found ${imageContainers.length} image containers to animate:`,
      imageContainers,
    );
  }

  // Set initial state - all image containers invisible
  gsap.set(imageContainers, { autoAlpha: 0 });
  console.log("Set initial state: all image containers invisible");

  // Randomize the array order
  const randomizedImages = [...imageContainers].sort(() => Math.random() - 0.5);
  console.log("Randomized image order for animation");

  // Create the animation
  console.log("Creating ScrollTrigger animation");
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: grid,
      start: "top 80%", // Trigger when the top of the grid is 80% from the top of the viewport
      once: true, // Only trigger once
      toggleActions: "play none none none",
      markers: true, // Add visible markers to see trigger points
      onEnter: () => console.log("ScrollTrigger entered - animation starting"),
      onLeaveBack: () => console.log("ScrollTrigger left backwards"),
      onLeave: () => console.log("ScrollTrigger left forwards"),
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
    onStart: () => console.log("Animation started"),
    onComplete: () =>
      console.log("Animation completed - all images should be visible now"),
  });

  console.log("Animation setup complete - waiting for scroll trigger");

  // Force refresh ScrollTrigger to ensure it's working
  ScrollTrigger.refresh();
  console.log("ScrollTrigger refreshed");
});
