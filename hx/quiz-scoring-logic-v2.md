# The Standout Few Quiz - Enhanced Scoring Logic
## Primary × Secondary Archetype Combinations (20 Results)

---

## Overview

This document extends the existing quiz scoring to support **20 unique result combinations** based on Primary and Secondary archetypes.

### Core Principles:
- **5 Archetypes**: Shaper, Refiner, Experimenter, Balancer, Uplifter
- **10 Questions**: Each scores 1 Primary (100% weight) + 1 Secondary (50% weight)
- **20 Combinations**: All possible Primary × Secondary pairs (excluding identical pairs)
- **2 Edge Cases**: Overplay (high intensity) and Neutral (low alignment)

---

## Variables Needed in Tally

### Score Counters (all start at 0):
```
countShaper
countRefiner
countExperimenter
countBalancer
countUplifter
countNeutral
countOverplay
```

### NEW Tracking Variables:
```
maxPrimary          (number, starts at 0)
maxSecondary        (number, starts at 0)
primaryArchetype    (text, empty)
secondaryArchetype  (text, empty)
resultURL           (text, empty) - for redirect target
```

---

## Scoring Per Question (UNCHANGED)

Each question awards points based on answer choice:

| Answer | Points to Primary | Points to Secondary | Special |
|--------|------------------|---------------------|---------|
| A      | 0                | 0                   | Nothing |
| B      | 0                | 0                   | +0.5 to countNeutral |
| C      | +1.0             | +0.5                | — |
| D      | +1.6             | +0.8                | — |
| E      | +1.0             | +0.5                | +1 to countOverplay |

*See tally.md for full question-by-question scoring logic*

---

## NEW: Enhanced Result Calculation Logic

### Step 1: Find Primary Archetype (Highest Score)

```
// Compare all 5 scores to find the winner
When countShaper ≥ countRefiner AND countShaper ≥ countExperimenter AND countShaper ≥ countBalancer AND countShaper ≥ countUplifter
Then
  Calculate → maxPrimary Assign = countShaper
  Calculate → primaryArchetype Assign = "Shaper"

When countRefiner > countShaper AND countRefiner ≥ countExperimenter AND countRefiner ≥ countBalancer AND countRefiner ≥ countUplifter
Then
  Calculate → maxPrimary Assign = countRefiner
  Calculate → primaryArchetype Assign = "Refiner"

When countExperimenter > countShaper AND countExperimenter > countRefiner AND countExperimenter ≥ countBalancer AND countExperimenter ≥ countUplifter
Then
  Calculate → maxPrimary Assign = countExperimenter
  Calculate → primaryArchetype Assign = "Experimenter"

When countBalancer > countShaper AND countBalancer > countRefiner AND countBalancer > countExperimenter AND countBalancer ≥ countUplifter
Then
  Calculate → maxPrimary Assign = countBalancer
  Calculate → primaryArchetype Assign = "Balancer"

When countUplifter > countShaper AND countUplifter > countRefiner AND countUplifter > countExperimenter AND countUplifter > countBalancer
Then
  Calculate → maxPrimary Assign = countUplifter
  Calculate → primaryArchetype Assign = "Uplifter"
```

---

### Step 2: Find Secondary Archetype (2nd Highest Score)

**IMPORTANT:** Secondary must be DIFFERENT from Primary

#### If Primary = Shaper:
```
When primaryArchetype = "Shaper" AND countRefiner ≥ countExperimenter AND countRefiner ≥ countBalancer AND countRefiner ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countRefiner
  Calculate → secondaryArchetype Assign = "Refiner"

When primaryArchetype = "Shaper" AND countExperimenter > countRefiner AND countExperimenter ≥ countBalancer AND countExperimenter ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countExperimenter
  Calculate → secondaryArchetype Assign = "Experimenter"

When primaryArchetype = "Shaper" AND countBalancer > countRefiner AND countBalancer > countExperimenter AND countBalancer ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countBalancer
  Calculate → secondaryArchetype Assign = "Balancer"

When primaryArchetype = "Shaper" AND countUplifter > countRefiner AND countUplifter > countExperimenter AND countUplifter > countBalancer
Then
  Calculate → maxSecondary Assign = countUplifter
  Calculate → secondaryArchetype Assign = "Uplifter"
```

