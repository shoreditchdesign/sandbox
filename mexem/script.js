//Textarea Resizer
document.addEventListener("DOMContentLoaded", () => {
  const textareas = document.querySelectorAll("textarea");

  textareas.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
});

//Map Locator
document.addEventListener("DOMContentLoaded", function () {
  // Parse percentage value from attribute string
  function parsePercentage(value) {
    console.log("Parsing percentage:", value);
    if (!value) return null;
    // Clean string - remove %, spaces, and convert to number
    const cleaned = value.toString().trim().replace(/%/g, "");
    const number = parseFloat(cleaned);
    if (isNaN(number)) {
      console.error("Invalid percentage value:", value);
      return null;
    }
    // Clamp between 0-100
    const clamped = Math.max(0, Math.min(100, number));
    console.log(`Parsed ${value} to ${clamped}%`);
    return clamped;
  }

  // Main function to position all markers using x,y coordinates
  function positionMarkers() {
    console.log("=== Starting simple x,y marker positioning ===");
    const markers = document.querySelectorAll("[data-map-marker]");
    console.log(`Found ${markers.length} markers`);
    if (markers.length === 0) {
      console.warn("No markers found with [data-map-marker] attribute");
      return;
    }
    markers.forEach((marker, index) => {
      console.log(`\n--- Processing marker ${index + 1} ---`);
      const xStr = marker.getAttribute("data-map-x");
      const yStr = marker.getAttribute("data-map-y");
      console.log("Raw attributes:", { x: xStr, y: yStr });
      if (!xStr || !yStr) {
        console.error("Missing x,y coordinates for marker:", marker);
        return;
      }
      // Parse x,y percentages
      const x = parsePercentage(xStr);
      const y = parsePercentage(yStr);
      if (x === null || y === null) {
        console.error("Failed to parse x,y coordinates for marker:", marker);
        return;
      }
      // Apply CSS positioning directly
      marker.style.position = "absolute";
      marker.style.left = `${x}%`;
      marker.style.top = `${y}%`;
      marker.style.transform = "translate(-50%, -50%)"; // Center marker on coordinates
      console.log(`Marker positioned at: left: ${x}%, top: ${y}%`);
      // Add debug attributes
      marker.setAttribute("data-debug-x", x);
      marker.setAttribute("data-debug-y", y);
    });
    console.log("=== Simple x,y positioning complete ===");
  }

  // Separate function to add hover event listeners to all markers
  function addHoverListeners() {
    console.log("=== Adding hover listeners to all markers ===");

    const markers = document.querySelectorAll("[data-map-marker]");
    console.log(`Found ${markers.length} markers for hover listeners`);

    markers.forEach((marker, index) => {
      console.log(`Adding hover listeners to marker ${index + 1}`);

      // Add hover event listeners for modal state
      marker.addEventListener("mouseenter", function () {
        console.log("Marker hovered:", marker);
        marker.setAttribute("data-marker-state", "active");
      });

      marker.addEventListener("mouseleave", function () {
        console.log("Marker unhovered:", marker);
        marker.setAttribute("data-marker-state", "default");
      });
    });

    console.log("=== Hover listeners added to all markers ===");
  }

  // Initialize positioning
  positionMarkers();

  // Add hover listeners to all markers (separate function)
  addHoverListeners();

  // Expose functions globally for manual triggering
  window.positionMapMarkers = positionMarkers;
  window.addHoverListeners = addHoverListeners;

  console.log(
    "Simple x,y positioning system initialized. Call positionMapMarkers() to re-run.",
  );
});
