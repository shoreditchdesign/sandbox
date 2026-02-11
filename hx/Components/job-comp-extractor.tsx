import { useEffect, useRef } from "react";
import type { ComponentType } from "react";

// Matches any {{value}} tag in the job description HTML
const TAG_PATTERN = /\{\{([^}]+)\}\}/i;

// Inline styles for injected text
const VALUE_STYLES: Record<string, string> = {
  fontFamily:
    '"FFF Acid Grotesk Regular", "FFF Acid Grotesk Regular Placeholder", sans-serif',
  fontSize: "14px",
  fontWeight: "400",
  fontStyle: "italic",
  lineHeight: "1.6em",
  letterSpacing: "0em",
  color: "#848D9A",
  textDecoration: "none",
  textTransform: "none",
};

/**
 * Code override that extracts a single {{value}} tag from job description
 * markup and injects it into the bonus-label text element inside the
 * job-bonus div. Hides job-bonus if no tag is found.
 *
 * Usage in job description (Ashby):
 *   {{10,000 - 50,000}}
 *
 * Required HTML structure:
 *   - Parent div with ID: job-bonus
 *   - Text element with ID: bonus-label
 *
 * Apply this override to the job description element in Framer.
 */
export function jobCompExtractor(Component: ComponentType): ComponentType {
  return (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const processedRef = useRef(false);

    // Hide job-bonus immediately to prevent placeholder flash
    useEffect(() => {
      const parentDiv = document.getElementById("job-bonus");
      if (parentDiv) parentDiv.style.visibility = "hidden";
    }, []);

    useEffect(() => {
      if (processedRef.current) return;

      const timeoutId = setTimeout(() => {
        if (!containerRef.current) return;

        const descriptionEl =
          containerRef.current.querySelector("[data-framer-component-type]") ||
          containerRef.current;

        const originalHtml = descriptionEl.innerHTML;
        const match = TAG_PATTERN.exec(originalHtml);

        const parentDiv = document.getElementById("job-bonus");

        if (match) {
          const value = match[1].trim();

          // Remove the tag from the description
          descriptionEl.innerHTML = originalHtml.replace(TAG_PATTERN, "");

          if (parentDiv) {
            const valueEl = document.getElementById("bonus-label");
            if (valueEl) {
              valueEl.textContent = value;
              Object.entries(VALUE_STYLES).forEach(([prop, val]) => {
                (valueEl as HTMLElement).style[prop as any] = val;
              });
            }
            parentDiv.style.visibility = "";
            parentDiv.style.display = "";
          }
        } else if (parentDiv) {
          parentDiv.style.display = "none";
        }

        processedRef.current = true;
      }, 100);

      return () => clearTimeout(timeoutId);
    }, []);

    return (
      <div ref={containerRef}>
        <Component {...props} />
      </div>
    );
  };
}
