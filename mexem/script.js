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
    return clamped;
  }

  // Main function to position all markers using x,y coordinates
  function positionMarkers() {
    const markers = document.querySelectorAll("[data-map-marker]");
    if (markers.length === 0) {
      console.warn("No markers found with [data-map-marker] attribute");
      return;
    }
    markers.forEach((marker) => {
      const xStr = marker.getAttribute("data-map-x");
      const yStr = marker.getAttribute("data-map-y");
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
      // Add debug attributes
      marker.setAttribute("data-debug-x", x);
      marker.setAttribute("data-debug-y", y);
    });
  }

  // Separate function to add hover event listeners to all markers
  function addHoverListeners() {
    const markers = document.querySelectorAll("[data-map-marker]");
    markers.forEach((marker) => {
      // Check if listeners already added
      if (marker.hasAttribute("data-listeners-added")) {
        return;
      }

      // Add hover event listeners for modal state
      marker.addEventListener("mouseenter", function () {
        marker.setAttribute("data-marker-state", "active");
      });

      marker.addEventListener("mouseleave", function () {
        marker.setAttribute("data-marker-state", "default");
      });

      // Mark as having listeners added
      marker.setAttribute("data-listeners-added", "true");
    });
  }

  // Separate function to calculate and update timezone-based times for all markers
  function updateMarkerTimes() {
    const markers = document.querySelectorAll("[data-map-marker]");

    markers.forEach((marker) => {
      const zoneStr = marker.getAttribute("data-map-zone");
      const timeElement = marker.querySelector("[data-map-time]");

      if (!timeElement) {
        console.warn(`No [data-map-time] element found in marker`);
        return;
      }

      if (!zoneStr) {
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
            `Invalid summer/winter timezone format for marker:`,
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
      } else {
        // Single timezone format (e.g., "UTC+5", "UTC-8.5")
        const offsetMatch = zoneStr.match(/UTC([+-]?\d+(?:\.\d+)?)/);
        if (!offsetMatch) {
          console.error(`Invalid timezone format for marker:`, zoneStr);
          timeElement.style.display = "none";
          return;
        }

        offsetHours = parseFloat(offsetMatch[1]);
      }

      // Calculate current time for this timezone
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC
      const localTime = new Date(utcTime + offsetHours * 3600000); // Add offset

      // Format time as 24-hour format
      const hours = localTime.getHours().toString().padStart(2, "0");
      const minutes = localTime.getMinutes().toString().padStart(2, "0");
      const formattedTime = `Local Time: ${hours}:${minutes}`;

      // Inject formatted time into element
      timeElement.textContent = formattedTime;
      timeElement.style.display = ""; // Ensure it's visible
    });
  }

  // Function to start automatic time updates every minute
  function startTimeUpdates() {
    // Update immediately
    updateMarkerTimes();

    // Set up interval to update every minute
    setInterval(updateMarkerTimes, 60000);
  }

  // Initialize all functions
  positionMarkers();
  addHoverListeners();
  startTimeUpdates();

  // Expose functions globally for manual triggering
  window.positionMapMarkers = positionMarkers;
  window.addHoverListeners = addHoverListeners;
  window.updateMarkerTimes = updateMarkerTimes;
  window.startTimeUpdates = startTimeUpdates;
});

//Stock Market times
document.addEventListener("DOMContentLoaded", function () {
  function checkMarketHours() {
    const marketTabs = document.querySelectorAll("[data-market-tab]");

    marketTabs.forEach((tab) => {
      const zone = tab.getAttribute("data-market-zone");
      const openTime = tab.getAttribute("data-market-open");
      const closeTime = tab.getAttribute("data-market-close");
      const labelElement = tab.querySelector("[data-market-label]");

      // Parse timezone (handle UTC-1/UTC-2 or UTC-1/UTC-1 formats)
      const zoneOffset = parseTimezone(zone);

      // Get current time in market timezone
      const now = new Date();
      const marketTime = new Date(now.getTime() + zoneOffset * 60 * 60 * 1000);
      const currentDay = marketTime.getUTCDay(); // 0=Sunday, 6=Saturday
      const currentTimeStr =
        marketTime.getUTCHours().toString().padStart(2, "0") +
        ":" +
        marketTime.getUTCMinutes().toString().padStart(2, "0");

      let isOpen = false;

      // Check if weekend (Saturday=6, Sunday=0)
      if (currentDay === 0 || currentDay === 6) {
        isOpen = false;
      } else {
        // Compare times for weekdays
        isOpen = isTimeBetween(currentTimeStr, openTime, closeTime);
      }

      // Update elements
      const status = isOpen ? "open" : "closed";
      if (labelElement) {
        labelElement.textContent = status;
      }
      tab.setAttribute("data-market-state", status);
    });
  }

  function parseTimezone(zone) {
    // Handle formats like UTC-1/UTC-2 or UTC+1/UTC+2
    const parts = zone.split("/");
    const primaryZone = parts[0]; // Use first timezone (summer time)

    const match = primaryZone.match(/UTC([+-]?\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
    return 0; // Default to UTC if parsing fails
  }

  function isTimeBetween(current, open, close) {
    // Convert time strings to minutes for easier comparison
    const currentMinutes = timeToMinutes(current);
    const openMinutes = timeToMinutes(open);
    const closeMinutes = timeToMinutes(close);

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }

  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Run immediately
  checkMarketHours();

  // Run every minute
  setInterval(checkMarketHours, 60000);
});
