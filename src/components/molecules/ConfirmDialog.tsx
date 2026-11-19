import { useEffect, useId, useRef, type ReactNode } from "react";
import Button from "../atoms/Button";

type ConfirmDialogProps = {
  cancelLabel?: string;
  children: ReactNode;
  confirmLabel: string;
  /** Shown on the confirm button while `isConfirming` is true. */
  confirmingLabel?: string;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  /** "danger" for actions that take something away, such as deactivating. */
  tone?: "danger" | "primary";
};

// Rendered only while open, like AddAdminModal, so each opening starts fresh.
const ConfirmDialog = ({
  cancelLabel = "Cancel",
  children,
  confirmLabel,
  confirmingLabel,
  isConfirming = false,
  onCancel,
  onConfirm,
  title,
  tone = "primary",
}: ConfirmDialogProps) => {
  const titleId = useId();
  const messageId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Starts on Cancel, so pressing Enter straight away doesn't confirm, and
  // hands focus back to whatever opened the dialog once it closes.
  useEffect(() => {
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    cancelButtonRef.current?.focus();

    return () => previouslyFocusedElement?.focus();
  }, []);

  // Listens in the capture phase and stops Escape there, so when this opens over
  // another modal (which also closes on Escape), only this dialog responds.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.stopPropagation();

      if (!isConfirming) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isConfirming, onCancel]);

  const handleCancel = () => {
    if (!isConfirming) {
      onCancel();
    }
  };

  return (
    <div
      aria-describedby={messageId}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6 py-10"
      onClick={handleCancel}
      role="alertdialog"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 py-5">
          <h3
            id={titleId}
            className="text-lg font-bold tracking-tight text-slate-950"
          >
            {title}
          </h3>
          <div id={messageId} className="mt-2 text-sm leading-6 text-slate-600">
            {children}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <Button
            ref={cancelButtonRef}
            disabled={isConfirming}
            variant="inverse"
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            disabled={isConfirming}
            variant={tone === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {isConfirming && confirmingLabel ? confirmingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
