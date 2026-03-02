// CMS Swiper v3 — renders the CMS collection list in a hidden div, then reads
// the DOM after render to clone [aria-label="swiper-slide"] nodes into the swiper.
import { addPropertyControls, ControlType, RenderTarget } from "framer";
import {
  useEffect,
  useRef,
  useState,
  startTransition,
  type CSSProperties,
} from "react";
import React from "react";

interface CarouselProps {
  collectionList?: React.ReactNode;
  heading: React.ReactNode;
  previousButton: React.ReactNode;
  nextButton: React.ReactNode;
  slidesPerViewDesktop: number;
  slidesPerViewMobile: number;
  slideGap: number;
  enableDrag: boolean;
  componentGapDesktop: number;
  componentGapMobile: number;
  autoplay: boolean;
  autoplayDelay: number;
  style?: CSSProperties;
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function CMSSwiperV3(props: CarouselProps) {
  const {
    collectionList,
    heading,
    previousButton,
    nextButton,
    slidesPerViewDesktop = 3,
    slidesPerViewMobile = 1,
    slideGap = 20,
    enableDrag = true,
    componentGapDesktop = 40,
    componentGapMobile = 24,
    autoplay = false,
    autoplayDelay = 3000,
  } = props;

  const [slideNodes, setSlideNodes] = useState<HTMLElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const hiddenRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  const isCanvas = RenderTarget.current() === RenderTarget.canvas;

  // Unwrap array wrapper Framer sometimes adds
  const rawNode = Array.isArray(collectionList)
    ? collectionList[0]
    : collectionList;

  // After the hidden CMS list renders, query for aria-label="swiper-slide" nodes
  // and clone them into state so the swiper can render them.
  useEffect(() => {
    if (!hiddenRef.current) return;

    const read = () => {
      const found = hiddenRef.current!.querySelectorAll<HTMLElement>(
        '[aria-label="swiper-slide"]',
      );
      if (found.length > 0) {
        setSlideNodes(Array.from(found));
      }
    };

    // Read immediately, then also observe for CMS async renders
    read();
    const observer = new MutationObserver(read);
    observer.observe(hiddenRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [rawNode]);

  const totalSlides = slideNodes.length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () =>
      startTransition(() => setIsMobile(window.innerWidth < 768));
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const slidesPerView = isMobile ? slidesPerViewMobile : slidesPerViewDesktop;
  const maxIndex = Math.max(0, totalSlides - slidesPerView);
  const componentGap = isMobile ? componentGapMobile : componentGapDesktop;

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const totalGapWidth = slideGap * (slidesPerView - 1);
      const slideWidth = (containerWidth - totalGapWidth) / slidesPerView;
      startTransition(() =>
        setTranslateX(-(currentIndex * (slideWidth + slideGap))),
      );
    }
  }, [currentIndex, slidesPerView, slideGap, isMobile]);

