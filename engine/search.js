// Search Results
// Fetches posts from the Engine News API based on the ?query= URL parameter,
// filters and sorts them, clones a DOM card template for each result,
// and handles load-more pagination.

const PAGE_SIZE = 20;
const API_BASE = "https://feeds.engine.online/api/EngineNews/SearchPosts";
const UPDATE_CATEGORIES = ["Availability", "Bunkering Info", "Fuel Quality"];
const MAX_AGE_DAYS = 59;

document.addEventListener("DOMContentLoaded", function () {
  // --- DOM guards ---
  const grid = document.querySelector("[data-search-grid]");
  const template = document.querySelector("[data-search-card]");
  const loadBtn = document.querySelector("[data-search-load]");
  const loadWrap = loadBtn ? loadBtn.parentElement : null;
  const emptyEl = document.querySelector("[data-search-empty]");
  const waitEl = document.querySelector("[data-search-wait]");

  if (!grid || !template) return;

  // Remove template from DOM immediately; we use it only as a clone source
  template.remove();

  // --- State ---
  let filteredPosts = [];
  let renderedCount = 0;

  // --- Helpers ---

  function getQuery() {
    const match = window.location.href.match(/[?&]query=([^&]+)/);
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")).trim() : "";
  }

  function filterPosts(posts) {
    const updateCutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    const globalCutoff = new Date("2022-01-01T00:00:00Z").getTime();
    return posts.filter((post) => {
      const ts = new Date(post.timestamp).getTime();
      if (ts < globalCutoff) return false;
      if (UPDATE_CATEGORIES.includes(post.cat)) return ts >= updateCutoff;
      return true;
    });
  }

  function sortPosts(posts) {
    return posts
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  function buildCard(post) {
    const card = template.cloneNode(true);

    card.setAttribute("href", "/news/" + post.slug);

    const imgEl = card.querySelector("[data-search-image]");
    const titleEl = card.querySelector("[data-search-title]");
    const catEl = card.querySelector("[data-search-cat]");

    if (imgEl) {
      const src =
        post.featuredImageBig && post.featuredImageBig.trim()
          ? post.featuredImageBig
          : post.featuredImageSmall;
      imgEl.setAttribute("src", src || "");
    }
    if (titleEl) titleEl.textContent = post.title || "";
    if (catEl) catEl.textContent = post.cat || "";

    return card;
  }

  function renderBatch(posts, startIndex, count) {
    const slice = posts.slice(startIndex, startIndex + count);
    slice.forEach((post) => {
      grid.appendChild(buildCard(post));
    });
    return slice.length;
  }

  function updateLoadBtn() {
    if (!loadWrap) return;
    loadWrap.style.display = renderedCount >= filteredPosts.length ? "none" : "flex";
  }

  function showEmpty() {
    if (waitEl) waitEl.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
  }

  // --- Fetch & initialise ---

  async function init() {
    const query = getQuery();
    if (!query) {
      showEmpty();
      return;
    }

    try {
      const url =
        API_BASE +
        "?searchTerm=" +
        encodeURIComponent(query) +
        "&Limit=100&Page=1";

      const response = await fetch(url);
      if (!response.ok) throw new Error("API error: " + response.status);

      const data = await response.json();
      const posts = data.posts || [];

      filteredPosts = sortPosts(filterPosts(posts));

      if (filteredPosts.length === 0) {
        showEmpty();
        return;
      }

      // Render first page
      if (waitEl) waitEl.style.display = "none";
      grid.style.display = "grid";
      renderedCount += renderBatch(filteredPosts, 0, PAGE_SIZE);
      updateLoadBtn();

      // Load more
      if (loadBtn) {
        loadBtn.addEventListener("click", function () {
          const added = renderBatch(filteredPosts, renderedCount, PAGE_SIZE);
          renderedCount += added;
          updateLoadBtn();
        });
      }
    } catch (error) {
      console.error("Search: Failed to fetch results", error);
      showEmpty();
    }
  }

  init();
});

// Search Form
// Listens for submit on [data-search-form] and redirects to /news-search?query={{input}}
// Works independently — safe to include on any page with the form present.

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("[data-search-form]");
  const input = document.querySelector("[data-search-input]");
  const submit = document.querySelector("[data-search-submit]");

  if (!form || !input) return;

  function handleSearch(e) {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    window.location.href = "/news-search?query=" + encodeURIComponent(query);
  }

  form.addEventListener("submit", handleSearch);

  if (submit) {
    submit.addEventListener("click", handleSearch);
  }
});
