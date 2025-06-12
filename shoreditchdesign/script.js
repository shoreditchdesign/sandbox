//Pixel Configruation
function initFacebookPixel() {
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );
  fbq("init", "894766198261900");
  fbq("track", "PageView");
}

//Countup Numbers
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".counterup").forEach((element, index) => {
    let thisId = "countup" + index;
    element.setAttribute("id", thisId);
    let startNumber = +element.textContent;
    let endNumber = +element.getAttribute("final-number");
    let decimals = 0;
    let duration = element.getAttribute("count-duration");
    let myCounter = new CountUp(
      thisId,
      startNumber,
      endNumber,
      decimals,
      duration,
    );

    /* Scroll out of view trigger
    ScrollTrigger.create({
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      onLeaveBack: () => {
        myCounter.reset();
      }
    });*/

    // Scroll into view trigger
    ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      end: "bottom top",
      onEnter: () => {
        myCounter.start();
      },
    });
  });
});
