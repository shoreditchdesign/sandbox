import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { addPropertyControls, ControlType } from "framer";

export default function FocusText({
  text1,
  text2,
  text3,
  text4,
  text5,

  /* Layout */
  align,
  maxWidth,
  padding,
  gap,

  /* Visual */
  minOpacity,

  /* Indicator */
  indicatorSize,
  indicatorColor,
  indicatorGap,
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [text1, text2, text3, text4, text5].filter(Boolean);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  // One scroll listener → stable
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const index = Math.round(v * (items.length - 1));
    setActiveIndex(index);
  });

  const justifyContent =
    align === "center"
      ? "center"
      : align === "right"
        ? "flex-end"
        : "flex-start";

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        display: "flex",
        justifyContent,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          display: "flex",
          flexDirection: "column",
          gap,
          padding,
        }}
      >
        {items.map((text, i) => {
          const isActive = i === activeIndex;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: indicatorGap,
                opacity: isActive ? 1 : minOpacity,
                transition: "opacity 0.35s ease",
              }}
            >
              {/* Square indicator */}
              <div
                style={{
                  width: indicatorSize,
                  height: indicatorSize,
                  backgroundColor: indicatorColor,
                  opacity: isActive ? 1 : 0,
                  flexShrink: 0,
                  transition: "opacity 0.35s ease",
                }}
              />

              {/* Text */}
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Acid Grotesk', sans-serif",
                  fontWeight: 400, // Book
                  fontSize: "24px",
                  lineHeight: "1.3",
                  color: isActive ? "#111111" : "#B5B5B5",
                  filter: isActive ? "blur(0px)" : "blur(4px)",
                  transition:
                    "color 0.35s ease, filter 0.35s ease, opacity 0.35s ease",
                  maxWidth: "100%",
                }}
              >
                {text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Defaults ---------- */

FocusText.defaultProps = {
  text1: "Operate without a playbook in a category we're still defining",
  text2: "Make product decisions where the constraints are real and visible",
  text3: "Go deep on product choices that shape the entire stack",
  text4: "Solve problems that only appear at scale and in production",
  text5: "Design for feasibility twice: for hx and for customers",

  /* Layout */
  align: "left",
  maxWidth: 900,
  padding: 0,
  gap: 32,

  /* Visual */
  minOpacity: 0.4,

  /* Indicator */
  indicatorSize: 8,
  indicatorColor: "#E36F5C",
  indicatorGap: 16,
};

/* ---------- Controls ---------- */

addPropertyControls(FocusText, {
  text1: {
    title: "Text 1",
    type: ControlType.String,
    displayTextArea: true,
  },
  text2: {
    title: "Text 2",
    type: ControlType.String,
    displayTextArea: true,
  },
  text3: {
    title: "Text 3",
    type: ControlType.String,
    displayTextArea: true,
  },
  text4: {
    title: "Text 4",
    type: ControlType.String,
    displayTextArea: true,
  },
  text5: {
    title: "Text 5",
    type: ControlType.String,
    displayTextArea: true,
  },

  /* Layout */
  align: {
    title: "Align",
    type: ControlType.Enum,
    options: ["left", "center", "right"],
    optionTitles: ["Left", "Center", "Right"],
  },

  maxWidth: {
    title: "Max width",
    type: ControlType.Number,
    min: 320,
    max: 1400,
    step: 20,
  },

  padding: {
    title: "Padding",
    type: ControlType.Number,
    min: 0,
    max: 200,
    step: 4,
  },

  gap: {
    title: "Line gap",
    type: ControlType.Number,
    min: 0,
    max: 120,
    step: 4,
  },

  /* Visual */
  minOpacity: {
    title: "Inactive opacity",
    type: ControlType.Number,
    min: 0.1,
    max: 1,
    step: 0.05,
  },

  /* Indicator */
  indicatorSize: {
    title: "Indicator size",
    type: ControlType.Number,
    min: 4,
    max: 24,
  },

  indicatorGap: {
    title: "Indicator gap",
    type: ControlType.Number,
    min: 8,
    max: 40,
  },

  indicatorColor: {
    title: "Indicator color",
    type: ControlType.Color,
  },
});
