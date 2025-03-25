//Setting Stagger Attributes
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof SplitType === "undefined") {
      console.error("GSAP or SplitType is not loaded.");
      return;
    }

    // Add data attribute to target elements - MODIFIED to exclude elements with data-stagger-block
    document.querySelectorAll("h1, h2, p").forEach((element) => {
      // Only apply to elements that don't have the data-stagger-block attribute
      if (!element.hasAttribute("data-stagger-block")) {
        element.setAttribute("data-stagger-fade", "");
      }
    });
  }, 0);
});
