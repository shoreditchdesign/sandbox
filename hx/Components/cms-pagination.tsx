import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { ComponentType } from "react";

// Customizable constants
const ITEMS_PER_PAGE = 6;

// Font settings
const FONT_FAMILY = "FFF Acid Grotesk, sans-serif";
const ACTIVE_TEXT_COLOR = "#F7F7F7";
const TEXT_SIZE = "14px";
const TEXT_WEIGHT = 500;
const LINE_HEIGHT = "150%";

// Padding and spacing
const TAB_PADDING_VERTICAL = "8px";
const TAB_PADDING_HORIZONTAL = "16px";

// Colors
const PAGINATION_BACKGROUND_COLOR = "#0F1924";

// Borders and dimensions
const BORDER_RADIUS = "150px";

const baseButtonStyles = {
  padding: `${TAB_PADDING_VERTICAL} ${TAB_PADDING_HORIZONTAL}`,
  fontFamily: FONT_FAMILY,
  fontSize: TEXT_SIZE,
  fontWeight: TEXT_WEIGHT,
  lineHeight: LINE_HEIGHT,
  border: "none",
  background: PAGINATION_BACKGROUND_COLOR,
  color: ACTIVE_TEXT_COLOR,
  cursor: "pointer",
  borderRadius: BORDER_RADIUS,
  transition: "all 0.2s ease",
  whiteSpace: "nowrap" as const,
  minWidth: "80px",
};

export default function cmsPagination(Component: ComponentType): ComponentType {
  return (props) => {
    const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
    const [paginationTarget, setPaginationTarget] =
      useState<HTMLElement | null>(null);

    // Find the pagination target div
    useEffect(() => {
      const pagTarget = document.querySelector(
        '[aria-label="load-pagination"]',
      ) as HTMLElement;
      setPaginationTarget(pagTarget);
    }, []);

    // Show/hide items based on visible count
    useEffect(() => {
      const items = document.querySelectorAll('[aria-label="load-item"]');
      items.forEach((item, index) => {
        (item as HTMLElement).style.display =
          index < visibleCount ? "" : "none";
      });
    }, [visibleCount]);

    const getTotalCount = () =>
      document.querySelectorAll('[aria-label="load-item"]').length;

    const totalCount = getTotalCount();
    const hasMore = visibleCount < totalCount;
    const remainingCount = totalCount - visibleCount;

    const handleLoadMore = () => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    const paginationUI = hasMore ? (
      <button onClick={handleLoadMore} style={baseButtonStyles}>
        Load {Math.min(remainingCount, ITEMS_PER_PAGE)} more
      </button>
    ) : null;

    return (
      <>
        {paginationTarget && createPortal(paginationUI, paginationTarget)}
        <Component {...props} />
      </>
    );
  };
}
