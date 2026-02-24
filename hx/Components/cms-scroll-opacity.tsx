import { useEffect, useRef } from "react";
import type { ComponentType } from "react";

// ─── Opacity zone thresholds (fraction of wrapper height) ───────────────────
// 0–20%  → 0.2   |  20–40%  → 0.6   |  40–60%  → 1.0
// 60–80% → 0.6   |  80–100% → 0.2
const TRANSITION_DURATION = "0.25s";
const TRANSITION_EASING = "ease";

function getOpacity(centerFrac: number): number {
  if (centerFrac < 0.2 || centerFrac > 0.8) return 0.2;
  if (centerFrac < 0.4 || centerFrac > 0.6) return 0.6;
  return 1;
}

export default function cmsScrollOpacity(
  Component: ComponentType,
): ComponentType {
  return (props) => {
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
      // ── 1. Locate wrapper ──────────────────────────────────────────────────
      const findWrapper = (): HTMLElement | null =>
        document.querySelector(
          '[aria-label="scroll-opacity-wrapper"]',
        ) as HTMLElement | null;

      const attachRaf = (wrapper: HTMLElement) => {
        // ── 2. Per-item opacity update via rAF ────────────────────────────
        // Items move via CSS transform on the <ul> (ticker/marquee), not scroll,
        // so we poll getBoundingClientRect on every animation frame instead.
        const tick = () => {
          const items = wrapper.querySelectorAll<HTMLElement>(
            '[aria-label="scroll-opacity-item"]',
          );

          if (items.length > 0) {
            // Use the overflow:clip child as the visible viewport bounds —
            // the wrapper itself may be taller than the clipped visible area
            const clipEl =
              (wrapper.querySelector<HTMLElement>('[style*="overflow-y: clip"]') ??
               wrapper.querySelector<HTMLElement>('[style*="overflow-y:clip"]') ??
               wrapper);
            const wRect = clipEl.getBoundingClientRect();
            const wHeight = wRect.height;

            if (wHeight > 0) {
              items.forEach((item) => {
                const iRect = item.getBoundingClientRect();

                // Centre of item relative to top of wrapper (px → fraction)
                const centerPx = iRect.top + iRect.height / 2 - wRect.top;
                const centerFrac = Math.min(Math.max(centerPx / wHeight, 0), 1);
                const opacity = getOpacity(centerFrac);

                // Only write to the DOM when the value actually changes
                // to avoid unnecessary style recalcs
                const current = parseFloat(item.style.opacity);
                if (isNaN(current) || Math.abs(current - opacity) > 0.01) {
                  item.style.opacity = String(opacity);
                  item.style.transition = `opacity ${TRANSITION_DURATION} ${TRANSITION_EASING}`;
                }
              });
            }
          }

          rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
          if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
      };

      // ── 3. Retry via MutationObserver until wrapper appears ───────────────
      const existing = findWrapper();
      if (existing) {
        return attachRaf(existing);
      }

      let cleanup: (() => void) | undefined;

      const observer = new MutationObserver(() => {
        const wrapper = findWrapper();
        if (wrapper) {
          observer.disconnect();
          cleanup = attachRaf(wrapper);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        cleanup?.();
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return <Component {...props} />;
  };
}
