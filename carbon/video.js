//Video.js Player Initialization
document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing Video.js players");

  // Inject minimal Video.js CSS

  // Inject minimal Video.js CSS with VideoJS font
  function injectMinimalCSS() {
    const cssContent = `
      @font-face {
        font-family: VideoJS;
        src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABUcAA0AAAAAGCwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABRAAAABoAAAAcbMXs4kdERUYAAAFgAAAAIwAAACgAJwCvT1MvMgAAAYQAAABOAAAAYGk/BU9jbWFwAAAB1AAAAIQAAAGOaFhrbGdhc3AAAAJYAAAACAAAAAj//wADZ2x5ZgAAAmAAAA8eAAAbUE5U8rdoZWFkAAARgAAAADIAAAA2A6vKh2hoZWEAABG0AAAAHgAAACQGCQVBaG10eAAAEdQAAABBAAAAUj/5/Atsb2NhAAASGAAAACoAAAAqNcg3MG1heHAAABJEAAAAHgAAACABXgKZbmFtZQAAEmQAAAFzAAACo8iLgHxwb3N0AAAT2AAAAUEAAAGHvamN7XjaY2BkYGAA4hkNIBJCnPdtIauUFgOY73gBBEVwOAODAACKCwirAAB42mNgZGBg4GKQYPBmAANGBiQwIjL6D6IoSAAAEU0BEQAAeNpjYGRgYOBhKGYwAoQsEOYAIggABngJkAAAAHjaY2BmLGKcwMDKwMHUyXSGgYGhH0IzNjAwMYMBCxJzXPNYFHA4MrxgZDr9/z8LCwsnA8YIpoEMIq8hKpsBBBUYGQAAAwkLCwAAeNpjYGBkYGDLy8vLAQQGABA3ABEAAHjaXVG7TsNAEN0NlwQSkkAoREGJIg0STikZWQU0dPQUIoHKFnKCbVlKKKfx58A3nJyWHf+tHrHf2ju7MzN7xh4Av4BfIMJPvCDB2ew4yNvwE//1FzLVr1kgUaztqXb6YgFlOHJxbDRx0fJ8Y8HH1qZV+v9VRrVYe9EqVXq1F6tbZ1mpwU3rNqlzpztW9WZhqcCfQYJhFpOCpfgK+Tn5jfk9+YP5i/mb+bv5i/mr+Zv5u/mL+Zv5y/lnQ8K38gfzV/N3C8YXQJYnSAuSHOIm5wNzTuMDzGfJD+O8wO+rY+9XoKemh7jHQFQ3E8CdXC5C5EZK3m+c1k2vM8g2xJYOlKvZ8/HKgp9/MMLKHwJjDwrJBtJ9/GqDUlxtdm1Rlj1r8PqKuGQ+wNKd8sKEhTrwp3W6uVKW6ZO8/tKK9Eb9LwGZPnWuE+hQDmT/WPOJ/2zKa+tUFcuKBhVoIiw0uNrVG0mO8F29V3L9xnpRNi3fLU5e2Uj19uvGutNbtIi62X8fGl//wOv8WXzUOuKf/5f6N76Rd3v/HwB42mNgQANGBwZ2BgcGNwZXBi8Gfwy+DCj5CAdcAhwdXBh8ACojZOQAAAA=) format("woff");
      }
      .video-js { position: relative; background-color: #000; color: #fff; font-size: 10px; line-height: 1; font-family: Arial, Helvetica, sans-serif; }
      .video-js .vjs-control-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 30px; background: rgba(43, 51, 63, 0.7); display: flex; visibility: visible; opacity: 1; }
      .video-js .vjs-control { height: 30px; width: 4em; flex: none; display: flex; align-items: center; justify-content: center; position: relative; }
      .video-js .vjs-button { background: none; border: none; color: #fff; cursor: pointer; height: 30px; width: 100%; font-family: VideoJS; font-size: 1.5em; line-height: 2; text-align: center; margin: 0; padding: 0; }
      .video-js .vjs-button:hover { color: #73859f; }
      .video-js .vjs-icon-placeholder:before { font-family: VideoJS; font-weight: normal; font-style: normal; font-size: 1.8em; line-height: 1; text-align: center; display: block; }
      .video-js .vjs-play-control.vjs-paused .vjs-icon-placeholder:before { content: "\\f101"; }
      .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder:before { content: "\\f103"; }
      .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder:before { content: "\\f104"; }
      .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder:before { content: "\\f105"; }
      .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder:before { content: "\\f106"; }
      .video-js .vjs-mute-control.vjs-vol-3 .vjs-icon-placeholder:before { content: "\\f107"; }
      .video-js .vjs-fullscreen-control .vjs-icon-placeholder:before { content: "\\f108"; }
      .video-js .vjs-progress-control { flex: auto; height: 30px; display: flex; align-items: center; position: relative; }
      .video-js .vjs-progress-holder { position: relative; width: 100%; height: 0.3em; background: rgba(115, 133, 159, 0.5); border-radius: 0.15em; cursor: pointer; }
      .video-js .vjs-play-progress { position: absolute; top: 0; left: 0; height: 100%; background: #fff; border-radius: 0.15em; }
      .video-js .vjs-load-progress { position: absolute; top: 0; left: 0; height: 100%; background: rgba(115, 133, 159, 0.3); border-radius: 0.15em; }
      /* Hide unwanted controls */
      .video-js .vjs-volume-panel, .video-js .vjs-current-time, .video-js .vjs-duration, .video-js .vjs-time-divider, .video-js .vjs-remaining-time, .video-js .vjs-playback-rate, .video-js .vjs-chapters-button, .video-js .vjs-descriptions-button, .video-js .vjs-subs-caps-button, .video-js .vjs-audio-button, .video-js .vjs-picture-in-picture-control { display: none !important; }
    `;

    const styleEl = document.createElement("style");
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);
    console.log("Minimal Video.js CSS with font injected");
  }

  // Video.js Configuration
  const VIDEO_CONFIG = {
    mobile: {
      controls: true,
      fluid: false,
      responsive: true,
      autoplay: false,
      muted: true,
      preload: "metadata",
      width: "100%",
      height: "auto",
      techOrder: ["html5"],
      html5: {
        nativeControlsForTouch: false,
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
    },
    modal: {
      controls: true,
      fluid: false,
      responsive: true,
      autoplay: false,
      muted: true,
      preload: "metadata",
      width: "100%",
      height: "auto",
      techOrder: ["html5"],
      html5: {
        nativeControlsForTouch: false,
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },
    },
  };

  // Selectors
  const selectors = {
    mobilePlayer: "[data-player-mobile]",
    modalPlayer: "[data-player-modal]",
  };

  function initMobilePlayer() {
    const mobileVideoElement = document.querySelector(selectors.mobilePlayer);

    if (!mobileVideoElement) {
      console.warn("Mobile video element not found");
      return null;
    }

    console.log("Initializing mobile Video.js player");

    const mobilePlayer = videojs(
      mobileVideoElement,
      VIDEO_CONFIG.mobile,
      function () {
        console.log("Mobile Video.js player ready");

        // Ensure muted and paused on load
        this.muted(true);
        this.pause();
      },
    );

    return mobilePlayer;
  }

  function initModalPlayer() {
    const modalVideoElement = document.querySelector(selectors.modalPlayer);

    if (!modalVideoElement) {
      console.warn("Modal video element not found");
      return null;
    }

    console.log("Initializing modal Video.js player");

    const modalPlayer = videojs(
      modalVideoElement,
      VIDEO_CONFIG.modal,
      function () {
        console.log("Modal Video.js player ready");

        // Ensure muted and paused on load
        this.muted(true);
        this.pause();

        // Store reference for lightbox controller
        modalVideoElement.player = this;
      },
    );

    return modalPlayer;
  }

  // Initialize both players
  injectMinimalCSS();

  const mobilePlayerInstance = initMobilePlayer();
  const modalPlayerInstance = initModalPlayer();

  console.log("Video.js initialization complete", {
    mobile: !!mobilePlayerInstance,
    modal: !!modalPlayerInstance,
  });
});

