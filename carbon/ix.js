console.log("ix deployed");

// Marquee Cards
document.addEventListener("DOMContentLoaded", () => {
  function initializeMarqueeCards() {
    try {
      const cards = document.querySelectorAll("[data-marquee-card]");
      if (!cards.length) return;

      cards.forEach((card) => {
        if (card && card.parentElement) {
          const parentHeight = card.parentElement.offsetHeight;
          const width = Math.floor(parentHeight * 0.3 + 24);
          card.style.width = `${width}px`;
        }
      });
    } catch (error) {
      console.warn("Marquee card calculation error:", error);
    }
  }

  initializeMarqueeCards();

  const marqueeWrap = document.querySelector("[data-marquee-wrap]");
  const marqueeItem = document.querySelector("[data-marquee-item]");
  const originalContent = marqueeItem.outerHTML;

  function calculateRequiredCopies() {
    const viewportWidth = window.innerWidth;
    const itemWidth = marqueeItem.offsetWidth;
    // Create a sequence 5 times the viewport width
    const copiesNeeded = Math.ceil((viewportWidth * 5) / itemWidth) + 2;

    return {
      viewportWidth,
      itemWidth,
      copiesNeeded,
    };
  }

  function setupMarquee() {
    const { copiesNeeded, itemWidth } = calculateRequiredCopies();

    marqueeWrap.innerHTML = "";

    for (let i = 0; i < copiesNeeded; i++) {
      const clone = document.createElement("div");
      clone.innerHTML = originalContent;
      const clonedItem = clone.firstElementChild;
      marqueeWrap.appendChild(clonedItem);
    }

    // Total width of the sequence
    const totalWidth = itemWidth * copiesNeeded;

    gsap.to(marqueeWrap, {
      x: -totalWidth + itemWidth, // Subtract one item width to ensure smooth loop
      duration: totalWidth / 25, // Slowed down the speed for longer animation
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        gsap.set(marqueeWrap, { x: 0 });
      },
    });
  }

  setupMarquee();
  initializeMarqueeCards();
  initializeMarqueeCards();

  function openCard(card, initialWidth, getHoverWidth, quickAnims) {
    const targetWidth = getHoverWidth();
    quickAnims.width(targetWidth);
    quickAnims.bg(0);
    quickAnims.textOpacity(1);
    card.setAttribute("data-marquee-state", "hover");
  }

  function closeCard(card, initialWidth, quickAnims) {
    quickAnims.width(initialWidth);
    quickAnims.bg(1);
    quickAnims.textOpacity(0);
    card.setAttribute("data-marquee-state", "default");
  }

  const cards = document.querySelectorAll("[data-marquee-card]");
  const firstCard = cards[0]; // Store the first card
  let firstClonedCard;

  cards.forEach((card) => {
    const bgLayer = card.querySelector("[data-marquee-bg]");
    const textLayer = card.querySelector("[data-marquee-text]");
    const easeDuration =
      parseFloat(card.getAttribute("data-marquee-ease")) || 0.4;

    gsap.set(textLayer, { opacity: 0 });
    const initialWidth = card.offsetWidth;
    const getHoverWidth = () => {
      const currentHeight = card.offsetHeight;
      return (currentHeight * 16) / 9;
    };
    const quickAnims = {
      width: gsap.quickTo(card, "width", {
        duration: easeDuration,
        ease: "power2.inOut",
      }),
      bg: gsap.quickTo(bgLayer, "opacity", {
        duration: easeDuration,
        ease: "power2.inOut",
      }),
      textOpacity: gsap.quickTo(textLayer, "opacity", {
        duration: easeDuration,
        ease: "power2.inOut",
      }),
    };

    card.addEventListener("mouseenter", () =>
      openCard(card, initialWidth, getHoverWidth, quickAnims),
    );
    card.addEventListener("mouseleave", () =>
      closeCard(card, initialWidth, quickAnims),
    );

    // Find the first cloned card after marquee setup
    if (
      !firstClonedCard &&
      card.closest("[data-marquee-wrap]") &&
      card !== firstCard
    ) {
      firstClonedCard = card;
    }
  });

  // Open the first card after all cards have been processed and the marquee is set up
  if (firstClonedCard) {
    const bgLayer = firstClonedCard.querySelector("[data-marquee-bg]");
    const textLayer = firstClonedCard.querySelector("[data-marquee-text]");
    const easeDuration =
      parseFloat(firstClonedCard.getAttribute("data-marquee-ease")) || 0.4;

    const initialWidth = firstClonedCard.offsetWidth;
    const getHoverWidth = () => {
      const currentHeight = firstClonedCard.offsetHeight;
      return (currentHeight * 16) / 9;
    };
    const quickAnims = {
      width: gsap.quickTo(firstClonedCard, "width", {
        duration: easeDuration,
        ease: "power2.inOut",
      }),
      bg: gsap.quickTo(bgLayer, "opacity", {
        duration: easeDuration,
        ease: "power2.inOut",
      }),
      textOpacity: gsap.quickTo(textLayer, "opacity", {
        duration: easeDuration,
        ease: "power2.inOut",
      }),
    };
    openCard(firstClonedCard, initialWidth, getHoverWidth, quickAnims);
  }
});

