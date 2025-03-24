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
document.addEventListener("DOMContentLoaded", function () {
  // Part 1: Add data-stagger-block to children of data-toc-body elements
  const tocBodyElements = document.querySelectorAll("[data-toc-body]");

  if (tocBodyElements.length === 0) {
    console.log("No elements with [data-toc-body] found");
  } else {
    tocBodyElements.forEach(function (tocBody) {
      const childElements = tocBody.children;

      if (childElements.length === 0) {
        console.log("No children found for a data-toc-body element");
      } else {
        Array.from(childElements).forEach(function (child) {
          child.setAttribute("data-stagger-block", "");
          console.log("Added data-stagger-block to element:", child);
        });

        console.log(
          `Added data-stagger-block to ${childElements.length} children of a data-toc-body element`,
        );
      }
    });
  }

  // Part 2: Create table of contents
  const richTextBodies = document.querySelectorAll("[data-toc-body]");
  let allH2s = [];

  richTextBodies.forEach((body) => {
    const h2s = body.querySelectorAll("h2");
    allH2s = [...allH2s, ...h2s];
  });

  // If no H2s are found, remove template cells from all TOC wrappers
  if (allH2s.length === 0) {
    const tocWrappers = document.querySelectorAll("[data-toc-wrap]");
    tocWrappers.forEach((tocWrapper) => {
      const templateCell = tocWrapper.querySelector("[data-toc-cell]");
      if (templateCell) {
        templateCell.remove();
      }
      tocWrapper.style.display = "none";
    });
    return; // Exit early if no H2s found
  }

  allH2s.forEach((h2, index) => {
    const id = `id-toc-link-${index + 1}`;
    h2.setAttribute("id", id);
  });

  const tocWrappers = document.querySelectorAll("[data-toc-wrap]");

  tocWrappers.forEach((tocWrapper) => {
    const templateCell = tocWrapper.querySelector("[data-toc-cell]");

    if (!templateCell || allH2s.length === 0) {
      tocWrapper.style.display = "none";
      return;
    }

    const existingCells = tocWrapper.querySelectorAll("[data-toc-cell]");
    existingCells.forEach((cell, index) => {
      if (index !== 0) cell.remove();
    });

    allH2s.forEach((h2, index) => {
      const newCell = templateCell.cloneNode(true);
      const textElement = newCell.querySelector("[data-toc-text]");
      const id = `id-toc-link-${index + 1}`;

      // Store the id as a data attribute instead of href
      newCell.setAttribute("data-toc-target", id);
      // Remove href to prevent default behavior
      newCell.removeAttribute("href");

      if (textElement) {
        textElement.textContent = h2.textContent;
      }

      newCell.addEventListener("click", (e) => {
        e.preventDefault();
        const targetH2 = document.getElementById(id);
        if (targetH2) {
          const offset = 200;
          const targetPosition =
            targetH2.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });

      tocWrapper.appendChild(newCell);
    });

    templateCell.remove();
  });
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
        paragraph.setAttribute("data-motion-element", "single");
      });

      console.log(
        `Added data-stagger-block and data-motion-element=single to ${paragraphs.length} paragraphs in a .w-richtext element`,
      );
    }
  });
});
