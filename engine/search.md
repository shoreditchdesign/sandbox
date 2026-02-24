## User

we are going to make a new search fucntion called [@search.js](file:///home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js) , this will extract query apremteres from a url, use an api to fetch a json resposne, aprese output, and filter out certain repsones based on metadata in the json, and then use a sample card extartced from the dom as a remplate (usigna trr as slectors) to then rendener dynamic html with each of ther epsosnes as content. we will then intialsie pagiantion fro thesame and then use an event to runa  custom animtion once the dom is fully ready to anaimte teh rcards in one by one.

mocve yo plan mode. i will detial wcah step one by one,, incl preferences for slectors, params, api logic, sasmple json repsons,e no of resuls, pagiantion logic and naiamtion logic as refernece from othr globalc fiucntiosn in this repo,a nd once we have the p;an nailed down, wwe can outlien a md and then start of an agent o work on the code.

capiche?

## Assistant

Capiche. Let me enter plan mode and get familiar with the repo first before we start taking notes.

**Tool Call: EnterPlanMode**
Status: Completed

Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.

## Assistant

Good, I'm in plan mode. Let me explore the repo to understand the existing patterns before we start detailing the spec.

**Tool Call: Explore repo structure and JS patterns**
Status: Completed

Perfect! Now let me compile a comprehensive summary of the codebase based on my thorough exploration.

## Thorough Codebase Exploration Summary

### 1. File Structure

**Location:** `/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/`

**Files:**
- `script.js` (17.3 KB) - Core DOM manipulation, animations, layout logic
- `motion.js` (46.2 KB) - Comprehensive GSAP animation library for various components
- `ix.js` (50.1 KB) - Interaction handlers, navigation, cards, gallery, timeline
- `query.js` (2.5 KB) - URL parameter parsing and filtering logic
- `clamp.js` (1.1 KB) - Responsive font sizing utility
- `countdown.js` (703 B) - Post redirect countdown timer
- `head.js` (540 B) - Scroll restoration control
- `redirects.js` (2.3 KB) - 404 and URL redirect handling
- `override.css` (788 B) - Global CSS utilities and resets
- `search.js` (0 B) - Empty file

---

### 2. Key JavaScript Patterns and Functions

#### **Event-Driven Architecture**
- All initialization wrapped in `document.addEventListener("DOMContentLoaded", function() {...})`
- Uses data attributes as selectors: `data-*` convention
- Custom events: `window.dispatchEvent(new CustomEvent("stackCardsInitialized"))`

#### **DOM Selector Conventions**
```javascript
// Attribute-based selectors (primary pattern)
[data-news-card]          // Card elements
[data-scroll-list]        // Scroll container
[data-stack-section]      // Stacking section
[data-glow-card]          // Glow card effect
[data-motion-*]           // Motion animation triggers
[data-nav-element]        // Navigation elements
[data-post-redirect]      // Redirect control
```

---

### 3. Animation Patterns

#### **GSAP-Based Animations** (motion.js)

**Navbar Tuck Animation** (motion.js:1-62)
- Scrolling threshold-based navbar hide/show
- 200px down threshold to hide, 200px up threshold to show
- Uses `gsap.from()` with `yPercent: -100`
- States: `data-tuck-state="default"` or `data-tuck-state="hidden"`

**Fade-in Card Animation** (script.js:91-103)
```javascript
gsap.set(cards, { opacity: 0 });
gsap.to(cards, {
  opacity: 1,
  duration: 0.3,
  ease: "power1.out",
});
```

**Motion Array/Stagger** (script.js:349-454)
- Initial state: `opacity: 0, y: 5` (arrays) or `opacity: 0` (stagger)
- Fade-in on load with stagger delay of 0.15s
- Desktop-only (disables on screens ≤ 991px)
- Uses `MutationObserver` to detect new items added via load-more

**Slide Animation** (motion.js:76-164)
- Initial: `opacity: 1, y: "-120%"`
- Animates to: `opacity: 1, y: "0%"`
- Duration: 0.8s with `ease: "power2.out"`
- ScrollTrigger at "top 95%"
- Supports `data-motion-delay` attribute

**Text/Heading Animation** (motion.js:1182-1312)
- Uses `SplitText` plugin to split text into lines
- Initial: `opacity: 0, y: 20, filter: "blur(5px)"`
- Animates to: `opacity: 1, y: 0, filter: "blur(0px)"`
- Stagger: 0.1s between lines
- Handles gradient text with CSS variables

**Stacking Cards Animation** (motion.js:423-694)
- Creates dynamic height: `(items.length + 1) * 100lvh`
- First card at `yPercent: 0`, others at `yPercent: 100`
- Each card: `opacity: 0, scale: 0.9` when scrolled out
- Next card: `yPercent: 0` slides in
- Pinned ScrollTrigger with scrub
- Mobile (≤ 768px): resets all styles, displays as normal grid
- Dispatches `stackCardsInitialized` event for dependent animations

**Scroll Cards Animation** (motion.js:854-1042)
- Default state: `opacity: 0.4, scale: 0.95`
- Active state: `opacity: 1, scale: 1`
- Three card types:
  - First card: stays active until scrolls out (fades only)
  - Last card: becomes active when centered (no fade out)
  - Middle cards: fade in/out as they pass center
- ScrollTrigger with `scrub: 0.5`

**Glow Effect Cards** (ix.js:123-473)
- Wraps cards with `.o-glow-wrapper`
- Creates glow container with angle tracking
- Mouse proximity-based activation
- CSS variables: `--glow-start`, `--glow-active`, `--glow-spread`
- Desktop-only (768px+), 500ms init delay

**Quote/Review Cards Carousel** (motion.js:1044-1179)
- Loops through cards automatically
- Duration: 0.5s, delay: 6s between transitions
- Cards animate: `scale: 1 → 1.1 → 1.2 → 1.3` with vertical movement
- Opacity fades: `1 → 0` with blur effect
- 3 cards per view, duplicates if fewer
- Navigation buttons: next/prev with timeline jumping

---

### 4. Pagination & Load-More Logic

**News Grid Pagination** (script.js:189-236)
```javascript
// Load more button selector
[data-news-load]

// Grid selector
[data-news-grid]

// Uses MutationObserver to detect added items
observer.observe(grid, { childList: true, subtree: false });

// Fallback: 500ms setTimeout after button click
```

**Array Animation on Load More** (script.js:349-454)
```javascript
// Detects new children: filter for nodeType === 1 && !data-motion-block
// Animates only new children with stagger
gsap.set(newChildren, { opacity: 0, y: 5 });
gsap.to(newChildren, {
  opacity: 1,
  y: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: "power2.out",
});
```

---

### 5. Card Rendering & Grid Layout

**News Grid Layout System** (script.js:89-236)

**Remove Offset Items:**
```javascript
data-news-offset="X"  // Removes first X-1 items
```

**Add "Wide" Class Pattern:**
```javascript
// Adds "wide" class to first and last item in each interval group
data-news-grid="10"   // Default interval is 10

gridItems.forEach((item, index) => {
  const groupNumber = Math.floor(index / interval);
  const positionInGroup = index % interval;
  if (positionInGroup === 0 || positionInGroup === interval - 1) {
    item.classList.add("wide");
  }
});
```

**Responsive Behavior:**
```javascript
data-grid-mobile  // Only applies layout on mobile (max-width: 768px)
```

**Animation on Layout Change:**
- Calls fade-in animation (0.3s opacity: 0 → 1)
- Triggers on initial load and after mutations

---

### 6. URL Parameter Parsing & Query Logic

**query.js** (2.5 KB)

**Search Query Display** (script.js:238-255)
```javascript
[data-search-query]  // Element to display query

// Parse URL
const queryMatch = currentUrl.match(/[?&]query=([^&]+)/);
if (queryMatch && queryMatch[1]) {
  const decodedQuery = decodeURIComponent(queryMatch[1].replace(/\+/g, " "));
  element.textContent = decodedQuery;
}
```

**Resource Category Query** (script.js:544-568)
```javascript
[data-resource-link]  // Links get query param added

// Converts link text to category parameter
link.href = `/resources?category_equal=${formattedCategory}`;
```

**Post Redirect Query Handler** (query.js:1-88)
```javascript
// Gets postId from URL
const postId = new URLSearchParams(window.location.search).get("postId");

// Searches for article slug
[data-post-target]  // Container
[data-post-id]      // ID element
[data-post-slug]    // Slug element
```

---

### 7. Event Wiring & State Management

**Navigation Toggle** (ix.js:1-121)
```javascript
[data-nav-element="menu"]     // Menu button
[data-nav-element="navbar"]   // Navbar container
data-nav-state="open|closed"  // State attribute

menuButton.addEventListener("click", () => {
  currentState = navbar.getAttribute("data-nav-state");
  navbar.setAttribute("data-nav-state", currentState === "open" ? "closed" : "open");
});
```

**Dropdown Navigation** (ix.js:475-599)
```javascript
[data-nav-dd="toggle"]   // Trigger element
[data-nav-dd="drawer"]   // Content container
[data-dd-state]          // "show" or "hide"

// Uses gsap.quickTo for overlay opacity
window.playDropdown(drawer, show);  // Exposed global function
```

**Tab System** (ix.js:900-1047)
```javascript
[data-tab-name]      // Tab container
[data-tab-menu]      // Tab navigation
[data-tab-link]      // Tab triggers (indexed)
[data-tab-panel]     // Tab content panels
[data-tab-autoplay]  // Autoplay duration in ms

// Switches tabs with fade animation
window.switchToTab(isolatedTab, index, duration);
```

---

### 8. Existing Animations & Transitions

**Textarea Auto-Resize** (script.js:18-28)
```javascript
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
});
```

**Sticky Header Opacity** (motion.js:348-421)
```javascript
[data-features-wrap]    // Wrapper
[data-features-header]  // Header to fade

// Fades header opacity to 0 at bottom of wrap
ScrollTrigger at "bottom bottom-=32px"
```

**Gallery Carousel** (ix.js:1049-1170)
```javascript
[data-gallery-wrap]      // Container
[data-gallery-list]      // Slides container
[data-gallery-slide]     // Individual slides
[data-gallery-autoplay]  // Duration (default 3000ms)

// Fade transition: opacity 0.15s ease-out/in
// Pagination dots: [data-gallery-dot]="active|inactive"
```

**Progress Bar** (motion.js:696-852)
```javascript
[data-progress-wrap]     // Container
[data-progress-bar]      // Animated bar
[data-progress-section]  // Content to measure
[data-progress-array]    // Segment indicators

// window.barAnimator(bar, trigger, start, end)
// window.cellAnimator(cells, trigger, start, end)
```

---

### 9. Global Configuration & Utility Functions

**GSAP Utilities Exposed:**
```javascript
window.textAnimator(element, offset)      // Text animation
window.arrayAnimator(container, offset)   // Array animation
window.staggerAnimator(container, offset) // Stagger animation
window.elementAnimator(element, offset)   // Single element
window.barAnimator(bar, trigger, start, end)
window.cellAnimator(cells, trigger, start, end)
window.playDropdown(drawer, show)
window.overlayQuickTo(opacity)
window.switchToTab(tab, index, duration)
window.destroyTicker()
```

**Responsive Breakpoints:**
- Mobile/Tablet: ≤ 768px
- Desktop: > 768px
- Desktop large: > 991px

**Common Animation Defaults:**
- Fade duration: 0.3-0.8s
- Easing: `power1.out`, `power2.out`
- Stagger delay: 0.15s
- ScrollTrigger offset: "top 95%" or "top 85%"
- Debounce timeout: 250-300ms

---

### 10. Template & Card Structure Patterns

**News Card** (script.js:93)
```html
[data-news-card]   <!-- Container -->
  <!-- Any content -->
```

**Scroll Card** (motion.js:854)
```html
[data-scroll-list]
  [data-scroll-card]  <!-- state: data-scroll-state="active|default" -->
```

**Stack Card** (motion.js:423)
```html
[data-stack-section]
  [data-stack-wrap]
    [data-stack-list]
      [data-stack-card]  <!-- Animated with yPercent -->
```

**Glow Card** (ix.js:123)
```html
[data-glow-card]
  <!-- Gets wrapped with .o-glow-wrapper -->
  <!-- Glow container injected: .o-glow-container > .o-glow-effect -->
```

**Review/Quote Card** (motion.js:1044)
```html
[data-review-wrap]
  [data-review-card]  <!-- Cycles with scale/opacity animation -->
[data-review-prev], [data-review-next]  <!-- Navigation buttons -->
```

**Gallery Slide** (ix.js:1049)
```html
[data-gallery-wrap]
  [data-gallery-list] data-gallery-autoplay="3000"
    [data-gallery-slide]
#gallery-pagination
  [data-gallery-dot]  <!-- Generated dynamically -->
```

---

### 11. CSS Classes & Utilities

**From override.css:**
- `.u-grad-heading` - Gradient text effect
- `.o-glow-wrapper` - Glow card container
- `.o-glow-container` - Glow effect holder
- `.o-glow-effect` - Glow visual element
- `.w-richtext` - Rich text content (removes margin on first/last child)
- `.u-hs-h1|h2|h3|h4|h5|h6` - Heading style classes
- `.timeline-bullet`, `.timeline-bullet-active` - Timeline pagination
- `.timeline-nav-disabled` - Disabled state for timeline nav

**Utility Attributes:**
- `[hide]` - display: none
- `[pointer="off"]` - pointer-events: none
- `[pointer="on"]` - pointer-events: auto
- `[color-inherit]` - color: inherit
- `[inline-flex]` - display: inline-flex

---

### 12. Form & Dynamic Content Injection

**Form Embedding** (script.js:456-542)
```javascript
[data-form-embed]     // Wrapper
[data-form-source]    // HTML source (escaped)
[data-form-target]    // Injection target

// Decodes HTML entities, parses scripts, injects sequentially
// Waits for external scripts to load before continuing
```

**Tab/Pane Cloning** (script.js:30-87)
```javascript
[data-clone-source="wrap"]
  [data-clone-source="link"]
  [data-clone-source="pane"]

[data-clone-target="link"]  <!-- Gets cloned content -->
[data-clone-target="pane"]  <!-- Gets cloned content -->
```

**Sidebar Injection** (script.js:257-297)
```javascript
[data-sidebar-source]  // Element to move
[data-sidebar-target]  // Destination on mobile

// Media query breakpoint: 768px
// Uses insertBefore() to restore position on desktop
```

---

### 13. Stateful Components & Tracking

**Card State Storage** (ix.js:126)
```javascript
const cardStates = new Map();  // Stores glow card state
cardStates.set(wrapper, {
  glowContainer,
  config: { spread, proximity, deadzone, duration, borderWidth },
  currentAngle
});
```

**Animation References** (motion.js:428-430, 608)
```javascript
let stackTriggers = [];     // ScrollTrigger instances
let stackTimelines = [];    // GSAP timeline instances
let activeToggle = null;    // Current active navigation toggle
```

---

### 14. Error Handling & Safety Patterns

**Try-Catch Wrapping** (motion.js:89-123, ix.js:354-363)
```javascript
try {
  // Animation code
} catch (error) {
  console.error("Motion: Animation failed", error);
}

// Fail silently to prevent breaking other scripts
```

**Library Checks** (motion.js:67-74)
```javascript
if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
  console.error("Required libraries not loaded");
  return;
}
gsap.registerPlugin(ScrollTrigger);
```

**DOM Stability Checks** (ix.js:146-149, 428)
```javascript
if (!isDOMStable) return;  // Prevent running during mutations
if (!card.isConnected) return;  // Skip if element removed from DOM
```

---

### 15. Performance Optimizations

**Debouncing** (motion.js:250, 655-674)
```javascript
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Handler code
  }, 250-300);  // 300ms for stacking cards
});
```

**RequestAnimationFrame** (ix.js:246-248, 353-360)
```javascript
if (globalAnimationFrame) {
  cancelAnimationFrame(globalAnimationFrame);
}
globalAnimationFrame = requestAnimationFrame(() => {
  updateAllCards(mouseX, mouseY);
});
```

**MutationObserver for DOM Changes** (script.js:196-206)
```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      // Handle new items
    }
  });
});
observer.observe(grid, { childList: true, subtree: false });
```

**Batch DOM Operations** (motion.js:548-573)
```javascript
// Reset multiple items in loop
items.forEach((item) => {
  gsap.set(item, { clearProps: "all" });
});
// Force single reflow after all
document.body.offsetHeight;
```

---

### 16. Finsweet Integration

- Pagination system uses Finsweet CMS collection loads
- 500ms delay for content to load after click
- MutationObserver detects dynamically added items
- Fallback click listeners for reliability

---

### Summary of Key Takeaways

1. **Data-Driven DOM:** Entire codebase relies on `data-*` attributes for selection and state
2. **GSAP-Heavy:** All major animations use GSAP with ScrollTrigger for scroll-based triggers
3. **Scroll-Triggered:** Most animations use `start: "top 95%"` with `once: true` for single-fire animations
4. **Responsive:** Clear 768px and 991px breakpoints for different layouts
5. **Modular Functions:** Global utility functions exposed on `window` object for reuse
6. **Event-Driven:** DOMContentLoaded as primary initialization point, custom events for coordination
7. **Performance-Conscious:** Debouncing, RAF, batch DOM operations, error boundaries
8. **State Management:** Uses data attributes, Maps, and flags for state tracking
9. **Loading Aware:** MutationObserver for detecting dynamically added content
10. **Fallback Patterns:** Always includes fallback handlers for reliability

agentId: a1d465d (for resuming to continue this agent's work if needed)
<usage>total_tokens: 75540
tool_uses: 18
duration_ms: 71024</usage>

**Tool Call: find /home/austinjxseph/GitHub/shoreditchdesign/brochuresite -type f -name "*.js" -o -name "*.html" -o -name "*.css" -o -name "*.json" | head -50**
Status: Completed

Terminal:
```
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/clamp.js
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/countdown.js
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/head.js
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/ix.js
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/motion.js
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/override.css
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/query.js
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/redirects.js
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js
```


**Tool Call: ls -la /home/austinjxseph/GitHub/shoreditchdesign/brochuresite**
Status: Completed

Terminal:
```
total 148
drwxr-xr-x. 1 austinjxseph austinjxseph   208 Feb 24 18:39 .
drwxr-xr-x. 1 austinjxseph austinjxseph   182 Feb 19 00:12 ..
-rw-r--r--. 1 austinjxseph austinjxseph  1130 Jan  4 15:05 clamp.js
-rw-r--r--. 1 austinjxseph austinjxseph   703 Jan  4 15:05 countdown.js
drwxr-xr-x. 1 austinjxseph austinjxseph   122 Feb 24 18:42 .git
-rw-r--r--. 1 austinjxseph austinjxseph   540 Jan  4 15:05 head.js
-rw-r--r--. 1 austinjxseph austinjxseph 50111 Jan  4 15:05 ix.js
-rw-r--r--. 1 austinjxseph austinjxseph 46173 Jan  4 15:05 motion.js
-rw-r--r--. 1 austinjxseph austinjxseph   788 Jan  4 15:05 override.css
-rw-r--r--. 1 austinjxseph austinjxseph  2542 Jan  4 15:05 query.js
-rw-r--r--. 1 austinjxseph austinjxseph    36 Jan  4 15:05 README.md
-rw-r--r--. 1 austinjxseph austinjxseph  2306 Jan  4 15:05 redirects.js
-rw-r--r--. 1 austinjxseph austinjxseph 17312 Jan  4 15:05 script.js
-rw-r--r--. 1 austinjxseph austinjxseph     0 Feb 24 18:39 search.js
```


**Tool Call: find /home/austinjxseph/GitHub/shoreditchdesign/brochuresite -type f \( -name "*.html" -o -name "index.*" \)**
Status: Completed

Terminal:
```






```


**Tool Call: ls -la /home/austinjxseph/GitHub/shoreditchdesign/**
Status: Completed

Terminal:
```
total 0
drwxr-xr-x. 1 austinjxseph austinjxseph 182 Feb 19 00:12 .
drwxr-xr-x. 1 austinjxseph austinjxseph  56 Feb 11 14:09 ..
drwxr-xr-x. 1 austinjxseph austinjxseph 750 Jan  4 15:05 arena
drwxr-xr-x. 1 austinjxseph austinjxseph 208 Feb 24 18:39 brochuresite
drwxr-xr-x. 1 austinjxseph austinjxseph 256 Feb  9 15:09 brochuresync
drwxr-xr-x. 1 austinjxseph austinjxseph  64 Jan  4 15:03 build
drwxr-xr-x. 1 austinjxseph austinjxseph 266 Jan 21 09:57 buildit
drwxr-xr-x. 1 austinjxseph austinjxseph  38 Feb 24 18:14 .claude
drwxr-xr-x. 1 austinjxseph austinjxseph 256 Jan  4 15:03 engine
drwxr-xr-x. 1 austinjxseph austinjxseph 510 Jan  4 15:03 engine-azure
drwxr-xr-x. 1 austinjxseph austinjxseph 148 Jan  4 15:03 hoxton
drwxr-xr-x. 1 austinjxseph austinjxseph 136 Feb 11 14:17 mbzuai
drwxr-xr-x. 1 austinjxseph austinjxseph 218 Feb  4 00:33 sandbox
drwxr-xr-x. 1 austinjxseph austinjxseph 126 Jan 27 16:10 studio
```


**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js**
Status: Completed

```
     1→//Normalise Scroll
     2→document.addEventListener("DOMContentLoaded", function () {
     3→  // Skip scroll normalization for /news and all URLs inside /news/
     4→  const currentPath = window.location.pathname;
     5→  if (currentPath === "/news" || currentPath.startsWith("/news/")) {
     6→    return;
     7→  }
     8→
     9→  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    10→    ScrollTrigger.normalizeScroll({
    11→      allowNestedScroll: true,
    12→      lockAxis: true,
    13→      type: "touch,wheel",
    14→    });
    15→  }
    16→});
    17→
    18→//Textarea Resizer
    19→document.addEventListener("DOMContentLoaded", () => {
    20→  const textareas = document.querySelectorAll("textarea");
    21→
    22→  textareas.forEach((textarea) => {
    23→    textarea.addEventListener("input", () => {
    24→      textarea.style.height = "auto";
    25→      textarea.style.height = `${textarea.scrollHeight}px`;
    26→    });
    27→  });
    28→});
    29→
    30→//Tab Injection
    31→document.addEventListener("DOMContentLoaded", function () {
    32→  // Find wrapper element
    33→  const wrapper = document.querySelector('[data-clone-source="wrap"]');
    34→  if (!wrapper) {
    35→    console.warn("Tab Injection: Wrapper not found");
    36→    return;
    37→  }
    38→  console.log("Wrapper found:", wrapper);
    39→
    40→  // Find source elements inside wrapper
    41→  const sourceLink = wrapper.querySelector('[data-clone-source="link"]');
    42→  const sourcePane = wrapper.querySelector('[data-clone-source="pane"]');
    43→
    44→  if (!sourceLink) {
    45→    console.log("Source link element not found, returning");
    46→    return;
    47→  }
    48→  if (!sourcePane) {
    49→    console.log("Source pane element not found, returning");
    50→    return;
    51→  }
    52→  console.log("Source elements found - link:", sourceLink, "pane:", sourcePane);
    53→
    54→  // Find ALL target elements
    55→  const targetLinks = document.querySelectorAll('[data-clone-target="link"]');
    56→  const targetPanes = document.querySelectorAll('[data-clone-target="pane"]');
    57→
    58→  if (targetLinks.length === 0) {
    59→    console.log("No target link elements found, returning");
    60→    return;
    61→  }
    62→  if (targetPanes.length === 0) {
    63→    console.log("No target pane elements found, returning");
    64→    return;
    65→  }
    66→  console.log(
    67→    `Found ${targetLinks.length} target links and ${targetPanes.length} target panes`,
    68→  );
    69→
    70→  // Clone source link to all target links
    71→  targetLinks.forEach((targetLink, index) => {
    72→    const clonedLink = sourceLink.cloneNode(true);
    73→    targetLink.appendChild(clonedLink);
    74→    console.log(`Cloned source link to target link ${index + 1}`);
    75→  });
    76→
    77→  // Clone source pane to all target panes
    78→  targetPanes.forEach((targetPane, index) => {
    79→    const clonedPane = sourcePane.cloneNode(true);
    80→    targetPane.appendChild(clonedPane);
    81→    console.log(`Cloned source pane to target pane ${index + 1}`);
    82→  });
    83→
    84→  // Delete wrapper
    85→  wrapper.remove();
    86→  console.log("Clone operation complete, wrapper deleted");
    87→});
    88→
    89→//Dynamic Layouts
    90→document.addEventListener("DOMContentLoaded", function () {
    91→  // Subtle fade-in for news cards
    92→  function animate() {
    93→    const cards = document.querySelectorAll("[data-news-card]");
    94→
    95→    if (cards.length === 0) return;
    96→
    97→    gsap.set(cards, { opacity: 0 });
    98→    gsap.to(cards, {
    99→      opacity: 1,
   100→      duration: 0.3,
   101→      ease: "power1.out",
   102→    });
   103→  }
   104→
   105→  // Remove offset items from grid
   106→  function remove(grid) {
   107→    const offset = grid.getAttribute("data-news-offset");
   108→    if (!offset) return;
   109→
   110→    const offsetNum = parseInt(offset, 10);
   111→    if (isNaN(offsetNum) || offsetNum <= 0) return;
   112→
   113→    const gridItems = Array.from(grid.children);
   114→    const itemsToRemove = gridItems.slice(0, offsetNum - 1);
   115→    itemsToRemove.forEach((item) => item.remove());
   116→  }
   117→
   118→  // Add 'wide' class to specific items based on interval
   119→  function layout(grid) {
   120→    const gridItems = Array.from(grid.children);
   121→    const intervalAttr = grid.getAttribute("data-news-grid");
   122→    const interval =
   123→      intervalAttr && !isNaN(parseInt(intervalAttr, 10))
   124→        ? parseInt(intervalAttr, 10)
   125→        : 10;
   126→
   127→    gridItems.forEach((item, index) => {
   128→      const groupNumber = Math.floor(index / interval);
   129→      const positionInGroup = index % interval;
   130→
   131→      if (positionInGroup === 0 || positionInGroup === interval - 1) {
   132→        item.classList.add("wide");
   133→      }
   134→    });
   135→  }
   136→
   137→  // Remove all 'wide' classes from grid
   138→  function reset(grid) {
   139→    const gridItems = Array.from(grid.children);
   140→    gridItems.forEach((item) => item.classList.remove("wide"));
   141→  }
   142→
   143→  // Check device and setup responsive behavior
   144→  function checkDevice(grid) {
   145→    const hasMobileAttr = grid.hasAttribute("data-grid-mobile");
   146→
   147→    // Check if should apply layout based on device
   148→    const shouldApply = () => {
   149→      if (!hasMobileAttr) return true;
   150→      const mediaQuery = window.matchMedia("(max-width: 768px)");
   151→      return mediaQuery.matches;
   152→    };
   153→
   154→    // Apply or reset layout based on device check
   155→    if (!shouldApply()) {
   156→      reset(grid);
   157→      // Fade in cards even when resetting (desktop view for mobile-only grids)
   158→      animate();
   159→      return;
   160→    }
   161→    reset(grid);
   162→    layout(grid);
   163→
   164→    // Fade in cards after layout is complete
   165→    animate();
   166→
   167→    // Setup responsive listener if mobile attribute exists
   168→    if (hasMobileAttr) {
   169→      const mediaQuery = window.matchMedia("(max-width: 768px)");
   170→      const handleMediaQueryChange = (e) => {
   171→        if (e.matches) {
   172→          layout(grid);
   173→          // Fade in cards after layout is complete
   174→          animate();
   175→        } else {
   176→          reset(grid);
   177→        }
   178→      };
   179→      mediaQuery.addEventListener("change", handleMediaQueryChange);
   180→    }
   181→  }
   182→
   183→  // Process a single grid
   184→  function initialiseLayout(grid) {
   185→    remove(grid);
   186→    checkDevice(grid);
   187→  }
   188→
   189→  // Check pagination and setup load more buttons
   190→  function checkPagination() {
   191→    const loadMoreButtons = document.querySelectorAll("[data-news-load]");
   192→    const grid = document.querySelector("[data-news-grid]");
   193→    if (!grid) return;
   194→
   195→    // Use MutationObserver to detect when new items are added
   196→    const observer = new MutationObserver((mutations) => {
   197→      mutations.forEach((mutation) => {
   198→        if (mutation.addedNodes.length > 0) {
   199→          // New items were added, recalculate layout
   200→          reset(grid);
   201→          layout(grid);
   202→
   203→          // Fade in cards after layout is complete
   204→          animate();
   205→        }
   206→      });
   207→    });
   208→
   209→    // Start observing the grid for child additions
   210→    observer.observe(grid, {
   211→      childList: true,
   212→      subtree: false,
   213→    });
   214→
   215→    // Fallback: also add click listeners with longer delay
   216→    loadMoreButtons.forEach((button) => {
   217→      button.addEventListener("click", () => {
   218→        // Wait longer for Finsweet to load content
   219→        setTimeout(() => {
   220→          reset(grid);
   221→          layout(grid);
   222→
   223→          // Fade in cards after layout is complete
   224→          animate();
   225→        }, 500);
   226→      });
   227→    });
   228→  }
   229→
   230→  // Main execution
   231→  const newsGrids = document.querySelectorAll("[data-news-grid]");
   232→  if (newsGrids.length === 0) return;
   233→
   234→  newsGrids.forEach((grid) => initialiseLayout(grid));
   235→  checkPagination();
   236→});
   237→
   238→//Query Parameters
   239→document.addEventListener("DOMContentLoaded", function () {
   240→  const newsQueryElement = document.querySelector("[data-search-query]");
   241→
   242→  //Check if attribute exists
   243→  if (!newsQueryElement) {
   244→    return;
   245→  }
   246→
   247→  const currentUrl = window.location.href;
   248→  const queryMatch = currentUrl.match(/[?&]query=([^&]+)/);
   249→
   250→  if (queryMatch && queryMatch[1]) {
   251→    const decodedQuery = decodeURIComponent(queryMatch[1].replace(/\+/g, " "));
   252→    newsQueryElement.textContent = decodedQuery;
   253→  } else {
   254→  }
   255→});
   256→
   257→//Sidebar Injection
   258→document.addEventListener("DOMContentLoaded", function () {
   259→  // Check for data-sidebar-source and data-sidebar-target
   260→  const sidebarSource = document.querySelector("[data-sidebar-source]");
   261→  const sidebarTarget = document.querySelector("[data-sidebar-target]");
   262→
   263→  if (!sidebarSource || !sidebarTarget) {
   264→    return;
   265→  }
   266→
   267→  // Store the original parent and next sibling to restore position later
   268→  const originalParent = sidebarSource.parentNode;
   269→  const originalNextSibling = sidebarSource.nextSibling;
   270→
   271→  // Define a media query for tablet and below (max-width 768px)
   272→  const mediaQuery = window.matchMedia("(max-width: 768px)");
   273→
   274→  const handleMediaQueryChange = (e) => {
   275→    if (e.matches) {
   276→      // If screen is tablet or below, move the sidebar to the target
   277→      if (sidebarSource.parentNode !== sidebarTarget) {
   278→        sidebarTarget.appendChild(sidebarSource);
   279→      }
   280→    } else {
   281→      // If screen is larger than tablet, move it back to original position
   282→      if (sidebarSource.parentNode !== originalParent) {
   283→        if (originalNextSibling) {
   284→          originalParent.insertBefore(sidebarSource, originalNextSibling);
   285→        } else {
   286→          originalParent.appendChild(sidebarSource);
   287→        }
   288→      }
   289→    }
   290→  };
   291→
   292→  // Initial check
   293→  handleMediaQueryChange(mediaQuery);
   294→
   295→  // Listen for changes in the media query
   296→  mediaQuery.addEventListener("change", handleMediaQueryChange);
   297→});
   298→
   299→//Countup Animation
   300→document.addEventListener("DOMContentLoaded", function () {
   301→  function initStatCells() {
   302→    const statArrays = document.querySelectorAll("[data-stat-array]");
   303→
   304→    statArrays.forEach((array) => {
   305→      const statCells = array.querySelectorAll("[data-stat-cell]");
   306→
   307→      statCells.forEach((cell, index) => {
   308→        const finalNumber = parseInt(cell.textContent) || 0;
   309→        const startNumber = Math.round(finalNumber * 0.7);
   310→
   311→        // Create unique ID for each cell
   312→        const cellId = `stat-${Date.now()}-${index}`;
   313→        cell.id = cellId;
   314→
   315→        // Create CountUp instance
   316→        const counter = new CountUp(cellId, startNumber, finalNumber, 0, 2);
   317→
   318→        if (!counter.error) {
   319→          createScrollTrigger(array, counter, index);
   320→        }
   321→      });
   322→    });
   323→  }
   324→
   325→  function createScrollTrigger(array, counter, index) {
   326→    const staggerDelay = index * 100;
   327→
   328→    // Start on scroll down - only once
   329→    ScrollTrigger.create({
   330→      trigger: array,
   331→      start: "top 85%", // Increased from 80% for better mobile trigger reliability
   332→      once: true, // Only trigger once
   333→      onEnter: () => {
   334→        setTimeout(() => {
   335→          counter.start();
   336→        }, staggerDelay);
   337→      },
   338→    });
   339→  }
   340→
   341→  initStatCells();
   342→
   343→  // Refresh ScrollTrigger after layout settles to account for any initial shifts
   344→  setTimeout(() => {
   345→    ScrollTrigger.refresh();
   346→  }, 100);
   347→});
   348→
   349→//Array Animation on Load More
   350→document.addEventListener("DOMContentLoaded", function () {
   351→  function checkLoadMore() {
   352→    const loadMoreButtons = document.querySelectorAll("[data-load-more]");
   353→    const containers = document.querySelectorAll(
   354→      "[data-motion-array]:not([data-motion-block]), [data-motion-stagger]:not([data-motion-block])",
   355→    );
   356→    if (containers.length === 0) return;
   357→
   358→    containers.forEach((container) => {
   359→      // Determine animation type based on attribute
   360→      const isStagger = container.hasAttribute("data-motion-stagger");
   361→
   362→      // Use MutationObserver to detect when new items are added
   363→      const observer = new MutationObserver((mutations) => {
   364→        mutations.forEach((mutation) => {
   365→          if (mutation.addedNodes.length > 0) {
   366→            // Get only the newly added child elements
   367→            const newChildren = Array.from(mutation.addedNodes).filter(
   368→              (node) =>
   369→                node.nodeType === 1 && !node.hasAttribute("data-motion-block"),
   370→            );
   371→
   372→            if (newChildren.length > 0) {
   373→              // Animate only the new children
   374→              if (window.innerWidth > 991) {
   375→                if (isStagger) {
   376→                  // Stagger: opacity only (no y translate)
   377→                  gsap.set(newChildren, {
   378→                    opacity: 0,
   379→                  });
   380→                  gsap.to(newChildren, {
   381→                    opacity: 1,
   382→                    duration: 0.8,
   383→                    stagger: 0.15,
   384→                    ease: "power2.out",
   385→                  });
   386→                } else {
   387→                  // Array: opacity + y translate
   388→                  gsap.set(newChildren, {
   389→                    opacity: 0,
   390→                    y: 5,
   391→                  });
   392→                  gsap.to(newChildren, {
   393→                    opacity: 1,
   394→                    y: 0,
   395→                    duration: 0.8,
   396→                    stagger: 0.15,
   397→                    ease: "power2.out",
   398→                  });
   399→                }
   400→              } else {
   401→                gsap.set(newChildren, {
   402→                  opacity: 1,
   403→                  y: 0,
   404→                });
   405→              }
   406→            }
   407→          }
   408→        });
   409→      });
   410→
   411→      // Start observing the container for child additions
   412→      observer.observe(container, {
   413→        childList: true,
   414→        subtree: false,
   415→      });
   416→    });
   417→
   418→    // Fallback: also add click listeners with delay
   419→    loadMoreButtons.forEach((button) => {
   420→      button.addEventListener("click", () => {
   421→        setTimeout(() => {
   422→          containers.forEach((container) => {
   423→            const isStagger = container.hasAttribute("data-motion-stagger");
   424→            const children = Array.from(container.children).filter(
   425→              (child) => !child.hasAttribute("data-motion-block"),
   426→            );
   427→            if (window.innerWidth > 991) {
   428→              if (isStagger) {
   429→                // Stagger: opacity only
   430→                gsap.to(children, {
   431→                  opacity: 1,
   432→                  duration: 0.8,
   433→                  stagger: 0.15,
   434→                  ease: "power2.out",
   435→                });
   436→              } else {
   437→                // Array: opacity + y translate
   438→                gsap.to(children, {
   439→                  opacity: 1,
   440→                  y: 0,
   441→                  duration: 0.8,
   442→                  stagger: 0.15,
   443→                  ease: "power2.out",
   444→                });
   445→              }
   446→            }
   447→          });
   448→        }, 500);
   449→      });
   450→    });
   451→  }
   452→
   453→  checkLoadMore();
   454→});
   455→
   456→//Form Injection
   457→document.addEventListener("DOMContentLoaded", function () {
   458→  // Find all form embed wrapper elements
   459→  const formWrappers = document.querySelectorAll("[data-form-embed]");
   460→
   461→  if (formWrappers.length === 0) {
   462→    return;
   463→  }
   464→
   465→  formWrappers.forEach((wrapper) => {
   466→    // Find source and target within this wrapper
   467→    const formSource = wrapper.querySelector("[data-form-source]");
   468→    const formTarget = wrapper.querySelector("[data-form-target]");
   469→
   470→    if (!formSource || !formTarget) {
   471→      return;
   472→    }
   473→
   474→    // Get the innerHTML from the source div (which contains escaped HTML entities)
   475→    const scriptContent = formSource.innerHTML.trim();
   476→
   477→    if (!scriptContent) {
   478→      return;
   479→    }
   480→
   481→    // Create a temporary div to decode HTML entities and remove <br> tags
   482→    const tempDiv = document.createElement("div");
   483→    tempDiv.innerHTML = scriptContent;
   484→
   485→    // Get the decoded text content and remove line breaks
   486→    const decodedContent = tempDiv.textContent.replace(/\n/g, "");
   487→
   488→    // Create another temp div to parse the decoded HTML into actual script elements
   489→    const scriptContainer = document.createElement("div");
   490→    scriptContainer.innerHTML = decodedContent;
   491→
   492→    // Hide or remove the editor preview message
   493→    const editorPreview = formTarget.querySelector("[data-editor-preview]");
   494→    if (editorPreview) {
   495→      editorPreview.style.display = "none";
   496→    }
   497→
   498→    // Get all script elements from the parsed content
   499→    const scriptElements = Array.from(
   500→      scriptContainer.querySelectorAll("script"),
   501→    );
   502→
   503→    // Function to inject scripts sequentially
   504→    function injectScriptsSequentially(scripts, index = 0) {
   505→      if (index >= scripts.length) return;
   506→
   507→      const script = scripts[index];
   508→      const newScript = document.createElement("script");
   509→
   510→      // Copy all attributes
   511→      Array.from(script.attributes).forEach((attr) => {
   512→        newScript.setAttribute(attr.name, attr.value);
   513→      });
   514→
   515→      // Copy the script content
   516→      if (script.src) {
   517→        // External script - wait for it to load before continuing
   518→        newScript.src = script.src;
   519→        newScript.onload = () => {
   520→          injectScriptsSequentially(scripts, index + 1);
   521→        };
   522→        newScript.onerror = () => {
   523→          console.error("Failed to load script:", script.src);
   524→          injectScriptsSequentially(scripts, index + 1);
   525→        };
   526→      } else {
   527→        // Inline script - executes immediately
   528→        newScript.textContent = script.textContent;
   529→        // Continue to next script after a small delay
   530→        setTimeout(() => {
   531→          injectScriptsSequentially(scripts, index + 1);
   532→        }, 0);
   533→      }
   534→
   535→      // Append the new script to the target
   536→      formTarget.appendChild(newScript);
   537→    }
   538→
   539→    // Start injecting scripts
   540→    injectScriptsSequentially(scriptElements);
   541→  });
   542→});
   543→
   544→//Resource Categories
   545→document.addEventListener("DOMContentLoaded", function () {
   546→  const resourceLinks = document.querySelectorAll("[data-resource-link]");
   547→
   548→  if (resourceLinks.length === 0) {
   549→    return;
   550→  }
   551→
   552→  resourceLinks.forEach((link) => {
   553→    const linkText = link.textContent.trim();
   554→
   555→    if (!linkText) {
   556→      return;
   557→    }
   558→
   559→    // Capitalize first letter of each word for the query parameter
   560→    const formattedCategory = linkText
   561→      .split(" ")
   562→      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
   563→      .join(" ");
   564→
   565→    // Set the href with the category query parameter
   566→    link.href = `/resources?category_equal=${formattedCategory}`;
   567→  });
   568→});
   569→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/query.js**
Status: Completed

```
     1→//Query Parameter Redirect Handler for news-single page
     2→document.addEventListener("DOMContentLoaded", function () {
     3→  // Check redirect flag once
     4→  const redirectFlag = document.querySelector("[data-post-redirect]");
     5→  const shouldRedirect =
     6→    !redirectFlag || redirectFlag.getAttribute("data-post-redirect") !== "0";
     7→
     8→  // Get postId from URL once
     9→  const postId = new URLSearchParams(window.location.search).get("postId");
    10→
    11→  // Wait for tab focus, then start countdown and wait for Finsweet pagination to load
    12→  waitForFocus(() => {
    13→    startCountdown();
    14→    setTimeout(() => {
    15→      performRedirect(postId, shouldRedirect);
    16→    }, 3000);
    17→  });
    18→
    19→  function performRedirect(postId, shouldRedirect) {
    20→    // Single nested if-else logic tree
    21→    if (!postId) {
    22→      // No postId in URL
    23→      if (shouldRedirect) {
    24→        window.location.replace("/news");
    25→      }
    26→    } else {
    27→      // PostId exists, try to find article
    28→      const articleSlug = findArticleSlug(postId);
    29→
    30→      if (!articleSlug) {
    31→        // Article not found in DOM
    32→        if (shouldRedirect) {
    33→          window.location.replace("/news");
    34→        }
    35→      } else {
    36→        // Article found
    37→        if (shouldRedirect) {
    38→          window.location.replace(`/news/${articleSlug}`);
    39→        }
    40→      }
    41→    }
    42→  }
    43→
    44→  function findArticleSlug(postId) {
    45→    const allPostTargets = document.querySelectorAll("[data-post-target]");
    46→
    47→    for (const item of allPostTargets) {
    48→      const postIdElement = item.querySelector("[data-post-id]");
    49→      const postSlugElement = item.querySelector("[data-post-slug]");
    50→
    51→      if (postIdElement && postIdElement.textContent.trim() === postId) {
    52→        return postSlugElement ? postSlugElement.textContent.trim() : null;
    53→      }
    54→    }
    55→
    56→    return null;
    57→  }
    58→
    59→  function waitForFocus(callback) {
    60→    if (document.hasFocus()) {
    61→      callback();
    62→    } else {
    63→      window.addEventListener("focus", function onFocus() {
    64→        window.removeEventListener("focus", onFocus);
    65→        callback();
    66→      });
    67→    }
    68→  }
    69→
    70→  function startCountdown() {
    71→    const countdownElement = document.querySelector("[data-post-time]");
    72→    if (!countdownElement) return;
    73→
    74→    const startTime =
    75→      parseInt(countdownElement.getAttribute("data-time-start")) || 3;
    76→    let timeRemaining = startTime;
    77→    countdownElement.textContent = timeRemaining;
    78→
    79→    const interval = setInterval(() => {
    80→      timeRemaining--;
    81→      countdownElement.textContent = timeRemaining;
    82→
    83→      if (timeRemaining <= 0) {
    84→        clearInterval(interval);
    85→      }
    86→    }, 1000);
    87→  }
    88→});
    89→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/motion.js**
Status: Completed

```
     1→//GSAP for Navbar Tuck
     2→document.addEventListener("DOMContentLoaded", () => {
     3→  const navbars = document.querySelectorAll(
     4→    '[data-nav-element="navbar"]:not([data-tuck-block="blocked"])',
     5→  );
     6→  if (navbars.length === 0) {
     7→    console.warn("No navbar elements found - animation aborted");
     8→    return;
     9→  }
    10→
    11→  // Set initial attribute state
    12→  navbars.forEach((navbar) => {
    13→    navbar.setAttribute("data-tuck-state", "default");
    14→  });
    15→
    16→  gsap.set(navbars, { yPercent: 0, translateY: "0%" });
    17→  const showAnim = gsap
    18→    .from(navbars, {
    19→      yPercent: -100,
    20→      paused: true,
    21→      duration: 0.2,
    22→    })
    23→    .progress(1);
    24→  let lastScrollTop = 0;
    25→  const downScrollThreshold = 200;
    26→  const upScrollThreshold = 200;
    27→  let accumulatedScroll = 0;
    28→  let navbarVisible = true;
    29→  window.addEventListener("scroll", () => {
    30→    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    31→    const scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
    32→    const scrollAmount = Math.abs(scrollTop - lastScrollTop);
    33→    if (
    34→      (scrollDirection === "down" && accumulatedScroll < 0) ||
    35→      (scrollDirection === "up" && accumulatedScroll > 0)
    36→    ) {
    37→      accumulatedScroll = 0;
    38→    }
    39→    accumulatedScroll +=
    40→      scrollDirection === "down" ? scrollAmount : -scrollAmount;
    41→    if (accumulatedScroll > downScrollThreshold && navbarVisible) {
    42→      showAnim.reverse();
    43→      navbarVisible = false;
    44→      accumulatedScroll = 0;
    45→
    46→      // Set attribute to default when hiding navbar (reverse animation)
    47→      navbars.forEach((navbar) => {
    48→        navbar.setAttribute("data-tuck-state", "default");
    49→      });
    50→    } else if (accumulatedScroll < -upScrollThreshold && !navbarVisible) {
    51→      showAnim.play();
    52→      navbarVisible = true;
    53→      accumulatedScroll = 0;
    54→
    55→      // Set attribute to hidden when showing navbar (play animation)
    56→      navbars.forEach((navbar) => {
    57→        navbar.setAttribute("data-tuck-state", "hidden");
    58→      });
    59→    }
    60→    lastScrollTop = scrollTop;
    61→  });
    62→});
    63→
    64→//GSAP to Navbar Slide
    65→document.addEventListener("DOMContentLoaded", () => {
    66→  function initialiser() {
    67→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    68→      console.error(
    69→        "Required libraries (GSAP or ScrollTrigger) are not loaded",
    70→      );
    71→      return;
    72→    }
    73→    gsap.registerPlugin(ScrollTrigger);
    74→  }
    75→
    76→  function animator() {
    77→    const slideElements = document.querySelectorAll("[data-motion-slide]");
    78→
    79→    if (!slideElements || slideElements.length === 0) {
    80→      console.warn("Motion: Slide elements not found");
    81→      return;
    82→    }
    83→
    84→    const animatableElements = Array.from(slideElements).filter((element) => {
    85→      return element.getAttribute("data-motion-slide") !== "blocked";
    86→    });
    87→
    88→    animatableElements.forEach((element, index) => {
    89→      try {
    90→        const delay = element.getAttribute("data-motion-delay")
    91→          ? parseFloat(element.getAttribute("data-motion-delay"))
    92→          : 0;
    93→
    94→        gsap.set(element, {
    95→          opacity: 1,
    96→          y: "-120%",
    97→        });
    98→
    99→        const tl = gsap.timeline({
   100→          paused: true,
   101→        });
   102→
   103→        tl.to(element, {
   104→          opacity: 1,
   105→          y: "0%",
   106→          duration: 0.8,
   107→          ease: "power2.out",
   108→        });
   109→
   110→        ScrollTrigger.create({
   111→          trigger: element,
   112→          start: "top 95%",
   113→          markers: false,
   114→          once: true,
   115→          onEnter: () => {
   116→            setTimeout(() => {
   117→              tl.play(0);
   118→            }, delay * 1000);
   119→          },
   120→        });
   121→      } catch (error) {
   122→        console.error(`Motion: Slide animation failed at ${index + 1}:`, error);
   123→      }
   124→    });
   125→  }
   126→
   127→  function triggers() {
   128→    let resizeTimeout;
   129→    window.addEventListener("resize", () => {
   130→      clearTimeout(resizeTimeout);
   131→      resizeTimeout = setTimeout(() => {
   132→        ScrollTrigger.getAll().forEach((trigger) => {
   133→          if (
   134→            trigger.vars &&
   135→            trigger.vars.trigger &&
   136→            trigger.vars.trigger.hasAttribute("data-motion-slide")
   137→          ) {
   138→            trigger.kill();
   139→          }
   140→        });
   141→        animator();
   142→      }, 250);
   143→    });
   144→  }
   145→
   146→  initialiser();
   147→
   148→  // Wait for stacking cards to initialize before measuring content height
   149→  // This ensures we get accurate measurements after dynamic heights are set
   150→  if (window.innerWidth > 768) {
   151→    window.addEventListener(
   152→      "stackCardsInitialized",
   153→      () => {
   154→        animator();
   155→      },
   156→      { once: true },
   157→    );
   158→  } else {
   159→    // On mobile, no stacking cards, initialize immediately
   160→    animator();
   161→  }
   162→
   163→  triggers();
   164→});
   165→
   166→//GSAP for Navbar Opacity Toggle
   167→document.addEventListener("DOMContentLoaded", function () {
   168→  function initialiser() {
   169→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
   170→      console.warn("Script terminated due to missing libraries");
   171→      return;
   172→    }
   173→    gsap.registerPlugin(ScrollTrigger);
   174→  }
   175→
   176→  function animator() {
   177→    const navbar = document.querySelector("[data-nav-element='navbar']");
   178→    const heroSection = document.querySelector("[data-section-hero]");
   179→
   180→    if (!navbar || !heroSection) {
   181→      console.warn("Navbar or hero section not found");
   182→      return;
   183→    }
   184→
   185→    // Check if at top of page and set opacity off
   186→    if (window.scrollY === 0) {
   187→      navbar.setAttribute("data-nav-opacity", "off");
   188→    }
   189→
   190→    ScrollTrigger.create({
   191→      trigger: heroSection,
   192→      start: "top top",
   193→      end: "bottom top",
   194→      onEnter: () => {
   195→        navbar.setAttribute("data-nav-opacity", "on");
   196→      },
   197→      onLeaveBack: () => {
   198→        navbar.setAttribute("data-nav-opacity", "off");
   199→      },
   200→      markers: false,
   201→    });
   202→  }
   203→
   204→  function triggers() {
   205→    let resizeTimeout;
   206→    window.addEventListener("resize", () => {
   207→      clearTimeout(resizeTimeout);
   208→      resizeTimeout = setTimeout(() => {
   209→        ScrollTrigger.getAll().forEach((trigger) => {
   210→          if (
   211→            trigger.vars &&
   212→            trigger.vars.trigger &&
   213→            trigger.vars.trigger.hasAttribute("data-section-hero")
   214→          ) {
   215→            trigger.kill();
   216→          }
   217→        });
   218→        animator();
   219→        ScrollTrigger.refresh();
   220→      }, 250);
   221→    });
   222→  }
   223→
   224→  initialiser();
   225→  animator();
   226→  triggers();
   227→
   228→  // Prevent bfcache from caching this page
   229→  window.addEventListener("unload", () => {
   230→    // Empty handler - presence of unload listener prevents bfcache
   231→  });
   232→
   233→  // Backup: Force reload if bfcache activates
   234→  window.addEventListener("pageshow", (event) => {
   235→    if (event.persisted) {
   236→      window.location.reload();
   237→    }
   238→  });
   239→});
   240→
   241→//GSAP for Ticker
   242→document.addEventListener("DOMContentLoaded", () => {
   243→  const tickerWrap = document.querySelector("[data-ticker-wrap]");
   244→  const tickerItem = document.querySelector("[data-ticker-item]");
   245→
   246→  if (!tickerWrap || !tickerItem) {
   247→    console.warn("Ticker elements not found");
   248→    return;
   249→  }
   250→
   251→  const originalContent = tickerItem.outerHTML;
   252→  let currentAnimation = null;
   253→  let resizeTimeout;
   254→
   255→  function calculateRequiredCopies() {
   256→    const viewportWidth = window.innerWidth;
   257→    // Get fresh reference to first ticker item
   258→    const firstItem = tickerWrap.querySelector("[data-ticker-item]");
   259→
   260→    if (!firstItem) {
   261→      console.warn("Ticker: No item found in wrap");
   262→      return null;
   263→    }
   264→
   265→    const itemWidth = firstItem.offsetWidth;
   266→
   267→    // Prevent infinite loop if itemWidth is 0
   268→    if (itemWidth <= 0) {
   269→      console.warn("Ticker: Item width is 0, cannot calculate copies");
   270→      return null;
   271→    }
   272→
   273→    // Create enough copies to fill viewport plus buffer
   274→    const copiesNeeded = Math.ceil(viewportWidth / itemWidth) + 2;
   275→
   276→    return {
   277→      viewportWidth,
   278→      itemWidth,
   279→      copiesNeeded,
   280→    };
   281→  }
   282→
   283→  function setupTicker() {
   284→    // Kill existing animation if any
   285→    if (currentAnimation) {
   286→      currentAnimation.kill();
   287→      currentAnimation = null;
   288→    }
   289→
   290→    const calculations = calculateRequiredCopies();
   291→
   292→    if (!calculations) {
   293→      console.warn("Ticker: Unable to setup, invalid calculations");
   294→      return;
   295→    }
   296→
   297→    const { copiesNeeded, itemWidth } = calculations;
   298→
   299→    tickerWrap.innerHTML = "";
   300→
   301→    for (let i = 0; i < copiesNeeded; i++) {
   302→      const clone = document.createElement("div");
   303→      clone.innerHTML = originalContent;
   304→      const clonedItem = clone.firstElementChild;
   305→      tickerWrap.appendChild(clonedItem);
   306→    }
   307→
   308→    // Reset position before starting new animation
   309→    gsap.set(tickerWrap, { x: 0 });
   310→
   311→    // Animate by one item width for seamless loop
   312→    currentAnimation = gsap.to(tickerWrap, {
   313→      x: -itemWidth,
   314→      duration: itemWidth / 50,
   315→      ease: "none",
   316→      repeat: -1,
   317→      onRepeat: () => {
   318→        gsap.set(tickerWrap, { x: 0 });
   319→      },
   320→    });
   321→  }
   322→
   323→  // Resize handler function (so we can remove it if needed)
   324→  function handleResize() {
   325→    clearTimeout(resizeTimeout);
   326→    resizeTimeout = setTimeout(() => {
   327→      setupTicker();
   328→    }, 250); // Debounce resize events
   329→  }
   330→
   331→  // Initialize the ticker
   332→  setupTicker();
   333→
   334→  // Recalculate on window resize
   335→  window.addEventListener("resize", handleResize);
   336→
   337→  // Cleanup function (optional - can be called if ticker needs to be destroyed)
   338→  window.destroyTicker = () => {
   339→    window.removeEventListener("resize", handleResize);
   340→    clearTimeout(resizeTimeout);
   341→    if (currentAnimation) {
   342→      currentAnimation.kill();
   343→      currentAnimation = null;
   344→    }
   345→  };
   346→});
   347→
   348→//GSAP for Sticky Headers
   349→document.addEventListener("DOMContentLoaded", () => {
   350→  function initialiser() {
   351→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
   352→      console.warn("Script terminated due to missing libraries");
   353→      return;
   354→    }
   355→    gsap.registerPlugin(ScrollTrigger);
   356→  }
   357→
   358→  function animator() {
   359→    const featuresWrap = document.querySelector("[data-features-wrap]");
   360→    const featuresHeader = document.querySelector("[data-features-header]");
   361→
   362→    if (!featuresWrap || !featuresHeader) {
   363→      console.warn("Features wrap or header not found");
   364→      return;
   365→    }
   366→
   367→    // Force scroll to top only when these elements are present
   368→    if (window.innerWidth > 768) {
   369→      if ("scrollRestoration" in history) {
   370→        history.scrollRestoration = "manual";
   371→      }
   372→      window.scrollTo(0, 0);
   373→    }
   374→
   375→    gsap.set(featuresHeader, { opacity: 1 });
   376→
   377→    ScrollTrigger.create({
   378→      trigger: featuresWrap,
   379→      start: "bottom bottom-=32px",
   380→      end: "bottom bottom-=33px",
   381→      onEnter: () => {
   382→        gsap.to(featuresHeader, {
   383→          opacity: 0,
   384→          duration: 0.1,
   385→          ease: "power2.out",
   386→        });
   387→      },
   388→      onLeaveBack: () => {
   389→        gsap.to(featuresHeader, {
   390→          opacity: 1,
   391→          duration: 0.3,
   392→          ease: "power2.out",
   393→        });
   394→      },
   395→      markers: false,
   396→    });
   397→  }
   398→
   399→  function triggers() {
   400→    let resizeTimeout;
   401→    window.addEventListener("resize", () => {
   402→      clearTimeout(resizeTimeout);
   403→      resizeTimeout = setTimeout(() => {
   404→        ScrollTrigger.getAll().forEach((trigger) => {
   405→          if (
   406→            trigger.vars &&
   407→            trigger.vars.trigger &&
   408→            trigger.vars.trigger.hasAttribute("data-features-wrap")
   409→          ) {
   410→            trigger.kill();
   411→          }
   412→        });
   413→        animator();
   414→      }, 250);
   415→    });
   416→  }
   417→
   418→  initialiser();
   419→  animator();
   420→  triggers();
   421→});
   422→
   423→//GSAP for Stacking Cards
   424→document.addEventListener("DOMContentLoaded", function () {
   425→  gsap.registerPlugin(ScrollTrigger);
   426→
   427→  // Track initialization state and store references
   428→  let isInitialized = false;
   429→  let stackTriggers = [];
   430→  let stackTimelines = [];
   431→
   432→  function desktopInitializer(scrollSections) {
   433→    scrollSections.forEach((section) => {
   434→      const wrapper = section.querySelector("[data-stack-wrap]");
   435→      const list = wrapper?.querySelector("[data-stack-list]");
   436→      const items = list?.querySelectorAll("[data-stack-card]");
   437→
   438→      if (wrapper && list && items && items.length > 0) {
   439→        sectionInitialiser(section, wrapper, items);
   440→      }
   441→    });
   442→
   443→    isInitialized = true;
   444→
   445→    // Refresh ScrollTrigger to ensure all triggers (including progress bar) recalculate
   446→    // This allows progress bar to remeasure now that stacking cards have set their heights
   447→    requestAnimationFrame(() => {
   448→      ScrollTrigger.refresh();
   449→
   450→      // Dispatch custom event to notify other scripts that layout is ready
   451→      window.dispatchEvent(new CustomEvent("stackCardsInitialized"));
   452→    });
   453→  }
   454→
   455→  function domSettler(callback) {
   456→    // Force reflow first to ensure DOM has settled
   457→    document.body.offsetHeight;
   458→
   459→    // Wait for browser to complete paint cycles
   460→    requestAnimationFrame(() => {
   461→      requestAnimationFrame(() => {
   462→        callback();
   463→      });
   464→    });
   465→  }
   466→
   467→  function sequenceInitialiser() {
   468→    // Prevent overlapping initializations
   469→    if (isInitialized === "initializing") {
   470→      return;
   471→    }
   472→
   473→    // Clean up existing animations first
   474→    animationCleaner();
   475→
   476→    if (window.innerWidth <= 768) {
   477→      // Mobile/tablet - reset cards to default state
   478→      mobileInitializer();
   479→      isInitialized = false;
   480→      return;
   481→    }
   482→
   483→    const scrollSection = document.querySelectorAll("[data-stack-section]");
   484→
   485→    if (!scrollSection || scrollSection.length === 0) {
   486→      isInitialized = false;
   487→      return;
   488→    }
   489→
   490→    // Force scroll to top only when these elements are present (desktop only)
   491→    if (window.innerWidth > 768) {
   492→      if ("scrollRestoration" in history) {
   493→        history.scrollRestoration = "manual";
   494→      }
   495→      window.scrollTo(0, 0);
   496→    }
   497→
   498→    // Mark as initializing to prevent race conditions
   499→    isInitialized = "initializing";
   500→
   501→    // Force a full reset before desktop init
   502→    mobileInitializer();
   503→
   504→    // Wait for browser to complete paint cycle before initializing
   505→    domSettler(() => {
   506→      desktopInitializer(scrollSection);
   507→    });
   508→  }
   509→
   510→  function animationCleaner() {
   511→    // Kill all tracked timelines first (includes their ScrollTriggers)
   512→    stackTimelines.forEach((timeline) => {
   513→      if (timeline && timeline.kill) {
   514→        timeline.kill();
   515→      }
   516→    });
   517→    stackTimelines = [];
   518→
   519→    // Kill any remaining tracked ScrollTriggers
   520→    stackTriggers.forEach((trigger) => {
   521→      if (trigger && trigger.kill) {
   522→        trigger.kill();
   523→      }
   524→    });
   525→    stackTriggers = [];
   526→
   527→    // Safety net: Only kill orphaned stack-section triggers not in our tracking arrays
   528→    // This prevents killing unrelated triggers (like progress bars)
   529→    const allTriggers = ScrollTrigger.getAll();
   530→    allTriggers.forEach((trigger) => {
   531→      if (
   532→        trigger.vars &&
   533→        trigger.vars.trigger &&
   534→        trigger.vars.trigger.hasAttribute &&
   535→        trigger.vars.trigger.hasAttribute("data-stack-section")
   536→      ) {
   537→        // Only kill if not already killed by our tracked arrays
   538→        if (!trigger.killed) {
   539→          trigger.kill();
   540→        }
   541→      }
   542→    });
   543→  }
   544→
   545→  function mobileInitializer() {
   546→    const scrollSection = document.querySelectorAll("[data-stack-section]");
   547→
   548→    // Batch DOM operations to minimize reflows
   549→    scrollSection.forEach((section) => {
   550→      const wrapper = section.querySelector("[data-stack-wrap]");
   551→      const list = wrapper?.querySelector("[data-stack-list]");
   552→      const items = list?.querySelectorAll("[data-stack-card]");
   553→
   554→      if (wrapper && items) {
   555→        // Reset wrapper height to auto
   556→        wrapper.style.height = "auto";
   557→
   558→        // Reset all card styles to default
   559→        items.forEach((item) => {
   560→          // Clear all GSAP properties
   561→          gsap.set(item, {
   562→            clearProps: "all",
   563→          });
   564→
   565→          // Explicitly reset transform-related properties
   566→          item.style.transformOrigin = "";
   567→          item.style.removeProperty("transform");
   568→        });
   569→      }
   570→    });
   571→
   572→    // Force single reflow after all sections processed (performance optimization)
   573→    document.body.offsetHeight;
   574→  }
   575→
   576→  function sectionInitialiser(section, wrapper, items) {
   577→    // Calculate dynamic height with current viewport
   578→    const dynamicHeight = `${(items.length + 1) * 100}lvh`;
   579→    wrapper.style.height = dynamicHeight;
   580→
   581→    // Force reflow after setting height
   582→    wrapper.offsetHeight;
   583→
   584→    // Set initial positions with explicit values
   585→    items.forEach((item, index) => {
   586→      if (index !== 0) {
   587→        gsap.set(item, { yPercent: 100 });
   588→      } else {
   589→        gsap.set(item, { yPercent: 0, opacity: 1, scale: 1 });
   590→      }
   591→    });
   592→
   593→    // Create timeline with ScrollTrigger
   594→    const timeline = gsap.timeline({
   595→      scrollTrigger: {
   596→        trigger: section,
   597→        pin: true,
   598→        start: "top top",
   599→        end: () => `+=${items.length * 100}%`,
   600→        scrub: true,
   601→        invalidateOnRefresh: true,
   602→        markers: false,
   603→      },
   604→      defaults: { ease: "none" },
   605→    });
   606→
   607→    // Store timeline reference
   608→    stackTimelines.push(timeline);
   609→
   610→    // Build animation sequence
   611→    items.forEach((item, index) => {
   612→      if (index < items.length - 1) {
   613→        timeline.to(item, {
   614→          opacity: 0,
   615→          scale: 0.9,
   616→          borderRadius: "10px",
   617→        });
   618→        timeline.to(
   619→          items[index + 1],
   620→          {
   621→            yPercent: 0,
   622→          },
   623→          "<",
   624→        );
   625→      }
   626→    });
   627→
   628→    // Store the ScrollTrigger instance (only once)
   629→    if (timeline.scrollTrigger) {
   630→      stackTriggers.push(timeline.scrollTrigger);
   631→    }
   632→  }
   633→
   634→  // Initial setup
   635→  sequenceInitialiser();
   636→
   637→  function thresholdChecker(currentWidth, prevWidth) {
   638→    const crossedThreshold =
   639→      (prevWidth > 768 && currentWidth <= 768) ||
   640→      (prevWidth <= 768 && currentWidth > 768);
   641→
   642→    // Only reinitialize if we crossed the 768px threshold
   643→    if (crossedThreshold) {
   644→      sequenceInitialiser();
   645→
   646→      // Refresh ScrollTrigger after a brief delay to ensure DOM has settled
   647→      requestAnimationFrame(() => {
   648→        ScrollTrigger.refresh();
   649→      });
   650→    }
   651→
   652→    return currentWidth; // Return new width to update previousWidth
   653→  }
   654→
   655→  // Resize handler with debouncing
   656→  let resizeTimeout;
   657→  let previousWidth = window.innerWidth;
   658→  let previousScale = window.visualViewport ? window.visualViewport.scale : 1;
   659→
   660→  window.addEventListener("resize", () => {
   661→    clearTimeout(resizeTimeout);
   662→
   663→    resizeTimeout = setTimeout(() => {
   664→      const currentScale = window.visualViewport
   665→        ? window.visualViewport.scale
   666→        : 1;
   667→
   668→      // Only trigger reinitialization if scale hasn't changed (meaning it's an actual resize, not zoom)
   669→      if (currentScale === previousScale) {
   670→        previousWidth = thresholdChecker(window.innerWidth, previousWidth);
   671→      }
   672→
   673→      previousScale = currentScale;
   674→    }, 300); // Increased debounce to allow viewport units to settle
   675→  });
   676→
   677→  // Cleanup on page unload (prevent memory leaks)
   678→  window.addEventListener("beforeunload", () => {
   679→    animationCleaner();
   680→  });
   681→
   682→  // Prevent bfcache from caching this page (Safari and other browsers)
   683→  window.addEventListener("unload", () => {
   684→    // Empty handler - presence of unload listener prevents bfcache
   685→  });
   686→
   687→  // Backup: Also handle any bfcache restoration attempts
   688→  window.addEventListener("pageshow", (event) => {
   689→    if (event.persisted) {
   690→      // Force full page reload if bfcache somehow still activated
   691→      window.location.reload();
   692→    }
   693→  });
   694→});
   695→
   696→//GSAP for Progress Bar
   697→document.addEventListener("DOMContentLoaded", function () {
   698→  function initialiser() {
   699→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
   700→      console.warn("Script terminated due to missing libraries");
   701→      return;
   702→    }
   703→    gsap.registerPlugin(ScrollTrigger);
   704→
   705→    window.barAnimator = function (
   706→      bar,
   707→      trigger,
   708→      start = "top top",
   709→      end = "bottom 70%",
   710→    ) {
   711→      gsap.set(bar, { width: 0 });
   712→
   713→      const tl = gsap.timeline({
   714→        scrollTrigger: {
   715→          trigger: trigger,
   716→          start: start,
   717→          end: end,
   718→          scrub: true,
   719→        },
   720→      });
   721→
   722→      tl.to(bar, {
   723→        width: "100%",
   724→        ease: "none",
   725→      });
   726→
   727→      return tl;
   728→    };
   729→
   730→    window.cellAnimator = function (
   731→      cells,
   732→      trigger,
   733→      start = "top top",
   734→      end = "bottom 70%",
   735→    ) {
   736→      if (!cells || cells.length === 0) return null;
   737→
   738→      const cellCount = cells.length;
   739→
   740→      ScrollTrigger.create({
   741→        trigger: trigger,
   742→        start: start,
   743→        end: end,
   744→        scrub: true,
   745→        onUpdate: (self) => {
   746→          const currentSegment = Math.min(
   747→            Math.floor(self.progress * cellCount),
   748→            cellCount - 1,
   749→          );
   750→
   751→          cells.forEach((cell, index) => {
   752→            if (index === currentSegment) {
   753→              cell.setAttribute("data-progress-cell", "on");
   754→            } else {
   755→              cell.setAttribute("data-progress-cell", "off");
   756→            }
   757→          });
   758→        },
   759→      });
   760→    };
   761→  }
   762→
   763→  function animator() {
   764→    const progressContainer = document.querySelector("[data-progress-wrap]");
   765→    const progressBar = document.querySelector("[data-progress-bar]");
   766→    const scrollContent = document.querySelector("[data-progress-section]");
   767→    const progressArray = document.querySelector("[data-progress-array]");
   768→
   769→    if (!scrollContent || !progressBar) {
   770→      console.warn("Progress Bar: Required elements not found");
   771→      return;
   772→    }
   773→
   774→    // Force scroll to top only when these elements are present (desktop only)
   775→    if (window.innerWidth > 768) {
   776→      if ("scrollRestoration" in history) {
   777→        history.scrollRestoration = "manual";
   778→      }
   779→      window.scrollTo(0, 0);
   780→    }
   781→
   782→    const contentHeight = scrollContent.offsetHeight;
   783→    const viewportHeight = window.innerHeight;
   784→
   785→    if (contentHeight < viewportHeight * 1.2) {
   786→      gsap.set(progressBar, { width: 0 });
   787→      if (progressContainer) {
   788→        progressContainer.style.display = "none";
   789→      }
   790→      return;
   791→    }
   792→
   793→    window.barAnimator(progressBar, scrollContent);
   794→
   795→    if (progressArray) {
   796→      const progressCells = progressArray.querySelectorAll(
   797→        "[data-progress-cell]",
   798→      );
   799→      window.cellAnimator(progressCells, scrollContent);
   800→    }
   801→  }
   802→
   803→  function triggers() {
   804→    let resizeTimeout;
   805→    window.addEventListener("resize", () => {
   806→      clearTimeout(resizeTimeout);
   807→      resizeTimeout = setTimeout(() => {
   808→        ScrollTrigger.getAll().forEach((trigger) => {
   809→          if (
   810→            trigger.vars &&
   811→            trigger.vars.trigger &&
   812→            trigger.vars.trigger.hasAttribute("data-progress-section")
   813→          ) {
   814→            trigger.kill();
   815→          }
   816→        });
   817→        animator();
   818→      }, 250);
   819→    });
   820→  }
   821→
   822→  initialiser();
   823→
   824→  // Wait for stacking cards to initialize before measuring content height
   825→  // This ensures we get accurate measurements after dynamic heights are set
   826→  if (window.innerWidth > 768) {
   827→    window.addEventListener(
   828→      "stackCardsInitialized",
   829→      () => {
   830→        animator();
   831→      },
   832→      { once: true },
   833→    );
   834→  } else {
   835→    // On mobile, no stacking cards, initialize immediately
   836→    animator();
   837→  }
   838→
   839→  triggers();
   840→
   841→  // Prevent bfcache from caching this page
   842→  window.addEventListener("unload", () => {
   843→    // Empty handler - presence of unload listener prevents bfcache
   844→  });
   845→
   846→  // Backup: Force reload if bfcache activates
   847→  window.addEventListener("pageshow", (event) => {
   848→    if (event.persisted) {
   849→      window.location.reload();
   850→    }
   851→  });
   852→});
   853→
   854→//GSAP for Scroll Cards
   855→document.addEventListener("DOMContentLoaded", () => {
   856→  function initialiser() {
   857→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
   858→      console.warn("Script terminated due to missing libraries");
   859→      return;
   860→    }
   861→    gsap.registerPlugin(ScrollTrigger);
   862→  }
   863→
   864→  function setMobileStyles() {
   865→    // On mobile, set all cards to active state
   866→    const scrollLists = document.querySelectorAll("[data-scroll-list]");
   867→
   868→    scrollLists.forEach((list) => {
   869→      const cards = list.querySelectorAll("[data-scroll-card]");
   870→
   871→      cards.forEach((card) => {
   872→        gsap.set(card, {
   873→          opacity: 1,
   874→          scale: 1,
   875→        });
   876→        card.setAttribute("data-scroll-state", "active");
   877→      });
   878→    });
   879→  }
   880→
   881→  function animator() {
   882→    // Only run on desktop (above 768px)
   883→    if (window.innerWidth <= 768) {
   884→      console.warn("Scroll Cards: Disabled on tablet and mobile");
   885→      setMobileStyles();
   886→      return;
   887→    }
   888→
   889→    const scrollLists = document.querySelectorAll("[data-scroll-list]");
   890→
   891→    if (!scrollLists || scrollLists.length === 0) {
   892→      console.warn("Scroll Cards: No scroll lists found");
   893→      return;
   894→    }
   895→
   896→    scrollLists.forEach((list) => {
   897→      const cards = list.querySelectorAll("[data-scroll-card]");
   898→
   899→      if (!cards || cards.length === 0) {
   900→        console.warn("Scroll Cards: No cards found in list");
   901→        return;
   902→      }
   903→
   904→      // Set initial state for all cards (default state)
   905→      cards.forEach((card) => {
   906→        gsap.set(card, {
   907→          opacity: 0.4,
   908→          scale: 0.95,
   909→        });
   910→        card.setAttribute("data-scroll-state", "default");
   911→      });
   912→
   913→      // Create ScrollTrigger for each card
   914→      cards.forEach((card, index) => {
   915→        const isFirstCard = index === 0;
   916→        const isLastCard = index === cards.length - 1;
   917→
   918→        // First card: stays active when at/above viewport, fades out when scrolling down
   919→        if (isFirstCard) {
   920→          ScrollTrigger.create({
   921→            trigger: card,
   922→            start: "top 70%",
   923→            end: "center 30%",
   924→            scrub: 0.5,
   925→            markers: false,
   926→            onUpdate: (self) => {
   927→              const progress = self.progress;
   928→
   929→              // First card: stays at 1 until it starts leaving center
   930→              // Only fades out as it leaves (no fade in)
   931→              const opacity = gsap.utils.interpolate(1, 0.4, progress);
   932→              const scale = gsap.utils.interpolate(1, 0.95, progress);
   933→
   934→              gsap.to(card, {
   935→                opacity: opacity,
   936→                scale: scale,
   937→                duration: 0.1,
   938→                ease: "none",
   939→              });
   940→
   941→              if (progress < 0.4) {
   942→                card.setAttribute("data-scroll-state", "active");
   943→              } else {
   944→                card.setAttribute("data-scroll-state", "default");
   945→              }
   946→            },
   947→          });
   948→        }
   949→        // Last card: stays active after reaching center
   950→        else if (isLastCard) {
   951→          ScrollTrigger.create({
   952→            trigger: card,
   953→            start: "center 70%",
   954→            end: "center 50%",
   955→            scrub: 0.5,
   956→            markers: false,
   957→            onUpdate: (self) => {
   958→              const progress = self.progress;
   959→
   960→              // Last card only goes from default → active (no fade out)
   961→              const opacity = gsap.utils.interpolate(0.4, 1, progress);
   962→              const scale = gsap.utils.interpolate(0.95, 1, progress);
   963→
   964→              gsap.to(card, {
   965→                opacity: opacity,
   966→                scale: scale,
   967→                duration: 0.1,
   968→                ease: "none",
   969→              });
   970→
   971→              if (progress > 0.6) {
   972→                card.setAttribute("data-scroll-state", "active");
   973→              } else {
   974→                card.setAttribute("data-scroll-state", "default");
   975→              }
   976→            },
   977→          });
   978→        }
   979→        // Middle cards: normal behavior
   980→        else {
   981→          ScrollTrigger.create({
   982→            trigger: card,
   983→            start: "center 70%",
   984→            end: "center 30%",
   985→            scrub: 0.5,
   986→            markers: false,
   987→            onUpdate: (self) => {
   988→              const progress = self.progress;
   989→
   990→              let opacity, scale;
   991→
   992→              if (progress <= 0.5) {
   993→                const t = progress * 2;
   994→                opacity = gsap.utils.interpolate(0.4, 1, t);
   995→                scale = gsap.utils.interpolate(0.95, 1, t);
   996→              } else {
   997→                const t = (progress - 0.5) * 2;
   998→                opacity = gsap.utils.interpolate(1, 0.4, t);
   999→                scale = gsap.utils.interpolate(1, 0.95, t);
  1000→              }
  1001→
  1002→              gsap.to(card, {
  1003→                opacity: opacity,
  1004→                scale: scale,
  1005→                duration: 0.1,
  1006→                ease: "none",
  1007→              });
  1008→
  1009→              if (progress > 0.3 && progress < 0.7) {
  1010→                card.setAttribute("data-scroll-state", "active");
  1011→              } else {
  1012→                card.setAttribute("data-scroll-state", "default");
  1013→              }
  1014→            },
  1015→          });
  1016→        }
  1017→      });
  1018→    });
  1019→  }
  1020→
  1021→  initialiser();
  1022→  animator();
  1023→
  1024→  // Refresh on resize
  1025→  let resizeTimeout;
  1026→  window.addEventListener("resize", () => {
  1027→    clearTimeout(resizeTimeout);
  1028→    resizeTimeout = setTimeout(() => {
  1029→      // Kill all scroll card triggers and reinitialize
  1030→      ScrollTrigger.getAll().forEach((trigger) => {
  1031→        if (
  1032→          trigger.vars &&
  1033→          trigger.vars.trigger &&
  1034→          trigger.vars.trigger.hasAttribute("data-scroll-card")
  1035→        ) {
  1036→          trigger.kill();
  1037→        }
  1038→      });
  1039→      animator();
  1040→    }, 250);
  1041→  });
  1042→});
  1043→
  1044→//GSAP for Quote Cards
  1045→document.addEventListener("DOMContentLoaded", function () {
  1046→  document.querySelectorAll("[data-review-wrap]").forEach(function (component) {
  1047→    const prevButton = document.querySelector("[data-review-prev]");
  1048→    const nextButton = document.querySelector("[data-review-next]");
  1049→    const duration = 0.5;
  1050→    const delay = 6;
  1051→    const dd = duration + delay;
  1052→    const cardsPerView = 3;
  1053→    let items = Array.from(component.querySelectorAll("[data-review-card]"));
  1054→
  1055→    if (items.length > 0 && items.length <= cardsPerView) {
  1056→      const list = items[0].parentNode;
  1057→      const originalItems = items.slice();
  1058→
  1059→      originalItems.forEach((item) => {
  1060→        list.appendChild(item.cloneNode(true));
  1061→      });
  1062→
  1063→      items = Array.from(component.querySelectorAll("[data-review-card]"));
  1064→    }
  1065→
  1066→    let activeIndex = -1;
  1067→    let zIndex = 12;
  1068→
  1069→    const tl = gsap.timeline({
  1070→      defaults: { duration: duration, ease: "power1.inOut" },
  1071→    });
  1072→
  1073→    for (let i = 0; i < items.length + cardsPerView; i++) {
  1074→      activeIndex++;
  1075→      if (activeIndex === items.length) activeIndex = 0;
  1076→      const item = items[activeIndex];
  1077→      zIndex--;
  1078→      tl.set(
  1079→        item,
  1080→        {
  1081→          scale: 1,
  1082→          yPercent: 0,
  1083→          "--background-opacity": 0.2,
  1084→          opacity: 1,
  1085→          filter: "blur(0rem)",
  1086→          delay: 0,
  1087→          zIndex: zIndex,
  1088→        },
  1089→        i * dd,
  1090→      );
  1091→      tl.to(
  1092→        item,
  1093→        { scale: 1.1, yPercent: -15, "--background-opacity": 0.1 },
  1094→        "<" + dd,
  1095→      );
  1096→      tl.to(
  1097→        item,
  1098→        { scale: 1.2, yPercent: -30, "--background-opacity": 0 },
  1099→        "<" + dd,
  1100→      );
  1101→      tl.to(
  1102→        item,
  1103→        {
  1104→          scale: 1.3,
  1105→          yPercent: -45,
  1106→          opacity: 0,
  1107→          filter: "blur(0.2rem)",
  1108→        },
  1109→        "<" + dd,
  1110→      );
  1111→    }
  1112→
  1113→    const mainTl = gsap.timeline({
  1114→      repeat: -1,
  1115→      onUpdate: () => {
  1116→        const offset = dd * cardsPerView;
  1117→        if (tl.time() < offset - delay || tl.time() > tl.duration() - offset) {
  1118→          tl.time(offset - delay);
  1119→        }
  1120→      },
  1121→    });
  1122→    mainTl.to(tl, { duration: tl.duration(), ease: "none" });
  1123→
  1124→    // Button click handlers
  1125→    if (nextButton) {
  1126→      nextButton.addEventListener("click", () => {
  1127→        console.log("Next button clicked.");
  1128→        const currentTime = tl.time();
  1129→        const offset = dd * cardsPerView;
  1130→        const minTime = offset - delay;
  1131→        const maxTime = tl.duration() - offset;
  1132→        const validRange = maxTime - minTime;
  1133→
  1134→        // Calculate the start time of the *next* animation segment
  1135→        let newTime = (Math.floor(currentTime / dd) + 1) * dd;
  1136→
  1137→        // If we're already at the end, the next logical step is the beginning of the loop.
  1138→        if (currentTime >= maxTime) {
  1139→          newTime = minTime;
  1140→        } else if (newTime > maxTime) {
  1141→          // Otherwise, if the calculated jump overshoots, wrap it using the original modulo logic.
  1142→          newTime = minTime + ((newTime - minTime) % validRange);
  1143→        }
  1144→
  1145→        console.log(
  1146→          `Jumping from ${currentTime.toFixed(2)}s to ${newTime.toFixed(2)}s`,
  1147→        );
  1148→        tl.time(newTime);
  1149→      });
  1150→    }
  1151→
  1152→    if (prevButton) {
  1153→      prevButton.addEventListener("click", () => {
  1154→        console.log("Prev button clicked.");
  1155→        const currentTime = tl.time();
  1156→        const offset = dd * cardsPerView;
  1157→        const minTime = offset - delay;
  1158→        const maxTime = tl.duration() - offset;
  1159→        const validRange = maxTime - minTime;
  1160→
  1161→        // Calculate the start time of the *previous* animation segment
  1162→        let newTime = (Math.floor(currentTime / dd) - 1) * dd;
  1163→
  1164→        // If we're already at the start, the prev click should go to the end of the loop.
  1165→        if (currentTime <= minTime) {
  1166→          newTime = maxTime;
  1167→        } else if (newTime < minTime) {
  1168→          // Otherwise, if the calculated jump undershoots, wrap it using the original modulo logic.
  1169→          newTime = maxTime - ((minTime - newTime) % validRange);
  1170→        }
  1171→
  1172→        console.log(
  1173→          `Jumping from ${currentTime.toFixed(2)}s to ${newTime.toFixed(2)}s`,
  1174→        );
  1175→        tl.time(newTime);
  1176→      });
  1177→    }
  1178→  });
  1179→});
  1180→
  1181→//GSAP for Headings
  1182→document.addEventListener("DOMContentLoaded", () => {
  1183→  let viewportChecker;
  1184→
  1185→  function initialiser() {
  1186→    if (
  1187→      typeof gsap === "undefined" ||
  1188→      typeof ScrollTrigger === "undefined" ||
  1189→      typeof SplitText === "undefined"
  1190→    ) {
  1191→      console.warn("Script terminated due to missing libraries");
  1192→      return;
  1193→    }
  1194→    gsap.registerPlugin(ScrollTrigger, SplitText);
  1195→
  1196→    // Expose global textAnimator
  1197→    window.textAnimator = function (element, scrollTriggerOffset = "top 85%") {
  1198→      return new Promise((resolve) => {
  1199→        document.fonts.ready.then(() => {
  1200→          const delay = element.getAttribute("data-motion-delay")
  1201→            ? parseFloat(element.getAttribute("data-motion-delay"))
  1202→            : 0;
  1203→
  1204→          let split = new SplitText(element, {
  1205→            type: "lines",
  1206→            autoSplit: true,
  1207→            onSplit(self) {
  1208→              if (element.hasAttribute("data-motion-hide")) {
  1209→                element.removeAttribute("data-motion-hide");
  1210→              }
  1211→
  1212→              // Check if element has gradient text styles
  1213→              const hasGradient = element.classList.contains("u-grad-heading");
  1214→
  1215→              gsap.set(element, { opacity: 1 });
  1216→
  1217→              // If gradient, apply gradient styles to each line div
  1218→              if (hasGradient) {
  1219→                const gradientImage = getComputedStyle(element).backgroundImage;
  1220→                self.lines.forEach((line) => {
  1221→                  line.style.backgroundImage = gradientImage;
  1222→                  line.style.webkitBackgroundClip = "text";
  1223→                  line.style.backgroundClip = "text";
  1224→                  line.style.webkitTextFillColor = "transparent";
  1225→                });
  1226→              }
  1227→
  1228→              gsap.set(self.lines, {
  1229→                opacity: 0,
  1230→                y: 20,
  1231→                filter: "blur(5px)",
  1232→              });
  1233→
  1234→              let tl = gsap.timeline({
  1235→                paused: true,
  1236→              });
  1237→
  1238→              tl.to(self.lines, {
  1239→                opacity: 1,
  1240→                y: 0,
  1241→                filter: "blur(0px)",
  1242→                stagger: 0.1,
  1243→                duration: 0.6,
  1244→              });
  1245→
  1246→              ScrollTrigger.create({
  1247→                trigger: element,
  1248→                start: scrollTriggerOffset,
  1249→                once: true,
  1250→                onEnter: () => {
  1251→                  setTimeout(() => {
  1252→                    tl.play(0);
  1253→                  }, delay * 1000);
  1254→                },
  1255→              });
  1256→
  1257→              resolve(tl);
  1258→              return tl;
  1259→            },
  1260→          });
  1261→        });
  1262→      });
  1263→    };
  1264→  }
  1265→
  1266→  function selectors() {
  1267→    const allH1s = document.querySelectorAll("h1");
  1268→    // allH1s.forEach((h1) => {
  1269→    //   h1.setAttribute("data-motion-text", "");
  1270→    // });
  1271→  }
  1272→
  1273→  function animator() {
  1274→    document.fonts.ready.then(() => {
  1275→      const headings = document.querySelectorAll(
  1276→        "[data-motion-text]:not([data-motion-block])",
  1277→      );
  1278→      if (headings.length === 0) {
  1279→        return;
  1280→      }
  1281→      headings.forEach((heading) => {
  1282→        window.textAnimator(heading);
  1283→      });
  1284→    });
  1285→  }
  1286→
  1287→  function triggers() {
  1288→    let resizeTimeout;
  1289→    window.addEventListener("resize", () => {
  1290→      clearTimeout(resizeTimeout);
  1291→      resizeTimeout = setTimeout(() => {
  1292→        ScrollTrigger.getAll().forEach((trigger) => {
  1293→          if (
  1294→            trigger.vars &&
  1295→            trigger.vars.trigger &&
  1296→            trigger.vars.trigger.hasAttribute("data-motion-text")
  1297→          ) {
  1298→            trigger.kill();
  1299→          }
  1300→        });
  1301→        document.fonts.ready.then(() => {
  1302→          animator();
  1303→        });
  1304→      }, 250);
  1305→    });
  1306→  }
  1307→
  1308→  initialiser();
  1309→  selectors();
  1310→  animator();
  1311→  triggers();
  1312→});
  1313→
  1314→//GSAP for Arrays
  1315→document.addEventListener("DOMContentLoaded", () => {
  1316→  function initialiser() {
  1317→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
  1318→      console.warn("Script terminated due to missing libraries");
  1319→      return;
  1320→    }
  1321→    gsap.registerPlugin(ScrollTrigger);
  1322→
  1323→    window.arrayAnimator = function (
  1324→      container,
  1325→      scrollTriggerOffset = "top 95%",
  1326→    ) {
  1327→      const delay = container.getAttribute("data-motion-delay")
  1328→        ? parseFloat(container.getAttribute("data-motion-delay"))
  1329→        : 0;
  1330→
  1331→      const childElements = Array.from(container.children).filter(
  1332→        (child) => !child.hasAttribute("data-motion-block"),
  1333→      );
  1334→
  1335→      if (childElements.length === 0) {
  1336→        console.warn(
  1337→          "Motion for Arrays: No animatable children found or all are blocked.",
  1338→        );
  1339→        return null;
  1340→      }
  1341→
  1342→      if (window.innerWidth <= 991) {
  1343→        gsap.set(childElements, {
  1344→          opacity: 1,
  1345→          y: 0,
  1346→        });
  1347→        return null;
  1348→      }
  1349→
  1350→      gsap.set(childElements, {
  1351→        opacity: 0,
  1352→        y: 5,
  1353→      });
  1354→      let tl = gsap.timeline({
  1355→        paused: true,
  1356→      });
  1357→      tl.to(childElements, {
  1358→        opacity: 1,
  1359→        y: 0,
  1360→        duration: 0.8,
  1361→        stagger: 0.15,
  1362→        ease: "power2.out",
  1363→      });
  1364→      ScrollTrigger.create({
  1365→        trigger: container,
  1366→        start: scrollTriggerOffset,
  1367→        once: true,
  1368→        onEnter: () => {
  1369→          setTimeout(() => {
  1370→            tl.play(0);
  1371→          }, delay * 1000);
  1372→        },
  1373→      });
  1374→      return tl;
  1375→    };
  1376→  }
  1377→
  1378→  function animator() {
  1379→    setTimeout(() => {
  1380→      const containers = document.querySelectorAll(
  1381→        "[data-motion-array]:not([data-motion-block])",
  1382→      );
  1383→      if (containers.length === 0) {
  1384→        console.warn("Motion for Arrays: Array not found");
  1385→        return;
  1386→      }
  1387→      containers.forEach((container) => {
  1388→        window.arrayAnimator(container);
  1389→      });
  1390→    }, 200);
  1391→  }
  1392→
  1393→  function triggers() {
  1394→    let resizeTimeout;
  1395→    window.addEventListener("resize", () => {
  1396→      clearTimeout(resizeTimeout);
  1397→      resizeTimeout = setTimeout(() => {
  1398→        ScrollTrigger.getAll().forEach((trigger) => {
  1399→          if (
  1400→            trigger.vars &&
  1401→            trigger.vars.trigger &&
  1402→            trigger.vars.trigger.hasAttribute("data-motion-array")
  1403→          ) {
  1404→            trigger.kill();
  1405→          }
  1406→        });
  1407→        animator();
  1408→      }, 250);
  1409→    });
  1410→  }
  1411→
  1412→  initialiser();
  1413→  animator();
  1414→  triggers();
  1415→});
  1416→
  1417→//GSAP for Stagger
  1418→document.addEventListener("DOMContentLoaded", () => {
  1419→  function initialiser() {
  1420→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
  1421→      console.warn("Script terminated due to missing libraries");
  1422→      return;
  1423→    }
  1424→    gsap.registerPlugin(ScrollTrigger);
  1425→
  1426→    window.staggerAnimator = function (
  1427→      container,
  1428→      scrollTriggerOffset = "top 95%",
  1429→    ) {
  1430→      const delay = container.getAttribute("data-motion-delay")
  1431→        ? parseFloat(container.getAttribute("data-motion-delay"))
  1432→        : 0;
  1433→
  1434→      const childElements = Array.from(container.children).filter(
  1435→        (child) => !child.hasAttribute("data-motion-block"),
  1436→      );
  1437→
  1438→      if (childElements.length === 0) {
  1439→        console.warn(
  1440→          "Motion for Stagger: No animatable children found or all are blocked.",
  1441→        );
  1442→        return null;
  1443→      }
  1444→
  1445→      if (window.innerWidth <= 991) {
  1446→        gsap.set(childElements, {
  1447→          opacity: 1,
  1448→        });
  1449→        return null;
  1450→      }
  1451→
  1452→      gsap.set(childElements, {
  1453→        opacity: 0,
  1454→      });
  1455→      let tl = gsap.timeline({
  1456→        paused: true,
  1457→      });
  1458→      tl.to(childElements, {
  1459→        opacity: 1,
  1460→        duration: 0.8,
  1461→        stagger: 0.15,
  1462→        ease: "power2.out",
  1463→      });
  1464→      ScrollTrigger.create({
  1465→        trigger: container,
  1466→        start: scrollTriggerOffset,
  1467→        once: true,
  1468→        onEnter: () => {
  1469→          setTimeout(() => {
  1470→            tl.play(0);
  1471→          }, delay * 1000);
  1472→        },
  1473→      });
  1474→      return tl;
  1475→    };
  1476→  }
  1477→
  1478→  function animator() {
  1479→    setTimeout(() => {
  1480→      const containers = document.querySelectorAll(
  1481→        "[data-motion-stagger]:not([data-motion-block])",
  1482→      );
  1483→      if (containers.length === 0) {
  1484→        console.warn("Motion for Stagger: Stagger not found");
  1485→        return;
  1486→      }
  1487→      containers.forEach((container) => {
  1488→        window.staggerAnimator(container);
  1489→      });
  1490→    }, 200);
  1491→  }
  1492→
  1493→  function triggers() {
  1494→    let resizeTimeout;
  1495→    window.addEventListener("resize", () => {
  1496→      clearTimeout(resizeTimeout);
  1497→      resizeTimeout = setTimeout(() => {
  1498→        ScrollTrigger.getAll().forEach((trigger) => {
  1499→          if (
  1500→            trigger.vars &&
  1501→            trigger.vars.trigger &&
  1502→            trigger.vars.trigger.hasAttribute("data-motion-stagger")
  1503→          ) {
  1504→            trigger.kill();
  1505→          }
  1506→        });
  1507→        animator();
  1508→      }, 250);
  1509→    });
  1510→  }
  1511→
  1512→  initialiser();
  1513→  animator();
  1514→  triggers();
  1515→});
  1516→
  1517→//GSAP for Single Elements
  1518→document.addEventListener("DOMContentLoaded", () => {
  1519→  function initialiser() {
  1520→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
  1521→      console.warn("Script terminated due to missing libraries");
  1522→      return;
  1523→    }
  1524→    gsap.registerPlugin(ScrollTrigger);
  1525→
  1526→    window.elementAnimator = function (
  1527→      element,
  1528→      scrollTriggerOffset = "top 95%",
  1529→    ) {
  1530→      const delay = element.getAttribute("data-motion-delay")
  1531→        ? parseFloat(element.getAttribute("data-motion-delay"))
  1532→        : 0;
  1533→
  1534→      if (window.innerWidth <= 991) {
  1535→        gsap.set(element, {
  1536→          opacity: 1,
  1537→          y: 0,
  1538→        });
  1539→        return null;
  1540→      }
  1541→
  1542→      gsap.set(element, {
  1543→        opacity: 0,
  1544→        y: 5,
  1545→      });
  1546→      let tl = gsap.timeline({
  1547→        paused: true,
  1548→      });
  1549→      tl.to(element, {
  1550→        opacity: 1,
  1551→        y: 0,
  1552→        duration: 0.8,
  1553→        ease: "power2.out",
  1554→      });
  1555→
  1556→      const rect = element.getBoundingClientRect();
  1557→      const windowHeight = window.innerHeight;
  1558→      const isAbove = rect.top < windowHeight && rect.bottom > 0;
  1559→
  1560→      if (isAbove) {
  1561→        setTimeout(() => {
  1562→          tl.play(0);
  1563→        }, delay * 1000);
  1564→      } else {
  1565→        ScrollTrigger.create({
  1566→          trigger: element,
  1567→          start: scrollTriggerOffset,
  1568→          once: true,
  1569→          onEnter: () => {
  1570→            tl.play(0);
  1571→          },
  1572→        });
  1573→      }
  1574→      return tl;
  1575→    };
  1576→  }
  1577→
  1578→  function animator() {
  1579→    setTimeout(() => {
  1580→      const elements = document.querySelectorAll(
  1581→        "[data-motion-element]:not([data-motion-block])",
  1582→      );
  1583→      if (elements.length === 0) {
  1584→        console.warn("Motion for Elements: Elements not found");
  1585→        return;
  1586→      }
  1587→      elements.forEach((element) => {
  1588→        window.elementAnimator(element);
  1589→      });
  1590→    }, 200);
  1591→  }
  1592→
  1593→  function triggers() {
  1594→    let resizeTimeout;
  1595→    window.addEventListener("resize", () => {
  1596→      clearTimeout(resizeTimeout);
  1597→      resizeTimeout = setTimeout(() => {
  1598→        ScrollTrigger.getAll().forEach((trigger) => {
  1599→          if (
  1600→            trigger.vars &&
  1601→            trigger.vars.trigger &&
  1602→            trigger.vars.trigger.hasAttribute("data-motion-element")
  1603→          ) {
  1604→            trigger.kill();
  1605→          }
  1606→        });
  1607→        animator();
  1608→      }, 250);
  1609→    });
  1610→  }
  1611→
  1612→  initialiser();
  1613→  animator();
  1614→  triggers();
  1615→});
  1616→
  1617→//GSAP for Glow Elements
  1618→document.addEventListener("DOMContentLoaded", () => {
  1619→  function initialiser() {
  1620→    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
  1621→      console.warn("Script terminated due to missing libraries");
  1622→      return;
  1623→    }
  1624→    gsap.registerPlugin(ScrollTrigger);
  1625→  }
  1626→
  1627→  function animator() {
  1628→    const glowElements = document.querySelectorAll(
  1629→      "[data-motion-glow]:not([data-motion-block])",
  1630→    );
  1631→
  1632→    if (!glowElements || glowElements.length === 0) {
  1633→      console.warn("Motion: Glow elements not found");
  1634→      return;
  1635→    }
  1636→
  1637→    glowElements.forEach((element, index) => {
  1638→      try {
  1639→        const delay = element.getAttribute("data-motion-delay")
  1640→          ? parseFloat(element.getAttribute("data-motion-delay"))
  1641→          : 0;
  1642→
  1643→        // Set initial state
  1644→        gsap.set(element, {
  1645→          width: "0%",
  1646→        });
  1647→
  1648→        const tl = gsap.timeline({
  1649→          paused: true,
  1650→        });
  1651→
  1652→        // CRT shimmer effect animation
  1653→        tl.to(element, {
  1654→          width: "100%",
  1655→          duration: 2,
  1656→          ease: "power4.out",
  1657→        });
  1658→
  1659→        ScrollTrigger.create({
  1660→          trigger: element,
  1661→          start: "top 95%",
  1662→          markers: false,
  1663→          once: true,
  1664→          onEnter: () => {
  1665→            setTimeout(() => {
  1666→              tl.play(0);
  1667→            }, delay * 1000);
  1668→          },
  1669→        });
  1670→      } catch (error) {
  1671→        console.error(`Motion: Glow animation failed at ${index + 1}:`, error);
  1672→      }
  1673→    });
  1674→  }
  1675→
  1676→  function triggers() {
  1677→    let resizeTimeout;
  1678→    window.addEventListener("resize", () => {
  1679→      clearTimeout(resizeTimeout);
  1680→      resizeTimeout = setTimeout(() => {
  1681→        ScrollTrigger.getAll().forEach((trigger) => {
  1682→          if (
  1683→            trigger.vars &&
  1684→            trigger.vars.trigger &&
  1685→            trigger.vars.trigger.hasAttribute("data-motion-glow")
  1686→          ) {
  1687→            trigger.kill();
  1688→          }
  1689→        });
  1690→        animator();
  1691→      }, 250);
  1692→    });
  1693→  }
  1694→
  1695→  initialiser();
  1696→  animator();
  1697→  triggers();
  1698→});
  1699→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/clamp.js**
Status: Completed

```
     1→document.addEventListener("DOMContentLoaded", function () {
     2→  const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
     3→  const baseWidth = 1440;
     4→  const minSize = 1.125;
     5→  const breakpoint = 992;
     6→
     7→  let wasDesktop = window.innerWidth >= breakpoint;
     8→
     9→  function updateClamps() {
    10→    const vw = window.innerWidth;
    11→    const isDesktop = vw >= breakpoint;
    12→
    13→    // Skip if staying in mobile/tablet range
    14→    if (!wasDesktop && !isDesktop) return;
    15→
    16→    wasDesktop = isDesktop;
    17→
    18→    headings.forEach((tag) => {
    19→      const computedStyle = getComputedStyle(document.documentElement);
    20→      const fontSize = parseFloat(
    21→        computedStyle.getPropertyValue(`--${tag}--font-size`),
    22→      );
    23→
    24→      document.querySelectorAll(`${tag}, .u-hs-${tag}`).forEach((el) => {
    25→        if (isDesktop) {
    26→          const responsiveSize = Math.max(
    27→            minSize,
    28→            Math.min(fontSize, (fontSize * vw) / baseWidth),
    29→          );
    30→          el.style.fontSize = `${responsiveSize}rem`;
    31→        } else {
    32→          el.style.fontSize = "";
    33→        }
    34→      });
    35→    });
    36→  }
    37→
    38→  updateClamps();
    39→  window.addEventListener("resize", updateClamps);
    40→});
    41→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/countdown.js**
Status: Completed

```
     1→// Countdown timer for post redirect
     2→(function () {
     3→  if (document.readyState === "loading") {
     4→    document.addEventListener("DOMContentLoaded", init);
     5→  } else {
     6→    init();
     7→  }
     8→
     9→  function init() {
    10→    const countdownElement = document.querySelector("[data-post-time]");
    11→    if (!countdownElement) return;
    12→
    13→    const startTime =
    14→      parseInt(countdownElement.getAttribute("data-time-start")) || 20;
    15→    let timeRemaining = startTime;
    16→    countdownElement.textContent = timeRemaining;
    17→
    18→    const interval = setInterval(() => {
    19→      timeRemaining--;
    20→      countdownElement.textContent = timeRemaining;
    21→
    22→      if (timeRemaining <= 0) {
    23→        clearInterval(interval);
    24→      }
    25→    }, 1000);
    26→  }
    27→})();
    28→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/head.js**
Status: Completed

```
     1→// Nuclear scroll reset - force to top at earliest possible moment
     2→(function() {
     3→  // Disable scroll restoration immediately
     4→  if ('scrollRestoration' in history) {
     5→    history.scrollRestoration = 'manual';
     6→  }
     7→
     8→  // Force scroll to top immediately (runs before DOMContentLoaded)
     9→  window.scrollTo(0, 0);
    10→
    11→  // Also force on load event
    12→  window.addEventListener('load', () => {
    13→    window.scrollTo(0, 0);
    14→  });
    15→
    16→  // Force on pageshow (including bfcache)
    17→  window.addEventListener('pageshow', () => {
    18→    window.scrollTo(0, 0);
    19→  });
    20→})();
    21→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/redirects.js**
Status: Completed

```
     1→//404 Redirect Handler
     2→function handleRedirect() {
     3→  const redirectCategories = ["/news"];
     4→
     5→  // Old article category slugs from the previous site structure
     6→  const oldArticleCategories = [
     7→    "general-news",
     8→    "fuel-quality",
     9→    "availability",
    10→    "alternative-fuels",
    11→    "bunkering-info",
    12→    "regulations",
    13→  ];
    14→
    15→  const currentPath = window.location.pathname;
    16→
    17→  if (currentPath === "/" || currentPath === "") {
    18→    document.addEventListener("DOMContentLoaded", function () {
    19→      document.body.classList.remove("hide");
    20→    });
    21→    return;
    22→  }
    23→
    24→  function getPathInfo(path) {
    25→    const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
    26→    const segments = cleanPath.split("/").filter((segment) => segment !== "");
    27→
    28→    return {
    29→      segments: segments,
    30→      depth: segments.length,
    31→      parentFolder: segments.length > 0 ? `/${segments[0]}` : null,
    32→    };
    33→  }
    34→
    35→  function shouldRedirect(pathInfo) {
    36→    // Special case: /news-single should redirect to /news
    37→    if (pathInfo.segments[0] === "news-single") {
    38→      return "/news";
    39→    }
    40→
    41→    // Only redirect if we're at level 2 or deeper (e.g., /news/article-123)
    42→    if (pathInfo.depth <= 1) {
    43→      return null;
    44→    }
    45→
    46→    // Check if this is a /news path
    47→    if (pathInfo.parentFolder !== "/news") {
    48→      return null;
    49→    }
    50→
    51→    // Check if this is depth 3 with an old article category
    52→    // Pattern: /news/[old-category]/[article-slug]
    53→    if (pathInfo.depth === 3 && pathInfo.segments[0] === "news") {
    54→      const categorySlug = pathInfo.segments[1];
    55→      const articleSlug = pathInfo.segments[2];
    56→
    57→      // If the middle segment is a known old category, redirect to /news/article-slug
    58→      if (oldArticleCategories.includes(categorySlug)) {
    59→        return `/news/${articleSlug}`;
    60→      }
    61→    }
    62→
    63→    // Default behavior: redirect to /news for any other news sub-paths
    64→    return "/news";
    65→  }
    66→
    67→  const pathInfo = getPathInfo(currentPath);
    68→  const redirectTarget = shouldRedirect(pathInfo);
    69→
    70→  if (redirectTarget) {
    71→    console.warn("Client-side Redirect: Redirecting to", redirectTarget);
    72→    window.location.href = redirectTarget;
    73→  } else {
    74→    // Authentic 404 - show the page
    75→    document.addEventListener("DOMContentLoaded", function () {
    76→      document.body.classList.remove("hide");
    77→    });
    78→  }
    79→}
    80→
    81→handleRedirect();
    82→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/override.css**
Status: Completed

```
     1→body {
     2→    font-smoothing: antialiased;
     3→    text-rendering: optimizeLegibility;
     4→    -webkit-font-smoothing: antialiased;
     5→    -moz-osx-font-smoothing: grayscale;
     6→}
     7→
     8→* {
     9→    -webkit-tap-highlight-color: transparent;
    10→}
    11→
    12→a {
    13→    text-decoration: none;
    14→    color: inherit;
    15→}
    16→
    17→img,
    18→svg,
    19→video,
    20→canvas,
    21→audio,
    22→iframe,
    23→embed,
    24→object {
    25→    display: block;
    26→}
    27→img,
    28→video {
    29→    height: auto;
    30→}
    31→select {
    32→    -webkit-appearance: none;
    33→    -moz-appearance: none;
    34→    appearance: none;
    35→}
    36→
    37→.w-richtext :first-child {
    38→    margin-top: 0;
    39→}
    40→.w-richtext :last-child {
    41→    margin-bottom: 0;
    42→}
    43→
    44→[hide],
    45→.css,
    46→.js {
    47→    display: none;
    48→}
    49→[pointer="off"] {
    50→    pointer-events: none;
    51→}
    52→[pointer="on"] {
    53→    pointer-events: auto;
    54→}
    55→[color-inherit] {
    56→    color: inherit;
    57→}
    58→[inline-flex] {
    59→    display: inline-flex;
    60→}
    61→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/ix.js (1 - 100)**
Status: Completed

```
     1→//Navigation Bar
     2→document.addEventListener("DOMContentLoaded", function () {
     3→  const menuButton = document.querySelector('[data-nav-element="menu"]');
     4→
     5→  menuButton.addEventListener("click", () => {
     6→    const navbar = document.querySelector('[data-nav-element="navbar"]');
     7→    const currentState = navbar.getAttribute("data-nav-state");
     8→    navbar.setAttribute(
     9→      "data-nav-state",
    10→      currentState === "open" ? "closed" : "open",
    11→    );
    12→
    13→    const staticNav = document.querySelector('[data-nav-element="static"]');
    14→    if (staticNav) {
    15→      staticNav.classList.toggle("active");
    16→    }
    17→  });
    18→});
    19→
    20→//Navigation Overlays
    21→document.addEventListener("DOMContentLoaded", function () {
    22→  if (window.innerWidth > 991) {
    23→    return;
    24→  }
    25→  console.log("Mobile navigation initialized");
    26→
    27→  const toggles = document.querySelectorAll('[data-nav-dd="toggle"]');
    28→  const openButtons = document.querySelectorAll("[data-dd-open]");
    29→  const menu = document.querySelector('[data-nav-element="menu"]');
    30→  const backButtons = document.querySelectorAll("[data-dd-back]");
    31→  let activeToggle = null;
    32→
    33→  function hideAllDropdowns() {
    34→    console.log("Hiding all dropdowns");
    35→    toggles.forEach((toggle) => {
    36→      const drawer = toggle.nextElementSibling;
    37→      if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
    38→        toggle.setAttribute("data-dd-state", "hide");
    39→        console.log("Drawer hidden");
    40→      }
    41→    });
    42→    activeToggle = null;
    43→  }
    44→
    45→  function showDropdown(toggle, drawer) {
    46→    console.log("Showing dropdown");
    47→    if (activeToggle && activeToggle !== toggle) {
    48→      hideAllDropdowns();
    49→    }
    50→
    51→    activeToggle = toggle;
    52→    toggle.setAttribute("data-dd-state", "show");
    53→    console.log("Drawer shown");
    54→  }
    55→
    56→  function hideDropdown(toggle, drawer) {
    57→    console.log("Hiding dropdown");
    58→    toggle.setAttribute("data-dd-state", "hide");
    59→    if (activeToggle === toggle) {
    60→      activeToggle = null;
    61→    }
    62→    console.log("Drawer hidden");
    63→  }
    64→
    65→  // Open button click handlers
    66→  openButtons.forEach((openButton) => {
    67→    // Find the associated toggle element
    68→    const toggle =
    69→      openButton.closest('[data-nav-dd="toggle"]') ||
    70→      openButton.parentElement.querySelector('[data-nav-dd="toggle"]');
    71→    if (toggle) {
    72→      const drawer = toggle.nextElementSibling;
    73→      if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
    74→        openButton.addEventListener("click", () => {
    75→          console.log("Open button clicked");
    76→          const currentState = toggle.getAttribute("data-dd-state");
    77→          if (currentState === "show") {
    78→            hideDropdown(toggle, drawer);
    79→          } else {
    80→            showDropdown(toggle, drawer);
    81→          }
    82→        });
    83→      }
    84→    }
    85→  });
    86→
    87→  // Back button handlers
    88→  backButtons.forEach((backButton) => {
    89→    backButton.addEventListener("click", () => {
    90→      console.log("Back button clicked");
    91→      // Traverse up to find parent toggle
    92→      let parentToggle = backButton.closest('[data-nav-dd="drawer"]');
    93→      if (parentToggle) {
    94→        parentToggle = parentToggle.previousElementSibling;
    95→        if (
    96→          parentToggle &&
    97→          parentToggle.getAttribute("data-nav-dd") === "toggle"
    98→        ) {
    99→          const drawer = parentToggle.nextElementSibling;
   100→          hideDropdown(parentToggle, drawer);

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/ix.js (100 - 399)**
Status: Completed

```
   100→          hideDropdown(parentToggle, drawer);
   101→          console.log("Parent toggle found and drawer closed");
   102→        }
   103→      }
   104→    });
   105→  });
   106→
   107→  // Menu click handler
   108→  if (menu) {
   109→    menu.addEventListener("click", () => {
   110→      console.log("Menu clicked");
   111→      if (activeToggle) {
   112→        const currentState = activeToggle.getAttribute("data-dd-state");
   113→        if (currentState === "show") {
   114→          const drawer = activeToggle.nextElementSibling;
   115→          hideDropdown(activeToggle, drawer);
   116→          console.log("Active drawer closed via menu click");
   117→        }
   118→      }
   119→    });
   120→  }
   121→});
   122→
   123→//Glowing Cards
   124→document.addEventListener("DOMContentLoaded", function () {
   125→  // Store card states
   126→  const cardStates = new Map();
   127→  let isInitialized = false;
   128→  let resizeTimeout = null;
   129→  let globalAnimationFrame = null;
   130→  let lastMousePosition = { x: 0, y: 0 };
   131→  let isDOMStable = false; // Prevent running during DOM mutations
   132→
   133→  /**
   134→   * Main initialization function - finds all [data-glow-card] and sets up glow effects
   135→   */
   136→  function glowCardsInitialiser() {
   137→    if (window.innerWidth < 768) {
   138→      return;
   139→    }
   140→
   141→    // Guard against multiple initializations
   142→    if (isInitialized) {
   143→      return;
   144→    }
   145→
   146→    // Wait for DOM to stabilize (prevent conflicts with other scripts)
   147→    if (!isDOMStable) {
   148→      return;
   149→    }
   150→
   151→    // Convert to array to avoid live collection issues
   152→    const cards = Array.from(document.querySelectorAll("[data-glow-card]"));
   153→
   154→    if (cards.length === 0) {
   155→      return;
   156→    }
   157→
   158→    // Process cards in a stable way
   159→    cards.forEach((card) => {
   160→      // Skip if element is no longer in DOM
   161→      if (!card.isConnected) {
   162→        return;
   163→      }
   164→
   165→      // Skip if already wrapped
   166→      if (card.parentElement?.classList.contains("o-glow-wrapper")) {
   167→        return;
   168→      }
   169→
   170→      // Skip if already processed (marked with attribute)
   171→      if (card.hasAttribute("data-glow-initialized")) {
   172→        return;
   173→      }
   174→
   175→      // Mark as being processed
   176→      card.setAttribute("data-glow-initialized", "true");
   177→
   178→      // Check if disabled
   179→      const state = card.getAttribute("data-glow-state");
   180→      if (state === "disabled") {
   181→        // Still wrap but don't initialize glow
   182→        wrapCardWithGlow(card);
   183→        return;
   184→      }
   185→
   186→      // Wrap and initialize
   187→      const wrapper = wrapCardWithGlow(card);
   188→      initializeGlowEffect(wrapper, card);
   189→    });
   190→
   191→    // Add global event listeners (only once)
   192→    if (cardStates.size > 0) {
   193→      document.body.addEventListener("pointermove", handleGlobalMouseMove, {
   194→        passive: true,
   195→      });
   196→      window.addEventListener("scroll", handleGlobalScroll, { passive: true });
   197→    }
   198→
   199→    isInitialized = true;
   200→  }
   201→
   202→  /**
   203→   * Cleanup function - removes glow effects and event listeners
   204→   */
   205→  function glowCardsCleanup() {
   206→    if (!isInitialized) return;
   207→
   208→    // Remove global event listeners
   209→    document.body.removeEventListener("pointermove", handleGlobalMouseMove);
   210→    window.removeEventListener("scroll", handleGlobalScroll);
   211→
   212→    // Cancel any pending animation frame
   213→    if (globalAnimationFrame) {
   214→      cancelAnimationFrame(globalAnimationFrame);
   215→      globalAnimationFrame = null;
   216→    }
   217→
   218→    // Remove glow containers from DOM and clean up markers
   219→    cardStates.forEach((state, wrapper) => {
   220→      const glowContainer = wrapper.querySelector(".o-glow-container");
   221→      if (glowContainer) {
   222→        glowContainer.remove();
   223→      }
   224→
   225→      // Remove initialization marker from card
   226→      const card = wrapper.querySelector("[data-glow-initialized]");
   227→      if (card) {
   228→        card.removeAttribute("data-glow-initialized");
   229→      }
   230→    });
   231→
   232→    // Clear card states
   233→    cardStates.clear();
   234→
   235→    isInitialized = false;
   236→  }
   237→
   238→  /**
   239→   * Handle scroll events - update cards with last known mouse position
   240→   */
   241→  function handleGlobalScroll() {
   242→    if (globalAnimationFrame) {
   243→      cancelAnimationFrame(globalAnimationFrame);
   244→    }
   245→
   246→    globalAnimationFrame = requestAnimationFrame(() => {
   247→      updateAllCards(lastMousePosition.x, lastMousePosition.y);
   248→    });
   249→  }
   250→
   251→  /**
   252→   * Wraps a card element with .o-glow-wrapper
   253→   * @param {HTMLElement} cardElement - The card to wrap
   254→   * @returns {HTMLElement} The wrapper element
   255→   */
   256→  function wrapCardWithGlow(cardElement) {
   257→    // Create wrapper
   258→    const wrapper = document.createElement("div");
   259→    wrapper.className = "o-glow-wrapper";
   260→    wrapper.setAttribute("data-motion-element", "");
   261→
   262→    // Get border-radius from card and apply to wrapper
   263→    const computedStyle = window.getComputedStyle(cardElement);
   264→    const borderRadius = computedStyle.borderRadius;
   265→    if (borderRadius && borderRadius !== "0px") {
   266→      wrapper.style.borderRadius = borderRadius;
   267→    }
   268→
   269→    // Copy data-glow-theme attribute to wrapper if it exists
   270→    const theme = cardElement.getAttribute("data-glow-theme");
   271→    if (theme) {
   272→      wrapper.setAttribute("data-glow-theme", theme);
   273→    }
   274→
   275→    // Insert wrapper before card
   276→    cardElement.parentNode.insertBefore(wrapper, cardElement);
   277→
   278→    // Move card inside wrapper
   279→    wrapper.appendChild(cardElement);
   280→
   281→    return wrapper;
   282→  }
   283→
   284→  /**
   285→   * Creates the glow DOM elements
   286→   * @returns {Object} Object with container and effect element references
   287→   */
   288→  function createGlowElements() {
   289→    const container = document.createElement("div");
   290→    container.className = "o-glow-container";
   291→
   292→    const effect = document.createElement("div");
   293→    effect.className = "o-glow-effect";
   294→
   295→    container.appendChild(effect);
   296→
   297→    return { container, effect };
   298→  }
   299→
   300→  /**
   301→   * Initialize glow effect for a wrapped card
   302→   * @param {HTMLElement} wrapper - The wrapper element
   303→   * @param {HTMLElement} cardElement - The original card element
   304→   */
   305→  function initializeGlowEffect(wrapper, cardElement) {
   306→    // Read config from card attributes
   307→    const config = {
   308→      spread: parseFloat(cardElement.getAttribute("data-glow-spread")) || 40,
   309→      proximity:
   310→        parseFloat(cardElement.getAttribute("data-glow-proximity")) || 64,
   311→      deadzone:
   312→        parseFloat(cardElement.getAttribute("data-glow-deadzone")) || 0.6,
   313→      duration:
   314→        parseFloat(cardElement.getAttribute("data-glow-duration")) || 0.6,
   315→      borderWidth:
   316→        parseFloat(cardElement.getAttribute("data-glow-border")) || 1,
   317→    };
   318→
   319→    // Create glow elements
   320→    const { container, effect } = createGlowElements();
   321→
   322→    // Set CSS variables
   323→    container.style.setProperty("--glow-start", "0");
   324→    container.style.setProperty("--glow-active", "0");
   325→    container.style.setProperty("--glow-spread", config.spread);
   326→    container.style.setProperty(
   327→      "--glow-border-width",
   328→      `${config.borderWidth}px`,
   329→    );
   330→
   331→    // Inject into wrapper (as first child, before card)
   332→    wrapper.insertBefore(container, wrapper.firstChild);
   333→
   334→    // Store card state
   335→    cardStates.set(wrapper, {
   336→      glowContainer: container,
   337→      config: config,
   338→      currentAngle: 0,
   339→    });
   340→  }
   341→
   342→  /**
   343→   * Global mouse move handler - updates all cards at once
   344→   */
   345→  function handleGlobalMouseMove(e) {
   346→    try {
   347→      lastMousePosition = { x: e.clientX, y: e.clientY };
   348→
   349→      if (globalAnimationFrame) {
   350→        cancelAnimationFrame(globalAnimationFrame);
   351→      }
   352→
   353→      globalAnimationFrame = requestAnimationFrame(() => {
   354→        try {
   355→          updateAllCards(lastMousePosition.x, lastMousePosition.y);
   356→        } catch (error) {
   357→          // Silently fail to prevent crashes during animation
   358→          console.error("Glow Cards: Update failed", error);
   359→        }
   360→      });
   361→    } catch (error) {
   362→      console.error("Glow Cards: Mouse handler failed", error);
   363→    }
   364→  }
   365→
   366→  /**
   367→   * Update all card glow effects based on mouse position
   368→   */
   369→  function updateAllCards(mouseX, mouseY) {
   370→    cardStates.forEach((state, wrapper) => {
   371→      updateCardGlow(wrapper, state, mouseX, mouseY);
   372→    });
   373→  }
   374→
   375→  /**
   376→   * Update a single card's glow effect
   377→   */
   378→  function updateCardGlow(wrapper, state, mouseX, mouseY) {
   379→    const { glowContainer, config } = state;
   380→
   381→    const rect = wrapper.getBoundingClientRect();
   382→    const { left, top, width, height } = rect;
   383→
   384→    // Calculate center
   385→    const centerX = left + width * 0.5;
   386→    const centerY = top + height * 0.5;
   387→
   388→    // Calculate distance from center
   389→    const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);
   390→
   391→    // Check inactive zone (deadzone)
   392→    const inactiveRadius = 0.5 * Math.min(width, height) * config.deadzone;
   393→
   394→    if (distanceFromCenter < inactiveRadius) {
   395→      glowContainer.style.setProperty("--glow-active", "0");
   396→      return;
   397→    }
   398→
   399→    // Check proximity

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: wc -l /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/ix.js**
Status: Completed

Terminal:
```
1638 /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/ix.js





```


**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/ix.js (400 - 599)**
Status: Completed

```
   400→    const isActive =
   401→      mouseX > left - config.proximity &&
   402→      mouseX < left + width + config.proximity &&
   403→      mouseY > top - config.proximity &&
   404→      mouseY < top + height + config.proximity;
   405→
   406→    glowContainer.style.setProperty("--glow-active", isActive ? "1" : "0");
   407→
   408→    if (!isActive) return;
   409→
   410→    // Calculate angle
   411→    const targetAngle =
   412→      (180 * Math.atan2(mouseY - centerY, mouseX - centerX)) / Math.PI + 90;
   413→
   414→    // Calculate shortest rotation path
   415→    const angleDiff = ((targetAngle - state.currentAngle + 180) % 360) - 180;
   416→    const newAngle = state.currentAngle + angleDiff;
   417→
   418→    // Update angle immediately - CSS transition will smooth it
   419→    glowContainer.style.setProperty("--glow-start", String(newAngle));
   420→    state.currentAngle = newAngle;
   421→  }
   422→
   423→  /**
   424→   * Handle responsive behavior on window resize
   425→   */
   426→  function handleResize() {
   427→    // Don't run if DOM is not stable yet
   428→    if (!isDOMStable) {
   429→      return;
   430→    }
   431→
   432→    // Clear previous timeout
   433→    if (resizeTimeout) {
   434→      clearTimeout(resizeTimeout);
   435→    }
   436→
   437→    // Debounce resize events with longer delay to avoid conflicts
   438→    resizeTimeout = setTimeout(() => {
   439→      if (window.innerWidth >= 768 && !isInitialized) {
   440→        // Switched to desktop - initialize
   441→        glowCardsInitialiser();
   442→      } else if (window.innerWidth < 768 && isInitialized) {
   443→        // Switched to mobile - cleanup
   444→        glowCardsCleanup();
   445→      }
   446→    }, 300); // Increased from 200ms to avoid conflicts
   447→  }
   448→
   449→  // Delay initialization to run AFTER all other scripts
   450→  // This prevents conflicts with MutationObservers and other DOM manipulation
   451→  setTimeout(() => {
   452→    try {
   453→      isDOMStable = true; // Mark DOM as stable
   454→      glowCardsInitialiser();
   455→    } catch (error) {
   456→      console.error("Glow Cards: Initialization failed", error);
   457→      // Fail silently to not break other scripts
   458→    }
   459→  }, 500);
   460→
   461→  // Add resize listener with error handling
   462→  window.addEventListener(
   463→    "resize",
   464→    () => {
   465→      try {
   466→        handleResize();
   467→      } catch (error) {
   468→        console.error("Glow Cards: Resize handler failed", error);
   469→      }
   470→    },
   471→    { passive: true },
   472→  );
   473→});
   474→
   475→//Navigation Dropdowns
   476→document.addEventListener("DOMContentLoaded", function () {
   477→  if (window.innerWidth <= 991) {
   478→    return;
   479→  }
   480→  const toggles = document.querySelectorAll('[data-nav-dd="toggle"]');
   481→  const overlay = document.querySelector("[data-nav-dd='overlay']");
   482→  let activeToggle = null;
   483→  let hideTimeout = null;
   484→
   485→  function initialiser() {
   486→    // Create overlay quickTo
   487→    const overlayQuickTo = overlay
   488→      ? gsap.quickTo(overlay, "opacity", { duration: 0.15, ease: "power2.out" })
   489→      : null;
   490→
   491→    // Store timeline references for drawers
   492→    const drawerTimelines = new Map();
   493→
   494→    // Define playDropdown function with timeline logic
   495→    window.playDropdown = function (drawer, show = true) {
   496→      let timeline = drawerTimelines.get(drawer);
   497→      if (!timeline) {
   498→        // Create fresh timeline for drawer animation
   499→        gsap.set(drawer, { opacity: 0, y: 5 });
   500→        timeline = gsap.timeline({ paused: true }).to(drawer, {
   501→          opacity: 1,
   502→          y: 0,
   503→          duration: 0.15,
   504→          ease: "power2.out",
   505→        });
   506→        drawerTimelines.set(drawer, timeline);
   507→      }
   508→      show ? timeline.play() : timeline.reverse();
   509→    };
   510→
   511→    // Expose overlay function
   512→    window.overlayQuickTo = overlayQuickTo;
   513→  }
   514→
   515→  function showOverlay() {
   516→    const hasActiveDropdown = Array.from(toggles).some(
   517→      (toggle) => toggle.getAttribute("data-dd-state") === "show",
   518→    );
   519→    if (!hasActiveDropdown && window.overlayQuickTo) {
   520→      window.overlayQuickTo(0);
   521→    }
   522→  }
   523→
   524→  function hideAllDropdowns() {
   525→    toggles.forEach((toggle) => {
   526→      const drawer = toggle.nextElementSibling;
   527→      if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
   528→        toggle.setAttribute("data-dd-state", "hide");
   529→        drawer.style.pointerEvents = "none";
   530→        window.playDropdown(drawer, false);
   531→      }
   532→    });
   533→    activeToggle = null;
   534→    if (window.overlayQuickTo) {
   535→      window.overlayQuickTo(0);
   536→    }
   537→  }
   538→
   539→  function showDropdown(toggle, drawer) {
   540→    if (activeToggle && activeToggle !== toggle) {
   541→      hideAllDropdowns();
   542→    }
   543→    if (hideTimeout) {
   544→      clearTimeout(hideTimeout);
   545→      hideTimeout = null;
   546→    }
   547→
   548→    activeToggle = toggle;
   549→    toggle.setAttribute("data-dd-state", "show");
   550→    drawer.style.pointerEvents = "auto";
   551→    window.playDropdown(drawer, true);
   552→
   553→    if (window.overlayQuickTo) {
   554→      window.overlayQuickTo(1);
   555→    }
   556→  }
   557→
   558→  function hideDropdown(toggle, drawer) {
   559→    hideTimeout = setTimeout(() => {
   560→      toggle.setAttribute("data-dd-state", "hide");
   561→      drawer.style.pointerEvents = "none";
   562→      window.playDropdown(drawer, false);
   563→
   564→      if (activeToggle === toggle) {
   565→        activeToggle = null;
   566→      }
   567→      showOverlay();
   568→    }, 150);
   569→  }
   570→
   571→  // Initialize animations first
   572→  initialiser();
   573→
   574→  toggles.forEach((toggle, index) => {
   575→    const drawer = toggle.nextElementSibling;
   576→    if (drawer && drawer.getAttribute("data-nav-dd") === "drawer") {
   577→      toggle.addEventListener("mouseenter", () => {
   578→        showDropdown(toggle, drawer);
   579→      });
   580→      toggle.addEventListener("mouseleave", () => {
   581→        hideDropdown(toggle, drawer);
   582→      });
   583→      drawer.addEventListener("mouseenter", () => {
   584→        if (hideTimeout) {
   585→          clearTimeout(hideTimeout);
   586→          hideTimeout = null;
   587→        }
   588→
   589→        activeToggle = toggle;
   590→        toggle.setAttribute("data-dd-state", "show");
   591→        drawer.style.pointerEvents = "auto";
   592→        window.playDropdown(drawer, true);
   593→
   594→        if (window.overlayQuickTo) {
   595→          window.overlayQuickTo(1);
   596→        }
   597→      });
   598→      drawer.addEventListener("mouseleave", () => {
   599→        hideDropdown(toggle, drawer);

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/ix.js (1000 - 1199)**
Status: Completed

```
  1000→      );
  1001→      const currentIndex = currentActive
  1002→        ? parseInt(currentActive.getAttribute("data-tab-link"), 10)
  1003→        : 1;
  1004→
  1005→      const nextIndex = currentIndex >= tabLinks.length ? 1 : currentIndex + 1;
  1006→
  1007→      switchToTab(isolatedTab, nextIndex, duration);
  1008→    }, duration);
  1009→  }
  1010→
  1011→  function autoplayInitialiser() {
  1012→    const allTabs = document.querySelectorAll("[data-tab-name]");
  1013→
  1014→    allTabs.forEach((isolatedTab) => {
  1015→      const autoplayAttr = isolatedTab.getAttribute("data-tab-autoplay");
  1016→
  1017→      if (autoplayAttr !== null) {
  1018→        const duration =
  1019→          autoplayAttr === "" ? 15000 : parseInt(autoplayAttr, 10) || 15000;
  1020→
  1021→        startAutoplay(isolatedTab, duration);
  1022→
  1023→        // Trigger initial progress bar animation
  1024→        const tabMenu = isolatedTab.querySelector("[data-tab-menu]");
  1025→        const firstLink = tabMenu ? tabMenu.children[0] : null;
  1026→        if (firstLink) {
  1027→          const progressBar = firstLink.querySelector("[data-tab-border]");
  1028→          if (progressBar && window.gsap) {
  1029→            window.gsap.set(progressBar, { width: "0%" });
  1030→            window.gsap.to(progressBar, {
  1031→              width: "100%",
  1032→              duration: duration / 1000,
  1033→              ease: "linear",
  1034→            });
  1035→          }
  1036→        }
  1037→      }
  1038→    });
  1039→  }
  1040→
  1041→  setTimeout(() => {
  1042→    indexInitialiser();
  1043→    tabInitialiser();
  1044→    clickInitialiser();
  1045→    autoplayInitialiser();
  1046→  }, 100);
  1047→});
  1048→
  1049→//Gallery Carousel
  1050→document.addEventListener("DOMContentLoaded", function () {
  1051→  function galleryInitializer() {
  1052→    const galleryWrapper = document.querySelector("[data-gallery-wrap]");
  1053→    if (!galleryWrapper) return;
  1054→
  1055→    const galleryList = galleryWrapper.querySelector("[data-gallery-list]");
  1056→    const slides = galleryWrapper.querySelectorAll("[data-gallery-slide]");
  1057→    const paginationContainer = document.getElementById("gallery-pagination");
  1058→
  1059→    if (!galleryList || slides.length === 0 || !paginationContainer) return;
  1060→
  1061→    let currentIndex = 0;
  1062→    let autoplayTimer = null;
  1063→
  1064→    // Get autoplay duration from data attribute (default 3000ms)
  1065→    const autoplayAttr = galleryList.getAttribute("data-gallery-autoplay");
  1066→    const autoplayDuration =
  1067→      autoplayAttr !== null
  1068→        ? autoplayAttr === ""
  1069→          ? 3000
  1070→          : parseInt(autoplayAttr, 10) || 3000
  1071→        : 3000;
  1072→
  1073→    // Function to switch to a specific slide
  1074→    function switchToSlide(index) {
  1075→      const oldSlide = slides[currentIndex];
  1076→      const newSlide = slides[index];
  1077→
  1078→      // Skip if clicking the same slide
  1079→      if (currentIndex === index) return;
  1080→
  1081→      // Exit animation for current slide
  1082→      oldSlide.style.opacity = "1";
  1083→      oldSlide.style.transition = "opacity 0.15s ease-out";
  1084→      oldSlide.style.opacity = "0";
  1085→
  1086→      // After exit animation completes, show new slide
  1087→      setTimeout(() => {
  1088→        oldSlide.style.display = "none";
  1089→        oldSlide.style.opacity = "1";
  1090→        oldSlide.style.transition = "";
  1091→
  1092→        // Entry animation for new slide
  1093→        newSlide.style.display = "block";
  1094→        newSlide.style.opacity = "0";
  1095→        newSlide.style.transition = "opacity 0.15s ease-in";
  1096→
  1097→        // Trigger reflow to ensure transition works
  1098→        newSlide.offsetHeight;
  1099→
  1100→        newSlide.style.opacity = "1";
  1101→
  1102→        // Clean up transition after animation
  1103→        setTimeout(() => {
  1104→          newSlide.style.transition = "";
  1105→        }, 150);
  1106→      }, 150);
  1107→
  1108→      // Update pagination dots
  1109→      const dots = paginationContainer.querySelectorAll("[data-gallery-dot]");
  1110→      dots.forEach((dot, i) => {
  1111→        if (i === index) {
  1112→          dot.setAttribute("data-gallery-dot", "active");
  1113→        } else {
  1114→          dot.setAttribute("data-gallery-dot", "inactive");
  1115→        }
  1116→      });
  1117→
  1118→      currentIndex = index;
  1119→    }
  1120→
  1121→    // Generate pagination dots
  1122→    function generatePagination() {
  1123→      paginationContainer.innerHTML = "";
  1124→
  1125→      slides.forEach((slide, index) => {
  1126→        const dot = document.createElement("div");
  1127→        dot.setAttribute(
  1128→          "data-gallery-dot",
  1129→          index === 0 ? "active" : "inactive",
  1130→        );
  1131→        dot.style.cursor = "pointer";
  1132→
  1133→        // Add click handler
  1134→        dot.addEventListener("click", () => {
  1135→          switchToSlide(index);
  1136→          resetAutoplay();
  1137→        });
  1138→
  1139→        paginationContainer.appendChild(dot);
  1140→      });
  1141→    }
  1142→
  1143→    // Autoplay function
  1144→    function startAutoplay() {
  1145→      if (autoplayTimer) {
  1146→        clearInterval(autoplayTimer);
  1147→      }
  1148→
  1149→      autoplayTimer = setInterval(() => {
  1150→        const nextIndex = (currentIndex + 1) % slides.length;
  1151→        switchToSlide(nextIndex);
  1152→      }, autoplayDuration);
  1153→    }
  1154→
  1155→    // Reset autoplay timer
  1156→    function resetAutoplay() {
  1157→      startAutoplay();
  1158→    }
  1159→
  1160→    // Initialize
  1161→    generatePagination();
  1162→    switchToSlide(0);
  1163→    startAutoplay();
  1164→  }
  1165→
  1166→  // Initialize gallery after a short delay
  1167→  setTimeout(() => {
  1168→    galleryInitializer();
  1169→  }, 100);
  1170→});
  1171→
  1172→//Timeline Swipers
  1173→document.addEventListener("DOMContentLoaded", function () {
  1174→  // Flag to track manual year override (when year nav doesn't match active slide)
  1175→  let manualYearOverride = false;
  1176→  let manualYearValue = null;
  1177→
  1178→  // Flag to track if Next button is in fake-enabled state
  1179→  let nextButtonFakeEnabled = false;
  1180→
  1181→  var mySwiper = new Swiper("#timeline-swiper", {
  1182→    direction: "horizontal",
  1183→    slidesPerView: 1,
  1184→    slidesPerGroup: 1,
  1185→    spaceBetween: 16,
  1186→    grabCursor: true,
  1187→    allowTouchMove: true,
  1188→    autoHeight: false,
  1189→    watchOverflow: true,
  1190→    slidesOffsetBefore: 0,
  1191→    slidesOffsetAfter: 0,
  1192→    centeredSlides: false,
  1193→    loop: false,
  1194→    resistanceRatio: 0,
  1195→    pagination: {
  1196→      el: "#timeline-pagination",
  1197→      clickable: true,
  1198→      bulletClass: "timeline-bullet",
  1199→      bulletActiveClass: "timeline-bullet-active",

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/ix.js (1400 - 1637)**
Status: Completed

```
  1400→      nextButton.classList.remove("timeline-nav-disabled");
  1401→      nextButton.removeAttribute("disabled");
  1402→      nextButton.setAttribute("aria-disabled", "false");
  1403→      nextButton.setAttribute("tabindex", "0");
  1404→    } else {
  1405→      // Clear the flag when not fake-enabled
  1406→      nextButtonFakeEnabled = false;
  1407→    }
  1408→  }
  1409→
  1410→  // Manually set year nav state (for year nav clicks)
  1411→  function setYearNavState(year) {
  1412→    const yearItems = document.querySelectorAll("[data-timeline-year]");
  1413→    yearItems.forEach((yearItem) => {
  1414→      const yearValue = yearItem.getAttribute("data-year-target");
  1415→      yearItem.setAttribute(
  1416→        "data-year-state",
  1417→        yearValue === year ? "active" : "inactive",
  1418→      );
  1419→    });
  1420→  }
  1421→
  1422→  // Handle year navigation click
  1423→  function handleYearClick(swiper, targetYear) {
  1424→    const isDesktop = window.innerWidth >= 992;
  1425→
  1426→    // Determine navigation target
  1427→    let targetSlideIndex;
  1428→    let isSpecialNavigation = false;
  1429→
  1430→    if (isDesktop && isYearOnlyOnLastSlide(swiper, targetYear)) {
  1431→      // Navigate to second-to-last slide (special case)
  1432→      targetSlideIndex = swiper.slides.length - 2;
  1433→      isSpecialNavigation = true;
  1434→    } else {
  1435→      // Navigate to first occurrence of year
  1436→      targetSlideIndex = findSlideIndexByYear(swiper, targetYear);
  1437→    }
  1438→
  1439→    if (targetSlideIndex !== -1 && targetSlideIndex >= 0) {
  1440→      // Set manual override flag if navigating to a different slide than the year's first occurrence
  1441→      if (isSpecialNavigation) {
  1442→        manualYearOverride = true;
  1443→        manualYearValue = targetYear;
  1444→        setYearNavState(targetYear);
  1445→
  1446→        // Block prev navigation while in override state
  1447→        swiper.allowSlidePrev = false;
  1448→
  1449→        // Update Next button state after year override
  1450→        updateNextButtonState(swiper);
  1451→      } else {
  1452→        // Normal navigation - clear override and restore prev navigation
  1453→        manualYearOverride = false;
  1454→        manualYearValue = null;
  1455→        swiper.allowSlidePrev = true;
  1456→
  1457→        // If we're already on the target slide, manually update year nav
  1458→        // (since slideChange won't fire)
  1459→        if (swiper.activeIndex === targetSlideIndex) {
  1460→          setYearNavState(targetYear);
  1461→          updateNextButtonState(swiper);
  1462→        }
  1463→      }
  1464→
  1465→      swiper.slideTo(targetSlideIndex);
  1466→    }
  1467→  }
  1468→
  1469→  // Get all unique years from swiper slides
  1470→  function getAvailableYears(swiper) {
  1471→    const years = new Set();
  1472→    const slides = swiper.slides;
  1473→
  1474→    slides.forEach((slide) => {
  1475→      const yearSourceElement = slide.querySelector("[data-year-source]");
  1476→      if (yearSourceElement) {
  1477→        const year = yearSourceElement.getAttribute("data-year-source");
  1478→        if (year) {
  1479→          years.add(year);
  1480→        }
  1481→      }
  1482→    });
  1483→
  1484→    return years;
  1485→  }
  1486→
  1487→  // Remove year navigation items that don't have corresponding slides
  1488→  function filterYearNavigation(swiper) {
  1489→    const availableYears = getAvailableYears(swiper);
  1490→    const yearItems = document.querySelectorAll("[data-timeline-year]");
  1491→
  1492→    yearItems.forEach((yearItem) => {
  1493→      const yearValue = yearItem.getAttribute("data-year-target");
  1494→
  1495→      // Remove if year doesn't exist in slides
  1496→      if (!availableYears.has(yearValue)) {
  1497→        yearItem.remove();
  1498→      }
  1499→    });
  1500→  }
  1501→
  1502→  // Initialize click handlers for year navigation
  1503→  function initializeYearNavigation(swiper) {
  1504→    const yearItems = document.querySelectorAll("[data-timeline-year]");
  1505→
  1506→    yearItems.forEach((yearItem) => {
  1507→      yearItem.style.cursor = "pointer";
  1508→
  1509→      yearItem.addEventListener("click", function () {
  1510→        const targetYear = this.getAttribute("data-year-target");
  1511→        handleYearClick(swiper, targetYear);
  1512→      });
  1513→    });
  1514→  }
  1515→
  1516→  // Initialize click handlers for Next/Prev navigation buttons
  1517→  function initializeNavigationButtons(swiper) {
  1518→    const nextButton = document.querySelector("#timeline-next");
  1519→    const prevButton = document.querySelector("#timeline-prev");
  1520→
  1521→    if (nextButton) {
  1522→      // Capture the flag value BEFORE swiper processes the click
  1523→      let flagAtClickTime = false;
  1524→
  1525→      nextButton.addEventListener("mousedown", function (e) {
  1526→        // Capture flag state at mousedown, before any swiper processing
  1527→        flagAtClickTime = nextButtonFakeEnabled;
  1528→      });
  1529→
  1530→      nextButton.addEventListener("click", function (e) {
  1531→        // Only trigger override if the flag was true BEFORE this click
  1532→        if (flagAtClickTime) {
  1533→          // Trigger year override to last year
  1534→          const lastYear = getLastYearInNav();
  1535→          if (lastYear) {
  1536→            manualYearOverride = true;
  1537→            manualYearValue = lastYear;
  1538→            setYearNavState(lastYear);
  1539→
  1540→            // Clear the fake-enabled flag
  1541→            nextButtonFakeEnabled = false;
  1542→
  1543→            // Block prev navigation while in override state
  1544→            swiper.allowSlidePrev = false;
  1545→
  1546→            // Now truly disable the button (we're on last year)
  1547→            nextButton.classList.add("timeline-nav-disabled");
  1548→            nextButton.setAttribute("disabled", "");
  1549→            nextButton.setAttribute("aria-disabled", "true");
  1550→            nextButton.setAttribute("tabindex", "-1");
  1551→          }
  1552→        } else {
  1553→          // Normal navigation - clear manual override
  1554→          manualYearOverride = false;
  1555→          manualYearValue = null;
  1556→          swiper.allowSlidePrev = true;
  1557→        }
  1558→      });
  1559→    }
  1560→
  1561→    if (prevButton) {
  1562→      prevButton.addEventListener("click", function (e) {
  1563→        // If in override state, swiper is blocked by allowSlidePrev = false
  1564→        // Just clear override and restore normal navigation
  1565→        if (manualYearOverride) {
  1566→          // Clear override
  1567→          manualYearOverride = false;
  1568→          manualYearValue = null;
  1569→
  1570→          // Re-enable swiper prev navigation
  1571→          swiper.allowSlidePrev = true;
  1572→
  1573→          // Update year nav to match actual active slide
  1574→          updateYearNavigation(swiper);
  1575→
  1576→          // Re-enable Next button (we're back to the "fake-enable" state)
  1577→          updateNextButtonState(swiper);
  1578→        } else {
  1579→          // Normal navigation - ensure override state is clear
  1580→          manualYearOverride = false;
  1581→          manualYearValue = null;
  1582→          swiper.allowSlidePrev = true;
  1583→        }
  1584→      });
  1585→    }
  1586→  }
  1587→});
  1588→
  1589→//Blog Share Snippet
  1590→document.addEventListener("DOMContentLoaded", () => {
  1591→  // Find all elements with data-blog-share attribute
  1592→  const shareElements = document.querySelectorAll("[data-blog-share]");
  1593→
  1594→  // Add click event listeners to each element
  1595→  shareElements.forEach((element) => {
  1596→    element.addEventListener("click", function () {
  1597→      const shareType = this.getAttribute("data-blog-share");
  1598→
  1599→      if (shareType === "copy") {
  1600→        // Copy current URL to clipboard
  1601→        navigator.clipboard
  1602→          .writeText(window.location.href)
  1603→          .then(() => {
  1604→            showToast("Copied to clipboard");
  1605→          })
  1606→          .catch((err) => {
  1607→            console.error("Failed to copy URL:", err);
  1608→          });
  1609→      } else if (shareType === "mail") {
  1610→        // Create mailto link and trigger it
  1611→        const mailtoUrl = `mailto:?subject=Check this out&body=${window.location.href}`;
  1612→        window.location.href = mailtoUrl;
  1613→      }
  1614→    });
  1615→  });
  1616→
  1617→  // Simple toast notification function
  1618→  function showToast(message) {
  1619→    const toast = document.createElement("div");
  1620→    toast.textContent = message;
  1621→    toast.style.position = "fixed";
  1622→    toast.style.bottom = "20px";
  1623→    toast.style.left = "50%";
  1624→    toast.style.transform = "translateX(-50%)";
  1625→    toast.style.padding = "10px 20px";
  1626→    toast.style.backgroundColor = "#1c1c24";
  1627→    toast.style.color = "#fff";
  1628→    toast.style.borderRadius = "4px";
  1629→    toast.style.zIndex = "1000";
  1630→
  1631→    document.body.appendChild(toast);
  1632→
  1633→    // Remove the toast after 3 seconds
  1634→    setTimeout(() => {
  1635→      document.body.removeChild(toast);
  1636→    }, 3000);
  1637→  }

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

## Assistant

Good — solid picture of the codebase. I now understand all the conventions. Let me read a few of the most relevant files directly so I have precise references before we take notes.

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js (89 - 258)**
Status: Completed

```
    89→//Dynamic Layouts
    90→document.addEventListener("DOMContentLoaded", function () {
    91→  // Subtle fade-in for news cards
    92→  function animate() {
    93→    const cards = document.querySelectorAll("[data-news-card]");
    94→
    95→    if (cards.length === 0) return;
    96→
    97→    gsap.set(cards, { opacity: 0 });
    98→    gsap.to(cards, {
    99→      opacity: 1,
   100→      duration: 0.3,
   101→      ease: "power1.out",
   102→    });
   103→  }
   104→
   105→  // Remove offset items from grid
   106→  function remove(grid) {
   107→    const offset = grid.getAttribute("data-news-offset");
   108→    if (!offset) return;
   109→
   110→    const offsetNum = parseInt(offset, 10);
   111→    if (isNaN(offsetNum) || offsetNum <= 0) return;
   112→
   113→    const gridItems = Array.from(grid.children);
   114→    const itemsToRemove = gridItems.slice(0, offsetNum - 1);
   115→    itemsToRemove.forEach((item) => item.remove());
   116→  }
   117→
   118→  // Add 'wide' class to specific items based on interval
   119→  function layout(grid) {
   120→    const gridItems = Array.from(grid.children);
   121→    const intervalAttr = grid.getAttribute("data-news-grid");
   122→    const interval =
   123→      intervalAttr && !isNaN(parseInt(intervalAttr, 10))
   124→        ? parseInt(intervalAttr, 10)
   125→        : 10;
   126→
   127→    gridItems.forEach((item, index) => {
   128→      const groupNumber = Math.floor(index / interval);
   129→      const positionInGroup = index % interval;
   130→
   131→      if (positionInGroup === 0 || positionInGroup === interval - 1) {
   132→        item.classList.add("wide");
   133→      }
   134→    });
   135→  }
   136→
   137→  // Remove all 'wide' classes from grid
   138→  function reset(grid) {
   139→    const gridItems = Array.from(grid.children);
   140→    gridItems.forEach((item) => item.classList.remove("wide"));
   141→  }
   142→
   143→  // Check device and setup responsive behavior
   144→  function checkDevice(grid) {
   145→    const hasMobileAttr = grid.hasAttribute("data-grid-mobile");
   146→
   147→    // Check if should apply layout based on device
   148→    const shouldApply = () => {
   149→      if (!hasMobileAttr) return true;
   150→      const mediaQuery = window.matchMedia("(max-width: 768px)");
   151→      return mediaQuery.matches;
   152→    };
   153→
   154→    // Apply or reset layout based on device check
   155→    if (!shouldApply()) {
   156→      reset(grid);
   157→      // Fade in cards even when resetting (desktop view for mobile-only grids)
   158→      animate();
   159→      return;
   160→    }
   161→    reset(grid);
   162→    layout(grid);
   163→
   164→    // Fade in cards after layout is complete
   165→    animate();
   166→
   167→    // Setup responsive listener if mobile attribute exists
   168→    if (hasMobileAttr) {
   169→      const mediaQuery = window.matchMedia("(max-width: 768px)");
   170→      const handleMediaQueryChange = (e) => {
   171→        if (e.matches) {
   172→          layout(grid);
   173→          // Fade in cards after layout is complete
   174→          animate();
   175→        } else {
   176→          reset(grid);
   177→        }
   178→      };
   179→      mediaQuery.addEventListener("change", handleMediaQueryChange);
   180→    }
   181→  }
   182→
   183→  // Process a single grid
   184→  function initialiseLayout(grid) {
   185→    remove(grid);
   186→    checkDevice(grid);
   187→  }
   188→
   189→  // Check pagination and setup load more buttons
   190→  function checkPagination() {
   191→    const loadMoreButtons = document.querySelectorAll("[data-news-load]");
   192→    const grid = document.querySelector("[data-news-grid]");
   193→    if (!grid) return;
   194→
   195→    // Use MutationObserver to detect when new items are added
   196→    const observer = new MutationObserver((mutations) => {
   197→      mutations.forEach((mutation) => {
   198→        if (mutation.addedNodes.length > 0) {
   199→          // New items were added, recalculate layout
   200→          reset(grid);
   201→          layout(grid);
   202→
   203→          // Fade in cards after layout is complete
   204→          animate();
   205→        }
   206→      });
   207→    });
   208→
   209→    // Start observing the grid for child additions
   210→    observer.observe(grid, {
   211→      childList: true,
   212→      subtree: false,
   213→    });
   214→
   215→    // Fallback: also add click listeners with longer delay
   216→    loadMoreButtons.forEach((button) => {
   217→      button.addEventListener("click", () => {
   218→        // Wait longer for Finsweet to load content
   219→        setTimeout(() => {
   220→          reset(grid);
   221→          layout(grid);
   222→
   223→          // Fade in cards after layout is complete
   224→          animate();
   225→        }, 500);
   226→      });
   227→    });
   228→  }
   229→
   230→  // Main execution
   231→  const newsGrids = document.querySelectorAll("[data-news-grid]");
   232→  if (newsGrids.length === 0) return;
   233→
   234→  newsGrids.forEach((grid) => initialiseLayout(grid));
   235→  checkPagination();
   236→});
   237→
   238→//Query Parameters
   239→document.addEventListener("DOMContentLoaded", function () {
   240→  const newsQueryElement = document.querySelector("[data-search-query]");
   241→
   242→  //Check if attribute exists
   243→  if (!newsQueryElement) {
   244→    return;
   245→  }
   246→
   247→  const currentUrl = window.location.href;
   248→  const queryMatch = currentUrl.match(/[?&]query=([^&]+)/);
   249→
   250→  if (queryMatch && queryMatch[1]) {
   251→    const decodedQuery = decodeURIComponent(queryMatch[1].replace(/\+/g, " "));
   252→    newsQueryElement.textContent = decodedQuery;
   253→  } else {
   254→  }
   255→});
   256→
   257→//Sidebar Injection
   258→document.addEventListener("DOMContentLoaded", function () {

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js (238 - 267)**
Status: Completed

```
   238→//Query Parameters
   239→document.addEventListener("DOMContentLoaded", function () {
   240→  const newsQueryElement = document.querySelector("[data-search-query]");
   241→
   242→  //Check if attribute exists
   243→  if (!newsQueryElement) {
   244→    return;
   245→  }
   246→
   247→  const currentUrl = window.location.href;
   248→  const queryMatch = currentUrl.match(/[?&]query=([^&]+)/);
   249→
   250→  if (queryMatch && queryMatch[1]) {
   251→    const decodedQuery = decodeURIComponent(queryMatch[1].replace(/\+/g, " "));
   252→    newsQueryElement.textContent = decodedQuery;
   253→  } else {
   254→  }
   255→});
   256→
   257→//Sidebar Injection
   258→document.addEventListener("DOMContentLoaded", function () {
   259→  // Check for data-sidebar-source and data-sidebar-target
   260→  const sidebarSource = document.querySelector("[data-sidebar-source]");
   261→  const sidebarTarget = document.querySelector("[data-sidebar-target]");
   262→
   263→  if (!sidebarSource || !sidebarTarget) {
   264→    return;
   265→  }
   266→
   267→  // Store the original parent and next sibling to restore position later

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js (349 - 458)**
Status: Completed

```
   349→//Array Animation on Load More
   350→document.addEventListener("DOMContentLoaded", function () {
   351→  function checkLoadMore() {
   352→    const loadMoreButtons = document.querySelectorAll("[data-load-more]");
   353→    const containers = document.querySelectorAll(
   354→      "[data-motion-array]:not([data-motion-block]), [data-motion-stagger]:not([data-motion-block])",
   355→    );
   356→    if (containers.length === 0) return;
   357→
   358→    containers.forEach((container) => {
   359→      // Determine animation type based on attribute
   360→      const isStagger = container.hasAttribute("data-motion-stagger");
   361→
   362→      // Use MutationObserver to detect when new items are added
   363→      const observer = new MutationObserver((mutations) => {
   364→        mutations.forEach((mutation) => {
   365→          if (mutation.addedNodes.length > 0) {
   366→            // Get only the newly added child elements
   367→            const newChildren = Array.from(mutation.addedNodes).filter(
   368→              (node) =>
   369→                node.nodeType === 1 && !node.hasAttribute("data-motion-block"),
   370→            );
   371→
   372→            if (newChildren.length > 0) {
   373→              // Animate only the new children
   374→              if (window.innerWidth > 991) {
   375→                if (isStagger) {
   376→                  // Stagger: opacity only (no y translate)
   377→                  gsap.set(newChildren, {
   378→                    opacity: 0,
   379→                  });
   380→                  gsap.to(newChildren, {
   381→                    opacity: 1,
   382→                    duration: 0.8,
   383→                    stagger: 0.15,
   384→                    ease: "power2.out",
   385→                  });
   386→                } else {
   387→                  // Array: opacity + y translate
   388→                  gsap.set(newChildren, {
   389→                    opacity: 0,
   390→                    y: 5,
   391→                  });
   392→                  gsap.to(newChildren, {
   393→                    opacity: 1,
   394→                    y: 0,
   395→                    duration: 0.8,
   396→                    stagger: 0.15,
   397→                    ease: "power2.out",
   398→                  });
   399→                }
   400→              } else {
   401→                gsap.set(newChildren, {
   402→                  opacity: 1,
   403→                  y: 0,
   404→                });
   405→              }
   406→            }
   407→          }
   408→        });
   409→      });
   410→
   411→      // Start observing the container for child additions
   412→      observer.observe(container, {
   413→        childList: true,
   414→        subtree: false,
   415→      });
   416→    });
   417→
   418→    // Fallback: also add click listeners with delay
   419→    loadMoreButtons.forEach((button) => {
   420→      button.addEventListener("click", () => {
   421→        setTimeout(() => {
   422→          containers.forEach((container) => {
   423→            const isStagger = container.hasAttribute("data-motion-stagger");
   424→            const children = Array.from(container.children).filter(
   425→              (child) => !child.hasAttribute("data-motion-block"),
   426→            );
   427→            if (window.innerWidth > 991) {
   428→              if (isStagger) {
   429→                // Stagger: opacity only
   430→                gsap.to(children, {
   431→                  opacity: 1,
   432→                  duration: 0.8,
   433→                  stagger: 0.15,
   434→                  ease: "power2.out",
   435→                });
   436→              } else {
   437→                // Array: opacity + y translate
   438→                gsap.to(children, {
   439→                  opacity: 1,
   440→                  y: 0,
   441→                  duration: 0.8,
   442→                  stagger: 0.15,
   443→                  ease: "power2.out",
   444→                });
   445→              }
   446→            }
   447→          });
   448→        }, 500);
   449→      });
   450→    });
   451→  }
   452→
   453→  checkLoadMore();
   454→});
   455→
   456→//Form Injection
   457→document.addEventListener("DOMContentLoaded", function () {
   458→  // Find all form embed wrapper elements

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

## Assistant

Good. I have a thorough picture of the codebase. Now let me write the initial skeleton of the plan file so we have a base to build on, and then we can fill in the spec together as you walk me through each step.

**Tool Call: Write /home/austinjxseph/.claude/plans/floating-finding-toast.md**
Status: Completed

Diff: /home/austinjxseph/.claude/plans/floating-finding-toast.md
```
# search.js — Implementation Plan

> **Status:** Spec in progress. User will detail each step sequentially.

---

## Context

`search.js` is a new standalone module for the brochuresite that powers a search results page. It must:
1. Extract query params from the URL
2. Fetch a JSON response from an API
3. Parse and filter the response based on metadata fields
4. Clone a sample card from the DOM as a template and render dynamic HTML for each result
5. Initialise pagination
6. Animate cards in one-by-one using a stagger pattern once the DOM is ready

It follows the same conventions as the rest of the codebase:
- `data-*` attribute selectors throughout (no class selectors for JS hooks)
- GSAP for all animations (already loaded globally on the page)
- `document.addEventListener("DOMContentLoaded", fn)` as the init wrapper
- Pattern: set → to with stagger, `ease: "power2.out"`, duration ~0.8s, stagger ~0.15s
- Expose reusable helpers on `window` if needed
- Try/catch error boundaries around fetch and animation blocks
- Guard rails: early return if required DOM elements are absent

---

## Codebase Conventions (Reference)

| Pattern | Source |
|---|---|
| URL param parsing | `script.js:238–255` — `currentUrl.match(/[?&]query=([^&]+)/)` |
| Card fade-in | `script.js:91–103` — `gsap.set(cards, {opacity:0})` → `gsap.to(cards, {opacity:1, ...})` |
| Stagger on new items | `script.js:349–454` — `gsap.set(newChildren, {opacity:0, y:5})` → animate with `stagger:0.15` |
| MutationObserver | `script.js:196–213` — observe grid childList for pagination |
| Load-more fallback | `script.js:216–227` — 500ms setTimeout click fallback |
| Global `window.*` helpers | `motion.js` — `window.arrayAnimator`, `window.staggerAnimator`, etc. |
| Error boundary | `motion.js:89–123` — try/catch with `console.error(...)` |
| DOM guard | `script.js:232` — early return if selector returns nothing |

---

## Spec (To Be Filled In Per Step)

### Step 1 — URL Parameter Extraction
- **Params to extract:** TBD
- **Selector for display element:** TBD (likely `[data-search-query]` pattern)
- **Handling:** decode, trim, display in element

### Step 2 — API Fetch
- **Endpoint:** TBD
- **Method:** TBD (likely GET with query params appended)
- **Auth / headers:** TBD
- **Error handling:** show empty state element on failure

### Step 3 — Parse & Filter Response
- **JSON shape:** TBD (sample response to be provided)
- **Filter criteria:** TBD (metadata fields to exclude/include)
- **Max results:** TBD

### Step 4 — Card Template & Rendering
- **Template source:** clone a sample card from the DOM via `[data-search-card-template]` (or agreed selector)
- **Card selector convention:** TBD
- **Fields mapped:** TBD (from JSON → DOM attr/text)
- **Container selector:** TBD

### Step 5 — Pagination
- **Logic:** TBD (client-side slice vs server-side?)
- **Results per page:** TBD
- **Selectors:** TBD (e.g. `[data-search-prev]`, `[data-search-next]`, `[data-search-page]`)
- **Behaviour:** re-render cards on page change, scroll-to-top of results?

### Step 6 — Entry Animation
- **Trigger:** `DOMContentLoaded` + after cards are injected into DOM
- **Pattern:** matches `script.js:349–398` stagger pattern
  - `gsap.set(cards, { opacity: 0, y: 5 })`
  - `gsap.to(cards, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" })`
- **Desktop-only guard:** `window.innerWidth > 991` (match existing pattern)
- **Re-trigger:** animate only newly rendered cards on page change

---

## File to Create

`/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js`

---

## Verification

- Load search page with `?query=test` (and any other required params) in browser
- Confirm query display element shows decoded term
- Confirm API call fires and results render as cards
- Confirm filtered items are excluded
- Confirm pagination controls work and card count per page is correct
- Confirm stagger animation fires on initial load and on page change
- Confirm empty/error states display correctly when no results or API fails

```


## Assistant

Good. I've got the plan skeleton written with everything I've learned from the codebase. Here's what's locked in already, regardless of what you spec:

**Already confirmed from the codebase:**
- `data-*` attribute selectors throughout — no class-based JS hooks
- GSAP stagger animation matching `script.js:349–398` (`opacity: 0, y: 5` → `opacity: 1, y: 0`, `stagger: 0.15`, `ease: "power2.out"`)
- `DOMContentLoaded` wrapper, try/catch error boundaries, early-return guards
- URL param parsing style from `script.js:238–255`
- MutationObserver + 500ms click fallback for pagination (from `script.js:196–227`)
- Desktop-only animation guard (`window.innerWidth > 991`)

**What I need you to spec out, one step at a time:**

1. URL params — which params to extract from the URL? Just `query`, or others (e.g. category, type)?
2. API — endpoint URL, method, how the query gets appended, any auth headers?
3. JSON response — share a sample payload, and which metadata fields trigger filtering (what gets excluded)?
4. Card template — what's the `data-*` selector for the template card in the DOM, what fields from the JSON map to which elements inside the card?
5. Pagination — client-side or server-side? Results per page? Selectors for prev/next/page indicator?
6. Animation — any deviations from the standard stagger pattern, or does the existing one fit?

Walk me through step 1 and we'll go from there.

## User

firslt are the data-search attr sued anywhere else in this siote? you can look by serachign the other js fiels in thsi repo

**Tool Call: grep --include="*.js" "data-search" /home/austinjxseph/GitHub/shoreditchdesign/brochuresite**
Status: Completed

/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js-238-//Query Parameters
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js-239-document.addEventListener("DOMContentLoaded", function () {
script.js:240:  const newsQueryElement = document.querySelector("[data-search-query]");
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js-241-
/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js-242-  //Check if attribute exists

## Assistant

Only one hit: `[data-search-query]` in `script.js:240`, which is the existing element that displays a decoded query string in the DOM. That's it — no other `data-search-*` attributes are used anywhere in the JS files.

So the `data-search-*` namespace is essentially free for us to use in `search.js` without any collisions. We could either reuse `[data-search-query]` for the same display-query purpose (it already does that job), or namespace our new selectors differently if you want a cleaner separation. Worth flagging as we define the selectors in step 1.

## User

no, thast for an h1 injection. we wills till sue data-search-* for the toher attr

1. yes, use query?= to extrat the serah term from the live site's url.
2. api endpoint is of the apttern https://feeds.engine.online/api/EngineNews/SearchPosts?searchTerm=queryParameterhere&Limit=100&Page=1

limit is 100, page is 1, this satysu unchanges

we will aslo need to factor some foiltering and sort logic, will state in next mesage.
6. actually, skip teh animation logic for now
3. addedin [@test.json](file:///home/austinjxseph/GitHub/shoreditchdesign/brochuresite/test.json) 
4. we will add the follwoign from the jsaon resposne - data-search-url = slug appended at the end of /news/, data-search-image = src opf the said attr replaced with thumbnail big, thumbnails mall if big sisnt available, data-search-title  = replace w the title: field, data-search-cat with teh cat: field,  = use data-search-card as the parent selector we can use to select all these fields, cloned for each individual artocelr eturend in the json entry,adn added to the dom of the parent data-search-grid element.
5. thres a lod more impleematnion in of these files, mopre prolly [@script.js](file:///home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js)  - can we sue this to intalse the domw the 'first page' afetr the cloning si complete?

## Assistant

Let me read the actual test.json to understand the data shape, and also the load-more/pagination section of script.js more carefully.

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/test.json (1 - 50)**
Status: Completed

```
     1→{
     2→  "posts": [
     3→    {
     4→      "featuredImageSmall": "https://trade.engine.online/blobs/news/7b10bc12-a57f-414c-a67b-12e8ee89dfbf-600w.jpg",
     5→      "featuredImageBig": "https://trade.engine.online/blobs/news/7b10bc12-a57f-414c-a67b-12e8ee89dfbf-1200w.jpg",
     6→      "desc": "\u003Cspan class=\"ql-font-standfirst\"\u003EBunker prices across European and African ports have moved in mixed directions, and rough weather causes suspension in bunkering off Malta. \u003C/span\u003E",
     7→      "slug": "europe-and-africa-market-update-19-jan-7661",
     8→      "postId": 30305,
     9→      "cat": "Bunkering Info",
    10→      "color": "#74BEED",
    11→      "timestamp": "2026-01-19T11:15:36",
    12→      "title": "Europe & Africa Market Update 19 Jan",
    13→      "tags": [
    14→        "Durban",
    15→        "Gibraltar",
    16→        "Malta Offshore",
    17→        "Rotterdam",
    18→        "HSFO380",
    19→        "LSMGO",
    20→        "VLSFO",
    21→        "VLSFO B-30"
    22→      ],
    23→      "isFeatured": true
    24→    },
    25→    {
    26→      "featuredImageSmall": "https://trade.engine.online/blobs/news/d273dbad-de9d-415d-81f6-8889765269fb-600w.jpg",
    27→      "featuredImageBig": "https://trade.engine.online/blobs/news/d273dbad-de9d-415d-81f6-8889765269fb-1200w.jpg",
    28→      "desc": "\u003Cspan class=\"ql-font-standfirst\"\u003EPrices in East of Suez ports have moved in mixed directions, and availability of VLSFO is tight in Zhoushan.\u003C/span\u003E",
    29→      "slug": "east-of-suez-market-update-19-jan-7660",
    30→      "postId": 30304,
    31→      "cat": "Bunkering Info",
    32→      "color": "#74BEED",
    33→      "timestamp": "2026-01-19T10:33:29",
    34→      "title": "East of Suez Market Update 19 Jan",
    35→      "tags": [
    36→        "Fujairah",
    37→        "Singapore",
    38→        "Zhoushan",
    39→        "HSFO380",
    40→        "LSMGO",
    41→        "VLSFO",
    42→        "VLSFO B-30"
    43→      ],
    44→      "isFeatured": false
    45→    },
    46→    {
    47→      "featuredImageSmall": "https://trade.engine.online/blobs/news/7975e23e-3baa-4aed-ae68-0727c78593f2-600w.jpg",
    48→      "featuredImageBig": "https://trade.engine.online/blobs/news/7975e23e-3baa-4aed-ae68-0727c78593f2-600w.jpg",
    49→      "desc": "\u003Cspan class=\"ql-font-standfirst\"\u003EThe front-month ICE Brent contract has declined by $0.50/bbl on the day from Friday, to trade at $63.58/bbl at 09.00 GMT.\u003C/span\u003E",
    50→      "slug": "brent-loses-as-trump-threatens-10-pc-tariff-on-eight-european-nations-765f",

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js (189 - 228)**
Status: Completed

```
   189→  // Check pagination and setup load more buttons
   190→  function checkPagination() {
   191→    const loadMoreButtons = document.querySelectorAll("[data-news-load]");
   192→    const grid = document.querySelector("[data-news-grid]");
   193→    if (!grid) return;
   194→
   195→    // Use MutationObserver to detect when new items are added
   196→    const observer = new MutationObserver((mutations) => {
   197→      mutations.forEach((mutation) => {
   198→        if (mutation.addedNodes.length > 0) {
   199→          // New items were added, recalculate layout
   200→          reset(grid);
   201→          layout(grid);
   202→
   203→          // Fade in cards after layout is complete
   204→          animate();
   205→        }
   206→      });
   207→    });
   208→
   209→    // Start observing the grid for child additions
   210→    observer.observe(grid, {
   211→      childList: true,
   212→      subtree: false,
   213→    });
   214→
   215→    // Fallback: also add click listeners with longer delay
   216→    loadMoreButtons.forEach((button) => {
   217→      button.addEventListener("click", () => {
   218→        // Wait longer for Finsweet to load content
   219→        setTimeout(() => {
   220→          reset(grid);
   221→          layout(grid);
   222→
   223→          // Fade in cards after layout is complete
   224→          animate();
   225→        }, 500);
   226→      });
   227→    });
   228→  }

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

## Assistant

Good. I have everything I need. Let me update the plan with what's confirmed, then ask you the remaining open questions.

**Tool Call: Edit /home/austinjxseph/.claude/plans/floating-finding-toast.md**
Status: Completed

Diff: /home/austinjxseph/.claude/plans/floating-finding-toast.md
```

---

## Spec

### Step 1 — URL Parameter Extraction
- **Param:** `query` — extracted via `URLSearchParams` or regex match on `window.location.href`
- **Display selector:** `[data-search-query]` — already handled by `script.js:238–255`, no duplication needed here
- **Usage in search.js:** used solely to build the API request URL

### Step 2 — API Fetch
- **Endpoint:** `https://feeds.engine.online/api/EngineNews/SearchPosts`
- **Params:** `?searchTerm={query}&Limit=100&Page=1` — Limit and Page are fixed
- **Method:** GET
- **Auth / headers:** none (public endpoint)
- **Error handling:** try/catch; on failure show `[data-search-empty]` element

### Step 3 — Parse & Filter Response
- **JSON shape (from test.json):**
  ```json
  {
    "posts": [ { "featuredImageSmall", "featuredImageBig", "desc", "slug", "postId", "cat", "color", "timestamp", "title", "tags", "isFeatured" } ],
    "totalRecords": N,
    "totalPages": N
  }
  ```
- **Image logic:** use `featuredImageBig` as `src`; fall back to `featuredImageSmall` if big is unavailable (null/empty)
- **URL construction:** `/news/{slug}`
- **Filter criteria:** TBD — user to specify which `cat` values or other fields to exclude
- **Sort logic:** TBD — user to specify (API order, or client-side sort by timestamp/title?)
- **Max results rendered:** all returned posts after filtering (Limit=100 is fixed at API level)

### Step 4 — Card Template & Rendering
- **Template selector:** `[data-search-card]` — first matching element in DOM, cloned via `cloneNode(true)`, then hidden/removed from DOM before rendering
- **Fields mapped per clone:**
  | JSON field | DOM target inside card | Method |
  |---|---|---|
  | `/news/{slug}` | `[data-search-url]` inside card | `setAttribute("href", ...)` |
  | `featuredImageBig` (fallback: `featuredImageSmall`) | `[data-search-image]` inside card | `setAttribute("src", ...)` |
  | `title` | `[data-search-title]` inside card | `textContent` |
  | `cat` | `[data-search-cat]` inside card | `textContent` |
- **Container:** `[data-search-grid]` — cloned cards appended here
- **Template handling:** template card removed from DOM before first render; clones injected fresh each page render

### Step 5 — Pagination
- **Strategy:** client-side slice of the filtered results array
- **Results per page:** TBD
- **Selectors:** TBD (`[data-search-prev]`, `[data-search-next]`, `[data-search-page]`?)
- **On page change:** clear grid, re-clone and inject current page's slice, scroll to top of `[data-search-grid]`
- **Implementation reference:** mirrors `script.js:190–228` pattern (MutationObserver not needed here since we control injection directly)

### Step 6 — Entry Animation
- **SKIPPED for now** — to be added later

---

```


## Assistant

Good, plan updated. Two open items I need from you before we can lock step 3 and 5:

**Step 3 — Filter & Sort:**
- Are there any `cat` values (or other fields like `isFeatured`, `tags`) that should be **excluded** from the results?
- Should results stay in API order, or do you want client-side sorting (e.g. newest first by `timestamp`)?

**Step 5 — Pagination:**
- How many results per page?
- What are the selector names for the prev/next buttons and the page indicator? (e.g. `[data-search-prev]`, `[data-search-next]`, `[data-search-page]`) — or do you have a preferred naming convention?

## User

actually eveyrhting escepte the ones i told you about for attr arent needd to render the dom elemtn, howevewr we will use a key map fo r the ct, and the tiemstamp togetehr to filter out certaina rticels and then sort on decending order of tiemstamp for teh cards (so thw enwst card always occurs first).

the logic is that in [@category.json](file:///home/austinjxseph/GitHub/shoreditchdesign/brochuresite/category.json) , you ahve 6 possible values for the cat: field from the api. out of this, we need filter out any articels alder than 59 days for 2,3,4 - can include 1 5 and 6 as is.

youll cehck this by comapring system time and the timestamp, and then using it to calcuate what that minus 59 days looks like. these artitlces will be omitted from the rendered dom., for reference these are called UpdateCategories.

use the trip top map the types, adn use a fucntion to fitlere these out before the rest are passed own to rendfer the dom. and again, whislt rendering the dom, we need to sort using tim,estamp, newst first.

## Assistant

Got it. Let me update the plan with the full filter/sort logic.

**Tool Call: Edit /home/austinjxseph/.claude/plans/floating-finding-toast.md**
Status: Completed

Diff: /home/austinjxseph/.claude/plans/floating-finding-toast.md
```
  ```
- **Image logic:** use `featuredImageBig` as `src`; fall back to `featuredImageSmall` if big is unavailable (null/empty)
- **URL construction:** `/news/{slug}`
- **Category map (from category.json):**
  ```
  1 → "General News"      (include always)
  2 → "Availability"      (UpdateCategory — filter by age)
  3 → "Bunkering Info"    (UpdateCategory — filter by age)
  4 → "Fuel Quality"      (UpdateCategory — filter by age)
  5 → "Regulations"       (include always)
  6 → "Alternative Fuels" (include always)
  ```
- **Filter logic:**
  - Define `UPDATE_CATEGORIES = ["Availability", "Bunkering Info", "Fuel Quality"]`
  - Compute `cutoff = Date.now() - 59 * 24 * 60 * 60 * 1000`
  - For each post: if `post.cat` is in `UPDATE_CATEGORIES` AND `new Date(post.timestamp) < cutoff` → **exclude**
  - All other posts → **include**
  - Encapsulate in a pure `filterPosts(posts)` function
- **Sort logic:** after filtering, sort descending by `timestamp` (newest first) — `posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))`
- **Max results rendered:** all returned posts after filtering (Limit=100 is fixed at API level)

### Step 4 — Card Template & Rendering
```


## Assistant

Good. Now the two remaining open items — pagination selectors and results per page. What are they?

## User

okay, is there a oagiantion logic already available in the [@script.js](file:///home/austinjxseph/GitHub/shoreditchdesign/brochuresite/script.js) file? if not we will need to set one up. just lsiten for a click on data-load-more and render the next x number of articles, like loadmore butto - use a cosntant decalred at the tope to define what this nubemr is. default is 20 for now.

## Assistant

The existing `checkPagination()` in `script.js` is a MutationObserver that reacts to Finsweet CMS adding nodes — it's not reusable for our case since we control injection ourselves. And `checkLoadMore()` is purely an animation hook for newly added nodes, not a pagination controller either.

So we need our own load-more logic in `search.js`. Let me update the plan.

**Tool Call: Edit /home/austinjxseph/.claude/plans/floating-finding-toast.md**
Status: Completed

Diff: /home/austinjxseph/.claude/plans/floating-finding-toast.md
```
- **Container:** `[data-search-grid]` — cloned cards appended here
- **Template handling:** template card removed from DOM before first render; clones injected fresh each page render

### Step 5 — Pagination (Load More)
- **Strategy:** client-side "load more" — render first `PAGE_SIZE` results, append next `PAGE_SIZE` on each button click
- **Constant:** `const PAGE_SIZE = 20;` declared at top of file
- **State:** `let renderedCount = 0;` tracks how many cards are currently in the DOM
- **Selector:** `[data-search-load]` — click listener on this button
- **On initial render:** inject first `PAGE_SIZE` cards, hide button if total results ≤ PAGE_SIZE
- **On button click:** append next `PAGE_SIZE` cards (from `renderedCount` onwards); hide button when `renderedCount >= filteredResults.length`
- **No existing reusable logic** — `script.js:checkPagination()` is a Finsweet CMS MutationObserver (not applicable); `script.js:checkLoadMore()` is an animation hook only. New logic written entirely in `search.js`.

### Step 6 — Entry Animation
- **SKIPPED for now** — to be added later
```


## Assistant

Plan is now fully specced. Let me do a final read to confirm everything is clean before we present it.

**Tool Call: Read /home/austinjxseph/.claude/plans/floating-finding-toast.md**
Status: Completed

```
     1→# search.js — Implementation Plan
     2→
     3→> **Status:** Spec in progress. User will detail each step sequentially.
     4→
     5→---
     6→
     7→## Context
     8→
     9→`search.js` is a new standalone module for the brochuresite that powers a search results page. It must:
    10→1. Extract query params from the URL
    11→2. Fetch a JSON response from an API
    12→3. Parse and filter the response based on metadata fields
    13→4. Clone a sample card from the DOM as a template and render dynamic HTML for each result
    14→5. Initialise pagination
    15→6. Animate cards in one-by-one using a stagger pattern once the DOM is ready
    16→
    17→It follows the same conventions as the rest of the codebase:
    18→- `data-*` attribute selectors throughout (no class selectors for JS hooks)
    19→- GSAP for all animations (already loaded globally on the page)
    20→- `document.addEventListener("DOMContentLoaded", fn)` as the init wrapper
    21→- Pattern: set → to with stagger, `ease: "power2.out"`, duration ~0.8s, stagger ~0.15s
    22→- Expose reusable helpers on `window` if needed
    23→- Try/catch error boundaries around fetch and animation blocks
    24→- Guard rails: early return if required DOM elements are absent
    25→
    26→---
    27→
    28→## Codebase Conventions (Reference)
    29→
    30→| Pattern | Source |
    31→|---|---|
    32→| URL param parsing | `script.js:238–255` — `currentUrl.match(/[?&]query=([^&]+)/)` |
    33→| Card fade-in | `script.js:91–103` — `gsap.set(cards, {opacity:0})` → `gsap.to(cards, {opacity:1, ...})` |
    34→| Stagger on new items | `script.js:349–454` — `gsap.set(newChildren, {opacity:0, y:5})` → animate with `stagger:0.15` |
    35→| MutationObserver | `script.js:196–213` — observe grid childList for pagination |
    36→| Load-more fallback | `script.js:216–227` — 500ms setTimeout click fallback |
    37→| Global `window.*` helpers | `motion.js` — `window.arrayAnimator`, `window.staggerAnimator`, etc. |
    38→| Error boundary | `motion.js:89–123` — try/catch with `console.error(...)` |
    39→| DOM guard | `script.js:232` — early return if selector returns nothing |
    40→
    41→---
    42→
    43→## Spec
    44→
    45→### Step 1 — URL Parameter Extraction
    46→- **Param:** `query` — extracted via `URLSearchParams` or regex match on `window.location.href`
    47→- **Display selector:** `[data-search-query]` — already handled by `script.js:238–255`, no duplication needed here
    48→- **Usage in search.js:** used solely to build the API request URL
    49→
    50→### Step 2 — API Fetch
    51→- **Endpoint:** `https://feeds.engine.online/api/EngineNews/SearchPosts`
    52→- **Params:** `?searchTerm={query}&Limit=100&Page=1` — Limit and Page are fixed
    53→- **Method:** GET
    54→- **Auth / headers:** none (public endpoint)
    55→- **Error handling:** try/catch; on failure show `[data-search-empty]` element
    56→
    57→### Step 3 — Parse & Filter Response
    58→- **JSON shape (from test.json):**
    59→  ```json
    60→  {
    61→    "posts": [ { "featuredImageSmall", "featuredImageBig", "desc", "slug", "postId", "cat", "color", "timestamp", "title", "tags", "isFeatured" } ],
    62→    "totalRecords": N,
    63→    "totalPages": N
    64→  }
    65→  ```
    66→- **Image logic:** use `featuredImageBig` as `src`; fall back to `featuredImageSmall` if big is unavailable (null/empty)
    67→- **URL construction:** `/news/{slug}`
    68→- **Category map (from category.json):**
    69→  ```
    70→  1 → "General News"      (include always)
    71→  2 → "Availability"      (UpdateCategory — filter by age)
    72→  3 → "Bunkering Info"    (UpdateCategory — filter by age)
    73→  4 → "Fuel Quality"      (UpdateCategory — filter by age)
    74→  5 → "Regulations"       (include always)
    75→  6 → "Alternative Fuels" (include always)
    76→  ```
    77→- **Filter logic:**
    78→  - Define `UPDATE_CATEGORIES = ["Availability", "Bunkering Info", "Fuel Quality"]`
    79→  - Compute `cutoff = Date.now() - 59 * 24 * 60 * 60 * 1000`
    80→  - For each post: if `post.cat` is in `UPDATE_CATEGORIES` AND `new Date(post.timestamp) < cutoff` → **exclude**
    81→  - All other posts → **include**
    82→  - Encapsulate in a pure `filterPosts(posts)` function
    83→- **Sort logic:** after filtering, sort descending by `timestamp` (newest first) — `posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))`
    84→- **Max results rendered:** all returned posts after filtering (Limit=100 is fixed at API level)
    85→
    86→### Step 4 — Card Template & Rendering
    87→- **Template selector:** `[data-search-card]` — first matching element in DOM, cloned via `cloneNode(true)`, then hidden/removed from DOM before rendering
    88→- **Fields mapped per clone:**
    89→  | JSON field | DOM target inside card | Method |
    90→  |---|---|---|
    91→  | `/news/{slug}` | `[data-search-url]` inside card | `setAttribute("href", ...)` |
    92→  | `featuredImageBig` (fallback: `featuredImageSmall`) | `[data-search-image]` inside card | `setAttribute("src", ...)` |
    93→  | `title` | `[data-search-title]` inside card | `textContent` |
    94→  | `cat` | `[data-search-cat]` inside card | `textContent` |
    95→- **Container:** `[data-search-grid]` — cloned cards appended here
    96→- **Template handling:** template card removed from DOM before first render; clones injected fresh each page render
    97→
    98→### Step 5 — Pagination (Load More)
    99→- **Strategy:** client-side "load more" — render first `PAGE_SIZE` results, append next `PAGE_SIZE` on each button click
   100→- **Constant:** `const PAGE_SIZE = 20;` declared at top of file
   101→- **State:** `let renderedCount = 0;` tracks how many cards are currently in the DOM
   102→- **Selector:** `[data-search-load]` — click listener on this button
   103→- **On initial render:** inject first `PAGE_SIZE` cards, hide button if total results ≤ PAGE_SIZE
   104→- **On button click:** append next `PAGE_SIZE` cards (from `renderedCount` onwards); hide button when `renderedCount >= filteredResults.length`
   105→- **No existing reusable logic** — `script.js:checkPagination()` is a Finsweet CMS MutationObserver (not applicable); `script.js:checkLoadMore()` is an animation hook only. New logic written entirely in `search.js`.
   106→
   107→### Step 6 — Entry Animation
   108→- **SKIPPED for now** — to be added later
   109→
   110→---
   111→
   112→## File to Create
   113→
   114→`/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js`
   115→
   116→---
   117→
   118→## Verification
   119→
   120→- Load search page with `?query=test` (and any other required params) in browser
   121→- Confirm query display element shows decoded term
   122→- Confirm API call fires and results render as cards
   123→- Confirm filtered items are excluded
   124→- Confirm pagination controls work and card count per page is correct
   125→- Confirm stagger animation fires on initial load and on page change
   126→- Confirm empty/error states display correctly when no results or API fails
   127→

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

**Tool Call: Edit /home/austinjxseph/.claude/plans/floating-finding-toast.md**
Status: Completed

Diff: /home/austinjxseph/.claude/plans/floating-finding-toast.md
```
# search.js — Implementation Plan

> **Status:** Spec complete. Ready for implementation.

---

```


## Assistant

Plan is complete and clean. Here's a quick summary of what's locked in:

**Step 1** — Extract `?query=` from URL, use it only to build the API request (display already handled by `script.js`)

**Step 2** — GET `https://feeds.engine.online/api/EngineNews/SearchPosts?searchTerm={query}&Limit=100&Page=1`, no auth, show `[data-search-empty]` on failure

**Step 3** — Filter: exclude posts where `cat` is Availability / Bunkering Info / Fuel Quality AND older than 59 days. Sort: descending by `timestamp`. Pure `filterPosts()` function.

**Step 4** — Clone `[data-search-card]` from DOM as template, strip it, inject per-post clones into `[data-search-grid]`, mapping `[data-search-url]` / `[data-search-image]` / `[data-search-title]` / `[data-search-cat]`

**Step 5** — `const PAGE_SIZE = 20` at top, `[data-search-load]` click appends next batch, button hides when exhausted

**Step 6** — Skipped for now

**Constants at top of file:** `PAGE_SIZE = 20`, `UPDATE_CATEGORIES`, `API_BASE`

Ready to hand off to an implementation agent?

**Tool Call: Exited Plan Mode**
Status: Completed

User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: /home/austinjxseph/.claude/plans/floating-finding-toast.md
You can refer back to it if needed during implementation.

## Approved Plan:
# search.js — Implementation Plan

> **Status:** Spec complete. Ready for implementation.

---

## Context

`search.js` is a new standalone module for the brochuresite that powers a search results page. It must:
1. Extract query params from the URL
2. Fetch a JSON response from an API
3. Parse and filter the response based on metadata fields
4. Clone a sample card from the DOM as a template and render dynamic HTML for each result
5. Initialise pagination
6. Animate cards in one-by-one using a stagger pattern once the DOM is ready

It follows the same conventions as the rest of the codebase:
- `data-*` attribute selectors throughout (no class selectors for JS hooks)
- GSAP for all animations (already loaded globally on the page)
- `document.addEventListener("DOMContentLoaded", fn)` as the init wrapper
- Pattern: set → to with stagger, `ease: "power2.out"`, duration ~0.8s, stagger ~0.15s
- Expose reusable helpers on `window` if needed
- Try/catch error boundaries around fetch and animation blocks
- Guard rails: early return if required DOM elements are absent

---

## Codebase Conventions (Reference)

| Pattern | Source |
|---|---|
| URL param parsing | `script.js:238–255` — `currentUrl.match(/[?&]query=([^&]+)/)` |
| Card fade-in | `script.js:91–103` — `gsap.set(cards, {opacity:0})` → `gsap.to(cards, {opacity:1, ...})` |
| Stagger on new items | `script.js:349–454` — `gsap.set(newChildren, {opacity:0, y:5})` → animate with `stagger:0.15` |
| MutationObserver | `script.js:196–213` — observe grid childList for pagination |
| Load-more fallback | `script.js:216–227` — 500ms setTimeout click fallback |
| Global `window.*` helpers | `motion.js` — `window.arrayAnimator`, `window.staggerAnimator`, etc. |
| Error boundary | `motion.js:89–123` — try/catch with `console.error(...)` |
| DOM guard | `script.js:232` — early return if selector returns nothing |

---

## Spec

### Step 1 — URL Parameter Extraction
- **Param:** `query` — extracted via `URLSearchParams` or regex match on `window.location.href`
- **Display selector:** `[data-search-query]` — already handled by `script.js:238–255`, no duplication needed here
- **Usage in search.js:** used solely to build the API request URL

### Step 2 — API Fetch
- **Endpoint:** `https://feeds.engine.online/api/EngineNews/SearchPosts`
- **Params:** `?searchTerm={query}&Limit=100&Page=1` — Limit and Page are fixed
- **Method:** GET
- **Auth / headers:** none (public endpoint)
- **Error handling:** try/catch; on failure show `[data-search-empty]` element

### Step 3 — Parse & Filter Response
- **JSON shape (from test.json):**
  ```json
  {
    "posts": [ { "featuredImageSmall", "featuredImageBig", "desc", "slug", "postId", "cat", "color", "timestamp", "title", "tags", "isFeatured" } ],
    "totalRecords": N,
    "totalPages": N
  }
  ```
- **Image logic:** use `featuredImageBig` as `src`; fall back to `featuredImageSmall` if big is unavailable (null/empty)
- **URL construction:** `/news/{slug}`
- **Category map (from category.json):**
  ```
  1 → "General News"      (include always)
  2 → "Availability"      (UpdateCategory — filter by age)
  3 → "Bunkering Info"    (UpdateCategory — filter by age)
  4 → "Fuel Quality"      (UpdateCategory — filter by age)
  5 → "Regulations"       (include always)
  6 → "Alternative Fuels" (include always)
  ```
- **Filter logic:**
  - Define `UPDATE_CATEGORIES = ["Availability", "Bunkering Info", "Fuel Quality"]`
  - Compute `cutoff = Date.now() - 59 * 24 * 60 * 60 * 1000`
  - For each post: if `post.cat` is in `UPDATE_CATEGORIES` AND `new Date(post.timestamp) < cutoff` → **exclude**
  - All other posts → **include**
  - Encapsulate in a pure `filterPosts(posts)` function
- **Sort logic:** after filtering, sort descending by `timestamp` (newest first) — `posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))`
- **Max results rendered:** all returned posts after filtering (Limit=100 is fixed at API level)

### Step 4 — Card Template & Rendering
- **Template selector:** `[data-search-card]` — first matching element in DOM, cloned via `cloneNode(true)`, then hidden/removed from DOM before rendering
- **Fields mapped per clone:**
  | JSON field | DOM target inside card | Method |
  |---|---|---|
  | `/news/{slug}` | `[data-search-url]` inside card | `setAttribute("href", ...)` |
  | `featuredImageBig` (fallback: `featuredImageSmall`) | `[data-search-image]` inside card | `setAttribute("src", ...)` |
  | `title` | `[data-search-title]` inside card | `textContent` |
  | `cat` | `[data-search-cat]` inside card | `textContent` |
- **Container:** `[data-search-grid]` — cloned cards appended here
- **Template handling:** template card removed from DOM before first render; clones injected fresh each page render

### Step 5 — Pagination (Load More)
- **Strategy:** client-side "load more" — render first `PAGE_SIZE` results, append next `PAGE_SIZE` on each button click
- **Constant:** `const PAGE_SIZE = 20;` declared at top of file
- **State:** `let renderedCount = 0;` tracks how many cards are currently in the DOM
- **Selector:** `[data-search-load]` — click listener on this button
- **On initial render:** inject first `PAGE_SIZE` cards, hide button if total results ≤ PAGE_SIZE
- **On button click:** append next `PAGE_SIZE` cards (from `renderedCount` onwards); hide button when `renderedCount >= filteredResults.length`
- **No existing reusable logic** — `script.js:checkPagination()` is a Finsweet CMS MutationObserver (not applicable); `script.js:checkLoadMore()` is an animation hook only. New logic written entirely in `search.js`.

### Step 6 — Entry Animation
- **SKIPPED for now** — to be added later

---

## File to Create

`/home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js`

---

## Verification

- Load search page with `?query=test` (and any other required params) in browser
- Confirm query display element shows decoded term
- Confirm API call fires and results render as cards
- Confirm filtered items are excluded
- Confirm pagination controls work and card count per page is correct
- Confirm stagger animation fires on initial load and on page change
- Confirm empty/error states display correctly when no results or API fails


**Tool Call: Write /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js**
Status: Failed

```
<tool_use_error>File has not been read yet. Read it first before writing to it.</tool_use_error>
```

**Tool Call: Read /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js**
Status: Completed

```
<system-reminder>Warning: the file exists but is shorter than the provided offset (1). The file has 1 lines.</system-reminder>
```

**Tool Call: Write /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js**
Status: Completed

Diff: /home/austinjxseph/GitHub/shoreditchdesign/brochuresite/search.js
```
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
  const emptyEl = document.querySelector("[data-search-empty]");

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
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    return posts.filter((post) => {
      if (UPDATE_CATEGORIES.includes(post.cat)) {
        return new Date(post.timestamp).getTime() >= cutoff;
      }
      return true;
    });
  }

  function sortPosts(posts) {
    return posts.slice().sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  function buildCard(post) {
    const card = template.cloneNode(true);

    const urlEl = card.querySelector("[data-search-url]");
    const imgEl = card.querySelector("[data-search-image]");
    const titleEl = card.querySelector("[data-search-title]");
    const catEl = card.querySelector("[data-search-cat]");

    if (urlEl) urlEl.setAttribute("href", "/news/" + post.slug);
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
    if (!loadBtn) return;
    if (renderedCount >= filteredPosts.length) {
      loadBtn.style.display = "none";
    } else {
      loadBtn.style.display = "";
    }
  }

  function showEmpty() {
    if (emptyEl) emptyEl.style.display = "";
    if (loadBtn) loadBtn.style.display = "none";
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

```


## Assistant

Done. Here's what was written in `search.js`:

**Constants at top** — `PAGE_SIZE`, `API_BASE`, `UPDATE_CATEGORIES`, `MAX_AGE_DAYS`

**Flow:**
1. `DOMContentLoaded` wrapper, guards on `[data-search-grid]` and `[data-search-card]` — exits early if either is absent
2. Template card is immediately `.remove()`d from the DOM after being saved as a clone source
3. `getQuery()` — regex extracts `?query=` from the URL
4. `filterPosts()` — excludes UpdateCategory posts older than 59 days
5. `sortPosts()` — descending by `timestamp`
6. `buildCard()` — deep-clones template, populates `[data-search-url]`, `[data-search-image]` (big → small fallback), `[data-search-title]`, `[data-search-cat]`
7. First 20 cards rendered on init; `[data-search-load]` click appends next batch; button auto-hides when exhausted
8. `[data-search-empty]` shown on empty results, no query, or fetch failure
