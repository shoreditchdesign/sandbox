import { useEffect } from "react";
import type { ComponentType } from "react";

// ============================================
// CONFIGURABLE CSS PROPERTIES
// ============================================

// Label styles
const LABEL_FONT_SIZE = "var(--paragraph--font-size-m)";
const LABEL_LINE_HEIGHT = "var(--paragraph--line-height-m)";
const LABEL_FONT_WEIGHT = "400";
const LABEL_MARGIN_BOTTOM = "0.5rem";

// Input & Select styles
const INPUT_BORDER = "1px solid var(--_themes---site--border--border-primary)";
const INPUT_BORDER_RADIUS = "var(--radius--radius-md)";
const INPUT_BACKGROUND_COLOR = "var(--_themes---site--bg--bg-secondary)";
const INPUT_TEXT_COLOR = "var(--_themes---site--text--text-primary)";
const INPUT_FONT_SIZE = "var(--paragraph--font-size-m)";
const INPUT_LINE_HEIGHT = "var(--paragraph--line-height-m)";
const INPUT_MIN_HEIGHT = "3rem";
const INPUT_MARGIN = "0 0 1rem 0";
const INPUT_PADDING = "0.75rem 1rem";
const INPUT_WIDTH = "100%";

// Textarea styles
const TEXTAREA_BORDER = "1px solid var(--_themes---site--border--border-primary)";
const TEXTAREA_BORDER_RADIUS = "var(--radius--radius-md)";
const TEXTAREA_BACKGROUND_COLOR = "var(--_themes---site--bg--bg-secondary)";
const TEXTAREA_TEXT_COLOR = "var(--_themes---site--text--text-primary)";
const TEXTAREA_FONT_SIZE = "var(--paragraph--font-size-m)";
const TEXTAREA_LINE_HEIGHT = "var(--paragraph--line-height-m)";
const TEXTAREA_MIN_HEIGHT = "15rem";
const TEXTAREA_MARGIN = "0 0 1rem 0";
const TEXTAREA_PADDING = "0.75rem 1rem";
const TEXTAREA_FONT_WEIGHT = "400";
const TEXTAREA_WIDTH = "100%";

// Checkbox styles
const CHECKBOX_WIDTH = "auto";
const CHECKBOX_MIN_HEIGHT = "auto";
const CHECKBOX_MARGIN = "0 0.5rem 0 0";
const CHECKBOX_PADDING = "0";
const CHECKBOX_ACCENT_COLOR = "var(--_themes---brand--green--green)";

// Focus states
const FOCUS_BORDER_COLOR = "var(--_themes---site--border--border-brand)";

// Button/Submit styles
const BUTTON_COLOR = "var(--_themes---neutral--black--black)";
const BUTTON_BACKGROUND = "linear-gradient(180deg, #4ab765 0%, #61cdc0 100%)";
const BUTTON_BORDER = "2px solid #0000";
const BUTTON_BORDER_RADIUS = "100rem";
const BUTTON_PADDING = "0.625rem 1rem 0.75rem";
const BUTTON_MARGIN_TOP = "1.5rem";
const BUTTON_GAP = "1rem";
const BUTTON_HOVER_BACKGROUND =
  "linear-gradient(94deg, #86fca4 0.04%, #80fff0 99.96%)";
const BUTTON_ACTIVE_BACKGROUND =
  "linear-gradient(94deg, #4aff77 0.04%, #2dffe6 99.96%)";

// Link styles
const LINK_COLOR = "var(--_themes---site--text--text-primary)";
const LINK_HOVER_COLOR = "var(--_themes---site--text--text-brand)";
const LINK_TRANSITION_DURATION = "0.15s";

// Paragraph styles
const PARAGRAPH_COLOR = "var(--_themes---site--text--text-secondary)";

// ============================================
// CODE OVERRIDE FUNCTION
// ============================================

