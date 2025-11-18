// Text-to-speech dictation component with play/pause controls
import { addPropertyControls, ControlType } from "framer";
import { useEffect, useState, useRef, type CSSProperties } from "react";

// Customizable constants

// Aria label selector
const DICTATE_TEXT_LABEL = "dictate-text";

// Voice settings
const SPEECH_RATE = 1.0; // Speed of speech (0.1 to 10)
const SPEECH_PITCH = 1.0; // Pitch of voice (0 to 2)
const SPEECH_VOLUME = 1.0; // Volume (0 to 1)
const SPEECH_LANG = "en-US"; // Language code

// Card styling
const CARD_PADDING = "32px";
const CARD_BORDER_RADIUS = "8px";
const CARD_BACKGROUND = "#F4F4F4";
const CARD_ERROR_BACKGROUND = "#FFF2F2";

// Error state styling
const ERROR_FONT_FAMILY = "FFF Acid Grotesk, sans-serif";
const ERROR_TEXT_COLOR = "#DC2626";
const ERROR_BACKGROUND = "#FEE2E2";
const ERROR_BORDER_COLOR = "#FCA5A5";
const ERROR_BORDER_RADIUS = "8px";
const ERROR_PADDING = "16px 20px";
const ERROR_FONT_SIZE = "14px";
const ERROR_LINE_HEIGHT = "150%";

interface DictateProps {
  playButton: React.ReactNode;
  pauseButton: React.ReactNode;
  content: React.ReactNode;
  error?: React.ReactNode;
  style?: CSSProperties;
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function CMSDictate(props: DictateProps) {
  const { playButton, pauseButton, content, error } = props;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isMountedRef = useRef(true);

  // Check if Speech Synthesis API is supported and reset on mount
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsSupported(false);
    } else {
      // Cancel any ongoing speech from previous page state
      window.speechSynthesis.cancel();
    }
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const extractTextContent = (): string => {
    const dictateElement = document.querySelector(
      `[aria-label="${DICTATE_TEXT_LABEL}"]`,
    );

    if (!dictateElement) {
      console.warn(`No element found with aria-label="${DICTATE_TEXT_LABEL}"`);
      return "";
    }

    // Get all text content, preserving spaces between elements
    const getAllText = (element: Element): string => {
      let text = "";
      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent || "";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          text += getAllText(node as Element) + " ";
        }
      });
      return text;
    };

    const fullText = getAllText(dictateElement);

    // Clean up extra whitespace while preserving intentional spaces
    return fullText.replace(/\s+/g, " ").trim();
  };

  const handleToggle = () => {
    if (!isSupported) return;

    if (isPlaying) {
      // Pause
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      // Check if we're resuming or starting fresh
      if (window.speechSynthesis.paused) {
        // Resume
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        // Start new speech
        const textToSpeak = extractTextContent();

        if (!textToSpeak) {
          console.warn("No text content found to dictate");
          return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = SPEECH_RATE;
        utterance.pitch = SPEECH_PITCH;
        utterance.volume = SPEECH_VOLUME;
        utterance.lang = SPEECH_LANG;

        // Event handlers
        utterance.onend = () => {
          if (isMountedRef.current) {
            setIsPlaying(false);
          }
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          if (isMountedRef.current) {
            setIsPlaying(false);
          }
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  // Error state UI
  if (!isSupported) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: CARD_PADDING,
          borderRadius: CARD_BORDER_RADIUS,
          background: CARD_ERROR_BACKGROUND,
        }}
      >
        <div style={{ flex: 1 }}>
          {error || (
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
              <span>
                Your browser doesn't support text-to-speech functionality.
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: CARD_PADDING,
        borderRadius: CARD_BORDER_RADIUS,
        background: CARD_BACKGROUND,
      }}
    >
      <div style={{ flex: 1 }}>{content}</div>
      <div
        onClick={handleToggle}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        {isPlaying ? pauseButton : playButton}
      </div>
    </div>
  );
}

CMSDictate.displayName = "CMS Dictate";

addPropertyControls(CMSDictate, {
  playButton: {
    type: ControlType.ComponentInstance,
    title: "Play Button",
  },
  pauseButton: {
    type: ControlType.ComponentInstance,
    title: "Pause Button",
  },
  content: {
    type: ControlType.ComponentInstance,
    title: "Content",
  },
  error: {
    type: ControlType.ComponentInstance,
    title: "Error",
  },
});