// <style>
//   /* Video.js Complete Control Styling - Override Site CSS */

//   /* Base Video.js Player Styles */
//   .video-js {
//     position: relative !important;
//     background-color: #000 !important;
//     color: #fff !important;
//     font-family: Arial, Helvetica, sans-serif !important;
//     font-size: 10px !important;
//     line-height: 1 !important;
//     font-weight: normal !important;
//     font-style: normal !important;
//     word-break: initial !important;
//   }

//   /* Control Bar */
//   .video-js .vjs-control-bar {
//     display: flex !important;
//     visibility: visible !important;
//     opacity: 1 !important;
//     z-index: 15 !important;
//     pointer-events: auto !important;
//     position: absolute !important;
//     bottom: 0 !important;
//     left: 0 !important;
//     right: 0 !important;
//     height: 30px !important;
//     background: linear-gradient(to top, rgba(7, 20, 30, 0.7), transparent) !important;
//     background-color: rgba(43, 51, 63, 0.7) !important;
//     direction: ltr !important;
//   }

//   /* All Controls */
//   .video-js .vjs-control {
//     position: relative !important;
//     text-align: center !important;
//     margin: 0 !important;
//     padding: 0 !important;
//     height: 30px !important;
//     width: 4em !important;
//     flex: none !important;
//     display: flex !important;
//     align-items: center !important;
//     justify-content: center !important;
//     visibility: visible !important;
//     opacity: 1 !important;
//     z-index: 16 !important;
//     pointer-events: auto !important;
//   }

