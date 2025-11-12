import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ComponentType } from "react";

// Customizable constants

// Aria label selectors
const FILTER_CONTAINER_LABEL = "filter-container";
const WRAPPER_LABEL = "filter-wrapper";
const ITEM_LABEL = "filter-item";
const FILTER_PREFIX = "filter-";

// Font settings
const FONT_FAMILY = "FFF Acid Grotesk, sans-serif";
const TEXT_COLOR = "#1E293B";
const TEXT_SIZE = "16px";
const TEXT_WEIGHT = 400;
const LINE_HEIGHT = "130%";

// Padding and spacing
const PADDING_VERTICAL = "12px";
const PADDING_HORIZONTAL = "12px";
const FILTER_GAP = "10px";
const FILTER_BOTTOM_MARGIN = "20px";

// Colors
const BORDER_COLOR = "#E9E9E9";
const BACKGROUND_COLOR = "#FFF";
const SELECTED_BACKGROUND_COLOR = "#EEEDFD";
const ACTIVE_BORDER_COLOR = "#594FEE";
const HOVER_BACKGROUND_COLOR = "#F8FAFC";
const ACTIVE_TEXT_COLOR = "#594FEE";

// Borders and dimensions
const BORDER_RADIUS = "8px";
const BORDER_WIDTH = "1px";
const ICON_SIZE = "16px";

// Shadow
const BOX_SHADOW =
  "0px 0.301px 1.505px -1.5px rgba(0, 0, 0, 0.18), 0px 1.144px 5.721px -3px rgba(0, 0, 0, 0.04)";

// Base styles for the select component
const baseFilterStyles = {
  borderRadius: BORDER_RADIUS,
  border: `${BORDER_WIDTH} solid ${BORDER_COLOR}`,
  background: BACKGROUND_COLOR,
  boxShadow: BOX_SHADOW,
  padding: `${PADDING_VERTICAL} ${PADDING_HORIZONTAL}`,
  fontFamily: FONT_FAMILY,
  color: TEXT_COLOR,
  fontSize: TEXT_SIZE,
  fontWeight: TEXT_WEIGHT,
  lineHeight: LINE_HEIGHT,
  boxSizing: "border-box" as const,
  width: "auto",
  minWidth: "100%",
  maxWidth: "none",
  appearance: "none",
  whiteSpace: "nowrap" as const,
  overflow: "visible" as const,
  textOverflow: "clip" as const,
  paddingRight: `calc(${PADDING_HORIZONTAL} + ${ICON_SIZE} + 2px)`,
  position: "relative" as const,
};

// Helper function to format filter labels
const formatFilterLabel = (filterId: string): string => {
  // Remove dashes and split into words
  const words = filterId.split("-");

  // Capitalize first letter of each word (Title Case)
  const titleCased = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  // Basic pluralization
  const lastWord = words[words.length - 1].toLowerCase();

  // Check if already plural or add 's'
  if (
    lastWord.endsWith("s") ||
    lastWord.endsWith("x") ||
    lastWord.endsWith("z") ||
    lastWord.endsWith("ch") ||
    lastWord.endsWith("sh")
  ) {
    // Already likely plural or needs 'es', but keep simple
    return titleCased;
  } else if (lastWord.endsWith("y")) {
    // Convert 'y' to 'ies' (e.g., 'category' -> 'categories')
    const withoutY = titleCased.slice(0, -1);
    return withoutY + "ies";
  } else {
    // Simple plural: add 's'
    return titleCased + "s";
  }
};

