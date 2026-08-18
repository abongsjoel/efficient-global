import { useEffect, useId, useRef, type ReactNode } from "react";
import { cx } from "../atoms/formFieldStyles";
import { CloseIcon, MailIcon } from "../icons";
import { getMailtoHref } from "../../utils/contactLinks";

export type RequestDetailsField = {
  isWide?: boolean;
  label: string;
  value: ReactNode;
};

type RequestDetailsModalProps = {
  email?: string;
  emailSubject?: string;
  fields: RequestDetailsField[];
  isOpen: boolean;
  onClose: () => void;
  subtitle?: ReactNode;
  title: string;
};

const RequestDetailsModal = ({
  email,
  emailSubject,
  fields,
  isOpen,
  onClose,
  subtitle,
  title,
}: RequestDetailsModalProps) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mailtoHref = getMailtoHref(email, emailSubject);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h3
              id={titleId}
              className="text-lg font-bold tracking-tight text-slate-950"
            >
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            ) : null}
          </div>
          <button
            ref={closeButtonRef}
            aria-label="Close details"
            className="inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/30"
            type="button"
            onClick={onClose}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <dl className="grid flex-1 gap-x-6 gap-y-5 overflow-y-auto px-6 py-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className={cx(field.isWide ? "sm:col-span-2" : undefined)}
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {field.label}
              </dt>
              <dd className="mt-1.5 break-words text-sm text-slate-800">
                {field.value || "-"}
              </dd>
            </div>
          ))}
        </dl>

        {mailtoHref ? (
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <a
              className="inline-flex items-center gap-2 rounded bg-primary-200 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/30"
              href={mailtoHref}
            >
              <MailIcon />
              Email
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RequestDetailsModal;
