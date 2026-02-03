// Ashby job board embed component that renders application forms
import { addPropertyControls, ControlType } from "framer";
import { useEffect, useState, useRef, type CSSProperties } from "react";

// Customizable constants

// Aria label selector for job posting ID
const FORM_ID_LABEL = "form-id";

// Default Ashby settings
const DEFAULT_ASHBY_BASE_URL = "https://jobs.ashbyhq.com/hyperexponential";
const DEFAULT_DISPLAY_MODE = "application-form-only";
const DEFAULT_AUTO_SCROLL = false;
const DEFAULT_VERBOSE_LOGGING = false;

// Container styling
const CONTAINER_MIN_HEIGHT = "600px";

// Error state styling
const ERROR_FONT_FAMILY = "FFF Acid Grotesk, sans-serif";
const ERROR_TEXT_COLOR = "#DC2626";
const ERROR_BACKGROUND = "#FEE2E2";
const ERROR_BORDER_COLOR = "#FCA5A5";
const ERROR_BORDER_RADIUS = "8px";
const ERROR_PADDING = "16px 20px";
const ERROR_FONT_SIZE = "14px";
const ERROR_LINE_HEIGHT = "150%";

// Loading state styling
const LOADING_BACKGROUND = "#F9FAFB";
const LOADING_TEXT_COLOR = "#6B7280";

interface AshbyJobBoardProps {
  ashbyBaseUrl?: string;
  displayMode?: "application-form-only" | "full-job-board";
  autoScroll?: boolean;
  verboseLogging?: boolean;
  customCssUrl?: string;
  loadingContent?: React.ReactNode;
  errorContent?: React.ReactNode;
  style?: CSSProperties;
  onApplicationSubmitted?: () => void;
  successRedirectUrl?: string;
}

