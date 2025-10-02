# Pure GSAP Card Stacking Implementation Plan

## Overview
Adapt the reference toast animation pattern using **pure GSAP** for reviews cards. **Swiper will be commented out** to avoid library conflicts and complexity.

## Reference Animation Analysis

### Key Mechanics
- **Timeline-based**: Single GSAP timeline with all card states pre-built
- **4 States per card**:
  1. Active: `scale: 1, yPercent: 0, opacity: 1`
  2. Next: `scale: 1.1, yPercent: -30, opacity: 1`
  3. Third: `scale: 1.2, yPercent: -60, opacity: 1`
  4. Exit: `scale: 1.3, yPercent: -90, opacity: 0`
- **Position parameter**: Uses `i * dd` (duration + delay) to position each state in timeline
- **Loop logic**: Iterates `items.length + cardsPerView` times to create seamless loop

### Key Code Pattern from Reference
```javascript
for (let i = 0; i < items.length + cardsPerView; i++) {
    activeIndex++;
    if (activeIndex === items.length) activeIndex = 0;
    const item = items[activeIndex];
    
    tl.set(item, { /* state 1 */ }, i * dd);
    tl.to(item, { /* state 2 */ }, "<" + dd);
    tl.to(item, { /* state 3 */ }, "<" + dd);
    tl.to(item, { /* state 4 */ }, "<" + dd);
}
```

## Pure GSAP Adaptation

### Requirements
- **3 visible cards** with decreasing scale/opacity
- **Hidden cards** completely invisible
- **Button-triggered** navigation (not auto-play)
- **Smooth transitions** between states
- **Scalable** for any number of cards
- **No Swiper** - pure GSAP solution

### State Definitions

#### State 1: Active Card
- `scale: 1`
- `opacity: 1`
- `visibility: 'visible'`
- `zIndex: highest`

#### State 2: Next Card
- `scale: 0.95`
- `opacity: 0.6`
- `visibility: 'visible'`
- `zIndex: high`

#### State 3: Third Card
- `scale: 0.9`
- `opacity: 0.4`
- `visibility: 'visible'`
- `zIndex: medium`

#### State 4: Hidden/Exit
- `opacity: 0`
- `visibility: 'hidden'`
- `scale: 0.9` (reset for loop)

## Complete Implementation (Using Data Attributes)

```javascript
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing GSAP card stacking");

  // Query elements using data attributes
  const wrapper = document.querySelector("[data-cards-wrapper]");
  if (!wrapper) {
    console.error("Card wrapper not found");
    return;
  }

  const cards = wrapper.querySelectorAll("[data-card-item]");
  const nextButton = document.querySelector("[data-card-next]");
  const prevButton = document.querySelector("[data-card-prev]");

  console.log("Cards found:", cards.length);
  console.log("Next button:", nextButton);
  console.log("Prev button:", prevButton);

  if (cards.length === 0) {
    console.error("No cards found");
    return;
  }

  // Configuration
  const duration = 0.5;
  const cardsPerView = 3;

  // Create timeline
  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: duration, ease: "power2.out" }
  });

  let activeIndex = -1;
  let zIndex = 99999;

  // Build timeline with all card states
  for (let i = 0; i < cards.length + cardsPerView; i++) {
    activeIndex++;
    if (activeIndex === cards.length) activeIndex = 0;
    const card = cards[activeIndex];
    zIndex--;

    const timePos = i * duration;

    // State 1: Active
    tl.set(card, {
      scale: 1,
      opacity: 1,
      visibility: 'visible',
      zIndex: zIndex
    }, timePos);

    // State 2: Next
    tl.to(card, {
      scale: 0.95,
      opacity: 0.6
    }, timePos + duration);

    // State 3: Third
    tl.to(card, {
      scale: 0.9,
      opacity: 0.4
    }, timePos + (duration * 2));

    // State 4: Hidden
    tl.to(card, {
      opacity: 0,
      visibility: 'hidden'
    }, timePos + (duration * 3));
  }

  // Set initial position (show first 3 cards)
  let currentStep = 0;
  tl.seek(cardsPerView * duration);

  console.log("Timeline created, duration:", tl.duration());

  // Next button handler
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      console.log("Next clicked, step:", currentStep);
      currentStep++;
      const targetTime = (currentStep + cardsPerView) * duration;

      gsap.to(tl, {
        time: targetTime,
        duration: duration,
        ease: "power2.out"
      });
    });
  }

  // Prev button handler
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      console.log("Prev clicked, step:", currentStep);
      currentStep--;
      const targetTime = (currentStep + cardsPerView) * duration;

      gsap.to(tl, {
        time: targetTime,
        duration: duration,
        ease: "power2.out"
      });
    });
  }
});
```

## HTML Structure with Data Attributes

```html
<!-- Wrapper container -->
<div data-cards-wrapper>
  <!-- Individual cards -->
  <div data-card-item>Card 1 content</div>
  <div data-card-item>Card 2 content</div>
  <div data-card-item>Card 3 content</div>
  <div data-card-item>Card 4 content</div>
  <!-- etc. -->
</div>

<!-- Navigation buttons -->
<button data-card-prev>Previous</button>
<button data-card-next>Next</button>
```

## CSS Requirements

Cards need absolute positioning for stacking:

```css
[data-cards-wrapper] {
  position: relative;
  /* Set height to card height */
  height: 400px; /* Adjust as needed */
}

[data-card-item] {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  transform-origin: center center;
}
```

## Configuration Values

| Setting | Value | Reason |
|---------|-------|--------|
| `duration` | `0.5` | Matches reference |
| `ease` | `"power2.out"` | Smooth deceleration |
| `cardsPerView` | `3` | Show active + 2 stacked |
| Starting zIndex | `99999` | Proper layering |

## Edge Cases Handled

1. **Loop continuity**: Timeline includes `cards.length + cardsPerView` iterations
2. **Index wrapping**: `if (activeIndex === cards.length) activeIndex = 0`
3. **Initial state**: Seek to `cardsPerView * duration` on load
4. **Hidden cards**: `visibility: 'hidden'` and `opacity: 0`
5. **Z-index management**: Decrements for proper stacking

## Swiper Removal

Comment out the entire Swiper initialization block in `ix.js` (lines 594-624):

```javascript
/*
const swiper = new Swiper("#reviews-swiper", {
  // ... entire config
});
*/

// Also comment out resize handler
/*
window.addEventListener("resize", () => {
  // ...
});
*/
```

## Testing Checklist

- [ ] All cards cycle through correctly
- [ ] Only 3 cards visible at any time
- [ ] Scale and opacity transitions are smooth
- [ ] Hidden cards are completely invisible
- [ ] Loop works seamlessly (last → first card)
- [ ] Z-index stacking looks correct
- [ ] Works with different numbers of cards
- [ ] Prev/Next buttons both work
- [ ] No conflicts with Swiper (since it's commented out)

## File Changes

**Path**: `/Users/austinjoseph/Documents/GitHub/sandbox/engine/ix.js`  
**Lines**: 570-630 (approximately)  
**Changes**: 
1. Comment out Swiper initialization
2. Replace with pure GSAP implementation above
