# Framer Job Listing Text-to-Speech Override

## Overview
Create a Framer code override that enables text-to-speech playback for job listing content using the browser's native Web Speech API.

## Requirements

### Structure
- Job listing cards contain content marked with aria-label attributes
- Each card has a play button that triggers TTS
- Uses browser's speechSynthesis API (no external dependencies)

### Functionality
- Click play button → reads content aloud
- Click again while playing → stops/pauses speech
- Visual feedback for play/pause states
- Multiple cards can exist but only one speaks at a time

### Technical Specs

**Override type:** Framer code override (TypeScript)

**Target elements:**
- Button element (play control)
- Content container (has aria-label with text to read)

**Aria label pattern:**
```html
<div data-speech-content="true" aria-label="[job description text here]">
  <!-- visible content -->
</div>
<button data-speech-trigger="true">Play</button>
```

**Override behavior:**
1. On button click, find sibling/parent element with `data-speech-content`
2. Extract text from aria-label attribute
3. Use `window.speechSynthesis.speak()` to read text
4. Toggle play/pause state on subsequent clicks
5. Update button text/icon between "Play" and "Pause"

**API methods needed:**
- `speechSynthesis.speak(utterance)`
- `speechSynthesis.cancel()`
- `speechSynthesis.paused` / `speechSynthesis.speaking` (state checks)

### Implementation Notes
- Wrap in DOMContentLoaded
- Add console logs for debugging (voice loading, speech start/end)
- Handle cases where speech API isn't supported
- Clean up: stop other cards' speech when new one starts

### Deliverable
Single TypeScript code override file compatible with Framer's override system.