// Team Card Hover Animation
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded - initializing card animations");

  // Select all card elements
  const cards = document.querySelectorAll(".s-ab5_card");
  console.log(`Found ${cards.length} cards on the page`);

  // Track currently open card
  let currentlyOpenCard = null;

  // Setup for each card
  cards.forEach((card, index) => {
    console.log(`Setting up card #${index}`);

    const overlay = card.querySelector(".s-ab5_overlay");
    const content = card.querySelector(".s-ab5_content");
    const button = card.querySelector(".s-ab5_btn");

    // Check if elements exist
    if (!overlay) {
      console.error(
        `Card #${index} is missing overlay element (.s-ab5_overlay)`,
      );
      return;
    }
    if (!content) {
      console.error(
        `Card #${index} is missing content element (.s-ab5_content)`,
      );
      return;
    }
    if (!button) {
      console.error(`Card #${index} is missing button element (.s-ab5_btn)`);
      return;
    }

    console.log(`Card #${index} - found all required elements`);

    // Track open/closed state
    let isOpen = false;

    // Initial state
    let initialOverlayHeight;
    let finalOverlayHeight;

    // Function to calculate heights
    const calculateHeights = () => {
      initialOverlayHeight = parseFloat(
        window.getComputedStyle(overlay).height,
      );
      finalOverlayHeight = parseFloat(window.getComputedStyle(card).height);
      console.log(`Card #${index} - Heights calculated:`, {
        initialOverlayHeight,
        finalOverlayHeight,
      });
    };

    // Calculate on page load
    calculateHeights();

    // Set initial styles
    gsap.set(content, { display: "none", opacity: 0 });
    gsap.set(overlay, { height: initialOverlayHeight, overflow: "hidden" });
    console.log(`Card #${index} - Initial styles set`);

    // Create quickTo function for the overlay height
    const animateHeight = gsap.quickTo(overlay, "height", {
      duration: 0.4,
      ease: "power2.out",
    });

    // Create quickTo function for content opacity
    const animateOpacity = gsap.quickTo(content, "opacity", {
      duration: 0.3,
      ease: "power2.out",
    });

    console.log(`Card #${index} - quickTo functions created`);

    // Function to open the card
    const openCard = () => {
      if (isOpen) return;

      // If another card is open, close it first
      if (currentlyOpenCard && currentlyOpenCard !== card) {
        console.log(
          `Closing previously open card before opening Card #${index}`,
        );
        currentlyOpenCard.closeCard();
      }

      console.log(
        `Card #${index} - OPENING - animating to height: ${finalOverlayHeight}px`,
      );

      // Animate overlay height using quickTo
      animateHeight(finalOverlayHeight);

      // Show content and animate opacity
      gsap.set(content, { display: "flex" });
      animateOpacity(1);
      console.log(`Card #${index} - Content display set to flex`);

      // Set overflow to scroll
      gsap.delayedCall(0.3, () => {
        gsap.set(overlay, { overflowY: "scroll" });
        console.log(`Card #${index} - Overflow set to scroll`);
      });

      isOpen = true;
      currentlyOpenCard = card;
    };

    // Function to close the card
    const closeCard = () => {
      if (!isOpen) return;

      console.log(
        `Card #${index} - CLOSING - animating to height: ${initialOverlayHeight}px`,
      );

      // Reset overflow immediately
      gsap.set(overlay, { overflowY: "hidden" });
      console.log(`Card #${index} - Overflow set to hidden`);

      // Animate overlay back to initial height using quickTo
      animateHeight(initialOverlayHeight);

      // Fade out content
      animateOpacity(0);

      // Hide content after fade completes
      gsap.delayedCall(0.3, () => {
        gsap.set(content, { display: "none" });
        console.log(`Card #${index} - Content display set to none`);
      });

      isOpen = false;
      if (currentlyOpenCard === card) {
        currentlyOpenCard = null;
      }
    };

    // Attach the functions to the card object so they can be called externally
    card.openCard = openCard;
    card.closeCard = closeCard;

    // Button click handler
    button.addEventListener("click", () => {
      console.log(
        `Card #${index} - Button clicked, current state: ${isOpen ? "open" : "closed"}`,
      );

      if (isOpen) {
        closeCard();
      } else {
        openCard();
      }
    });

    // Window resize handler
    window.addEventListener("resize", () => {
      console.log(`Card #${index} - WINDOW RESIZE detected`);

      // Recalculate heights when window is resized
      calculateHeights();

      // Update current state if needed
      if (isOpen) {
        gsap.set(overlay, { height: finalOverlayHeight });
        console.log(
          `Card #${index} - Updated to new final height after resize (card is open)`,
        );
      } else {
        gsap.set(overlay, { height: initialOverlayHeight });
        console.log(
          `Card #${index} - Updated to new initial height after resize (card is closed)`,
        );
      }
    });

    console.log(`Card #${index} - All event listeners attached`);
  });
});
