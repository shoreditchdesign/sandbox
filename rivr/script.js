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

document
  .querySelector('[data-nav-element="toggle"]')
  .addEventListener("click", () => {
    const toggle = document.querySelector('[data-nav-element="toggle"]');
    const currentState = toggle.getAttribute("data-toggle-state");
    toggle.setAttribute(
      "data-toggle-state",
      currentState === "open" ? "closed" : "open",
    );
  });
