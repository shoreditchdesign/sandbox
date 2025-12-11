import { useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";

export function onOnlyChild(Component: ComponentType): ComponentType {
  return (props) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const checkVisibility = () => {
        if (ref.current && ref.current.parentElement) {
          const siblingCount = ref.current.parentElement.children.length;
          setIsVisible(siblingCount > 1);
        }
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

export function onWrap(Component: ComponentType): ComponentType {
  return (props) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const checkVisibility = () => {
        if (ref.current) {
          // Check for meaningful children by looking for aria-label="filter-item" that are NOT hidden
          const allChildren = ref.current.querySelectorAll(
            '[aria-label="filter-item"]',
          );
          const visibleChildren = Array.from(allChildren).filter(
            (child) => !child.classList.contains("hidden"),
          );
          setIsVisible(visibleChildren.length > 0);
        }
      };

      // Check multiple times as CMS content loads async
      setTimeout(checkVisibility, 0);
      setTimeout(checkVisibility, 100);
      setTimeout(checkVisibility, 500);

      // Set up MutationObserver to watch for class changes on filter items
      if (ref.current) {
        const observer = new MutationObserver(() => {
          checkVisibility();
        });

        // Observe the entire subtree for class attribute changes
        observer.observe(ref.current, {
          attributes: true,
          attributeFilter: ["class"],
          subtree: true,
        });

        return () => observer.disconnect();
      }
    }, []);

    // Use CSS hiding instead of returning null to keep elements in DOM for filter options
    const style = isVisible ? {} : { display: "none" };

    return <Component {...props} ref={ref} data-onwrap="true" style={style} />;
  };
}

export function onLayer(Component: ComponentType): ComponentType {
  return (props) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const checkVisibility = () => {
        // Find all elements with onWrap mounted
        const onWrapElements = document.querySelectorAll(
          '[data-onwrap="true"]',
        );

        if (onWrapElements.length === 0) {
          // No onWrap in DOM, onLayer has no use - hide it
          setIsVisible(false);
          return;
        }

        // Check across ALL onWrap elements for any visible filter-item children
        let totalVisibleChildren = 0;
        onWrapElements.forEach((onWrapElement) => {
          const allChildren = onWrapElement.querySelectorAll(
            '[aria-label="filter-item"]',
          );
          const visibleChildren = Array.from(allChildren).filter(
            (child) => !child.classList.contains("hidden"),
          );
          totalVisibleChildren += visibleChildren.length;
        });

        // Show onLayer only if any onWrap has visible children
        setIsVisible(totalVisibleChildren > 0);
      };

      // Check multiple times as CMS content loads async
      setTimeout(checkVisibility, 0);
      setTimeout(checkVisibility, 100);
      setTimeout(checkVisibility, 500);

      // Set up MutationObserver to watch for class changes on filter items
      // We need to observe all onWrap elements
      const onWrapElements = document.querySelectorAll('[data-onwrap="true"]');
      const observers: MutationObserver[] = [];

      onWrapElements.forEach((onWrapElement) => {
        const observer = new MutationObserver(() => {
          checkVisibility();
        });

        observer.observe(onWrapElement, {
          attributes: true,
          attributeFilter: ["class"],
          subtree: true,
        });

        observers.push(observer);
      });

      return () => {
        observers.forEach((observer) => observer.disconnect());
      };
    }, []);

    if (!isVisible) return null;

    return <Component {...props} ref={ref} />;
  };
}

export function onEmpty(Component: ComponentType): ComponentType {
  return (props) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const checkVisibility = () => {
        // Find all elements with onWrap mounted
        const onWrapElements = document.querySelectorAll(
          '[data-onwrap="true"]',
        );

        if (onWrapElements.length === 0) {
          // No onWrap in DOM, show empty state
          setIsVisible(true);
          return;
        }

        // Check across ALL onWrap elements for any visible filter-item children
        let totalVisibleChildren = 0;
        onWrapElements.forEach((onWrapElement) => {
          const allChildren = onWrapElement.querySelectorAll(
            '[aria-label="filter-item"]',
          );
          const visibleChildren = Array.from(allChildren).filter(
            (child) => !child.classList.contains("hidden"),
          );
          totalVisibleChildren += visibleChildren.length;
        });

        // Show only when NO visible filter-item children present across all wrappers
        setIsVisible(totalVisibleChildren === 0);
      };

      // Check multiple times as CMS content loads async
      setTimeout(checkVisibility, 0);
      setTimeout(checkVisibility, 100);
      setTimeout(checkVisibility, 500);

      // Set up MutationObserver to watch for class changes on filter items
      // We need to observe all onWrap elements
      const onWrapElements = document.querySelectorAll('[data-onwrap="true"]');
      const observers: MutationObserver[] = [];

      onWrapElements.forEach((onWrapElement) => {
        const observer = new MutationObserver(() => {
          checkVisibility();
        });

        observer.observe(onWrapElement, {
          attributes: true,
          attributeFilter: ["class"],
          subtree: true,
        });

        observers.push(observer);
      });

      return () => {
        observers.forEach((observer) => observer.disconnect());
      };
    }, []);

    if (!isVisible) return null;

    return <Component {...props} ref={ref} />;
  };
}
