import { useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";

// Customizable constants

// Font settings
const FONT_FAMILY = "FFF Acid Grotesk, sans-serif";
const TEXT_COLOR = "#1E293B";
const TEXT_SIZE = "16px";
const TEXT_WEIGHT = 500;
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
  padding: `${PADDING_VERTICAL} ${PADDING_HORIZONTAL}`, // Separate vertical and horizontal padding
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
  paddingRight: `calc(${PADDING_HORIZONTAL} + ${ICON_SIZE} + 2px)`, // Adjust space for the icon
  position: "relative" as const,
};

export function multiFilterCMS(Component: ComponentType): ComponentType {
  return (props) => {
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [filtersInitialized, setFiltersInitialized] = useState(false);
    const selectRefs = useRef<{ [key: string]: HTMLSelectElement | null }>({});

    useEffect(() => {
      const layer = document.querySelector(`.${props.className}`);
      if (layer) {
        const cards = layer.querySelectorAll("[aria-label='cmsitem']");
        cards.forEach((card) => {
          let matchAll = true;
          Object.entries(filters).forEach(([filterId, filterValue]) => {
            if (filterValue) {
              const filterElement = card.querySelector(
                `[aria-label^="filter-${filterId}"]`,
              );
              if (filterElement) {
                const text = filterElement.textContent?.toLowerCase() || "";
                if (!text.includes(filterValue.toLowerCase())) {
                  matchAll = false;
                }
              }
            }
          });
          card.classList.toggle("hidden", !matchAll);
        });
      }
    }, [props.className, filters]);

    // Update URL query parameters when filters change
    const updateURL = (newFilters: { [key: string]: string }) => {
      const url = new URL(window.location.href);
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      const newUrl = params.toString()
        ? `${url.pathname}?${params.toString()}`
        : url.pathname;

      window.history.replaceState({}, "", newUrl);
    };

    // Read URL query parameters on mount
    const getFiltersFromURL = (): { [key: string]: string } => {
      const params = new URLSearchParams(window.location.search);
      const urlFilters: { [key: string]: string } = {};
      params.forEach((value, key) => {
        urlFilters[key] = value;
      });
      return urlFilters;
    };

    const handleFilterChange = (filterId: string, value: string) => {
      setFilters((prevFilters) => {
        const newFilters = {
          ...prevFilters,
          [filterId]: value,
        };
        updateURL(newFilters);
        return newFilters;
      });
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
          parseInt(PADDING_HORIZONTAL) * 2 + parseInt(ICON_SIZE) + 8; // Adjust for padding and icon space
        select.style.width = `${textWidth + extraSpace}px`;
      }
    };

    useEffect(() => {
      const layer = document.querySelector(`.${props.className}`);
      if (layer) {
        const filterElements = layer.querySelectorAll(
          '[aria-label^="filter-"]',
        );
        const uniqueFilters: { [key: string]: Set<string> } = {};

        filterElements.forEach((el) => {
          const id = el.getAttribute("aria-label")?.split("-")[1];
          if (id) {
            if (!uniqueFilters[id]) {
              uniqueFilters[id] = new Set();
            }
            uniqueFilters[id].add(el.textContent || "");
          }
        });

        const initialFilters: { [key: string]: string } = {};
        Object.keys(uniqueFilters).forEach((filterId) => {
          initialFilters[filterId] = "";
        });

        // Merge URL parameters with initial filters
        const urlFilters = getFiltersFromURL();
        const mergedFilters = { ...initialFilters, ...urlFilters };

        setFilters(mergedFilters);
        setFiltersInitialized(true);
      }
    }, [props.className]);

    useEffect(() => {
      Object.keys(filters).forEach(adjustSelectWidth);
    }, [filters]);

    return (
      <>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: FILTER_GAP,
            marginBottom: FILTER_BOTTOM_MARGIN,
            justifyContent: "flex-start",
            width: "100%",
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
                  <option value="">All {filterId}</option>
                  {Array.from(
                    document.querySelectorAll(
                      `.${props.className} [aria-label^="filter-${filterId}"]`,
                    ),
                  )
                    .map((el) => el.textContent)
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
        <Component {...props} />
        <style>{`
                    .${props.className} .hidden {
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
  };
}
