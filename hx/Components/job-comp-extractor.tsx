import { useEffect, useRef } from "react";
import type { ComponentType } from "react";

// Configuration

// Markup tag pattern: {{type=value}}
const TAG_PATTERN = /\{\{(bonus|commission|equity)=([^}]+)\}\}/gi;

// Parent div IDs for each compensation type
const COMP_DIVS = {
  bonus: "job-bonus",
  commission: "job-commission",
  equity: "job-equity",
} as const;

// IDs for the text elements where values get injected
const VALUE_IDS = {
  bonus: "bonus-label",
  commission: "commission-label",
  equity: "equity-label",
} as const;

// Inline styles for injected text
const VALUE_STYLES: Record<string, string> = {
  fontFamily:
    '"FFF Acid Grotesk Regular", "FFF Acid Grotesk Regular Placeholder", sans-serif',
  fontSize: "18px",
  fontWeight: "400",
  fontStyle: "normal",
  lineHeight: "1.3em",
  letterSpacing: "0em",
  color: "#0f1924",
  textDecoration: "none",
  textTransform: "none",
};

type CompType = keyof typeof COMP_DIVS;

interface ExtractedComp {
  type: CompType;
  value: string;
}

/**
 * Parses the job description HTML for compensation markup tags
 * Returns extracted values and the cleaned HTML with tags removed
 */
function parseCompensationTags(html: string): {
  extracted: ExtractedComp[];
  cleanedHtml: string;
} {
  const extracted: ExtractedComp[] = [];

  // Find all matches
  let match;
  const regex = new RegExp(TAG_PATTERN.source, "gi");

  while ((match = regex.exec(html)) !== null) {
    const type = match[1].toLowerCase() as CompType;
    const value = match[2].trim();

    extracted.push({ type, value });
  }

  // Remove all tags from HTML
  const cleanedHtml = html.replace(TAG_PATTERN, "");

  return { extracted, cleanedHtml };
}

/**
 * Code override that extracts compensation data from job description markup
 * and injects it into designated divs while hiding unused ones.
 *
 * Usage in job description (Ashby):
 *   {{bonus=10,000 - 50,000}}
 *   {{commission=10-15% OTE}}
 *   {{equity=Significant equity package offered}}
 *
 * Required HTML structure:
 *   - Parent divs with IDs: job-bonus, job-commission, job-equity
 *   - Text elements with IDs: bonus-label, commission-label, equity-label
 *
 * Apply this override to the job description element in Framer.
 */
export function jobCompExtractor(Component: ComponentType): ComponentType {
  return (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const processedRef = useRef(false);

    useEffect(() => {
      // Prevent double processing
      if (processedRef.current) return;

      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (!containerRef.current) return;

        // Get the job description HTML from the wrapped component
        const descriptionEl =
          containerRef.current.querySelector("[data-framer-component-type]") ||
          containerRef.current;

        const originalHtml = descriptionEl.innerHTML;

        // Parse and extract compensation tags
        const { extracted, cleanedHtml } = parseCompensationTags(originalHtml);

        // Update the job description HTML (remove tags)
        if (cleanedHtml !== originalHtml) {
          descriptionEl.innerHTML = cleanedHtml;
        }

        // Track which comp types were found
        const foundTypes = new Set(extracted.map((e) => e.type));

        // Process each compensation type
        (Object.keys(COMP_DIVS) as CompType[]).forEach((compType) => {
          const divId = COMP_DIVS[compType];
          const parentDiv = document.getElementById(divId);

          if (!parentDiv) {
            console.warn(`[job-comp-extractor] Parent div #${divId} not found`);
            return;
          }

          if (foundTypes.has(compType)) {
            // Find the extracted value for this type
            const compData = extracted.find((e) => e.type === compType);

            if (compData) {
              // Find the text element by ID
              const valueEl = document.getElementById(VALUE_IDS[compType]);

              if (valueEl) {
                // Inject the value
                valueEl.textContent = compData.value;

                // Apply inline styles
                Object.entries(VALUE_STYLES).forEach(([prop, value]) => {
                  (valueEl as HTMLElement).style[prop as any] = value;
                });
              } else {
                console.warn(
                  `[job-comp-extractor] Text element #${VALUE_IDS[compType]} not found`,
                );
              }

              // Ensure parent is visible
              parentDiv.style.display = "";
            }
          } else {
            // Hide the parent div if this comp type wasn't found
            parentDiv.style.display = "none";
          }
        });

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
