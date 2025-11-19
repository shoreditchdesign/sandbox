# CMS Dictation Feature - Game Plan

## Overview
Create a Framer code override that uses the Web Speech API (Speech Synthesis) to read CMS content aloud with play/pause controls.

## Requirements

### Core Functionality
- Use browser's Web Speech API (SpeechSynthesis) to read content
- Target element: `aria-label="dictation-target"` (contains CMS-mapped content)
- Controller element: `aria-label="dictation-controller"` (play/pause button)
- Page reload resets dictation to beginning (t=0)

### Content Handling
- Read entire content field with natural pausing
- API handles punctuation-based pauses automatically
- Split content by line breaks (`\n` or `<br>`) for paragraph pauses
- No visual feedback/highlighting needed

### Controller Behavior
- Toggle play/pause functionality
- Visual states via Framer component variants:
  - "Playing" variant (when audio is active)
  - "Paused" variant (when stopped or paused)
- Code override switches variants dynamically

### Voice Settings
- Use browser defaults (no custom configuration needed)
- No Framer component properties required

### Edge Cases & Behavior
- **During playback**: Click = Pause (maintains position)
- **When paused**: Click = Resume from current position
- **When finished**: Auto-reset to beginning, next click starts from t=0
- **Multiple clicks**: Toggle behavior (pause if playing, play if paused)

### Constraints
- Single dictation instance per page (no multiple pairs)
- Code override implementation (not a component)

## Implementation Strategy

### 1. File Structure
- Create: `cms-dictation.tsx` in code overrides directory
- Export two override functions:
  - `DictationTarget()` - for content element
  - `DictationController()` - for control button

### 2. State Management
- Use singleton pattern to share state between overrides
- Track:
  - Current playing state (playing/paused/stopped)
  - SpeechSynthesis utterance instance
  - Current position/character index
  - Content to be read

### 3. Speech API Integration
- Initialize `SpeechSynthesisUtterance`
- Handle events:
  - `onend` - Auto-reset when finished
  - `onpause` - Track paused state
  - `onresume` - Track resumed state
  - `onerror` - Handle errors gracefully

### 4. Content Processing
- Extract text from dictation-target element
- Split by line breaks for paragraph handling
- Rejoin with punctuation to ensure natural pauses

### 5. Controller Integration
- Click listener on controller element
- Update Framer variant based on state:
  - Playing → "Playing"
  - Paused/Stopped → "Paused"

## Technical Considerations

### Browser Compatibility
- Web Speech API supported in modern browsers
- Graceful degradation if not supported

### Framer-Specific
- Override must return props object with event handlers
- Variant switching via `variant` prop
- Ensure cleanup on component unmount

### Performance
- Single global state instance
- No memory leaks from event listeners
- Cancel speech on page unload

## Next Steps
1. Draft the code structure
2. Implement state management singleton
3. Create DictationTarget override
4. Create DictationController override
5. Test with Framer CMS content
6. Document variant setup instructions for Framer component

---

## Session Notes

**Status**: Planning phase complete - ready for implementation
**Next Action**: Create `cms-dictation.tsx` file with the code implementation when you return to this

The plan is finalized and all requirements have been discussed. When you revisit this, we'll proceed with coding the override functions.
