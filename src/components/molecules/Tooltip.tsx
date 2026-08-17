import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../atoms/formFieldStyles";

type TooltipPosition = {
  left: number;
  placement: "bottom" | "top";
  top: number;
};

type TooltipProps = {
  children: ReactNode;
  className?: string;
  label: string;
};

const TOOLTIP_GAP = 8;
const TOOLTIP_VIEWPORT_PADDING = 12;
const TOOLTIP_ESTIMATED_HEIGHT = 36;

// Rendered through a portal so the tooltip is never clipped by the table's
// horizontal scroll container or painted over by the pinned actions cell.
const Tooltip = ({ children, className, label }: TooltipProps) => {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || typeof window === "undefined") {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const placement =
      rect.top > TOOLTIP_ESTIMATED_HEIGHT + TOOLTIP_GAP ? "top" : "bottom";

    setPosition({
      left: Math.min(
        Math.max(rect.left + rect.width / 2, TOOLTIP_VIEWPORT_PADDING),
        Math.max(
          TOOLTIP_VIEWPORT_PADDING,
          window.innerWidth - TOOLTIP_VIEWPORT_PADDING,
        ),
      ),
      placement,
      top:
        placement === "top" ? rect.top - TOOLTIP_GAP : rect.bottom + TOOLTIP_GAP,
    });
  }, []);

  const openTooltip = useCallback(() => {
    updatePosition();
    setIsOpen(true);
  }, [updatePosition]);

  const closeTooltip = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  return (
    <>
      <span
        ref={triggerRef}
        aria-describedby={isOpen ? tooltipId : undefined}
        className={cx("inline-flex", className)}
        onBlur={closeTooltip}
        onFocus={openTooltip}
        onPointerEnter={openTooltip}
        onPointerLeave={closeTooltip}
      >
        {children}
      </span>

      {isOpen && position && typeof document !== "undefined"
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none fixed z-[100] whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg shadow-slate-950/25"
              style={{
                left: position.left,
                top: position.top,
                transform:
                  position.placement === "top"
                    ? "translate(-50%, -100%)"
                    : "translate(-50%, 0)",
              }}
            >
              {label}
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default Tooltip;