export function embedFormStyles(Component: ComponentType): ComponentType {
  return (props) => {
    useEffect(() => {
      // Find the element with aria-label="embed-form"
      const formContainer = document.querySelector('[aria-label="embed-form"]');

      if (formContainer) {
        // Apply form block styles to the container
        const container = formContainer as HTMLElement;
        container.style.display = "flex";
        container.style.flexFlow = "column";
        container.style.justifyContent = "flex-start";
        container.style.alignSelf = "stretch";
        container.style.alignItems = "stretch";

        // Style all labels
        const labels = formContainer.querySelectorAll("label");
        labels.forEach((label) => {
          const el = label as HTMLElement;
          el.style.fontSize = LABEL_FONT_SIZE;
          el.style.lineHeight = LABEL_LINE_HEIGHT;
          el.style.fontWeight = LABEL_FONT_WEIGHT;
          el.style.marginBottom = LABEL_MARGIN_BOTTOM;
        });

        // Style all inputs (except checkbox and submit)
        const inputs = formContainer.querySelectorAll(
          'input:not([type="checkbox"]):not([type="submit"])',
        );
        inputs.forEach((input) => {
          const el = input as HTMLElement;
          el.style.border = INPUT_BORDER;
          el.style.borderRadius = INPUT_BORDER_RADIUS;
          el.style.backgroundColor = INPUT_BACKGROUND_COLOR;
          el.style.color = INPUT_TEXT_COLOR;
          el.style.fontSize = INPUT_FONT_SIZE;
          el.style.lineHeight = INPUT_LINE_HEIGHT;
          el.style.minHeight = INPUT_MIN_HEIGHT;
          el.style.margin = INPUT_MARGIN;
          el.style.padding = INPUT_PADDING;
          el.style.width = INPUT_WIDTH;
        });

        // Style all select elements
        const selects = formContainer.querySelectorAll("select");
        selects.forEach((select) => {
          const el = select as HTMLElement;
          el.style.border = INPUT_BORDER;
          el.style.borderRadius = INPUT_BORDER_RADIUS;
          el.style.backgroundColor = INPUT_BACKGROUND_COLOR;
          el.style.color = INPUT_TEXT_COLOR;
          el.style.fontSize = INPUT_FONT_SIZE;
          el.style.lineHeight = INPUT_LINE_HEIGHT;
          el.style.minHeight = INPUT_MIN_HEIGHT;
          el.style.margin = INPUT_MARGIN;
          el.style.padding = INPUT_PADDING;
          el.style.width = INPUT_WIDTH;
        });

        // Style all textareas
        const textareas = formContainer.querySelectorAll("textarea");
        textareas.forEach((textarea) => {
          const el = textarea as HTMLElement;
          el.style.border = TEXTAREA_BORDER;
          el.style.borderRadius = TEXTAREA_BORDER_RADIUS;
          el.style.backgroundColor = TEXTAREA_BACKGROUND_COLOR;
          el.style.color = TEXTAREA_TEXT_COLOR;
          el.style.fontSize = TEXTAREA_FONT_SIZE;
          el.style.lineHeight = TEXTAREA_LINE_HEIGHT;
          el.style.minHeight = TEXTAREA_MIN_HEIGHT;
          el.style.margin = TEXTAREA_MARGIN;
          el.style.padding = TEXTAREA_PADDING;
          el.style.fontWeight = TEXTAREA_FONT_WEIGHT;
          el.style.width = TEXTAREA_WIDTH;
        });

        // Style checkboxes
        const checkboxes = formContainer.querySelectorAll(
          'input[type="checkbox"]',
        );
        checkboxes.forEach((checkbox) => {
          const el = checkbox as HTMLElement;
          el.style.width = CHECKBOX_WIDTH;
          el.style.minHeight = CHECKBOX_MIN_HEIGHT;
          el.style.margin = CHECKBOX_MARGIN;
          el.style.padding = CHECKBOX_PADDING;
          el.style.display = "inline-block";
          el.style.verticalAlign = "middle";
          // @ts-ignore - accentColor is valid but TypeScript may not recognize it
          el.style.accentColor = CHECKBOX_ACCENT_COLOR;
        });

        // Style submit buttons and regular buttons
        const buttons = formContainer.querySelectorAll(
          'input[type="submit"], button',
        );
        buttons.forEach((button) => {
          const el = button as HTMLElement;
          el.style.color = BUTTON_COLOR;
          el.style.textAlign = "center";
          el.style.background = BUTTON_BACKGROUND;
          el.style.border = BUTTON_BORDER;
          el.style.borderRadius = BUTTON_BORDER_RADIUS;
          el.style.padding = BUTTON_PADDING;
          el.style.marginTop = BUTTON_MARGIN_TOP;
          el.style.columnGap = BUTTON_GAP;
          el.style.rowGap = BUTTON_GAP;
          el.style.flexDirection = "row";
          el.style.justifyContent = "center";
          el.style.alignItems = "center";
          el.style.display = "flex";
          el.style.textDecoration = "none";
          el.style.transition = "all 0.3s";
          el.style.cursor = "pointer";
        });

        // Style links
        const links = formContainer.querySelectorAll("a");
        links.forEach((link) => {
          const el = link as HTMLElement;
          el.style.color = LINK_COLOR;
          el.style.transitionProperty = "color";
          el.style.transitionDuration = LINK_TRANSITION_DURATION;
          el.style.transitionTimingFunction = "ease";
        });

        // Style paragraphs
        const paragraphs = formContainer.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const el = p as HTMLElement;
          el.style.color = PARAGRAPH_COLOR;
        });

        // Style lists
        const lists = formContainer.querySelectorAll("ul, ol, li");
        lists.forEach((list) => {
          const el = list as HTMLElement;
          el.style.paddingLeft = "0";
        });

        // Add focus, hover, and active event listeners
        const focusableElements = formContainer.querySelectorAll(
          "input, select, textarea",
        );
        focusableElements.forEach((element) => {
          element.addEventListener("focus", function () {
            (this as HTMLElement).style.borderColor = FOCUS_BORDER_COLOR;
          });
          element.addEventListener("blur", function () {
            if ((this as HTMLInputElement).type === "checkbox") return;
            (this as HTMLElement).style.borderColor =
              INPUT_BORDER.split(" ").pop() || "";
          });
        });

        buttons.forEach((button) => {
          button.addEventListener("mouseenter", function () {
            (this as HTMLElement).style.background = BUTTON_HOVER_BACKGROUND;
          });
          button.addEventListener("mouseleave", function () {
            (this as HTMLElement).style.background = BUTTON_BACKGROUND;
          });
          button.addEventListener("mousedown", function () {
            (this as HTMLElement).style.background = BUTTON_ACTIVE_BACKGROUND;
          });
          button.addEventListener("mouseup", function () {
            (this as HTMLElement).style.background = BUTTON_HOVER_BACKGROUND;
          });
        });

        links.forEach((link) => {
          link.addEventListener("mouseenter", function () {
            (this as HTMLElement).style.color = LINK_HOVER_COLOR;
          });
          link.addEventListener("mouseleave", function () {
            (this as HTMLElement).style.color = LINK_COLOR;
          });
        });
      }
    }, []);

    return <Component {...props} />;
  };
}
