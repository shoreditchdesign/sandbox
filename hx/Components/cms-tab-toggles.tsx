import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ComponentType } from "react";

// Customizable constants

// Pagination
const ITEMS_PER_PAGE = 6;

// Font settings
const FONT_FAMILY = "FFF Acid Grotesk, sans-serif";
const TEXT_COLOR = "#28323F";
const ACTIVE_TEXT_COLOR = "#F7F7F7";
const TEXT_SIZE = "14px";
const TEXT_WEIGHT = 500;
const LINE_HEIGHT = "150%";

// Padding and spacing
const TAB_PADDING_VERTICAL = "8px";
const TAB_PADDING_HORIZONTAL = "16px";
const TAB_GAP = "8px";
const CONTAINER_MARGIN_BOTTOM = "24px";

// Colors
const HOVER_BACKGROUND_COLOR = "#132130";
const ACTIVE_BACKGROUND_COLOR = "#1D2733";
const BACKGROUND_COLOR = "#FFFFFF";
const PAGINATION_BACKGROUND_COLOR = "#0F1924";

// Borders and dimensions
const BORDER_RADIUS = "150px";

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
  minWidth: "80px",
};

export default function tabToggleCMS(Component: ComponentType): ComponentType {
  return (props) => {
    const [activeTab, setActiveTab] = useState<string>("");
    const [tabs, setTabs] = useState<string[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
    const [renderTarget, setRenderTarget] = useState<HTMLElement | null>(null);
    const [paginationTarget, setPaginationTarget] =
      useState<HTMLElement | null>(null);

    // Find the target divs to render tabs and pagination
    useEffect(() => {
      const target = document.querySelector(
        '[aria-label="tab-toggle"]',
      ) as HTMLElement;
      console.log("Tab toggle target:", target);
      setRenderTarget(target);

      const pagTarget = document.querySelector(
        '[aria-label="tab-pagination"]',
      ) as HTMLElement;
      console.log("Pagination target:", pagTarget);
      setPaginationTarget(pagTarget);
    }, []);

    // Scan DOM for unique filter-tab items, retrying until CMS items load
    useEffect(() => {
      const scanTabs = () => {
        const items = document.querySelectorAll('[aria-label="tab-item"]');
        if (items.length === 0) return false;

        const uniqueTabs = new Set<string>();
        items.forEach((item) => {
          const filterTab = item.querySelector('[aria-label="tab-filter"]');
          const text = filterTab?.textContent?.trim();
          if (text) {
            uniqueTabs.add(text);
          }
        });

        if (uniqueTabs.size > 0) {
          const sorted = Array.from(uniqueTabs).sort();
          setTabs(sorted);
          // Default to first tab
          if (!activeTab) {
            setActiveTab(sorted[0]);
          }
          return true;
        }
        return false;
      };

      if (scanTabs()) return;

      const observer = new MutationObserver(() => {
        if (scanTabs()) {
          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }, []);

    // Filter cards based on active tab and visible count
    useEffect(() => {
      if (!activeTab) return;

      const items = document.querySelectorAll('[aria-label="tab-item"]');

      // First filter by tab
      const filteredItems: HTMLElement[] = [];
      items.forEach((item) => {
        const filterTab = item.querySelector('[aria-label="tab-filter"]');
        const tabValue = filterTab?.textContent?.trim();

        if (tabValue === activeTab) {
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
      setVisibleCount(ITEMS_PER_PAGE);
    };

    // Get total filtered items count
    const getTotalFilteredCount = () => {
      if (!activeTab) return 0;

      const items = document.querySelectorAll('[aria-label="tab-item"]');
      let count = 0;

      items.forEach((item) => {
        const filterTab = item.querySelector('[aria-label="tab-filter"]');
        const tabValue = filterTab?.textContent?.trim();
        if (tabValue === activeTab) {
          count++;
        }
      });

      return count;
    };

    const totalCount = getTotalFilteredCount();
    const hasMore = visibleCount < totalCount;
    const remainingCount = totalCount - visibleCount;

    const handleLoadMore = () => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    const tabUI = (
      <div
        style={{
          display: "flex",
          gap: TAB_GAP,
          marginBottom: CONTAINER_MARGIN_BOTTOM,
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{
              ...baseTabStyles,
              color: activeTab === tab ? ACTIVE_TEXT_COLOR : TEXT_COLOR,
              background:
                activeTab === tab ? ACTIVE_BACKGROUND_COLOR : BACKGROUND_COLOR,
            }}
          >
            {tab}
          </button>
        ))}

        <style>{`
          button:hover {
            background-color: ${HOVER_BACKGROUND_COLOR} !important;
            color: ${ACTIVE_TEXT_COLOR} !important;
          }
        `}</style>
      </div>
    );

    const paginationUI = hasMore ? (
      <button
        onClick={handleLoadMore}
        style={{
          ...baseTabStyles,
          background: PAGINATION_BACKGROUND_COLOR,
          color: ACTIVE_TEXT_COLOR,
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
