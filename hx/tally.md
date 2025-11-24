# The Standout Few Quiz - Tally Implementation Guide

## Quiz Introduction

### **Headline**
You found it.

### **Subhead**
Ten questions. A small experiment in how people think, decide, and build - not unlike how we do things around here.

**Extra copy:**
Our quiz takes about 5 minutes. You might pause on one or two questions - that's the point.

At hx, experiments don't always lead to answers. Sometimes, they just make better questions - or better conversations when we meet.

---

## Disclaimer (Show before quiz starts)

**A quick note before you start:**

This quiz is completely optional, fully anonymous, and has no impact on your application.

We don't collect or track anyone's individual answers - it's just a fun way to help you sense whether hx's pace, expectations, and way of working feel energising to you.

---

## Variables to Create in Tally

**Score Counters (all start at 0):**
- `countShaper`
- `countRefiner`
- `countExperimenter`
- `countBalancer`
- `countUplifter`
- `countNeutral`
- `countOverplay`

**Tracking Variables:**
- `maxPrimary` (start at 0)
- `primaryArchetype` (text field, empty)

---

## The 10 Questions

---

### **Q1: Shaper (Primary) × Balancer (Secondary)**

**You notice a gap slowing the team down, something you believe others can see but no one has taken on yet.**

- **A.** It's best to pause, gather more context without creating noise and then make a suggestion of how to help.
- **B.** I'd flag it in our next team catch-up to see if others think it's worth tackling.
- **C.** I'd share what I'm noticing with my manager and offer a couple of paths we could take.
- **D.** I'd test a small fix myself, share what I learned, and invite others to build on it with me.
- **E.** I'd jump in immediately to generate some kind of progress, and we can refine together later.

#### **Scoring Logic:**
```
When Q1 is A
Then (do nothing)

When Q1 is B
Then Calculate → countNeutral Add +0.5

When Q1 is C
Then 
Calculate → countShaper Add +1
Calculate → countBalancer Add +0.5

When Q1 is D
Then
Calculate → countShaper Add +1.6
Calculate → countBalancer Add +0.8

When Q1 is E
Then
Calculate → countShaper Add +1
Calculate → countBalancer Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q2: Shaper (Primary) × Refiner (Secondary)**

**A project is moving slowly. You see a faster route, but others value the original plan.**

- **A.** I'd stick with the current plan; changing direction mid-flow can confuse people.
- **B.** I'd raise the potential trade-offs and ask if it's worth reconsidering.
- **C.** I'd outline a few options — faster, safer, hybrid — and let the team choose.
- **D.** I'd create a quick version of the faster path so we can compare in real terms.
- **E.** I'd move ahead with the quicker route to generate some momentum.

#### **Scoring Logic:**
```
When Q2 is A
Then (do nothing)

When Q2 is B
Then Calculate → countNeutral Add +0.5

When Q2 is C
Then 
Calculate → countShaper Add +1
Calculate → countRefiner Add +0.5

When Q2 is D
Then
Calculate → countShaper Add +1.6
Calculate → countRefiner Add +0.8

When Q2 is E
Then
Calculate → countShaper Add +1
Calculate → countRefiner Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q3: Refiner (Primary) × Experimenter (Secondary)**

**You're finishing something due tomorrow. It's solid, but a few details could elevate the outcome.**

- **A.** I'd send it as it is; deadlines matter more than polish.
- **B.** I'd note improvements for the next iteration.
- **C.** I'd refine the parts that matter most and ship on time.
- **D.** I'd spend a bit more time improving what has real impact.
- **E.** I'd keep perfecting until I'm fully satisfied, even if it slips.

#### **Scoring Logic:**
```
When Q3 is A
Then (do nothing)

When Q3 is B
Then Calculate → countNeutral Add +0.5

When Q3 is C
Then 
Calculate → countRefiner Add +1
Calculate → countExperimenter Add +0.5

When Q3 is D
Then
Calculate → countRefiner Add +1.6
Calculate → countExperimenter Add +0.8

When Q3 is E
Then
Calculate → countRefiner Add +1
Calculate → countExperimenter Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q4: Refiner (Primary) × Uplifter (Secondary)**

**A teammate's work isn't quite meeting the shared standard, but they're trying hard.**

- **A.** I'd quietly make edits myself to keeps things moving and support them.
- **B.** I'd give clear, direct feedback and let them adjust.
- **C.** I'd walk through the gaps with them to understand what's hard.
- **D.** I'd sit with them to refine the work together and align on quality.
- **E.** I'd take it on for now to protect the timeline and outcome.

#### **Scoring Logic:**
```
When Q4 is A
Then (do nothing)

When Q4 is B
Then Calculate → countNeutral Add +0.5

When Q4 is C
Then 
Calculate → countRefiner Add +1
Calculate → countUplifter Add +0.5

