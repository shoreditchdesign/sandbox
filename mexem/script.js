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

  // Separate function to calculate and update timezone-based times for all markers
  function updateMarkerTimes() {
    console.log("=== Updating marker times ===");

    const markers = document.querySelectorAll("[data-map-marker]");
    console.log(`Found ${markers.length} markers for time updates`);

    markers.forEach((marker, index) => {
      console.log(`Processing time for marker ${index + 1}`);

      const zoneStr = marker.getAttribute("data-map-zone");
      const timeElement = marker.querySelector("[data-map-time]");

      if (!timeElement) {
        console.warn(`No [data-map-time] element found in marker ${index + 1}`);
        return;
      }

      if (!zoneStr) {
        console.log(
          `No timezone data for marker ${index + 1}, hiding time element`,
        );
        timeElement.style.display = "none";
        return;
      }

      let offsetHours;

      // Check for summer/winter time format (e.g., "UTC-1/UTC-2")
      if (zoneStr.includes("/")) {
        const [summerTime, winterTime] = zoneStr.split("/");

        // Parse both offsets
        const summerMatch = summerTime.match(/UTC([+-]?\d+(?:\.\d+)?)/);
        const winterMatch = winterTime.match(/UTC([+-]?\d+(?:\.\d+)?)/);

        if (!summerMatch || !winterMatch) {
          console.error(
            `Invalid summer/winter timezone format for marker ${index + 1}:`,
            zoneStr,
          );
          timeElement.style.display = "none";
          return;
        }

        const summerOffset = parseFloat(summerMatch[1]);
        const winterOffset = parseFloat(winterMatch[1]);

        // Determine if it's currently summer time (rough approximation)
        const now = new Date();
        const month = now.getMonth(); // 0-11
        const isDST = month >= 2 && month <= 9; // March to October (rough DST period)

        offsetHours = isDST ? summerOffset : winterOffset;
        console.log(
          `Marker ${index + 1} using ${isDST ? "summer" : "winter"} time: ${offsetHours} hours`,
        );
      } else {
        // Single timezone format (e.g., "UTC+5", "UTC-8.5")
        const offsetMatch = zoneStr.match(/UTC([+-]?\d+(?:\.\d+)?)/);
        if (!offsetMatch) {
          console.error(
            `Invalid timezone format for marker ${index + 1}:`,
            zoneStr,
          );
          timeElement.style.display = "none";
          return;
        }

        offsetHours = parseFloat(offsetMatch[1]);
        console.log(
          `Marker ${index + 1} timezone offset: ${offsetHours} hours`,
        );
      }

      // Calculate current time for this timezone
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC
      const localTime = new Date(utcTime + offsetHours * 3600000); // Add offset

      // Format time as 24-hour format
      const hours = localTime.getHours().toString().padStart(2, "0");
      const minutes = localTime.getMinutes().toString().padStart(2, "0");
      const formattedTime = `Local Time: ${hours}:${minutes}`;

      console.log(`Marker ${index + 1} time: ${formattedTime}`);

      // Inject formatted time into element
      timeElement.textContent = formattedTime;
      timeElement.style.display = ""; // Ensure it's visible
    });

    console.log("=== Marker times updated ===");
  }

  // Function to start automatic time updates every minute
  function startTimeUpdates() {
    console.log("=== Starting automatic time updates ===");

    // Update immediately
    updateMarkerTimes();

    // Set up interval to update every minute
    setInterval(updateMarkerTimes, 60000);

    console.log("Time updates will refresh every minute");
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
