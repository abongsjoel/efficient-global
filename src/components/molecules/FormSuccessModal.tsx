import type { ReactNode } from "react";
import Button from "../atoms/Button";

type FormSuccessModalProps = {
  isOpen: boolean;
  title: string;
  titleId: string;
  children: ReactNode;
  onGoHome: () => void;
  onClose: () => void;
  onContinue: () => void;
  continueLabel?: string;
  homeLabel?: string;
};

const FormSuccessModal = ({
  isOpen,
  title,
  titleId,
  children,
  onGoHome,
  onClose,
  onContinue,
  continueLabel = "Continue",
  homeLabel = "Back to Home",
}: FormSuccessModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6 py-10"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h3
          id={titleId}
          className="mt-5 text-2xl font-semibold tracking-tight text-slate-950"
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{children}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button onClick={onGoHome} className="w-full">
            {homeLabel}
          </Button>
          <Button variant="inverse" onClick={onContinue} className="w-full">
            {continueLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormSuccessModal;
