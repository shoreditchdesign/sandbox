console.log("video deployed");

document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing Video.js players");

  // Inject minimal Video.js CSS
  function injectMinimalCSS() {
    const cssContent = `
      .video-js { position: relative; background-color: #000; color: #fff; font-size: 10px; line-height: 1; }
      .video-js .vjs-control-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 30px; background: rgba(43, 51, 63, 0.7); display: flex; }
      .video-js .vjs-control { height: 30px; width: 4em; flex: none; display: flex; align-items: center; justify-content: center; }
      .video-js .vjs-button { background: none; border: none; color: #fff; cursor: pointer; height: 30px; width: 100%; font-family: VideoJS; font-size: 1.5em; }
      .video-js .vjs-button:hover { color: #73859f; }
      .video-js .vjs-icon-placeholder:before { font-family: VideoJS; font-size: 1.8em; line-height: 1; display: block; }
      .video-js .vjs-play-control.vjs-paused .vjs-icon-placeholder:before { content: "\\f101"; }
      .video-js .vjs-play-control.vjs-playing .vjs-icon-placeholder:before { content: "\\f103"; }
      .video-js .vjs-mute-control.vjs-vol-0 .vjs-icon-placeholder:before { content: "\\f104"; }
      .video-js .vjs-mute-control.vjs-vol-3 .vjs-icon-placeholder:before { content: "\\f107"; }
      .video-js .vjs-fullscreen-control .vjs-icon-placeholder:before { content: "\\f108"; }
      .video-js .vjs-progress-control { flex: auto; height: 30px; display: flex; align-items: center; }
      .video-js .vjs-progress-holder { width: 100%; height: 0.3em; background: rgba(115, 133, 159, 0.5); border-radius: 0.15em; cursor: pointer; }
      .video-js .vjs-play-progress { position: absolute; top: 0; left: 0; height: 100%; background: #fff; border-radius: 0.15em; }
    `;

    const styleEl = document.createElement("style");
    styleEl.textContent = cssContent;
    document.head.appendChild(styleEl);
    console.log("Minimal Video.js CSS injected");
  }

  // Video.js Configuration
  const VIDEO_CONFIG = {
    mobile: {
      controls: ["play-toggle", "progress", "mute-toggle", "fullscreen-toggle"],
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
      controls: ["play-toggle", "progress", "mute-toggle", "fullscreen-toggle"],
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
