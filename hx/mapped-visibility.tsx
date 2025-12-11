import { useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";

export function onMapItem(Component: ComponentType): ComponentType {
  return (props) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const checkVisibility = () => {
        if (!ref.current) return;

        // Find the map-target within this map-item
        const mapTarget = ref.current.querySelector(
          '[aria-label="map-target"]'
        );

        if (!mapTarget) {
          // No map-target found, keep visible by default
          setIsVisible(true);
          return;
        }

        // Get the target text
        const targetText = mapTarget.textContent?.trim() || "";

        // Find the map-source in the DOM (first occurrence)
        const mapSource = document.querySelector('[aria-label="map-source"]');

        if (!mapSource) {
          // No map-source found, keep visible by default
          setIsVisible(true);
          return;
        }

        // Get the source text
        const sourceText = mapSource.textContent?.trim() || "";

        // Show only if source matches target
        setIsVisible(sourceText === targetText);
      };

      // Check multiple times as CMS content loads async
      setTimeout(checkVisibility, 0);
      setTimeout(checkVisibility, 100);
      setTimeout(checkVisibility, 500);
    }, []);

    if (!isVisible) return null;

    return <Component {...props} ref={ref} />;
  };
}

export function onMapTarget(Component: ComponentType): ComponentType {
  return (props) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const checkVisibility = () => {
        if (!ref.current) return;

        // Get the target text from this element
        const targetText = ref.current.textContent?.trim() || "";

        // Find the map-source in the DOM (first occurrence)
        const mapSource = document.querySelector('[aria-label="map-source"]');

        if (!mapSource) {
          // No map-source found, keep visible by default
          setIsVisible(true);
          return;
        }

        // Get the source text
        const sourceText = mapSource.textContent?.trim() || "";

        // Show only if source matches target
        setIsVisible(sourceText === targetText);
      };

      // Check multiple times as CMS content loads async
      setTimeout(checkVisibility, 0);
      setTimeout(checkVisibility, 100);
      setTimeout(checkVisibility, 500);
    }, []);

    if (!isVisible) return null;

    return <Component {...props} ref={ref} />;
  };
}

export function onMapSource(Component: ComponentType): ComponentType {
  return (props) => {
    // Map source is always visible, just pass through
    return <Component {...props} />;
  };
}
