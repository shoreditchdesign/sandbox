console.log("script deployed");

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
