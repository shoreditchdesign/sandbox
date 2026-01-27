// Article Jump Links Component - Dynamically generates navigation links from H2 and H3 headings in article content
import { useEffect, useState, useRef } from "react";
import { addPropertyControls, ControlType } from "framer";

interface JumpLinkData {
  id: string;
  title: string;
  level: number; // 2 for H2, 3 for H3
}

interface Props {
  width?: number | string;
  height?: number | string;
  gap?: number;
  // Typography props
  numberFontFamily?: string;
  numberFontSize?: number;
  numberColor?: string;
  titleFontFamily?: string;
  titleFontSize?: number;
  titleLineHeight?: number;
  titleColor?: string;
  // Border and styling
  borderColor?: string;
  showNumbers?: boolean;
  indentSubheadings?: boolean;
  indentSize?: number;
  // Active state
  activeColor?: string;
  showActiveIndicator?: boolean;
}

// Custom Jump Link component that handles scrolling and styling
function JumpLink({
  listNumber,
  title,
  targetId,
  level,
  isActive,
  numberFontFamily,
  numberFontSize,
  numberColor,
  titleFontFamily,
  titleFontSize,
  titleLineHeight,
  titleColor,
  borderColor,
  showNumbers,
  indentSubheadings,
  indentSize,
  activeColor,
  showActiveIndicator,
}: {
  listNumber: string;
  title: string;
  targetId: string;
  level: number;
  isActive: boolean;
  numberFontFamily?: string;
  numberFontSize?: number;
  numberColor?: string;
  titleFontFamily?: string;
  titleFontSize?: number;
  titleLineHeight?: number;
  titleColor?: string;
  borderColor?: string;
  showNumbers?: boolean;
  indentSubheadings?: boolean;
  indentSize?: number;
  activeColor?: string;
  showActiveIndicator?: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const isSubheading = level === 3;
  const leftPadding = indentSubheadings && isSubheading ? indentSize : 0;
  const showNumberForThisItem = showNumbers && !isSubheading; // Only show numbers for H2, not H3

  return (
    <div
      onClick={handleClick}
      style={{
        display: "grid",
        gridTemplateColumns: showNumberForThisItem ? "40px 1fr" : "1fr",
        gap: showNumberForThisItem ? "12px" : "0px",
        padding: "8px 0",
        paddingLeft: `${leftPadding}px`,
        cursor: "pointer",
        borderBottom: `1px solid ${borderColor || "#e5e5e5"}`,
        alignItems: "flex-start",
        userSelect: "none",
        backgroundColor:
          isActive && showActiveIndicator ? `${activeColor}10` : "transparent",
        borderLeft:
          isActive && showActiveIndicator
            ? `3px solid ${activeColor}`
            : "3px solid transparent",
        transition: "all 0.2s ease",
      }}
    >
      {showNumberForThisItem && (
        <div
          style={{
            width: "40px",
            fontFamily: numberFontFamily || "JetBrains Mono, monospace",
            fontSize: `${numberFontSize || 14}px`,
            color:
              isActive && showActiveIndicator
                ? activeColor
                : numberColor || "#666",
            fontWeight: isActive && showActiveIndicator ? "600" : "normal",
          }}
        >
          {listNumber}
        </div>
      )}
      <div
        style={{
          fontFamily: titleFontFamily || "inherit",
          fontSize: `${(titleFontSize || 14) - (isSubheading ? 1 : 0)}px`,
          lineHeight: titleLineHeight || 1.5,
          color:
            isActive && showActiveIndicator
              ? activeColor
              : titleColor || "#333",
          fontWeight:
            isActive && showActiveIndicator
              ? "600"
              : isSubheading
                ? "400"
                : "500",
          opacity: isSubheading ? 0.8 : 1,
        }}
      >
        {title}
      </div>
    </div>
  );
}

/**
 * Article Jump Links - Dynamically generates navigation from H2 and H3 headings
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function ArticleJumpLinks({
  width = 304,
  height = "fit-content",
  gap = 0,
  numberFontFamily = "JetBrains Mono, monospace",
  numberFontSize = 14,
  numberColor = "#666",
  titleFontFamily = "inherit",
  titleFontSize = 14,
  titleLineHeight = 1.5,
  titleColor = "#333",
  borderColor = "#e5e5e5",
  showNumbers = true,
  indentSubheadings = true,
  indentSize = 20,
  activeColor = "#0066FF",
  showActiveIndicator = true,
}: Props) {
  const [jumpLinks, setJumpLinks] = useState<JumpLinkData[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const findArticleHeadings = () => {
      const currentElement = componentRef.current;
      if (!currentElement) return [];

      // Multiple strategies to find content
      const findContentElements = (): Element[] => {
        const contentElements: Element[] = [];

        // Strategy 1: Look for direct siblings (most likely in your case)
        const parent = currentElement.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children);
          siblings.forEach((sibling) => {
            if (sibling !== currentElement) {
              // Check if sibling contains headings
              const headingsInSibling = sibling.querySelectorAll(
                "h1, h2, h3, h4, h5, h6",
              );
              if (headingsInSibling.length > 0) {
                contentElements.push(sibling);
              }
            }
          });
        }

        // Strategy 2: Look in parent's siblings
        if (contentElements.length === 0 && parent?.parentElement) {
          const grandParent = parent.parentElement;
          const parentSiblings = Array.from(grandParent.children);
          parentSiblings.forEach((parentSibling) => {
            if (parentSibling !== parent) {
              const headingsInParentSibling = parentSibling.querySelectorAll(
                "h1, h2, h3, h4, h5, h6",
              );
              if (headingsInParentSibling.length > 0) {
                contentElements.push(parentSibling);
              }
            }
          });
        }

        // Strategy 3: Look for common content selectors anywhere in the document
        if (contentElements.length === 0) {
          const commonSelectors = [
            '[role="article"]',
            "article",
            ".content",
            ".article-content",
            "#content",
            "main",
            "[data-content]",
          ];

          commonSelectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
              const headingsInElement = element.querySelectorAll(
                "h1, h2, h3, h4, h5, h6",
              );
              if (headingsInElement.length > 0) {
                contentElements.push(element);
              }
            });
          });
        }

        // Strategy 4: Scan entire document as fallback
        if (contentElements.length === 0) {
          const allHeadings = document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6",
          );
          if (allHeadings.length > 0) {
            contentElements.push(document.body);
          }
        }

        return contentElements;
      };

      const contentElements = findContentElements();
      const sectionData: JumpLinkData[] = [];

      contentElements.forEach((contentElement) => {
        // Find all H2 and H3 elements within the content
        const headings = contentElement.querySelectorAll("h2, h3");

        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName.charAt(1)); // Extract 2 or 3 from H2/H3
          let id = heading.id;

          // If heading doesn't have an ID, create one
          if (!id) {
            const text = heading.textContent || "";
            id = `heading-${text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")}-${index}`;
            heading.id = id;
          }

          const title = heading.textContent?.trim() || "";
          if (title) {
            sectionData.push({
              id,
              title,
              level,
            });
          }
        });
      });

      return sectionData;
    };

    const updateJumpLinks = () => {
      const sections = findArticleHeadings();
      setJumpLinks(sections);
    };

    // Initial scan with longer delay to ensure content is loaded
    const timeoutId = setTimeout(updateJumpLinks, 500);

    // More frequent rescans for dynamic content
    const interval = setInterval(updateJumpLinks, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    if (!showActiveIndicator || jumpLinks.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better UX

      let currentActiveId = "";

      // Find the heading that's currently in view
      for (let i = jumpLinks.length - 1; i >= 0; i--) {
        const element = document.getElementById(jumpLinks[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;

          if (elementTop <= scrollPosition) {
            currentActiveId = jumpLinks[i].id;
            break;
          }
        }
      }

      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [jumpLinks, activeId, showActiveIndicator]);

  return (
    <div
      ref={componentRef}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        display: "flex",
        flexDirection: "column",
        gap: `${gap}px`,
      }}
    >
      {jumpLinks.length > 0 ? (
        jumpLinks.map((link, index) => {
          // Only count H2s for numbering
          const h2Index = jumpLinks
            .slice(0, index + 1)
            .filter((l) => l.level === 2).length;

          return (
            <JumpLink
              key={link.id}
              listNumber={String(h2Index).padStart(2, "0")}
              title={link.title}
              targetId={link.id}
              level={link.level}
              isActive={activeId === link.id}
              numberFontFamily={numberFontFamily}
              numberFontSize={numberFontSize}
              numberColor={numberColor}
              titleFontFamily={titleFontFamily}
              titleFontSize={titleFontSize}
              titleLineHeight={titleLineHeight}
              titleColor={titleColor}
              borderColor={borderColor}
              showNumbers={showNumbers}
              indentSubheadings={indentSubheadings}
              indentSize={indentSize}
              activeColor={activeColor}
              showActiveIndicator={showActiveIndicator}
            />
          );
        })
      ) : (
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f5f5f5",
            color: "#666",
            textAlign: "center",
            fontSize: "14px",
            borderRadius: "4px",
          }}
        >
          No headings found in article content
          <br />
          <small style={{ opacity: 0.7 }}>
            Scanning for H2 and H3 elements...
          </small>
        </div>
      )}
    </div>
  );
}

addPropertyControls(ArticleJumpLinks, {
  gap: {
    type: ControlType.Number,
    title: "Gap",
    defaultValue: 0,
    min: 0,
    max: 50,
    step: 1,
  },
  showNumbers: {
    type: ControlType.Boolean,
    title: "Show Numbers",
    defaultValue: true,
    enabledTitle: "Show",
    disabledTitle: "Hide",
  },
  // Number Typography Controls
  numberFontFamily: {
    type: ControlType.String,
    title: "Number Font Family",
    defaultValue: "JetBrains Mono, monospace",
    placeholder: "JetBrains Mono, monospace",
    hidden: (props: Props) => !props.showNumbers,
  },
  numberFontSize: {
    type: ControlType.Number,
    title: "Number Font Size",
    defaultValue: 14,
    min: 8,
    max: 32,
    step: 1,
    unit: "px",
    hidden: (props: Props) => !props.showNumbers,
  },
  numberColor: {
    type: ControlType.Color,
    title: "Number Color",
    defaultValue: "#666",
    hidden: (props: Props) => !props.showNumbers,
  },
  // Title Typography Controls
  titleFontFamily: {
    type: ControlType.String,
    title: "Title Font Family",
    defaultValue: "inherit",
    placeholder: "inherit",
  },
  titleFontSize: {
    type: ControlType.Number,
    title: "Title Font Size",
    defaultValue: 14,
    min: 8,
    max: 32,
    step: 1,
    unit: "px",
  },
  titleLineHeight: {
    type: ControlType.Number,
    title: "Title Line Height",
    defaultValue: 1.5,
    min: 1,
    max: 3,
    step: 0.1,
  },
  titleColor: {
    type: ControlType.Color,
    title: "Title Color",
    defaultValue: "#333",
  },
  // Styling Controls
  borderColor: {
    type: ControlType.Color,
    title: "Border Color",
    defaultValue: "#e5e5e5",
  },
  indentSubheadings: {
    type: ControlType.Boolean,
    title: "Indent H3",
    defaultValue: true,
    enabledTitle: "Indent",
    disabledTitle: "No Indent",
  },
  indentSize: {
    type: ControlType.Number,
    title: "Indent Size",
    defaultValue: 20,
    min: 0,
    max: 60,
    step: 4,
    unit: "px",
    hidden: (props: Props) => !props.indentSubheadings,
  },
  // Active State Controls
  showActiveIndicator: {
    type: ControlType.Boolean,
    title: "Active Indicator",
    defaultValue: true,
    enabledTitle: "Show",
    disabledTitle: "Hide",
  },
  activeColor: {
    type: ControlType.Color,
    title: "Active Color",
    defaultValue: "#0066FF",
    hidden: (props: Props) => !props.showActiveIndicator,
  },
});