//   /* Button Styles */
//   .video-js .vjs-button {
//     background: none !important;
//     border: none !important;
//     color: #fff !important;
//     cursor: pointer !important;
//     margin: 0 !important;
//     padding: 0 !important;
//     height: 30px !important;
//     width: 100% !important;
//     font-family: VideoJS !important;
//     font-size: 1.5em !important;
//     line-height: 2 !important;
//     text-align: center !important;
//     outline: none !important;
//     box-shadow: none !important;
//     text-decoration: none !important;
//     font-weight: normal !important;
//     font-style: normal !important;
//   }

//   .video-js .vjs-button:hover,
//   .video-js .vjs-button:focus {
//     color: #73859f !important;
//     outline: none !important;
//     box-shadow: none !important;
//   }

//   /* Icon Placeholders */
//   .video-js .vjs-icon-placeholder:before {
//     font-family: VideoJS !important;
//     font-weight: normal !important;
//     font-style: normal !important;
//     font-size: 1.8em !important;
//     line-height: 1 !important;
//     text-align: center !important;
//     display: block !important;
//   }

//   /* Play Button */
//   .video-js .vjs-play-control.vjs-paused .vjs-icon-placeholder:before {
//     content: "\f101" !important;
//   }

//   .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder:before {
//     content: "\f103" !important;
//   }

//   /* Volume Control */
//   .video-js .vjs-volume-panel {
//     display: flex !important;
//     align-items: center !important;
//     width: 6em !important;
//     position: relative !important;
//   }

//   .video-js .vjs-mute-control {
//     width: 2em !important;
//   }

//   .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder:before {
//     content: "\f104" !important;
//   }

//   .video-js .vjs-mute-control.vjs-vol-1 .vjs-icon-placeholder:before {
//     content: "\f105" !important;
//   }

//   .video-js .vjs-mute-control.vjs-vol-2 .vjs-icon-placeholder:before {
//     content: "\f106" !important;
//   }

//   .video-js .vjs-mute-control.vjs-vol-3 .vjs-icon-placeholder:before {
//     content: "\f107" !important;
//   }

//   /* Volume Bar */
//   .video-js .vjs-volume-control {
//     width: 4em !important;
//     position: relative !important;
//     display: flex !important;
//     align-items: center !important;
//   }

//   .video-js .vjs-volume-bar {
//     position: relative !important;
//     width: 100% !important;
//     height: 0.3em !important;
//     background: rgba(115, 133, 159, 0.5) !important;
//     border-radius: 0.15em !important;
//     cursor: pointer !important;
//   }

