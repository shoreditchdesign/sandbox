// Excerpt from:
console.log("ix deployed");

// Marquee Cards
(function () {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMarqueeCards);
  } else {
    initializeMarqueeCards();
  }
})();

document.addEventListener("DOMContentLoaded", () => {
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
});

(function () {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMarqueeCards);
  } else {
    initializeMarqueeCards();
  }
})();

(function () {
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMarqueeCards);
  } else {
    initializeMarqueeCards();
  }
})();

(function () {
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

  document.addEventListener("DOMContentLoaded", () => {
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
})();