#### If Primary = Refiner:
```
When primaryArchetype = "Refiner" AND countShaper ≥ countExperimenter AND countShaper ≥ countBalancer AND countShaper ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countShaper
  Calculate → secondaryArchetype Assign = "Shaper"

When primaryArchetype = "Refiner" AND countExperimenter > countShaper AND countExperimenter ≥ countBalancer AND countExperimenter ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countExperimenter
  Calculate → secondaryArchetype Assign = "Experimenter"

When primaryArchetype = "Refiner" AND countBalancer > countShaper AND countBalancer > countExperimenter AND countBalancer ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countBalancer
  Calculate → secondaryArchetype Assign = "Balancer"

When primaryArchetype = "Refiner" AND countUplifter > countShaper AND countUplifter > countExperimenter AND countUplifter > countBalancer
Then
  Calculate → maxSecondary Assign = countUplifter
  Calculate → secondaryArchetype Assign = "Uplifter"
```

#### If Primary = Experimenter:
```
When primaryArchetype = "Experimenter" AND countShaper ≥ countRefiner AND countShaper ≥ countBalancer AND countShaper ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countShaper
  Calculate → secondaryArchetype Assign = "Shaper"

When primaryArchetype = "Experimenter" AND countRefiner > countShaper AND countRefiner ≥ countBalancer AND countRefiner ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countRefiner
  Calculate → secondaryArchetype Assign = "Refiner"

When primaryArchetype = "Experimenter" AND countBalancer > countShaper AND countBalancer > countRefiner AND countBalancer ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countBalancer
  Calculate → secondaryArchetype Assign = "Balancer"

When primaryArchetype = "Experimenter" AND countUplifter > countShaper AND countUplifter > countRefiner AND countUplifter > countBalancer
Then
  Calculate → maxSecondary Assign = countUplifter
  Calculate → secondaryArchetype Assign = "Uplifter"
```

#### If Primary = Balancer:
```
When primaryArchetype = "Balancer" AND countShaper ≥ countRefiner AND countShaper ≥ countExperimenter AND countShaper ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countShaper
  Calculate → secondaryArchetype Assign = "Shaper"

When primaryArchetype = "Balancer" AND countRefiner > countShaper AND countRefiner ≥ countExperimenter AND countRefiner ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countRefiner
  Calculate → secondaryArchetype Assign = "Refiner"

When primaryArchetype = "Balancer" AND countExperimenter > countShaper AND countExperimenter > countRefiner AND countExperimenter ≥ countUplifter
Then
  Calculate → maxSecondary Assign = countExperimenter
  Calculate → secondaryArchetype Assign = "Experimenter"

When primaryArchetype = "Balancer" AND countUplifter > countShaper AND countUplifter > countRefiner AND countUplifter > countExperimenter
Then
  Calculate → maxSecondary Assign = countUplifter
  Calculate → secondaryArchetype Assign = "Uplifter"
```

#### If Primary = Uplifter:
```
When primaryArchetype = "Uplifter" AND countShaper ≥ countRefiner AND countShaper ≥ countExperimenter AND countShaper ≥ countBalancer
Then
  Calculate → maxSecondary Assign = countShaper
  Calculate → secondaryArchetype Assign = "Shaper"

When primaryArchetype = "Uplifter" AND countRefiner > countShaper AND countRefiner ≥ countExperimenter AND countRefiner ≥ countBalancer
Then
  Calculate → maxSecondary Assign = countRefiner
  Calculate → secondaryArchetype Assign = "Refiner"

When primaryArchetype = "Uplifter" AND countExperimenter > countShaper AND countExperimenter > countRefiner AND countExperimenter ≥ countBalancer
Then
  Calculate → maxSecondary Assign = countExperimenter
  Calculate → secondaryArchetype Assign = "Experimenter"

When primaryArchetype = "Uplifter" AND countBalancer > countShaper AND countBalancer > countRefiner AND countBalancer > countExperimenter
Then
  Calculate → maxSecondary Assign = countBalancer
  Calculate → secondaryArchetype Assign = "Balancer"
```

---

### Step 3: Redirect Logic (Cascading Priority)

**Priority Order:**
1. Edge cases (Overplay/Neutral) override everything
2. Then cascade through 20 specific primary × secondary combinations

