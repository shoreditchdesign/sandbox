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
    console.warn("No elements with [data-toc-body] found");
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

      // MODIFIED PART - Fixed smooth scrolling with requestAnimationFrame
      newCell.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Scroll click triggered for ID:", id);

        const targetH2 = document.getElementById(id);
        if (targetH2) {
          console.log("Target element found:", targetH2);

          requestAnimationFrame(() => {
            const offset = 200;
            const targetPosition =
              targetH2.getBoundingClientRect().top +
              window.pageYOffset -
              offset;
            console.log("Scrolling to position:", targetPosition);

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          });
        }
      });
      // END OF MODIFIED PART

      tocWrapper.appendChild(newCell);
    });
    templateCell.remove();
  });
});

//Animation Blockers
document.addEventListener("DOMContentLoaded", function () {
  const richTextElements = document.querySelectorAll(".w-richtext");

  if (richTextElements.length === 0) {
    return;
  }

  richTextElements.forEach(function (richText) {
    const paragraphs = richText.querySelectorAll("p");

    if (paragraphs.length === 0) {
      // No paragraph elements found
    } else {
      paragraphs.forEach(function (paragraph) {
        paragraph.setAttribute("data-stagger-block", "");
      });
    }
  });
});

//Banner Injection
document.addEventListener("DOMContentLoaded", function () {
  // Find all parent elements with class w-richtext
  const richTextElements = document.querySelectorAll(".w-richtext");

  // Find the banner element that we'll use as a replacement
  const bannerElement = document.querySelector("[data-blog-banner]");

  // If there's no banner element, exit early
  if (!bannerElement) {
    console.warn("No element with data-blog-banner attribute found");
    return;
  }

  richTextElements.forEach(function (parent) {
    // Look for paragraphs inside each rich text element
    const paragraphs = parent.querySelectorAll("p");

    paragraphs.forEach(function (paragraph) {
      // Check if paragraph contains exactly "{{banner}}"
      if (paragraph.textContent.trim() === "{{banner}}") {
        // Clone the banner element to insert (in case we need to use it multiple times)
        const bannerClone = bannerElement.cloneNode(true);

        // Insert the banner clone before the paragraph
        parent.insertBefore(bannerClone, paragraph);

        // Remove the original paragraph
        paragraph.remove();
      }
    });
  });

  bannerElement.remove();
});

//Active Journal Links
document.addEventListener("DOMContentLoaded", function () {
  // Select all h2 headings and TOC links
  const headings = document.querySelectorAll('h2[id^="id-toc-link-"]');
  const tocLinks = document.querySelectorAll(
    "[data-toc-cell][data-toc-target]",
  );

  // Try alternative selectors if nothing found
  if (headings.length === 0) {
    const altHeadings = document.querySelectorAll("h2");
  }

  if (tocLinks.length === 0) {
    const altTocLinks = document.querySelectorAll(".d-jl2_toc-cell");
  }

  // Function to update active state
  function updateActiveState(currentId) {
    // Remove active class from all TOC links
    tocLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to the TOC link matching currentId
    if (currentId) {
      const activeLink = document.querySelector(
        `[data-toc-target="${currentId}"]`,
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  }

  // Create IntersectionObserver
  const options = {
    root: null, // Use viewport as root
    rootMargin: "-10% 0px -80% 0px", // Adjust these values based on preference
    threshold: 0, // Trigger as soon as any part becomes visible
  };

  // Track scroll direction
  let lastScrollTop = 0;
  let scrollDirection = "down";

  window.addEventListener("scroll", () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    scrollDirection = st > lastScrollTop ? "down" : "up";
    lastScrollTop = st <= 0 ? 0 : st;
  });

  // Observer callback function
  const observerCallback = (entries) => {
    // Check if any heading is intersecting
    const isAnyIntersecting = entries.some((entry) => entry.isIntersecting);

    if (isAnyIntersecting) {
      // Find the first intersecting heading
      for (const entry of entries) {
        if (entry.isIntersecting) {
          updateActiveState(entry.target.id);
          break;
        }
      }
    } else {
      // Handle case when scrolled past all headings
      if (scrollDirection === "down" && window.scrollY > 0) {
        // If scrolled down past last heading, set last heading as active
        const lastHeading = headings[headings.length - 1];
        updateActiveState(lastHeading.id);
      } else if (scrollDirection === "up" && window.scrollY > 0) {
        // If scrolled up above first heading, set first heading as active
        const firstHeading = headings[0];
        updateActiveState(firstHeading.id);
      }
    }
  };

  // Create and start observer
  const observer = new IntersectionObserver(observerCallback, options);

  // Start observing all headings
  headings.forEach((heading) => {
    observer.observe(heading);
  });

  // Handle initial state on page load
  window.addEventListener("DOMContentLoaded", () => {
    // Set first heading as active by default
    if (headings.length > 0) {
      // Check if any headings are in view on load
      const inView = Array.from(headings).find((heading) => {
        const rect = heading.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      if (inView) {
        updateActiveState(inView.id);
      } else {
        updateActiveState(headings[0].id);
      }
    }
  });
});

//Tab Switchers
// Select all tab links
//Tab Switchers
document.addEventListener("DOMContentLoaded", function () {
  const tabLinks = document.querySelectorAll("[data-tab-link]");

  // Add click event listeners to each tab link
  tabLinks.forEach((tabLink) => {
    tabLink.addEventListener("click", () => {
      // Get the tab link value (index)
      const tabIndex = tabLink.getAttribute("data-tab-link");
      console.log("Tab clicked:", tabIndex);

      // Find all tab links and panes
      const allTabLinks = document.querySelectorAll("[data-tab-link]");
      const allTabPanes = document.querySelectorAll("[data-tab-pane]");

      // Set all tab links and panes to hide
      allTabLinks.forEach((link) => {
        link.setAttribute("data-tab-state", "hide");
      });

      allTabPanes.forEach((pane) => {
        pane.setAttribute("data-tab-state", "hide");
      });

      // Set the clicked tab link to show
      tabLink.setAttribute("data-tab-state", "show");
      console.log("Showing tab link:", tabIndex);

      // Find and show the corresponding tab pane
      const correspondingPane = document.querySelector(
        `[data-tab-pane="${tabIndex}"]`,
      );
      if (correspondingPane) {
        correspondingPane.setAttribute("data-tab-state", "show");
        console.log("Showing tab pane:", tabIndex);
      } else {
        console.log("No matching tab pane found for index:", tabIndex);
      }
    });
  });
});
