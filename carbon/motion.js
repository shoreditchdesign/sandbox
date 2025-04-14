console.log("graphene1 deployed");

document.addEventListener("DOMContentLoaded", () => {
  // Only execute popup code if the element exists
  const popup = document.querySelector(".c-nw_share-wrap");
  if (popup) {
    // Conversion Pop-up
    gsap.registerPlugin(ScrollTrigger);
    const popupHeight = popup.offsetHeight;
    const conversionDistance =
      parseFloat(popup.getAttribute("data-conversion-distance")) || 1.5;
    gsap.fromTo(
      popup,
      { y: popupHeight },
      { y: 0, duration: 0.5, paused: true },
    );
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        if (self.scroll() > window.innerHeight * conversionDistance) {
          gsap.to(popup, { y: 0 });
        } else {
          gsap.to(popup, { y: 2 * popupHeight });
        }
      },
    });
    console.log("Popup initialized");
  }
});

console.log("graphene2 deployed");
//Graphene Preloader