```
// PRIORITY 1: Check for Overplay (≥4 E answers)
When countOverplay ≥ 4
Then Jump to page → /quiz-result/high-intensity

// PRIORITY 2: Check for Neutral (≥2.5 neutral points or very low scores)
When countNeutral ≥ 2.5
Then Jump to page → /quiz-result/neutral

// PRIORITY 3: Cascade through 20 combinations
// Format: /quiz-result/[primary]-[secondary]

// SHAPER PRIMARY (4 combinations)
When primaryArchetype = "Shaper" AND secondaryArchetype = "Refiner"
Then Jump to page → /quiz-result/shaper-refiner

When primaryArchetype = "Shaper" AND secondaryArchetype = "Experimenter"
Then Jump to page → /quiz-result/shaper-experimenter

When primaryArchetype = "Shaper" AND secondaryArchetype = "Balancer"
Then Jump to page → /quiz-result/shaper-balancer

When primaryArchetype = "Shaper" AND secondaryArchetype = "Uplifter"
Then Jump to page → /quiz-result/shaper-uplifter

// REFINER PRIMARY (4 combinations)
When primaryArchetype = "Refiner" AND secondaryArchetype = "Shaper"
Then Jump to page → /quiz-result/refiner-shaper

When primaryArchetype = "Refiner" AND secondaryArchetype = "Experimenter"
Then Jump to page → /quiz-result/refiner-experimenter

When primaryArchetype = "Refiner" AND secondaryArchetype = "Balancer"
Then Jump to page → /quiz-result/refiner-balancer

When primaryArchetype = "Refiner" AND secondaryArchetype = "Uplifter"
Then Jump to page → /quiz-result/refiner-uplifter

// EXPERIMENTER PRIMARY (4 combinations)
When primaryArchetype = "Experimenter" AND secondaryArchetype = "Shaper"
Then Jump to page → /quiz-result/experimenter-shaper

When primaryArchetype = "Experimenter" AND secondaryArchetype = "Refiner"
Then Jump to page → /quiz-result/experimenter-refiner

When primaryArchetype = "Experimenter" AND secondaryArchetype = "Balancer"
Then Jump to page → /quiz-result/experimenter-balancer

When primaryArchetype = "Experimenter" AND secondaryArchetype = "Uplifter"
Then Jump to page → /quiz-result/experimenter-uplifter

// BALANCER PRIMARY (4 combinations)
When primaryArchetype = "Balancer" AND secondaryArchetype = "Shaper"
Then Jump to page → /quiz-result/balancer-shaper

When primaryArchetype = "Balancer" AND secondaryArchetype = "Refiner"
Then Jump to page → /quiz-result/balancer-refiner

When primaryArchetype = "Balancer" AND secondaryArchetype = "Experimenter"
Then Jump to page → /quiz-result/balancer-experimenter

When primaryArchetype = "Balancer" AND secondaryArchetype = "Uplifter"
Then Jump to page → /quiz-result/balancer-uplifter

// UPLIFTER PRIMARY (4 combinations)
When primaryArchetype = "Uplifter" AND secondaryArchetype = "Shaper"
Then Jump to page → /quiz-result/uplifter-shaper

When primaryArchetype = "Uplifter" AND secondaryArchetype = "Refiner"
Then Jump to page → /quiz-result/uplifter-refiner

When primaryArchetype = "Uplifter" AND secondaryArchetype = "Experimenter"
Then Jump to page → /quiz-result/uplifter-experimenter

When primaryArchetype = "Uplifter" AND secondaryArchetype = "Balancer"
Then Jump to page → /quiz-result/uplifter-balancer
```

---

## Result Pages Needed (22 Total)

### Edge Cases (2):
1. `/quiz-result/neutral` - Low alignment result
2. `/quiz-result/high-intensity` - Overplay result

### Primary × Secondary Combinations (20):

#### Shaper Primary (4):
3. `/quiz-result/shaper-refiner`
4. `/quiz-result/shaper-experimenter`
5. `/quiz-result/shaper-balancer`
6. `/quiz-result/shaper-uplifter`

#### Refiner Primary (4):
7. `/quiz-result/refiner-shaper`
8. `/quiz-result/refiner-experimenter`
9. `/quiz-result/refiner-balancer`
10. `/quiz-result/refiner-uplifter`

#### Experimenter Primary (4):
11. `/quiz-result/experimenter-shaper`
12. `/quiz-result/experimenter-refiner`
13. `/quiz-result/experimenter-balancer`
14. `/quiz-result/experimenter-uplifter`

#### Balancer Primary (4):
15. `/quiz-result/balancer-shaper`
16. `/quiz-result/balancer-refiner`
17. `/quiz-result/balancer-experimenter`
18. `/quiz-result/balancer-uplifter`

#### Uplifter Primary (4):
19. `/quiz-result/uplifter-shaper`
20. `/quiz-result/uplifter-refiner`
21. `/quiz-result/uplifter-experimenter`
22. `/quiz-result/uplifter-balancer`

---

## Content Structure for Each Result Page

### Primary × Secondary Result Page Template:

```
HEADLINE:
THE [PRIMARY ARCHETYPE]
with [Secondary Archetype] instincts

SUBHEAD:
You [primary action phrase] — and you do it with [secondary quality].

PRIMARY COPY:
[2-3 paragraphs describing the primary archetype - use existing content from quiz.md]

SECONDARY INSIGHT:
Your secondary style brings [specific quality]. [1-2 sentences on how the secondary complements the primary]

[Use the existing "Secondary" insights from quiz.md Section 4 as starting points]

AT HX:
[How this combination shows up in the work - specific, grounded]

HOW TO USE THIS INSIGHT:
[Practical guidance for leveraging this combination]

CTA:
Explore open roles →
```

