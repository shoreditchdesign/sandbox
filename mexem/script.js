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
  // Map bounds for continuous landmass projection (Americas → Europe/Africa → Asia)
  const mapBounds = {
    north: 80, // Northern landmasses (80N)
    south: -60, // Southern extremes (60S)
    west: -170, // Alaska tip (170W)
    east: 170, // Russia tip (170E)
  };

  // Parse coordinate string (e.g., "51.5N" -> {value: 51.5, direction: "N"})
  function parseCoordinate(coordStr) {
    console.log("Parsing coordinate:", coordStr);

    if (!coordStr) return null;

    // Clean string - remove spaces, degrees symbol
    const cleaned = coordStr.toString().trim().replace(/°/g, "");
    console.log("Cleaned coordinate:", cleaned);

    // Extract direction letter (N, S, E, W)
    const direction = cleaned.match(/[NSEW]/i);
    if (!direction) {
      console.error("No direction found in:", coordStr);
      return null;
    }

    // Extract numerical value
    const numStr = cleaned.replace(/[NSEW]/i, "").trim();
    const value = parseFloat(numStr);

    if (isNaN(value)) {
      console.error("Invalid number in:", coordStr);
      return null;
    }

    const result = {
      value: value,
      direction: direction[0].toUpperCase(),
    };

    console.log("Parsed result:", result);
    return result;
  }

  // Convert parsed coordinates to decimal degrees
  function toDecimalDegrees(coord) {
    if (!coord) return null;

    let decimal = coord.value;

    // Convert to negative for South/West
    if (coord.direction === "S" || coord.direction === "W") {
      decimal = -decimal;
    }

    console.log(`Converted ${coord.value}${coord.direction} to ${decimal}°`);
    return decimal;
  }

  // Convert lat/lng to percentage positions (0-100)
  function coordsToPercentage(lat, lng) {
    console.log("Converting coordinates:", lat, lng);

    // X percentage (longitude)
    const xPercent =
      ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;

    // Y percentage (latitude) - inverted for top-left origin
    const yPercent =
      ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;

    const result = {
      x: Math.max(0, Math.min(100, xPercent)),
      y: Math.max(0, Math.min(100, yPercent)),
    };

    console.log("Percentage position:", result);
    return result;
  }

  // Main function to position all markers
  function positionMarkers() {
    console.log("=== Starting marker positioning ===");

    const markers = document.querySelectorAll("[data-map-marker]");
    console.log(`Found ${markers.length} markers`);

    if (markers.length === 0) {
      console.warn("No markers found with [data-map-marker] attribute");
      return;
    }

    markers.forEach((marker, index) => {
      console.log(`\n--- Processing marker ${index + 1} ---`);

      const latStr = marker.getAttribute("data-map-lat");
      const lngStr = marker.getAttribute("data-map-lng");

      console.log("Raw attributes:", { lat: latStr, lng: lngStr });

      if (!latStr || !lngStr) {
        console.error("Missing coordinates for marker:", marker);
        return;
      }

      // Parse coordinates
      const latParsed = parseCoordinate(latStr);
      const lngParsed = parseCoordinate(lngStr);

      if (!latParsed || !lngParsed) {
        console.error("Failed to parse coordinates for marker:", marker);
        return;
      }

      // Convert to decimal degrees
      const lat = toDecimalDegrees(latParsed);
      const lng = toDecimalDegrees(lngParsed);

      // Convert to percentage position
      const position = coordsToPercentage(lat, lng);

      // Apply CSS positioning (force absolute positioning)
      marker.style.position = "absolute";
      marker.style.left = `${position.x}%`;
      marker.style.top = `${position.y}%`;
      marker.style.transform = "translate(-50%, -50%)"; // Center marker on coordinates

      console.log(
        `Marker positioned at: left: ${position.x}%, top: ${position.y}%`,
      );

      // Optional: Add data attributes for debugging
      marker.setAttribute("data-debug-lat", lat);
      marker.setAttribute("data-debug-lng", lng);
      marker.setAttribute("data-debug-x", position.x.toFixed(2));
      marker.setAttribute("data-debug-y", position.y.toFixed(2));
    });

    console.log("=== Marker positioning complete ===");
  }

  // Initialize positioning
  positionMarkers();

  // Expose function globally for manual triggering
  window.positionMapMarkers = positionMarkers;

  console.log(
    "Map positioning system initialized. Call positionMapMarkers() to re-run.",
  );
});
