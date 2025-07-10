//Native HTML5 Video Player Initialization
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing native HTML5 video players");

  // Inject Native Video Controls CSS
  function injectNativeVideoCSS() {
    const cssContent = `
      /* Native HTML5 Video Controls Styling */
      [data-player-mobile], [data-player-modal] {
        position: relative !important;
        width: 100% !important;
        height: auto !important;
        z-index: 1000 !important;
      }

      /* WebKit/Chrome Controls */
      [data-player-mobile]::-webkit-media-controls-panel,
      [data-player-modal]::-webkit-media-controls-panel {
        position: relative !important;
        bottom: 0 !important;
        width: 100% !important;
        z-index: 2000 !important;
        background: rgba(0, 0, 0, 0.8) !important;
        border-radius: 0 !important;
      }

      [data-player-mobile]::-webkit-media-controls-play-button,
      [data-player-modal]::-webkit-media-controls-play-button,
      [data-player-mobile]::-webkit-media-controls-mute-button,
      [data-player-modal]::-webkit-media-controls-mute-button,
      [data-player-mobile]::-webkit-media-controls-fullscreen-button,
      [data-player-modal]::-webkit-media-controls-fullscreen-button {
        z-index: 2001 !important;
        background-color: transparent !important;
        color: white !important;
      }

      [data-player-mobile]::-webkit-media-controls-timeline,
      [data-player-modal]::-webkit-media-controls-timeline {
        z-index: 2001 !important;
        background: rgba(255, 255, 255, 0.3) !important;
        border-radius: 2px !important;
      }

      [data-player-mobile]::-webkit-media-controls-current-time-display,
      [data-player-modal]::-webkit-media-controls-current-time-display,
      [data-player-mobile]::-webkit-media-controls-time-remaining-display,
      [data-player-modal]::-webkit-media-controls-time-remaining-display {
        z-index: 2001 !important;
        color: white !important;
        font-size: 12px !important;
      }

      /* Firefox Controls */
      [data-player-mobile]::-moz-media-controls,
      [data-player-modal]::-moz-media-controls {
        z-index: 2000 !important;
        background: rgba(0, 0, 0, 0.8) !important;
      }

      /* Force controls visibility */
      [data-player-mobile]:hover,
      [data-player-modal]:hover {
        z-index: 1001 !important;
      }

      /* Ensure video stays responsive */
      [data-player-mobile], [data-player-modal] {
        max-width: 100% !important;
        height: auto !important;
        display: block !important;
      }
    `;

    const styleEl = document.createElement("style");
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);
    console.log("Native video controls CSS injected");
  }

  // Native Video Configuration
  const NATIVE_CONFIG = {
    controls: true,
    muted: true,
    preload: "metadata",
    playsinline: true,
    disablePictureInPicture: true,
  };

  // Selectors
  const selectors = {
    mobilePlayer: "[data-player-mobile]",
    modalPlayer: "[data-player-modal]",
  };

  function initNativeMobilePlayer() {
    const mobileVideoElement = document.querySelector(selectors.mobilePlayer);

    if (!mobileVideoElement) {
      console.warn("Mobile video element not found");
      return null;
    }

    console.log("Configuring native mobile video player");

    // Apply native configuration
    Object.keys(NATIVE_CONFIG).forEach((key) => {
      if (NATIVE_CONFIG[key] === true) {
        mobileVideoElement.setAttribute(key, "");
      } else if (NATIVE_CONFIG[key] !== false) {
        mobileVideoElement.setAttribute(key, NATIVE_CONFIG[key]);
      }
    });

    // Ensure muted and paused
    mobileVideoElement.muted = true;
    mobileVideoElement.pause();

    console.log("Native mobile video player configured");
    return mobileVideoElement;
  }

  function initNativeModalPlayer() {
    const modalVideoElement = document.querySelector(selectors.modalPlayer);

    if (!modalVideoElement) {
      console.warn("Modal video element not found");
      return null;
    }

    console.log("Configuring native modal video player");

    // Apply native configuration
    Object.keys(NATIVE_CONFIG).forEach((key) => {
      if (NATIVE_CONFIG[key] === true) {
        modalVideoElement.setAttribute(key, "");
      } else if (NATIVE_CONFIG[key] !== false) {
        modalVideoElement.setAttribute(key, NATIVE_CONFIG[key]);
      }
    });

    // Ensure muted and paused
    modalVideoElement.muted = true;
    modalVideoElement.pause();

    // Store reference for lightbox controller
    modalVideoElement.nativePlayer = modalVideoElement;

    console.log("Native modal video player configured");
    return modalVideoElement;
  }

  // Initialize native controls and players
  injectNativeVideoCSS();

  const mobilePlayerInstance = initNativeMobilePlayer();
  const modalPlayerInstance = initNativeModalPlayer();

  console.log("Native video initialization complete", {
    mobile: !!mobilePlayerInstance,
    modal: !!modalPlayerInstance,
  });
});
