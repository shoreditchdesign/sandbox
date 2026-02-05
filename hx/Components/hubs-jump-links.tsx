import { useEffect, useState, useRef } from "react";
import { addPropertyControls, ControlType } from "framer";

interface JumpLinkData {
  id: string;
  title: string;
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
  // Border color prop
  borderColor?: string;
}

// Custom Jump Link component that handles scrolling directly
function JumpLink({
  listNumber,
  title,
  targetId,
  numberFontFamily,
  numberFontSize,
  numberColor,
  titleFontFamily,
  titleFontSize,
  titleLineHeight,
  titleColor,
  borderColor,
}: {
  listNumber: string;
  title: string;
  targetId: string;
  numberFontFamily?: string;
  numberFontSize?: number;
  numberColor?: string;
  titleFontFamily?: string;
  titleFontSize?: number;
  titleLineHeight?: number;
  titleColor?: string;
  borderColor?: string;
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

  return (
    <div
      onClick={handleClick}
      style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr",
        gap: "12px",
        padding: "8px 0",
        cursor: "pointer",
        borderBottom: `1px solid ${borderColor || "#e5e5e5"}`,
        alignItems: "flex-start",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "40px",
          fontFamily: numberFontFamily || "JetBrains Mono, monospace",
          fontSize: `${numberFontSize || 14}px`,
          color: numberColor || "#ffffff",
        }}
      >
        {listNumber}
      </div>
      <div
        style={{
          fontFamily: titleFontFamily || "inherit",
          fontSize: `${titleFontSize || 14}px`,
          lineHeight: titleLineHeight || 1.5,
          color: titleColor || "#ffffff",
        }}
      >
        {title}
      </div>
    </div>
  );
}

export default function GlobalJumpLinks({
  width = 304,
  height = "fit-content",
  gap = 0,
  numberFontFamily = "JetBrains Mono, monospace",
  numberFontSize = 14,
  numberColor = "#ffffff",
  titleFontFamily = "inherit",
  titleFontSize = 14,
  titleLineHeight = 1.5,
  titleColor = "#ffffff",
  borderColor = "#e5e5e5",
}: Props) {
  const [jumpLinks, setJumpLinks] = useState<JumpLinkData[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const findScrollSections = (): JumpLinkData[] => {
      // Framer prefixes IDs with the section name, so match elements whose ID ends with "hubs-scroll"
      const elements = document.querySelectorAll<HTMLElement>(
        '[id$="hubs-scroll"]',
      );
      const results: JumpLinkData[] = [];

      elements.forEach((el) => {
        const id = el.id;
        const title = el.getAttribute("aria-label");
        if (!title) return;

        // The existing ID (e.g. "product-engine-hubs-scroll") is already unique — use it as the anchor target
        results.push({ id, title });
      });

      return results;
    };

    const timeoutId = setTimeout(() => {
      const sections = findScrollSections();
      setJumpLinks(sections);
    }, 100);

    const interval = setInterval(() => {
      const newSections = findScrollSections();
      setJumpLinks((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newSections)) {
          return newSections;
        }
        return prev;
      });
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);

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
        jumpLinks.map((link, index) => (
          <JumpLink
            key={link.id}
            listNumber={String(index + 1).padStart(2, "0")}
            title={link.title}
            targetId={link.id}
            numberFontFamily={numberFontFamily}
            numberFontSize={numberFontSize}
            numberColor={numberColor}
            titleFontFamily={titleFontFamily}
            titleFontSize={titleFontSize}
            titleLineHeight={titleLineHeight}
            titleColor={titleColor}
            borderColor={borderColor}
          />
        ))
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
          No jumplinks detected
        </div>
      )}
    </div>
  );
}

addPropertyControls(GlobalJumpLinks, {
  gap: {
    type: ControlType.Number,
    title: "Gap",
    defaultValue: 0,
    min: 0,
    max: 50,
    step: 1,
  },
  // Number Typography Controls
  numberFontFamily: {
    type: ControlType.String,
    title: "Number Font Family",
    defaultValue: "JetBrains Mono, monospace",
    placeholder: "JetBrains Mono, monospace",
  },
  numberFontSize: {
    type: ControlType.Number,
    title: "Number Font Size",
    defaultValue: 14,
    min: 8,
    max: 32,
    step: 1,
    unit: "px",
  },
  numberColor: {
    type: ControlType.Color,
    title: "Number Color",
    defaultValue: "#ffffff",
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
    defaultValue: "#ffffff",
  },
  // Border Color Control
  borderColor: {
    type: ControlType.Color,
    title: "Border Color",
    defaultValue: "#e5e5e5",
  },
});