---

## Example Result Page Content

### Shaper + Refiner

**Headline:**
THE SHAPER
with Refiner instincts

**Subhead:**
You create movement — and you do it with precision.

**Primary Copy:**
You're the person who sees standstill and starts something. You notice what isn't working, you see where momentum gets stuck, and you act - not recklessly, but with intent. Shapers are often the spark in the room: the ones who start things, unstick things, and help others see what's possible.

You don't wait to be asked. You lean in. You make things real.

**Secondary Insight:**
You bring structure and clarity to your instinct — you help things land with quality. This means you move fast, but you don't break things. Your speed has standards built in.

**At hx:**
Shaper-Refiners help us ship quickly without sacrificing craft. You're the person who can prototype fast, then tighten it before it scales. You keep us moving forward while maintaining the quality that makes work last.

**How to use this insight:**
Own the moments where speed and quality both matter. You're rare because you don't compromise on either.

---

### Experimenter + Balancer

**Headline:**
THE EXPERIMENTER
with Balancer instincts

**Subhead:**
You learn by making — and you do it with judgment.

**Primary Copy:**
Your instinct is to try, build, test, and adapt. You don't get stuck in theory because you know progress comes from contact with reality. Experimenters push boundaries, not for ego, but to learn what works.

You see feedback as fuel, not friction.

**Secondary Insight:**
You bring judgment and perspective; you navigate ambiguity with calm. This means you experiment with purpose, not chaos. You test things, but you listen carefully to what the results are telling you.

**At hx:**
Experimenter-Balancers help us stay curious without losing direction. You're the person who tries new paths but can also tell when it's time to commit. You balance exploration with pragmatism.

**How to use this insight:**
Lead experiments that matter. You have the courage to test new ideas and the wisdom to know which ones deserve commitment.

---

## Implementation Checklist

- [ ] Add new variables to Tally: `maxSecondary`, `secondaryArchetype`, `resultURL`
- [ ] Implement Step 1: Primary archetype calculation (same as current)
- [ ] Implement Step 2: Secondary archetype calculation (NEW - 5 conditional blocks)
- [ ] Implement Step 3: Cascading redirect logic (22 conditions)
- [ ] Create 22 result pages in Webflow/platform
- [ ] Write unique copy for each of 20 primary × secondary combinations
- [ ] Test edge cases (ties, identical scores, minimum scores)
- [ ] Verify all redirect URLs work correctly

---

## Testing Scenarios

### Test Case 1: Clear Winner
**Scenario:** User answers all D for Shaper primary questions, all C for Refiner secondary
**Expected:** Primary = Shaper (3.2), Secondary = Refiner (highest of remaining)
**Redirect:** `/quiz-result/shaper-refiner`

### Test Case 2: Overplay Override
**Scenario:** User answers E for 5+ questions
**Expected:** Overplay triggered regardless of archetype scores
**Redirect:** `/quiz-result/high-intensity`

### Test Case 3: Neutral Override
**Scenario:** User answers mostly B (6+ B answers)
**Expected:** Neutral triggered (countNeutral ≥ 3.0)
**Redirect:** `/quiz-result/neutral`

### Test Case 4: Balanced Scores
**Scenario:** User's scores are close across multiple archetypes
**Expected:** System finds highest, then 2nd highest excluding the first
**Redirect:** Based on whichever two win (e.g., `/quiz-result/balancer-uplifter`)

---

## Notes on Ties

If two archetypes tie for primary, the current logic uses the order of evaluation (Shaper → Refiner → Experimenter → Balancer → Uplifter) to break the tie. This is acceptable behavior as ties are rare with the weighted scoring system (0.5, 1.0, 1.6, etc.).

The same applies to secondary: the evaluation order acts as a tiebreaker.

---

## Scoring Distribution Analysis

Each archetype can receive:
- **Primary contribution:** 2 questions × max 1.6 points = 3.2 points
- **Secondary contribution:** 2 questions × max 0.8 points = 1.6 points  
- **Theoretical maximum per archetype:** 4.8 points (if user maxes out both primary AND secondary appearances)

Realistic scenarios:
- **Strong primary:** 2.4-3.2 points (D answers on primary questions)
- **Clear secondary:** 1.5-2.5 points (points from being secondary in 2 questions + some cross-scoring)
- **Low scorer:** 0.5-1.5 points (mix of B/C answers or appears less in secondary roles)

This distribution makes it very likely users will have a clear 1st and 2nd archetype, supporting the 20-combination model.
