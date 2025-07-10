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