// Extend Window interface for Ashby
declare global {
  interface Window {
    __Ashby?: {
      settings?: {
        ashbyBaseJobBoardUrl: string;
        displayMode: string;
        jobPostingId?: string;
        autoLoad: boolean;
        autoScroll: boolean;
        verboseLogging: boolean;
        customCssUrl?: string;
      };
      iFrame?: () => {
        load: (config: { jobPostingId: string }) => void;
      };
    };
  }
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function CMSFormRender(props: AshbyJobBoardProps) {
  const {
    ashbyBaseUrl = DEFAULT_ASHBY_BASE_URL,
    displayMode = DEFAULT_DISPLAY_MODE,
    autoScroll = DEFAULT_AUTO_SCROLL,
    verboseLogging = DEFAULT_VERBOSE_LOGGING,
    customCssUrl,
    loadingContent,
    errorContent,
    onApplicationSubmitted,
    successRedirectUrl,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [jobPostingId, setJobPostingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Extract job posting ID from DOM
  const extractJobPostingId = (): string | null => {
    const formIdElement = document.querySelector(
      `[aria-label="${FORM_ID_LABEL}"]`,
    );

    if (!formIdElement) {
      console.warn(`No element found with aria-label="${FORM_ID_LABEL}"`);
      return null;
    }

    // Try to get ID from data attribute first, then text content
    const id =
      formIdElement.getAttribute("data-job-id") ||
      formIdElement.textContent?.trim();

    if (!id) {
      console.warn("Job posting ID is empty");
      return null;
    }

    return id;
  };

  // Initialize Ashby embed
  useEffect(() => {
    if (typeof window === "undefined") {
      setHasError(true);
      setErrorMessage("Window object not available");
      setIsLoading(false);
      return;
    }

    // Extract job posting ID
    const extractedId = extractJobPostingId();

    if (!extractedId) {
      setHasError(true);
      setErrorMessage(
        `No job posting ID found. Add an element with aria-label="${FORM_ID_LABEL}" containing the job posting ID.`,
      );
      setIsLoading(false);
      return;
    }

    setJobPostingId(extractedId);

    // Initialize Ashby settings
    window.__Ashby = {
      settings: {
        ashbyBaseJobBoardUrl: ashbyBaseUrl,
        displayMode: displayMode,
        jobPostingId: extractedId,
        autoLoad: true,
        autoScroll: autoScroll,
        verboseLogging: verboseLogging,
        ...(customCssUrl && { customCssUrl }),
      },
    };

    // Check if script already exists
    const existingScript = document.getElementById("ashby-embed-script");

    if (existingScript) {
      // Script already loaded, just trigger load
      if (window.__Ashby?.iFrame) {
        try {
          window.__Ashby.iFrame().load({ jobPostingId: extractedId });
          setIsLoaded(true);
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading Ashby iframe:", error);
          setHasError(true);
          setErrorMessage("Failed to load job posting");
          setIsLoading(false);
        }
      }
      return;
    }

    // Load Ashby script
    const script = document.createElement("script");
    script.id = "ashby-embed-script";
    script.src = `${ashbyBaseUrl}/embed?version=2`;
    script.async = true;

    script.onload = () => {
      if (isMountedRef.current) {
        scriptLoadedRef.current = true;
        setIsLoaded(true);
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      if (isMountedRef.current) {
        console.error("Failed to load Ashby embed script");
        setHasError(true);
        setErrorMessage("Failed to load Ashby embed script");
        setIsLoading(false);
      }
    };

    document.body.appendChild(script);

    return () => {
      isMountedRef.current = false;
      // Note: We don't remove the script on unmount as it might be used by other instances
    };
  }, [ashbyBaseUrl, displayMode, autoScroll, verboseLogging, customCssUrl]);

  // Listen for postMessage events from Ashby iframe
  useEffect(() => {
    if (!isLoaded) return;

    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Ashby domain
      if (!event.origin.includes("ashbyhq.com")) return;

      const data = event.data;

      if (verboseLogging) {
        console.log("Ashby postMessage received:", data);
      }

      // Check for application submission events
      // Ashby may send different event types - log them to discover the exact format
      if (
        data?.type === "applicationSubmitted" ||
        data?.type === "application_submitted" ||
        data?.event === "applicationSubmitted" ||
        data?.event === "application_submitted" ||
        data?.action === "submitted" ||
        (typeof data === "string" && data.includes("submitted"))
      ) {
        if (verboseLogging) {
          console.log("Application submitted detected!");
        }

        onApplicationSubmitted?.();

        if (successRedirectUrl) {
          window.location.href = successRedirectUrl;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isLoaded, verboseLogging, onApplicationSubmitted, successRedirectUrl]);

  // Error state UI
  if (hasError) {
    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: CONTAINER_MIN_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
        }}
      >
        {errorContent || (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: ERROR_BACKGROUND,
              border: `1px solid ${ERROR_BORDER_COLOR}`,
              borderRadius: ERROR_BORDER_RADIUS,
              padding: ERROR_PADDING,
              fontFamily: ERROR_FONT_FAMILY,
              fontSize: ERROR_FONT_SIZE,
              lineHeight: ERROR_LINE_HEIGHT,
              color: ERROR_TEXT_COLOR,
              maxWidth: "600px",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 6V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 14H10.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // Loading state UI
  if (isLoading) {
    return (
      <div
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: CONTAINER_MIN_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: LOADING_BACKGROUND,
        }}
      >
        {loadingContent || (
          <div
            style={{
              fontFamily: ERROR_FONT_FAMILY,
              fontSize: ERROR_FONT_SIZE,
              color: LOADING_TEXT_COLOR,
            }}
          >
            Loading application form...
          </div>
        )}
      </div>
    );
  }

  // Main container for Ashby iframe
  return (
    <div
      ref={containerRef}
      id="ashby_embed"
      style={{
        width: "100%",
        minHeight: CONTAINER_MIN_HEIGHT,
      }}
    />
  );
}

CMSFormRender.displayName = "CMS Form Render";

addPropertyControls(CMSFormRender, {
  ashbyBaseUrl: {
    type: ControlType.String,
    title: "Ashby Base URL",
    defaultValue: DEFAULT_ASHBY_BASE_URL,
    placeholder: "https://jobs.ashbyhq.com/your-company",
  },
  displayMode: {
    type: ControlType.Enum,
    title: "Display Mode",
    options: ["application-form-only", "full-job-board"],
    optionTitles: ["Application Form Only", "Full Job Board"],
    defaultValue: DEFAULT_DISPLAY_MODE,
  },
  autoScroll: {
    type: ControlType.Boolean,
    title: "Auto Scroll",
    defaultValue: DEFAULT_AUTO_SCROLL,
  },
  verboseLogging: {
    type: ControlType.Boolean,
    title: "Verbose Logging",
    defaultValue: DEFAULT_VERBOSE_LOGGING,
  },
  customCssUrl: {
    type: ControlType.String,
    title: "Custom CSS URL",
    placeholder: "https://example.com/custom.css",
    optional: true,
  },
  loadingContent: {
    type: ControlType.ComponentInstance,
    title: "Loading Content",
  },
  errorContent: {
    type: ControlType.ComponentInstance,
    title: "Error Content",
  },
  successRedirectUrl: {
    type: ControlType.String,
    title: "Success Redirect URL",
    placeholder: "/thank-you",
    description: "URL to redirect to after successful application submission",
  },
});
