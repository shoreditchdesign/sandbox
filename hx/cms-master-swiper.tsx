// Carousel component with CMS collection list support, navigation buttons, heading, and responsive configuration
import { addPropertyControls, ControlType, RenderTarget } from "framer";
import {
  useEffect,
  useRef,
  useState,
  startTransition,
  type CSSProperties,
} from "react";
import React from "react";
import {
  CanvasPlaceholder,
  getCollectionListItems,
} from "https://framer.com/m/CMSSlideshow-xxTt.js@Gwq5XNGR2fw3oxqNnFeg";
import { useFilterContext } from "./cms-filter-context";

interface CarouselProps {
  collectionList?: React.ReactNode[];
  startLayers?: React.ReactNode[];
  endLayers?: React.ReactNode[];
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
export default function CMSSwiper(props: CarouselProps) {
  const {
    collectionList,
    startLayers = [],
    endLayers = [],
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reinitKey, setReinitKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  const isCanvas = RenderTarget.current() === RenderTarget.canvas;

  // Optional: Connect to filter context if available (for filter integration)
  const filterContext = useFilterContext();

  // Extract children from collection list wrapper (ONLY CHANGE FROM ORIGINAL)
  let slides: React.ReactNode[] = [];

  // Add start layers
  if (startLayers && startLayers.length > 0) {
    slides = slides.concat(startLayers);
  }

  // Extract CMS List children and filter out hidden items
  if (!isCanvas) {
    const items = getCollectionListItems(collectionList?.[0]);
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // Check if the item has the hidden class (from filter)
        const itemElement = item.props.children;
        const isHidden = itemElement?.props?.className?.includes("hidden");

        // Only include items that are not hidden
        if (!isHidden) {
          slides.push(item.props.children.props.children);
        }
      }
    }
  }

  // Add end layers
  if (endLayers && endLayers.length > 0) {
    slides = slides.concat(endLayers);
  }

  // Convert children to array of slides (reinitKey ensures recalculation on filter)
  const totalSlides = slides.length;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      startTransition(() => setIsMobile(window.innerWidth < 768));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Listen for filter changes and reinitialize the swiper
  useEffect(() => {
    if (!filterContext) return;

    // Reset to first slide when filter changes
    setCurrentIndex(0);
    setDragOffset(0);
    setIsDragging(false);

    // Force re-render to recalculate visible slides
    setReinitKey((prev) => prev + 1);
  }, [filterContext?.filterVersion]);

  const slidesPerView = isMobile ? slidesPerViewMobile : slidesPerViewDesktop;
  const maxIndex = Math.max(0, totalSlides - slidesPerView);
  const componentGap = isMobile ? componentGapMobile : componentGapDesktop;

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const totalGapWidth = slideGap * (slidesPerView - 1);
      const slideWidth = (containerWidth - totalGapWidth) / slidesPerView;
      const newTranslate = -(currentIndex * (slideWidth + slideGap));
      startTransition(() => setTranslateX(newTranslate));
    }
  }, [currentIndex, slidesPerView, slideGap, isMobile]);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Loop back to start when reaching the end
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, maxIndex, isDragging]);

  const handlePrevious = () => {
    startTransition(() => setCurrentIndex((prev) => Math.max(0, prev - 1)));
  };

  const handleNext = () => {
    startTransition(() =>
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1)),
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableDrag) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !enableDrag) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging || !enableDrag) return;
    setIsDragging(false);

    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
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
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !enableDrag) return;
    setIsDragging(false);

    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
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
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>{heading}</div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
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
        style={{
          width: "100%",
          overflow: "visible",
          position: "relative",
        }}
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
            No slides found. Connect a CMS List to the Collection List slot.
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
            {slides.map((slide, index) => (
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
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {React.isValidElement(slide)
                    ? React.cloneElement(slide as React.ReactElement<any>, {
                        style: {
                          ...(slide.props.style || {}),
                          width: "100%",
                          height: "100%",
                          flex: 1,
                        },
                      })
                    : slide}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

CMSSwiper.displayName = "CMS Swiper";

addPropertyControls(CMSSwiper, {
  collectionList: {
    type: ControlType.ComponentInstance,
    title: "Collection List",
  },
  startLayers: {
    type: ControlType.Array,
    title: "Start Layers",
    control: {
      type: ControlType.ComponentInstance,
    },
    maxCount: 20,
  },
  endLayers: {
    type: ControlType.Array,
    title: "End Layers",
    control: {
      type: ControlType.ComponentInstance,
    },
    maxCount: 20,
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
