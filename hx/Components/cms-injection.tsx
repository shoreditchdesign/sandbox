import { useEffect } from "react";
import type { ComponentType } from "react";

export function withCMSInjection(Component: ComponentType): ComponentType {
  return (props) => {
    useEffect(() => {
      setTimeout(() => {
        const container = document.querySelector(`.${props.className}`);
        if (!container) return;

        // Find all placeholder paragraphs with {{quote}} and {{stats}}
        const allParagraphs = Array.from(container.querySelectorAll("p"));

        const quotePlaceholders = allParagraphs.filter(
          (p) => p.textContent?.trim() === "{{quote}}",
        );

        const statsPlaceholders = allParagraphs.filter((p) =>
          p.textContent?.trim().startsWith("{{stats"),
        );

        // Find all source wrapper divs
        const quoteWrappers = Array.from(
          container.querySelectorAll('[aria-label="quote-wrapper"]'),
        );

        const statsWrappers = Array.from(
          container.querySelectorAll('[aria-label="stats-wrapper"]'),
        );

        // Store parent containers to hide after injection
        const parentContainersToHide = new Set<HTMLElement>();

        quoteWrappers.forEach((wrapper) => {
          const parent = (wrapper as HTMLElement).parentElement;
          if (parent) parentContainersToHide.add(parent);
        });

        statsWrappers.forEach((wrapper) => {
          const parent = (wrapper as HTMLElement).parentElement;
          if (parent) parentContainersToHide.add(parent);
        });

        // Replace {{quote}} placeholders with quote-wrapper divs (exhaustive matching)
        const quoteCount = Math.min(
          quotePlaceholders.length,
          quoteWrappers.length,
        );
        for (let i = 0; i < quoteCount; i++) {
          const placeholder = quotePlaceholders[i];
          const wrapper = quoteWrappers[i] as HTMLElement;

          // Clone the wrapper to avoid moving the original
          const clonedWrapper = wrapper.cloneNode(true) as HTMLElement;

          // Set width to 100% for responsive behavior
          clonedWrapper.style.width = "100%";

          // Replace the placeholder with the cloned wrapper
          placeholder.replaceWith(clonedWrapper);
        }

        // Replace first {{stats}} placeholder with first stats-wrapper div
        if (statsPlaceholders.length > 0 && statsWrappers.length > 0) {
          const placeholder = statsPlaceholders[0];
          const wrapper = statsWrappers[0] as HTMLElement;

          // Clone the wrapper to avoid moving the original
          const clonedWrapper = wrapper.cloneNode(true) as HTMLElement;

          // Set width to 100% for responsive behavior
          clonedWrapper.style.width = "100%";

          placeholder.replaceWith(clonedWrapper);
        }

        // Hide original parent containers
        parentContainersToHide.forEach((parent) => {
          parent.style.display = "none";
        });
      }, 0);
    }, [props.className]);

    return <Component {...props} />;
  };
}
