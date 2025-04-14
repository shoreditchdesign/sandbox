console.log("graphene1 deployed");

// Check if popup element exists
const popup = document.querySelector(".c-nw_share-wrap");
console.log("Popup element found:", popup);

// Only proceed if popup exists
if (popup) {
  const popupHeight = popup.offsetHeight;
  console.log("Popup height:", popupHeight);

  const conversionDistance =
    parseFloat(popup.getAttribute("data-conversion-distance")) || 1.5;
  console.log("Conversion distance:", conversionDistance);

  // Check GSAP availability
  console.log("GSAP available:", typeof gsap !== "undefined");
  console.log("ScrollTrigger available:", typeof ScrollTrigger !== "undefined");

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
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
  }
}

console.log("graphene2 deployed");