export function nestedFilterCMS(Component: ComponentType): ComponentType {
  return (props) => {
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [renderTarget, setRenderTarget] = useState<HTMLElement | null>(null);
    const selectRefs = useRef<{ [key: string]: HTMLSelectElement | null }>({});
    const fallbackContainerRef = useRef<HTMLDivElement | null>(null);

    // Determine where to render the filters
    useEffect(() => {
      // Try to find the preferred filter-container
      let container = document.querySelector(
        `[aria-label="${FILTER_CONTAINER_LABEL}"]`,
      ) as HTMLElement;

      // Fallback: create a container and insert before first filter-wrapper
      if (!container) {
        const firstWrapper = document.querySelector(
          `[aria-label="${WRAPPER_LABEL}"]`,
        );
        if (firstWrapper && firstWrapper.parentElement) {
          const fallbackDiv = document.createElement("div");
          fallbackDiv.setAttribute("aria-label", FILTER_CONTAINER_LABEL);
          fallbackDiv.setAttribute("data-filter-fallback", "true");
          firstWrapper.parentElement.insertBefore(fallbackDiv, firstWrapper);
          container = fallbackDiv;
          fallbackContainerRef.current = fallbackDiv;
        }
      }

      setRenderTarget(container);

      // Cleanup fallback container on unmount
      return () => {
        if (
          fallbackContainerRef.current &&
          fallbackContainerRef.current.parentElement
        ) {
          fallbackContainerRef.current.parentElement.removeChild(
            fallbackContainerRef.current,
          );
        }
      };
    }, []);

    // Filter items and hide/show wrappers based on child visibility
    useEffect(() => {
      const items = document.querySelectorAll(`[aria-label="${ITEM_LABEL}"]`);
      const wrappers = document.querySelectorAll(
        `[aria-label="${WRAPPER_LABEL}"]`,
      );

      items.forEach((item) => {
        let matchAll = true;
        Object.entries(filters).forEach(([filterId, filterValue]) => {
          if (filterValue) {
            const filterElement = item.querySelector(
              `[aria-label="${FILTER_PREFIX}${filterId}"]`,
            );
            if (filterElement) {
              const text = filterElement.textContent?.toLowerCase() || "";
              if (!text.includes(filterValue.toLowerCase())) {
                matchAll = false;
              }
            }
          }
        });
        item.classList.toggle("hidden", !matchAll);
      });

      // Check each wrapper and hide if:
      // 1. It has no filter-item children at all (empty department)
      // 2. All its filter-item children are hidden (filtered out)
      wrappers.forEach((wrapper) => {
        const childItems = wrapper.querySelectorAll(
          `[aria-label="${ITEM_LABEL}"]`,
        );

        // Hide if no items exist
        if (childItems.length === 0) {
          wrapper.classList.add("hidden");
          return;
        }

        // Hide if all items are hidden
        const allHidden = Array.from(childItems).every((child) =>
          child.classList.contains("hidden"),
        );
        wrapper.classList.toggle("hidden", allHidden);
      });
    }, [filters]);

    const handleFilterChange = (filterId: string, value: string) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterId]: value,
      }));
      setTimeout(() => adjustSelectWidth(filterId), 0);
    };

    const adjustSelectWidth = (filterId: string) => {
      const select = selectRefs.current[filterId];
      if (select) {
        const tempSpan = document.createElement("span");
        tempSpan.style.visibility = "hidden";
        tempSpan.style.position = "absolute";
        tempSpan.style.whiteSpace = "nowrap";
        tempSpan.style.font = window.getComputedStyle(select).font;
        tempSpan.textContent = select.options[select.selectedIndex].text;
        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        const extraSpace =
          parseInt(PADDING_HORIZONTAL) * 2 + parseInt(ICON_SIZE) + 8;
        select.style.width = `${textWidth + extraSpace}px`;
      }
    };

    // Discover filters from all filter-item elements in the document
    useEffect(() => {
      const items = document.querySelectorAll(`[aria-label="${ITEM_LABEL}"]`);
      const uniqueFilters: { [key: string]: Set<string> } = {};

      // Structural labels to exclude from becoming filter dropdowns
      const excludedLabels = ["item", "wrapper", "container"];

      items.forEach((item) => {
        const filterElements = item.querySelectorAll(
          `[aria-label^="${FILTER_PREFIX}"]`,
        );
        filterElements.forEach((el) => {
          const ariaLabel = el.getAttribute("aria-label");
          if (ariaLabel && ariaLabel.startsWith(FILTER_PREFIX)) {
            const id = ariaLabel.substring(FILTER_PREFIX.length);

            // Skip structural labels
            if (id && !excludedLabels.includes(id)) {
              if (!uniqueFilters[id]) {
                uniqueFilters[id] = new Set();
              }
              const content = el.textContent?.trim();
              if (content) {
                uniqueFilters[id].add(content);
              }
            }
          }
        });
      });

      const initialFilters: { [key: string]: string } = {};
      Object.keys(uniqueFilters).forEach((filterId) => {
        initialFilters[filterId] = "";
      });
      setFilters(initialFilters);
    }, []);

    // Adjust widths when filters change
    useEffect(() => {
      Object.keys(filters).forEach(adjustSelectWidth);
    }, [filters]);

    const filterUI = (
      <>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: FILTER_GAP,
            marginBottom: "0px",
            justifyContent: "flex-start",
            width: "auto",
          }}
        >
          {Object.entries(filters).map(([filterId, filterValue]) => {
            const isActive = !!filterValue;
            const style = {
              ...baseFilterStyles,
              background: isActive
                ? SELECTED_BACKGROUND_COLOR
                : BACKGROUND_COLOR,
              borderColor: isActive ? ACTIVE_BORDER_COLOR : BORDER_COLOR,
              color: isActive ? ACTIVE_TEXT_COLOR : TEXT_COLOR,
            };
            return (
              <div
                key={filterId}
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "auto",
                }}
              >
                <select
                  ref={(el) => (selectRefs.current[filterId] = el)}
                  value={filterValue}
                  onChange={(e) => handleFilterChange(filterId, e.target.value)}
                  style={style}
                >
                  <option value="">All {formatFilterLabel(filterId)}</option>
                  {Array.from(
                    document.querySelectorAll(
                      `[aria-label="${ITEM_LABEL}"] [aria-label="${FILTER_PREFIX}${filterId}"]`,
                    ),
                  )
                    .map((el) => el.textContent?.trim())
                    .filter(
                      (value, index, self) =>
                        value && self.indexOf(value) === index,
                    )
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: PADDING_HORIZONTAL,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    color: isActive ? ACTIVE_TEXT_COLOR : TEXT_COLOR,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            );
          })}
        </div>
        <style>{`
          [aria-label="${ITEM_LABEL}"].hidden {
            display: none;
          }
          [aria-label="${WRAPPER_LABEL}"].hidden {
            display: none;
          }
          select:hover {
            background-color: ${HOVER_BACKGROUND_COLOR} !important;
          }
          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
        `}</style>
      </>
    );

    return (
      <>
        {renderTarget && createPortal(filterUI, renderTarget)}
        <Component {...props} />
      </>
    );
  };
}
