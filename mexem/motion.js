//GSAP for Navbar Tuck
document.addEventListener("DOMContentLoaded", () => {
  const navbars = document.querySelectorAll(
    '[data-nav-element="navbar-wrap"]:not([data-tuck-block="blocked"])',
  );
  if (navbars.length === 0) {
    console.warn("No navbar elements found - animation aborted");
    return;
  }

  // Set initial attribute state
  navbars.forEach((navbar) => {
    navbar.setAttribute("data-tuck-state", "default");
  });

  gsap.set(navbars, { yPercent: 0, translateY: "0%" });
  const showAnim = gsap
    .from(navbars, {
      yPercent: -100,
      paused: true,
      duration: 0.2,
    })
    .progress(1);
  let lastScrollTop = 0;
  const downScrollThreshold = 200;
  const upScrollThreshold = 200;
  let accumulatedScroll = 0;
  let navbarVisible = true;
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
    const scrollAmount = Math.abs(scrollTop - lastScrollTop);
    if (
      (scrollDirection === "down" && accumulatedScroll < 0) ||
      (scrollDirection === "up" && accumulatedScroll > 0)
    ) {
      accumulatedScroll = 0;
    }
    accumulatedScroll +=
      scrollDirection === "down" ? scrollAmount : -scrollAmount;
    if (accumulatedScroll > downScrollThreshold && navbarVisible) {
      showAnim.reverse();
      navbarVisible = false;
      accumulatedScroll = 0;

      // Set attribute to default when hiding navbar (reverse animation)
      navbars.forEach((navbar) => {
        navbar.setAttribute("data-tuck-state", "default");
      });
    } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
      showAnim.play();
      navbarVisible = true;
      accumulatedScroll = 0;

      // Set attribute to hidden when showing navbar (play animation)
      navbars.forEach((navbar) => {
        navbar.setAttribute("data-tuck-state", "hidden");
      });
    }
    lastScrollTop = scrollTop;
  });
});