//   .video-js .vjs-volume-level {
//     position: absolute !important;
//     top: 0 !important;
//     left: 0 !important;
//     height: 100% !important;
//     background: #fff !important;
//     border-radius: 0.15em !important;
//   }

//   /* Time Display */
//   .video-js .vjs-time-control {
//     display: flex !important;
//     align-items: center !important;
//     padding: 0 0.5em !important;
//     color: #fff !important;
//     font-size: 1em !important;
//     line-height: 2 !important;
//     font-family: Arial, Helvetica, sans-serif !important;
//     font-weight: normal !important;
//     font-style: normal !important;
//     width: auto !important;
//     flex: none !important;
//   }

//   .video-js .vjs-time-divider {
//     width: 14px !important;
//     text-align: center !important;
//     padding: 0 !important;
//   }

//   /* Progress Control */
//   .video-js .vjs-progress-control {
//     position: relative !important;
//     display: flex !important;
//     align-items: center !important;
//     flex: auto !important;
//     height: 30px !important;
//     width: auto !important;
//   }

//   .video-js .vjs-progress-holder {
//     position: relative !important;
//     height: 0.3em !important;
//     width: 100% !important;
//     background: rgba(115, 133, 159, 0.5) !important;
//     border-radius: 0.15em !important;
//     cursor: pointer !important;
//   }

//   .video-js .vjs-play-progress {
//     position: absolute !important;
//     top: 0 !important;
//     left: 0 !important;
//     height: 100% !important;
//     background: #fff !important;
//     border-radius: 0.15em !important;
//   }

//   .video-js .vjs-load-progress {
//     position: absolute !important;
//     top: 0 !important;
//     left: 0 !important;
//     height: 100% !important;
//     background: rgba(115, 133, 159, 0.5) !important;
//     border-radius: 0.15em !important;
//   }

//   /* Fullscreen Button */
//   .video-js .vjs-fullscreen-control .vjs-icon-placeholder:before {
//     content: "\f108" !important;
//   }

//   .video-js.vjs-fullscreen .vjs-fullscreen-control .vjs-icon-placeholder:before {
//     content: "\f109" !important;
//   }

//   /* Big Play Button */
//   .video-js .vjs-big-play-button {
//     position: absolute !important;
//     top: 50% !important;
//     left: 50% !important;
//     transform: translate(-50%, -50%) !important;
//     width: 3em !important;
//     height: 3em !important;
//     background: rgba(43, 51, 63, 0.7) !important;
//     border: 0.1em solid #fff !important;
//     border-radius: 50% !important;
//     color: #fff !important;
//     cursor: pointer !important;
//     font-size: 1.8em !important;
//     z-index: 12 !important;
//     display: block !important;
//     visibility: visible !important;
//     opacity: 1 !important;
//     pointer-events: auto !important;
//   }

//   .video-js .vjs-big-play-button:hover {
//     background: rgba(73, 91, 103, 0.7) !important;
//   }

//   .video-js .vjs-big-play-button .vjs-icon-placeholder:before {
//     content: "\f101" !important;
//     font-family: VideoJS !important;
//     font-size: 1em !important;
//     line-height: 1.8 !important;
//   }

//   /* Hide big play button when playing */
//   .video-js.vjs-playing .vjs-big-play-button {
//     display: none !important;
//   }

//   /* Remaining Time */
//   .video-js .vjs-remaining-time {
//     color: #fff !important;
//     font-size: 1em !important;
//     line-height: 2 !important;
//   }

//   /* Spacer */
//   .video-js .vjs-custom-control-spacer {
//     flex: auto !important;
//   }

//   /* Hidden elements */
//   .video-js .vjs-hidden {
//     display: none !important;
//   }

//   /* Force controls to stay visible */
//   .video-js:hover .vjs-control-bar,
//   .video-js.vjs-user-active .vjs-control-bar,
//   .video-js.vjs-user-inactive .vjs-control-bar {
//     opacity: 1 !important;
//     visibility: visible !important;
//   }
// </style>
