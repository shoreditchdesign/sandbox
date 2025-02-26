console.log("script deployed");

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
      newCell.setAttribute("data-target", id);
      // Remove href to prevent default behavior
      newCell.removeAttribute("href");

      if (textElement) {
        textElement.textContent = h2.textContent;
      }

      newCell.addEventListener("click", (e) => {
        e.preventDefault();
        const targetH2 = document.getElementById(id);
        if (targetH2) {
          const offset = 100; // Adjust based on your header height
          const targetPosition =
            targetH2.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth", // This adds the smooth motion effect
          });
        }
      });

      tocWrapper.appendChild(newCell);
    });

    templateCell.remove();
  });
});
