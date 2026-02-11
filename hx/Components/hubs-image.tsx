// Simple image component with URL prop and common image properties
import { addPropertyControls, ControlType } from "framer";
import type { CSSProperties } from "react";
import { useState } from "react";

interface SimpleImageProps {
  url: string;
  fallbackUrl: string;
  objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition: string;
  alt: string;
  style?: CSSProperties;
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function SimpleImage(props: SimpleImageProps) {
  const { url = "", fallbackUrl = "", objectFit, objectPosition, alt } = props;

  const [hasError, setHasError] = useState(false);
  const imageSrc = !url || hasError ? fallbackUrl : url;

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={() => setHasError(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit,
        objectPosition,
      }}
    />
  );
}

addPropertyControls(SimpleImage, {
  url: {
    type: ControlType.Link,
    title: "Image URL",
    defaultValue: "",
  },
  fallbackUrl: {
    type: ControlType.Image,
    title: "Fallback Image",
  },
  objectFit: {
    type: ControlType.Enum,
    title: "Object Fit",
    options: ["contain", "cover", "fill", "none", "scale-down"],
    optionTitles: ["Contain", "Cover", "Fill", "None", "Scale Down"],
    defaultValue: "cover",
  },
  objectPosition: {
    type: ControlType.String,
    title: "Object Position",
    defaultValue: "center",
    placeholder: "e.g. center, top, left, 50% 50%",
  },
  alt: {
    type: ControlType.String,
    title: "Alt Text",
    defaultValue: "Image",
  },
});
