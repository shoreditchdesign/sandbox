# Pure GSAP Card Stacking Implementation Plan

## Overview
Adapt the reference toast animation pattern to work with the reviews cards, using GSAP timeline exclusively for smooth card stacking animations. **Swiper will be commented out** to avoid library conflicts.

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

### Key Code Pattern
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

## Adaptation for Reviews Cards

### Requirements
- **3 visible cards** with decreasing scale/opacity
- **Hidden cards** completely invisible (not in DOM view)
- **Button-triggered** navigation (not auto-play)
- **Smooth transitions** between states
- **Scalable** for any number of cards
- **No Swiper dependency** - pure GSAP solution

### State Definitions

#### State 1: Active Card
- `scale: 1`
- `opacity: 1`
- `y: 0`
- `visibility: 'visible'`
- `zIndex: highest`

#### State 2: Next Card
- `scale: 0.95`
- `opacity: 0.6`
- `y: 0`
- `visibility: 'visible'`
- `zIndex: high`

#### State 3: Third Card
- `scale: 0.9`
- `opacity: 0.4`
- `y: 0`
- `visibility: 'visible'`
- `zIndex: medium`

#### State 4: Hidden/Exit
- `opacity: 0`
- `visibility: 'hidden'`
- `y: 0` (reset)
- `scale: 0.9` (maintain for loop continuity)

### Implementation Steps

#### 1. Timeline Construction (in `init` event)
```javascript
const slides = this.slides;
const duration = 0.5;
const cardsPerView = 3;

const tl = gsap.timeline({
  paused: true,
  defaults: { duration: duration, ease: "power2.out" }
});

let activeIndex = -1;
let zIndex = 99999;

for (let i = 0; i < slides.length + cardsPerView; i++) {
  activeIndex++;
  if (activeIndex === slides.length) activeIndex = 0;
  const slide = slides[activeIndex];
  zIndex--;

  // Calculate timeline position for this iteration
  const timePos = i * duration;

  // State 1: Set as active
  tl.set(slide, {
    scale: 1,
    opacity: 1,
    y: 0,
    visibility: 'visible',
    zIndex: zIndex
  }, timePos);

  // State 2: Transition to next
  tl.to(slide, {
    scale: 0.95,
    opacity: 0.6
  }, timePos + duration);

  // State 3: Transition to third
  tl.to(slide, {
    scale: 0.9,
    opacity: 0.4
  }, timePos + (duration * 2));

  // State 4: Hide
  tl.to(slide, {
    opacity: 0,
    visibility: 'hidden'
  }, timePos + (duration * 3));
}
```

#### 2. Store Timeline Reference
```javascript
this.gsapTimeline = tl;
this.currentTimelineStep = 0;
this.stepDuration = duration;
```

#### 3. Set Initial Position
Show first 3 cards by seeking to correct timeline position:
```javascript
// Seek to position where cards 0, 1, 2 are in active/next/third states
tl.seek(cardsPerView * duration);
```

#### 4. Navigation Handler (in Swiper events)

##### For Next Button (`slideChange` event):
```javascript
slideChange: function() {
  if (!this.gsapTimeline) return;

  this.currentTimelineStep++;
  const targetTime = this.currentTimelineStep * this.stepDuration;

  // Animate timeline forward
  gsap.to(this.gsapTimeline, {
    time: targetTime,
    duration: this.stepDuration,
    ease: "power2.out"
  });
}
```

##### For Prev Button (if needed):
```javascript
// Decrement step and seek backwards
this.currentTimelineStep--;
const targetTime = this.currentTimelineStep * this.stepDuration;

gsap.to(this.gsapTimeline, {
  time: targetTime,
  duration: this.stepDuration,
  ease: "power2.out"
});
```

### Configuration Values

| Setting | Value | Reason |
|---------|-------|--------|
| `duration` | `0.5` | Matches reference, smooth but not too slow |
| `ease` | `"power2.out"` | Smooth deceleration |
| `cardsPerView` | `3` | Show active + 2 stacked cards |
| Starting zIndex | `99999` | Decrements to maintain proper layering |

### Edge Cases Handled

1. **Loop continuity**: Timeline includes `slides.length + cardsPerView` iterations
2. **Index wrapping**: `if (activeIndex === slides.length) activeIndex = 0`
3. **Initial state**: Seek to correct position on init
4. **Hidden cards**: Set `visibility: 'hidden'` and `opacity: 0`
5. **Z-index management**: Decrements for each iteration to maintain stacking order

### Swiper Configuration

Keep existing config with these key settings:
- `speed: 0` (GSAP handles all animation)
- `allowTouchMove: false` (button-only navigation)
- `loop: true` (Swiper tracks position, GSAP shows visuals)

### Testing Checklist

- [ ] All slides cycle through correctly
- [ ] Only 3 cards visible at any time
- [ ] Scale and opacity transitions are smooth
- [ ] Hidden cards are completely invisible
- [ ] Loop works seamlessly (last → first card)
- [ ] Z-index stacking looks correct
- [ ] Works with different numbers of slides (4, 5, 6, 10, etc.)
- [ ] Prev/Next buttons both work correctly
- [ ] No visual glitches on rapid clicking

### File to Modify

**Path**: `/Users/austinjoseph/Documents/GitHub/sandbox/engine/ix.js`
**Lines**: 594-612 (Swiper initialization)
**Changes**: Add timeline construction in `init` event, animation trigger in `slideChange` event

## Notes

- Remove the 24px translateY exit animation requirement
- Keep all hidden cards at `y: 0`
- Only visible state difference is scale and opacity
- Timeline approach allows for easy timing adjustments
- All cards get animated, solution scales automatically
