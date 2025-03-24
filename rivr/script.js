//Intercom Widget
document.addEventListener("DOMContentLoaded", function () {
  window.intercomSettings = {
    api_base: "https://api-iam.intercom.io",
    app_id: "jey3sjgt",
  };

  // We pre-filled your app ID in the widget URL: 'https://widget.intercom.io/widget/jey3sjgt'
  (function () {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic("reattach_activator");
      ic("update", w.intercomSettings);
    } else {
      var d = document;
      var i = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var l = function () {
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.intercom.io/widget/jey3sjgt";
        var x = d.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
      };
      if (document.readyState === "complete") {
        l();
      } else if (w.attachEvent) {
        w.attachEvent("onload", l);
      } else {
        w.addEventListener("load", l, false);
      }
    }
  })();
});

//Lenis Smooth Scroll
if (window.innerWidth >= 992) {
  // Only initialize on desktop (width >= 992px)
  const lenis = new Lenis({
    smooth: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    infinite: false,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

//Table of Contents
// Try this modified event listener for your click handler
newCell.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Scroll click triggered for ID:", id);

  const targetH2 = document.getElementById(id);
  if (targetH2) {
    console.log("Target element found:", targetH2);

    // Option 1: Use scrollIntoView instead
    targetH2.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Apply offset using a timeout to ensure scrolling has started
    setTimeout(() => {
      console.log("Applying offset adjustment");
      window.scrollBy({
        top: -200,
        behavior: "smooth",
      });
    }, 10);

    /*
    // Option 2: Alternative approach if Option 1 doesn't work
    // Use requestAnimationFrame to ensure calculations happen at the right time
    requestAnimationFrame(() => {
      const offset = 200;
      const targetPosition = targetH2.getBoundingClientRect().top + window.pageYOffset - offset;
      console.log("Calculated position:", targetPosition);

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
    */
  } else {
    console.error("Target element not found for ID:", id);
  }
});
//Block rich text elements from aniamting
document.addEventListener("DOMContentLoaded", function () {
  const richTextElements = document.querySelectorAll(".w-richtext");

  if (richTextElements.length === 0) {
    console.log("No elements with class .w-richtext found");
    return;
  }

  richTextElements.forEach(function (richText) {
    const paragraphs = richText.querySelectorAll("p");

    if (paragraphs.length === 0) {
      console.log("No paragraph elements found in a .w-richtext element");
    } else {
      paragraphs.forEach(function (paragraph) {
        paragraph.setAttribute("data-stagger-block", "");
      });

      console.log(
        `Added data-stagger-block to ${paragraphs.length} paragraphs in a .w-richtext element`,
      );
    }
  });
});
