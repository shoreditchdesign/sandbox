console.log("graphene1 deployed");

// Conversion Pop-up
gsap.registerPlugin(ScrollTrigger);

const popup = document.querySelector(".c-nw_share-wrap");
const popupHeight = popup.offsetHeight;

const conversionDistance =
  parseFloat(popup.getAttribute("data-conversion-distance")) || 1.5; // fallback to 1.5 if not set

gsap.fromTo(popup, { y: popupHeight }, { y: 0, duration: 0.5, paused: true });

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

//Graphene Preloader
console.log("graphene deployed");
