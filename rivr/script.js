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