When Q4 is D
Then
Calculate → countRefiner Add +1.6
Calculate → countUplifter Add +0.8

When Q4 is E
Then
Calculate → countRefiner Add +1
Calculate → countUplifter Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q5: Experimenter (Primary) × Shaper (Secondary)**

**You're asked to take on something new without much guidance.**

- **A.** I'd ask for clarity first; starting blind often causes rework.
- **B.** I'd research until I have enough to move comfortably.
- **C.** I'd try a few small things and adjust based on what I learn.
- **D.** I'd build a simple first version and share it early for feedback.
- **E.** I'd dive straight in; I learn best by doing.

#### **Scoring Logic:**
```
When Q5 is A
Then (do nothing)

When Q5 is B
Then Calculate → countNeutral Add +0.5

When Q5 is C
Then 
Calculate → countExperimenter Add +1
Calculate → countShaper Add +0.5

When Q5 is D
Then
Calculate → countExperimenter Add +1.6
Calculate → countShaper Add +0.8

When Q5 is E
Then
Calculate → countExperimenter Add +1
Calculate → countShaper Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q6: Experimenter (Primary) × Balancer (Secondary)**

**You test a new idea and feedback is mixed.**

- **A.** I'd pause the idea and revisit it later with fresh perspective.
- **B.** I'd make quick tweaks to see if they help it land.
- **C.** I'd look for the common themes in the feedback and adjust accordingly.
- **D.** I'd speak to the strongest voices to understand what sits behind their reaction and iterate with them.
- **E.** I'd keep going because some ideas make sense only once they're finished.

#### **Scoring Logic:**
```
When Q6 is A
Then (do nothing)

When Q6 is B
Then Calculate → countNeutral Add +0.5

When Q6 is C
Then 
Calculate → countExperimenter Add +1
Calculate → countBalancer Add +0.5

When Q6 is D
Then
Calculate → countExperimenter Add +1.6
Calculate → countBalancer Add +0.8

When Q6 is E
Then
Calculate → countExperimenter Add +1
Calculate → countBalancer Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q7: Balancer (Primary) × Uplifter (Secondary)**

**After debate, the team chooses an approach you disagree with for a high impact project.**

- **A.** I'd step back and see how it plays out.
- **B.** I'd restate my thinking so the rationale is clear, then move on.
- **C.** I'd support the chosen path and play my part.
- **D.** I'd commit fully and later reflect with the team on what we learned.
- **E.** I'd quietly explore my version on the side in case it's useful.

#### **Scoring Logic:**
```
When Q7 is A
Then (do nothing)

When Q7 is B
Then Calculate → countNeutral Add +0.5

When Q7 is C
Then 
Calculate → countBalancer Add +1
Calculate → countUplifter Add +0.5

When Q7 is D
Then
Calculate → countBalancer Add +1.6
Calculate → countUplifter Add +0.8

When Q7 is E
Then
Calculate → countBalancer Add +1
Calculate → countUplifter Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q8: Balancer (Primary) × Refiner (Secondary)**

**A stakeholder gives strong feedback that partially clashes with your view.**

- **A.** I'd explain why the approach makes sense and keep it as is.
- **B.** I'd make small adjustments that show we've listened.
- **C.** I'd weigh their points, adapt what improves the outcome, and explain the choices.
- **D.** I'd reshape things with them so we both feel confident in the final version.
- **E.** I'd adopt all their suggestions to ensure alignment.

#### **Scoring Logic:**
```
When Q8 is A
Then (do nothing)

When Q8 is B
Then Calculate → countNeutral Add +0.5

When Q8 is C
Then 
Calculate → countBalancer Add +1
Calculate → countRefiner Add +0.5

When Q8 is D
Then
Calculate → countBalancer Add +1.6
Calculate → countRefiner Add +0.8

When Q8 is E
Then
Calculate → countBalancer Add +1
Calculate → countRefiner Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q9: Uplifter (Primary) × Experimenter (Secondary)**

**A teammate is behind. You could help, but your workload is heavy.**

- **A.** I'd offer a couple of tips and let them lead.
- **B.** I'd give context or examples to unblock them.
- **C.** I'd focus on the hardest part with them.
- **D.** I'd work through it together so we both finish strong.
- **E.** I'd take over part of the task to ensure delivery.

#### **Scoring Logic:**
```
When Q9 is A
Then (do nothing)

When Q9 is B
Then Calculate → countNeutral Add +0.5

When Q9 is C
Then 
Calculate → countUplifter Add +1
Calculate → countExperimenter Add +0.5

When Q9 is D
Then
Calculate → countUplifter Add +1.6
Calculate → countExperimenter Add +0.8

When Q9 is E
Then
Calculate → countUplifter Add +1
Calculate → countExperimenter Add +0.5
Calculate → countOverplay Add +1
```

---

### **Q10: Uplifter (Primary) × Shaper (Secondary)**

