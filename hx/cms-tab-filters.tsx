import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ComponentType } from "react";

// Customizable constants

// Pagination
const ITEMS_PER_PAGE = 6;

// Font settings
const FONT_FAMILY = "FFF Acid Grotesk, sans-serif";
const TEXT_COLOR = "#64748B";
const ACTIVE_TEXT_COLOR = "#0F172A";
const TEXT_SIZE = "14px";
const TEXT_WEIGHT = 500;
const LINE_HEIGHT = "140%";

// Padding and spacing
const TAB_PADDING_VERTICAL = "10px";
const TAB_PADDING_HORIZONTAL = "16px";
const TAB_GAP = "8px";
const CONTAINER_MARGIN_BOTTOM = "24px";

// Colors
const BORDER_COLOR = "#E2E8F0";
const ACTIVE_BORDER_COLOR = "#594FEE";
const HOVER_BACKGROUND_COLOR = "#F8FAFC";
const ACTIVE_BACKGROUND_COLOR = "#F1F5F9";
const BACKGROUND_COLOR = "#FFF";
const DISABLED_OPACITY = 0.6;

// Borders and dimensions
const BORDER_RADIUS = "8px";
const BORDER_WIDTH = "2px";

// Base styles for tab buttons
const baseTabStyles = {
  padding: `${TAB_PADDING_VERTICAL} ${TAB_PADDING_HORIZONTAL}`,
  fontFamily: FONT_FAMILY,
  fontSize: TEXT_SIZE,
  fontWeight: TEXT_WEIGHT,
  lineHeight: LINE_HEIGHT,
  border: "none",
  background: "transparent",
  color: TEXT_COLOR,
  cursor: "pointer",
  borderRadius: BORDER_RADIUS,
  transition: "all 0.2s ease",
  whiteSpace: "nowrap" as const,
  position: "relative" as const,
  borderBottom: `${BORDER_WIDTH} solid transparent`,
};

export default function tabFilterCMS(Component: ComponentType): ComponentType {
  return (props) => {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [tabs, setTabs] = useState<string[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
    const [renderTarget, setRenderTarget] = useState<HTMLElement | null>(null);
    const [paginationTarget, setPaginationTarget] =
      useState<HTMLElement | null>(null);

    // Find the target divs to render tabs and pagination
    useEffect(() => {
      const target = document.querySelector(
        '[aria-label="tab-buttons"]',
      ) as HTMLElement;
      console.log("Tab buttons target:", target);
      setRenderTarget(target);

      const pagTarget = document.querySelector(
        '[aria-label="tab-pagination"]',
      ) as HTMLElement;
      console.log("Pagination target:", pagTarget);
      setPaginationTarget(pagTarget);
    }, []);

    // Scan DOM for unique filter-tab items
    useEffect(() => {
      const items = document.querySelectorAll('[aria-label="tab-item"]');
      const uniqueTabs = new Set<string>();

      items.forEach((item) => {
        const filterTab = item.querySelector('[aria-label="tab-filter"]');
        const text = filterTab?.textContent?.trim();
        if (text) {
          uniqueTabs.add(text);
        }
      });

      setTabs(Array.from(uniqueTabs).sort());
    }, []);

    // Filter cards based on active tab and visible count
    useEffect(() => {
      const items = document.querySelectorAll('[aria-label="tab-item"]');

      // First filter by tab
      const filteredItems: HTMLElement[] = [];
      items.forEach((item) => {
        const filterTab = item.querySelector('[aria-label="tab-filter"]');
        const tabValue = filterTab?.textContent?.trim();

        const matchesTab = activeTab === "all" || tabValue === activeTab;

        if (matchesTab) {
          filteredItems.push(item as HTMLElement);
        } else {
          (item as HTMLElement).style.display = "none";
        }
      });

      // Show only up to visibleCount items
      filteredItems.forEach((item, index) => {
        if (index < visibleCount) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    }, [activeTab, visibleCount]);

    const handleTabClick = (tab: string) => {
      setActiveTab(tab);
      setVisibleCount(ITEMS_PER_PAGE); // Reset visible count when changing tabs
    };

    // Get total filtered items count
    const getTotalFilteredCount = () => {
      const items = document.querySelectorAll('[aria-label="tab-item"]');
      let count = 0;

      items.forEach((item) => {
        const filterTab = item.querySelector('[aria-label="tab-filter"]');
        const tabValue = filterTab?.textContent?.trim();
        if (activeTab === "all" || tabValue === activeTab) {
          count++;
        }
      });

      return count;
    };

    const totalCount = getTotalFilteredCount();
    const hasMore = visibleCount < totalCount;
    const remainingCount = totalCount - visibleCount;

    console.log("Pagination stats:", {
      totalCount,
      visibleCount,
      hasMore,
      remainingCount,
    });

    const handleLoadMore = () => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    const tabUI = (
      <div
        style={{
          display: "flex",
          gap: TAB_GAP,
          marginBottom: CONTAINER_MARGIN_BOTTOM,
          borderBottom: `1px solid ${BORDER_COLOR}`,
          flexWrap: "wrap",
        }}
      >
        {/* All tab */}
        <button
          onClick={() => handleTabClick("all")}
          style={{
            ...baseTabStyles,
            color: activeTab === "all" ? ACTIVE_TEXT_COLOR : TEXT_COLOR,
            borderBottomColor:
              activeTab === "all" ? ACTIVE_BORDER_COLOR : "transparent",
            background:
              activeTab === "all" ? ACTIVE_BACKGROUND_COLOR : "transparent",
          }}
        >
          All
        </button>

        {/* Dynamic tabs */}
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{
              ...baseTabStyles,
              color: activeTab === tab ? ACTIVE_TEXT_COLOR : TEXT_COLOR,
              borderBottomColor:
                activeTab === tab ? ACTIVE_BORDER_COLOR : "transparent",
              background:
                activeTab === tab ? ACTIVE_BACKGROUND_COLOR : "transparent",
            }}
          >
            {tab}
          </button>
        ))}

        <style>{`
          button:hover {
            background-color: ${HOVER_BACKGROUND_COLOR} !important;
          }
        `}</style>
      </div>
    );

    const paginationUI = hasMore ? (
      <button
        onClick={handleLoadMore}
        style={{
          ...baseTabStyles,
          padding: `${TAB_PADDING_VERTICAL} ${TAB_PADDING_HORIZONTAL}`,
          background: BACKGROUND_COLOR,
          border: `1px solid ${BORDER_COLOR}`,
          color: TEXT_COLOR,
          cursor: "pointer",
        }}
      >
        Load {Math.min(remainingCount, ITEMS_PER_PAGE)} more
      </button>
    ) : null;

    return (
      <>
        {renderTarget && createPortal(tabUI, renderTarget)}
        {paginationTarget && createPortal(paginationUI, paginationTarget)}
        <Component {...props} />
      </>
    );
  };
}
