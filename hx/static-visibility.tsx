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
          // Check for meaningful children by looking for aria-label="filter-item"
          const meaningfulChildren = ref.current.querySelectorAll(
            '[aria-label="filter-item"]',
          );
          setIsVisible(meaningfulChildren.length > 0);
        }
      };

      // Check multiple times as CMS content loads async
      setTimeout(checkVisibility, 0);
      setTimeout(checkVisibility, 100);
      setTimeout(checkVisibility, 500);
    }, []);

    if (!isVisible) return null;

    return <Component {...props} ref={ref} data-onwrap="true" />;
  };
}

export function onLayer(Component: ComponentType): ComponentType {
  return (props) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const checkVisibility = () => {
        // Find any element with onWrap mounted
        const onWrapElement = document.querySelector('[data-onwrap="true"]');

        if (!onWrapElement) {
          // No onWrap in DOM, onLayer has no use - hide it
          setIsVisible(false);
          return;
        }

        // Check if onWrap has filter-item children
        const meaningfulChildren = onWrapElement.querySelectorAll(
          '[aria-label="filter-item"]',
        );

        // Show onLayer only if onWrap has children
        setIsVisible(meaningfulChildren.length > 0);
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

export function onEmpty(Component: ComponentType): ComponentType {
  return (props) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const checkVisibility = () => {
        // Find any element with onWrap mounted
        const onWrapElement = document.querySelector('[data-onwrap="true"]');

        if (!onWrapElement) {
          // No onWrap in DOM, show empty state
          setIsVisible(true);
          return;
        }

        // Check if onWrap has filter-item children
        const meaningfulChildren = onWrapElement.querySelectorAll(
          '[aria-label="filter-item"]',
        );

        // Show only when NO filter-item children present (empty state)
        setIsVisible(meaningfulChildren.length === 0);
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
