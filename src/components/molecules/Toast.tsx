import { useEffect } from "react";
import Button from "../atoms/Button";
import { cx } from "../atoms/formFieldStyles";

type ToastVariant = "success";

type ToastProps = {
  autoDismissMs?: number;
  message: string;
  onDismiss: () => void;
  variant?: ToastVariant;
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-primary-200/30 bg-white text-slate-800",
};

const iconStyles: Record<ToastVariant, string> = {
  success: "bg-primary-200 text-white",
};

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path d="m5 13 4 4L19 7" />
  </svg>
);

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const Toast = ({
  autoDismissMs = 3500,
  message,
  onDismiss,
  variant = "success",
}: ToastProps) => {
  useEffect(() => {
    const dismissTimer = window.setTimeout(onDismiss, autoDismissMs);

    return () => window.clearTimeout(dismissTimer);
  }, [autoDismissMs, message, onDismiss]);

  return (
    <div
      aria-live="polite"
      className={cx(
        "fixed right-6 top-24 z-50 flex w-[min(calc(100vw-3rem),22rem)] items-start gap-3 rounded-xl border p-4 shadow-2xl shadow-slate-950/15",
        variantStyles[variant],
      )}
      role="status"
    >
      <span
        className={cx(
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          iconStyles[variant],
        )}
      >
        <CheckIcon />
      </span>

      <p className="min-w-0 flex-1 text-sm font-medium leading-6">{message}</p>

      <Button
        aria-label="Dismiss notification"
        className="h-7 w-7 shrink-0 rounded-full p-0 text-slate-400 hover:text-slate-700"
        size="sm"
        type="button"
        variant="link"
        onClick={onDismiss}
      >
        <CloseIcon />
      </Button>
    </div>
  );
};

export default Toast;
