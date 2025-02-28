console.log("script deployed");

//Brand styles

document.querySelectorAll(".c-br_brand-card").forEach((element) => {
  const cardMap = {
    Culture: "u-card-pink",
    Underwriting: "u-card-purple",
    Technology: "u-card-green",
    Complementary: "u-card-blue",
  };

  const brandValue = element.getAttribute("data-brand-map");
  if (brandValue && cardMap[brandValue]) {
    element.classList.add(cardMap[brandValue]);
  }
});

document.querySelectorAll(".c-br_brand-stroke").forEach((element) => {
  const strokeMap = {
    Culture: "u-stroke-pink",
    Underwriting: "u-stroke-purple",
    Technology: "u-stroke-green",
  };

  const brandValue = element.getAttribute("data-brand-map");
  if (brandValue && strokeMap[brandValue]) {
    element.classList.add(strokeMap[brandValue]);
  }
});

document.querySelectorAll(".c-br_brand-motif").forEach((element) => {
  const motifMap = {
    Culture: "u-motif-pink",
    Underwriting: "u-motif-purple",
    Technology: "u-motif-green",
    Complementary: "u-motif-blue",
  };

  const brandValue = element.getAttribute("data-brand-map");
  if (brandValue && motifMap[brandValue]) {
    element.classList.add(motifMap[brandValue]);
  }
});

//Announcemenet Banner

document
  .querySelector('[data-banner-element="close"]')
  .addEventListener("click", () => {
    const banner = document.querySelector('[data-banner-element="banner"]');
    const currentState = banner.getAttribute("data-banner-state");
    banner.setAttribute(
      "data-banner-state",
      currentState === "visible" ? "hidden" : "visible",
    );
  });

//Navigation Bar

document
  .querySelector('[data-nav-element="menu"]')
  .addEventListener("click", () => {
    const navbar = document.querySelector('[data-nav-element="navbar"]');
    const currentState = navbar.getAttribute("data-nav-state");
    navbar.setAttribute(
      "data-nav-state",
      currentState === "open" ? "closed" : "open",
    );
  });

//Rich Text Table of Contents

console.log("generating table of content");

document.addEventListener("DOMContentLoaded", function () {
  const richTextBodies = document.querySelectorAll("[data-toc-body]");
  let allH2s = [];

  richTextBodies.forEach((body) => {
    const h2s = body.querySelectorAll("h2");
    allH2s = [...allH2s, ...h2s];
  });

  allH2s.forEach((h2, index) => {
    const id = `id-toc-link-${index + 1}`;
    h2.setAttribute("id", id);
  });

  const tocWrappers = document.querySelectorAll("[data-toc-wrap]");

  tocWrappers.forEach((tocWrapper) => {
    const templateCell = tocWrapper.querySelector("[data-toc-cell]");

    if (!templateCell || allH2s.length === 0) {
      tocWrapper.style.display = "none";
      return;
    }

    const existingCells = tocWrapper.querySelectorAll("[data-toc-cell]");
    existingCells.forEach((cell, index) => {
      if (index !== 0) cell.remove();
    });

    allH2s.forEach((h2, index) => {
      const newCell = templateCell.cloneNode(true);
      const textElement = newCell.querySelector("[data-toc-text]");
      const id = `id-toc-link-${index + 1}`;

      // Store the id as a data attribute instead of href
      newCell.setAttribute("data-toc-target", id);
      // Remove href to prevent default behavior
      newCell.removeAttribute("href");

      if (textElement) {
        textElement.textContent = h2.textContent;
      }

      newCell.addEventListener("click", (e) => {
        e.preventDefault();
        const targetH2 = document.getElementById(id);
        if (targetH2) {
          const offset = 200;
          const targetPosition =
            targetH2.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });

      tocWrapper.appendChild(newCell);
    });

    templateCell.remove();
  });
});

//Benefits Swiper
var mySwiper = new Swiper("#benefits-swiper", {
  slidesPerView: 4,
  slidesPerGroup: 1,
  spaceBetween: 28,
  grabCursor: true,
  allowTouchMove: true,
  //loop: true,
  pagination: {
    el: "#benefits-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: "#benefits-next",
    prevEl: "#benefits-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1.1,
      slidesPerGroup: 1,
      spaceBetween: 16,
    },
    480: {
      slidesPerView: 2.3,
      slidesPerGroup: 1,
      spaceBetween: 16,
    },
    767: {
      slidesPerView: 2.2,
      slidesPerGroup: 1,
      spaceBetween: 16,
    },
    992: {
      slidesPerView: 3.2,
      slidesPerGroup: 1,
      spaceBetween: 32,
    },
  },
});
