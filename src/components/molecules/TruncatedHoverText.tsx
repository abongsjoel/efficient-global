import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import HighlightedText from "../atoms/HighlightedText";
import { cx } from "../atoms/formFieldStyles";

type TooltipPosition = {
  left: number;
  placement: "bottom" | "top";
  top: number;
  width: number;
};

type TruncatedHoverTextProps = {
  className?: string;
  emptyFallback?: string;
  highlightQuery?: string;
  lineCount?: number;
  text?: string | null;
};

const TOOLTIP_GAP = 10;
const TOOLTIP_MAX_WIDTH = 384;
const TOOLTIP_VIEWPORT_PADDING = 16;
const TOOLTIP_ESTIMATED_HEIGHT = 220;

const TruncatedHoverText = ({
  className,
  emptyFallback = "-",
  highlightQuery,
  lineCount = 3,
  text,
}: TruncatedHoverTextProps) => {
  const tooltipId = useId();
  const closeTimeoutRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLSpanElement>(null);
  const hasText = Boolean(text?.trim());
  const displayText = hasText ? text : emptyFallback;
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);

  const previewStyle: CSSProperties = {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lineCount,
    whiteSpace: "pre-line",
  };

  const updateTooltipPosition = useCallback(() => {
    if (!previewRef.current || typeof window === "undefined") {
      return;
    }

    const rect = previewRef.current.getBoundingClientRect();
    const availableWidth = Math.max(
      180,
      window.innerWidth - TOOLTIP_VIEWPORT_PADDING * 2,
    );
    const width = Math.min(TOOLTIP_MAX_WIDTH, availableWidth);
    const maxLeft = Math.max(
      TOOLTIP_VIEWPORT_PADDING,
      window.innerWidth - width - TOOLTIP_VIEWPORT_PADDING,
    );
    const placement =
      rect.bottom + TOOLTIP_ESTIMATED_HEIGHT > window.innerHeight &&
      rect.top > TOOLTIP_ESTIMATED_HEIGHT
        ? "top"
        : "bottom";

    setTooltipPosition({
      left: Math.min(Math.max(rect.left, TOOLTIP_VIEWPORT_PADDING), maxLeft),
      placement,
      top:
        placement === "top"
          ? rect.top - TOOLTIP_GAP
          : rect.bottom + TOOLTIP_GAP,
      width,
    });
  }, []);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current === null || typeof window === "undefined") {
      return;
    }

    window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }, []);

  const openTooltip = useCallback(() => {
    if (!hasText) {
      return;
    }

    clearCloseTimeout();
    updateTooltipPosition();
    setIsTooltipOpen(true);
  }, [clearCloseTimeout, hasText, updateTooltipPosition]);

  const scheduleCloseTooltip = useCallback(() => {
    if (typeof window === "undefined") {
      setIsTooltipOpen(false);
      return;
    }

    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsTooltipOpen(false);
      closeTimeoutRef.current = null;
    }, 120);
  }, [clearCloseTimeout]);

  useEffect(() => {
    if (!isTooltipOpen) {
      return;
    }

    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);
    window.addEventListener("scroll", updateTooltipPosition, true);

    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
      window.removeEventListener("scroll", updateTooltipPosition, true);
    };
  }, [isTooltipOpen, updateTooltipPosition]);

  useEffect(
    () => () => {
      clearCloseTimeout();
    },
    [clearCloseTimeout],
  );

  return (
    <>
      <span
        ref={previewRef}
        aria-describedby={
          isTooltipOpen && hasText ? tooltipId : undefined
        }
        className={cx(
          "block min-w-0 max-w-full break-words",
          hasText && "cursor-help",
          className,
        )}
        style={previewStyle}
        tabIndex={hasText ? 0 : undefined}
        onBlur={scheduleCloseTooltip}
        onFocus={openTooltip}
        onPointerEnter={openTooltip}
        onPointerLeave={scheduleCloseTooltip}
      >
        <HighlightedText query={highlightQuery} text={displayText ?? ""} />
      </span>

      {isTooltipOpen &&
      hasText &&
      tooltipPosition &&
      typeof document !== "undefined"
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              className="fixed z-[100] max-h-[50vh] overflow-y-auto rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-2xl shadow-slate-950/20"
              style={{
                left: tooltipPosition.left,
                top: tooltipPosition.top,
                transform:
                  tooltipPosition.placement === "top"
                    ? "translateY(-100%)"
                    : undefined,
                width: tooltipPosition.width,
              }}
              onPointerEnter={clearCloseTimeout}
              onPointerLeave={scheduleCloseTooltip}
            >
              <p className="whitespace-pre-wrap break-words">
                <HighlightedText query={highlightQuery} text={text ?? ""} />
              </p>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default TruncatedHoverText;
