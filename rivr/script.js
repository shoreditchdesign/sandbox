window.intercomSettings = {
  api_base: "https://api-iam.intercom.io",
  app_id: "jey3sjgt",
};

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
    const drawer = document.querySelector('[data-nav-element="drawer"]');
    const grid = drawer.querySelector('[data-nav-element="grid"]');
    const finalHeight = grid.offsetHeight;

    const currentState = toggle.getAttribute("data-toggle-state");
    const newState = currentState === "open" ? "closed" : "open";

    toggle.setAttribute("data-toggle-state", newState);

    if (newState === "open") {
      // Animate from 0 to final height
      drawer.style.height = "0px";
      drawer.style.overflow = "hidden";
      setTimeout(() => {
        drawer.style.transition = "height 0.3s ease";
        drawer.style.height = finalHeight + "px";
      }, 10);
    } else {
      // Animate from final height to 0
      drawer.style.height = finalHeight + "px";
      drawer.style.overflow = "hidden";
      drawer.style.transition = "height 0.3s ease";
      setTimeout(() => {
        drawer.style.height = "0px";
      }, 10);
    }
  });
