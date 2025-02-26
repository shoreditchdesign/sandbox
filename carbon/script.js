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
  // 1. Find all rich text bodies and collect H2s
  const richTextBodies = document.querySelectorAll("[data-toc-body]");
  let allH2s = [];

  // 2. Find all H2s and store them
  richTextBodies.forEach((body) => {
    const h2s = body.querySelectorAll("h2");
    allH2s = [...allH2s, ...h2s];
  });

  // 3. Add IDs to H2s
  allH2s.forEach((h2, index) => {
    const id = `id-toc-link-${index + 1}`;
    h2.setAttribute("id", id);
  });

  // 4. Find TOC elements
  const tocWrappers = document.querySelectorAll("[data-toc-wrap]");

  tocWrappers.forEach((tocWrapper) => {
    const templateCell = tocWrapper.querySelector("[data-toc-cell]");

    if (!templateCell || allH2s.length === 0) {
      tocWrapper.style.display = "none";
      return;
    }

    // Clear existing cells except template
    const existingCells = tocWrapper.querySelectorAll("[data-toc-cell]");
    existingCells.forEach((cell, index) => {
      if (index !== 0) cell.remove();
    });

    // 5 & 6. Clone cells and update content/href
    allH2s.forEach((h2, index) => {
      const newCell = templateCell.cloneNode(true);
      const textElement = newCell.querySelector("[data-toc-text]");
      const id = `id-toc-link-${index + 1}`;

      // Update href for fallback
      //newCell.setAttribute("href", `#${id}`);

      if (textElement) {
        textElement.textContent = h2.textContent;
      }

      // Add click handler for JavaScript scrolling
      newCell.addEventListener("click", (e) => {
        e.preventDefault();
        const offset = 100; // Adjust this value based on your header height
        const targetPosition =
          h2.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      });

      tocWrapper.appendChild(newCell);
    });

    // Remove template cell
    templateCell.remove();
  });
});