  useEffect(() => {
    if (!autoplay || isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, maxIndex, isDragging]);

  const handlePrevious = () =>
    startTransition(() => setCurrentIndex((prev) => Math.max(0, prev - 1)));

  const handleNext = () =>
    startTransition(() =>
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1)),
    );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableDrag) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !enableDrag) return;
    setDragOffset(e.clientX - startX);
  };

  const handleMouseUp = () => {
    if (!isDragging || !enableDrag) return;
    setIsDragging(false);
    if (Math.abs(dragOffset) > 50) dragOffset > 0 ? handlePrevious() : handleNext();
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableDrag) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !enableDrag) return;
    setDragOffset(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !enableDrag) return;
    setIsDragging(false);
    if (Math.abs(dragOffset) > 50) dragOffset > 0 ? handlePrevious() : handleNext();
    setDragOffset(0);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: componentGap,
      }}
    >
      {/* Hidden CMS render — DOM is real, we query it after mount */}
      {!isCanvas && rawNode && (
        <div
          ref={hiddenRef}
          style={{
            position: "absolute",
            visibility: "hidden",
            pointerEvents: "none",
            width: "100%",
          }}
        >
          {rawNode}
        </div>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>{heading}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            onClick={handlePrevious}
            style={{
              cursor: currentIndex > 0 ? "pointer" : "not-allowed",
              opacity: currentIndex > 0 ? 1 : 0.3,
              pointerEvents: currentIndex > 0 ? "auto" : "none",
            }}
          >
            {previousButton}
          </div>
          <div
            onClick={handleNext}
            style={{
              cursor: currentIndex < maxIndex ? "pointer" : "not-allowed",
              opacity: currentIndex < maxIndex ? 1 : 0.3,
              pointerEvents: currentIndex < maxIndex ? "auto" : "none",
            }}
          >
            {nextButton}
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        style={{ width: "100%", overflow: "visible", position: "relative" }}
      >
        {totalSlides === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              background: "#f5f5f5",
              borderRadius: "8px",
              color: "#666",
            }}
          >
            No slides found. Connect a CMS List and mark each card with
            aria-label="swiper-slide".
          </div>
        ) : (
          <div
            ref={slidesRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              display: "flex",
              alignItems: "stretch",
              gap: slideGap,
              transform: `translateX(${translateX + dragOffset}px)`,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
              cursor: enableDrag
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "default",
              userSelect: "none",
            }}
          >
            {slideNodes.map((domNode, index) => (
              <div
                key={index}
                style={{
                  flex: `0 0 calc((100% - ${slideGap * (slidesPerView - 1)}px) / ${slidesPerView})`,
                  minWidth: 0,
                  maxWidth: `calc((100% - ${slideGap * (slidesPerView - 1)}px) / ${slidesPerView})`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  ref={(el) => {
                    if (el && !el.hasChildNodes()) {
                      const clone = domNode.cloneNode(true) as HTMLElement;
                      clone.style.width = "100%";
                      clone.style.height = "100%";
                      clone.style.flex = "1";
                      el.appendChild(clone);
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

CMSSwiperV3.displayName = "CMS Swiper V3";

addPropertyControls(CMSSwiperV3, {
  collectionList: {
    type: ControlType.ComponentInstance,
    title: "Collection List",
  },
  heading: {
    type: ControlType.ComponentInstance,
    title: "Heading",
  },
  previousButton: {
    type: ControlType.ComponentInstance,
    title: "Previous Button",
  },
  nextButton: {
    type: ControlType.ComponentInstance,
    title: "Next Button",
  },
  slidesPerViewDesktop: {
    type: ControlType.Number,
    title: "Slides (Desktop)",
    defaultValue: 3,
    min: 1,
    max: 10,
    step: 0.1,
    displayStepper: true,
  },
  slidesPerViewMobile: {
    type: ControlType.Number,
    title: "Slides (Mobile)",
    defaultValue: 1,
    min: 1,
    max: 5,
    step: 0.1,
    displayStepper: true,
  },
  slideGap: {
    type: ControlType.Number,
    title: "Slide Gap",
    defaultValue: 20,
    min: 0,
    max: 100,
    step: 1,
    unit: "px",
  },
  enableDrag: {
    type: ControlType.Boolean,
    title: "Enable Drag",
    defaultValue: true,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  componentGapDesktop: {
    type: ControlType.Number,
    title: "Component Gap (Desktop)",
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    unit: "px",
  },
  componentGapMobile: {
    type: ControlType.Number,
    title: "Component Gap (Mobile)",
    defaultValue: 24,
    min: 0,
    max: 100,
    step: 1,
    unit: "px",
  },
  autoplay: {
    type: ControlType.Boolean,
    title: "Autoplay",
    defaultValue: false,
    enabledTitle: "On",
    disabledTitle: "Off",
  },
  autoplayDelay: {
    type: ControlType.Number,
    title: "Autoplay Delay",
    defaultValue: 3000,
    min: 500,
    max: 10000,
    step: 100,
    unit: "ms",
    hidden: (props) => !props.autoplay,
  },
});
