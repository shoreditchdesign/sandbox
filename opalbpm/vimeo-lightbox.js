//Lightbox
document.addEventListener("DOMContentLoaded", function () {
  class VideoErrorHandler {
    constructor(container) {
      this.container = container;
      this.iframe = container.querySelector("iframe");
      if (this.iframe) {
        const videoId = this.getVideoId(this.iframe.src);
        if (videoId) {
          this.setupVimeoPlayer(videoId);
        }
      }
    }

    getVideoId(url) {
      const match = url.match(/video\/(\d+)/);
      return match ? match[1] : null;
    }

    async setupVimeoPlayer(videoId) {
      try {
        const player = new Vimeo.Player(this.iframe);

        player.on("error", (error) => {
          this.handleError();
        });

        try {
          await player.getVideoTitle();
        } catch (error) {
          this.handleError();
        }
      } catch (error) {
        this.handleError();
      }
    }

    handleError() {
      this.container.innerHTML = `
        <div class="vimeo-error" style="background-color: #F9FAFF; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
    </div>
      `;
    }
  }

  function stopEmbedVideo() {
    const frame = document.querySelector("iframe#embedvideo");
    let videoSrc = frame.getAttribute("src");

    // Turn autoplay off and reset to beginning
    if (videoSrc.includes("autoplay=1")) {
      videoSrc = videoSrc.replace("autoplay=1", "autoplay=0");
    }

    // Add #t=0s to reset to beginning if not present
    if (!videoSrc.includes("#t=")) {
      videoSrc = `${videoSrc}#t=0s`;
    } else {
      videoSrc = videoSrc.replace(/#t=\d+s/, "#t=0s");
    }

    frame.setAttribute("src", "");
    frame.setAttribute("src", videoSrc);
  }

  function playEmbedVideo() {
    const frame = document.querySelector("iframe#embedvideo");
    const videoSrc = frame.getAttribute("src");

    // Add Vimeo-specific autoplay parameter
    if (!videoSrc.includes("autoplay=")) {
      const separator = videoSrc.includes("?") ? "&" : "?";
      const newSrc = `${videoSrc}${separator}autoplay=1&background=0`;
      frame.setAttribute("src", newSrc);
    } else {
      const updatedSrc = videoSrc.replace("autoplay=0", "autoplay=1");
      frame.setAttribute("src", updatedSrc);
    }
  }

  // Load Vimeo script and initialize video error handlers
  const vimeoScript = document.createElement("script");
  vimeoScript.src = "https://player.vimeo.com/api/player.js";
  vimeoScript.onload = () => {
    const videoCovers = document.querySelectorAll(".video-cover");
    videoCovers.forEach((cover) => new VideoErrorHandler(cover));
  };
  document.head.appendChild(vimeoScript);

  // Set up lightbox event listeners
  document
    .getElementById("lightbox-close")
    .addEventListener("click", function () {
      stopEmbedVideo();
    });

  document
    .getElementById("lightbox-open")
    .addEventListener("click", function () {
      playEmbedVideo();
    });
});