**After a big success, one person gets most of the credit though everyone contributed.**

- **A.** I'd let it pass; those involved know the truth.
- **B.** I'd casually mention others' contributions.
- **C.** I'd thank the whole team and name what each added.
- **D.** I'd celebrate publicly and highlight everyone's part in the win.
- **E.** I'd correct the story immediately for accuracy.

#### **Scoring Logic:**
```
When Q10 is A
Then (do nothing)

When Q10 is B
Then Calculate → countNeutral Add +0.5

When Q10 is C
Then 
Calculate → countUplifter Add +1
Calculate → countShaper Add +0.5

When Q10 is D
Then
Calculate → countUplifter Add +1.6
Calculate → countShaper Add +0.8

When Q10 is E
Then
Calculate → countUplifter Add +1
Calculate → countShaper Add +0.5
Calculate → countOverplay Add +1
```

---

## Final Result Calculation Logic

**Place this logic at the end of the quiz (after Q10):**

### **Step 1: Calculate maxPrimary (find highest archetype score)**

```
// Compare all 5 archetype scores to find the winner
When countShaper ≥ countRefiner AND countShaper ≥ countExperimenter AND countShaper ≥ countBalancer AND countShaper ≥ countUplifter
Then
Calculate → maxPrimary Assign = countShaper
Calculate → primaryArchetype Assign = Shaper

When countRefiner > countShaper AND countRefiner ≥ countExperimenter AND countRefiner ≥ countBalancer AND countRefiner ≥ countUplifter
Then
Calculate → maxPrimary Assign = countRefiner
Calculate → primaryArchetype Assign = Refiner

When countExperimenter > countShaper AND countExperimenter > countRefiner AND countExperimenter ≥ countBalancer AND countExperimenter ≥ countUplifter
Then
Calculate → maxPrimary Assign = countExperimenter
Calculate → primaryArchetype Assign = Experimenter

When countBalancer > countShaper AND countBalancer > countRefiner AND countBalancer > countExperimenter AND countBalancer ≥ countUplifter
Then
Calculate → maxPrimary Assign = countBalancer
Calculate → primaryArchetype Assign = Balancer

When countUplifter > countShaper AND countUplifter > countRefiner AND countUplifter > countExperimenter AND countUplifter > countBalancer
Then
Calculate → maxPrimary Assign = countUplifter
Calculate → primaryArchetype Assign = Uplifter
```

### **Step 2: Check special cases, then redirect to results**

```
// First check for Overplay
When countOverplay ≥ 4
Then Jump to page → High-Intensity Result Page

// Then check for Neutral (low engagement)
When countNeutral ≥ 2.5
Then Jump to page → Neutral Result Page

// Finally redirect based on primary archetype
When primaryArchetype = Shaper
Then Jump to page → The Shaper Result Page

When primaryArchetype = Refiner
Then Jump to page → The Refiner Result Page

When primaryArchetype = Experimenter
Then Jump to page → The Experimenter Result Page

When primaryArchetype = Balancer
Then Jump to page → The Balancer Result Page

When primaryArchetype = Uplifter
Then Jump to page → The Uplifter Result Page
```

---

## 7 Thank You Pages Needed

1. **The Shaper** - Primary result page
2. **The Refiner** - Primary result page
3. **The Experimenter** - Primary result page
4. **The Balancer** - Primary result page
5. **The Uplifter** - Primary result page
6. **Neutral** - Low alignment result page
7. **High-Intensity** - Overplay result page

---

## Completion Message (shown on all result pages)

**A note when they finish:**

Thanks for taking the quiz! Hopefully it has helped give you a sense as to whether hx's pace, expectations, and way of working feel energising and aligned with how you like to operate.

**Recently completed:** (data to automatically update)

**e.g 40% Uplifters · 32% System Builders · 18% Edge Pushers · 10% Specialists**

---

## Scoring Summary for Reference

### Answer Values:
- **A** = 0 points (poor fit)
- **B** = +0.5 to countNeutral (low fit)
- **C** = +1 to Primary archetype, +0.5 to Secondary archetype (good fit)
- **D** = +1.6 to Primary archetype, +0.8 to Secondary archetype (excellent fit)
- **E** = +1 to Primary archetype, +0.5 to Secondary archetype, +1 to countOverplay (overplayed fit)

### Maximum Possible Scores:
- Each archetype appears as **Primary** in 2 questions
- Max primary score per archetype: 2 × 1.6 = **3.2 points**
- Secondary contributions add additional points from other questions
- Realistic max total per archetype: **~5-8 points** (primary + secondary appearances)

### Thresholds:
- **Overplay:** countOverplay ≥ 4 (4 or more E answers)
- **Neutral:** countNeutral ≥ 2.5 (5 or more B answers, or many A answers leading to low overall scores)
- **Primary Archetype:** Highest count among the 5 archetypes wins
