console.log("ix deployed");

// Marquee Cards Hover
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

// Team Cards Hover
document.addEventListener("DOMContentLoaded", () => {
  // Animation Constants
  const ANIMATION = {
    duration: 0.4,
    opacityDuration: 0.3,
    ease: "power2.out",
  };

  // Select all card elements using data attribute
  const cards = document.querySelectorAll("[data-ab-card='card']");

  // Track currently open card
  let currentlyOpenCard = null;

  // Check if device is mobile
  const isMobile = () => window.innerWidth <= 767;

  // Setup for each card
  cards.forEach((card, index) => {
    const overlay = card.querySelector("[data-ab-card='overlay']");
    const content = card.querySelector("[data-ab-card='content']");
    const button = card.querySelector("[data-ab-card='button']");

    // Check if elements exist
    if (!overlay) {
      console.error(
        `Card #${index} is missing overlay element ([data-ab-card='overlay'])`,
      );
      return;
    }
    if (!content) {
      console.error(
        `Card #${index} is missing content element ([data-ab-card='content'])`,
      );
      return;
    }
    if (!button) {
      console.error(
        `Card #${index} is missing button element ([data-ab-card='button'])`,
      );
      return;
    }

    // Initial state - check data-card-state attribute
    let isOpen = overlay.getAttribute("data-card-state") === "open";

    // Height variables
    let initialOverlayHeight;
    let finalOverlayHeight;
    let contentHeight;

    // Function to calculate heights - different for mobile vs desktop
    const calculateHeights = () => {
      initialOverlayHeight = parseFloat(
        window.getComputedStyle(overlay).height,
      );

      // For mobile: initialHeight + contentHeight
      // For desktop: use card's full height
      if (isMobile()) {
        // Make content temporarily visible to measure height
        const contentDisplay = window.getComputedStyle(content).display;
        const contentOpacity = window.getComputedStyle(content).opacity;

        gsap.set(content, { display: "flex", opacity: 0 });
        contentHeight = parseFloat(window.getComputedStyle(content).height);

        // Reset content to original state
        gsap.set(content, { display: contentDisplay, opacity: contentOpacity });

        finalOverlayHeight = initialOverlayHeight + contentHeight;
      } else {
        // Desktop behavior - use card's full height
        finalOverlayHeight = parseFloat(window.getComputedStyle(card).height);
      }

      console.log(
        `Card #${index}: Heights calculated - Initial: ${initialOverlayHeight}, Final: ${finalOverlayHeight}`,
      );
    };

    // Calculate on page load
    calculateHeights();

    // Set initial styles
    gsap.set(content, {
      display: isOpen ? "flex" : "none",
      opacity: isOpen ? 1 : 0,
    });

    gsap.set(overlay, {
      height: isOpen ? finalOverlayHeight : initialOverlayHeight,
      overflow: isOpen && !isMobile() ? "scroll" : "hidden",
    });

    // Create quickTo function for the overlay height
    const animateHeight = gsap.quickTo(overlay, "height", {
      duration: ANIMATION.duration,
      ease: ANIMATION.ease,
    });

    // Create quickTo function for content opacity
    const animateOpacity = gsap.quickTo(content, "opacity", {
      duration: ANIMATION.opacityDuration,
      ease: ANIMATION.ease,
    });

    // Function to open the card
    const openCard = () => {
      if (overlay.getAttribute("data-card-state") === "open") return;

      // If another card is open, close it first
      if (currentlyOpenCard && currentlyOpenCard !== card) {
        currentlyOpenCard.closeCard();
      }

      // Recalculate heights to ensure correct measurements
      calculateHeights();

      // Update card state attribute
      overlay.setAttribute("data-card-state", "open");

      // Animate overlay height using quickTo
      animateHeight(finalOverlayHeight);

      // Show content and animate opacity
      gsap.set(content, { display: "flex" });
      animateOpacity(1);

      // Set overflow to scroll ONLY on desktop
      if (!isMobile()) {
        gsap.delayedCall(ANIMATION.opacityDuration, () => {
          gsap.set(overlay, { overflowY: "scroll" });
        });
      }

      currentlyOpenCard = card;
      console.log(
        `Card #${index} opened (${isMobile() ? "Mobile" : "Desktop"} mode)`,
      );
    };

    // Function to close the card
    const closeCard = () => {
      if (overlay.getAttribute("data-card-state") === "closed") return;

      // Update card state attribute
      overlay.setAttribute("data-card-state", "closed");

      // Reset overflow immediately
      gsap.set(overlay, { overflowY: "hidden" });

      // Animate overlay back to initial height using quickTo
      animateHeight(initialOverlayHeight);

      // Fade out content
      animateOpacity(0);

      // Hide content after fade completes
      gsap.delayedCall(ANIMATION.opacityDuration, () => {
        gsap.set(content, { display: "none" });
      });

      if (currentlyOpenCard === card) {
        currentlyOpenCard = null;
      }

      console.log(`Card #${index} closed`);
    };

    // Attach the functions to the card object so they can be called externally
    card.openCard = openCard;
    card.closeCard = closeCard;

    // Button click handler
    button.addEventListener("click", () => {
      if (overlay.getAttribute("data-card-state") === "open") {
        closeCard();
      } else {
        openCard();
      }
    });

    // Window resize handler
    window.addEventListener("resize", () => {
      // Check if device type changed
      const wasMobile = overlay.hasAttribute("data-mobile");
      const nowMobile = isMobile();

      if (wasMobile !== nowMobile) {
        if (nowMobile) {
          overlay.setAttribute("data-mobile", "true");
        } else {
          overlay.removeAttribute("data-mobile");
        }

        // Reset overflow for mobile/desktop switch
        if (overlay.getAttribute("data-card-state") === "open") {
          gsap.set(overlay, { overflowY: nowMobile ? "hidden" : "scroll" });
        }
      }

      // Recalculate heights when window is resized
      calculateHeights();

      // Update current state if needed
      if (overlay.getAttribute("data-card-state") === "open") {
        gsap.set(overlay, { height: finalOverlayHeight });
      } else {
        gsap.set(overlay, { height: initialOverlayHeight });
      }
    });

    // Set initial mobile attribute
    if (isMobile()) {
      overlay.setAttribute("data-mobile", "true");
    }
  });
});
