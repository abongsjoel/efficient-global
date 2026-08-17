import { useEffect, useRef, useState } from "react";
import { cx } from "../atoms/formFieldStyles";
import { CheckIcon, CopyIcon } from "../icons";
import Tooltip from "./Tooltip";

type CopyButtonProps = {
  className?: string;
  copiedLabel?: string;
  label?: string;
  value: string;
};

const COPIED_RESET_DELAY = 1500;

// navigator.clipboard is only available in secure contexts, so fall back to the
// legacy selection copy when it is missing rather than failing silently.
const copyToClipboard = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);

    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
};

const CopyButton = ({
  className,
  copiedLabel = "Copied",
  label = "Copy",
  value,
}: CopyButtonProps) => {
  const resetTimeoutRef = useRef<number | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(
    () => () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await copyToClipboard(value);
    } catch {
      return;
    }

    setHasCopied(true);
    window.clearTimeout(resetTimeoutRef.current ?? undefined);
    resetTimeoutRef.current = window.setTimeout(() => {
      setHasCopied(false);
      resetTimeoutRef.current = null;
    }, COPIED_RESET_DELAY);
  };

  return (
    <Tooltip label={hasCopied ? copiedLabel : label}>
      <button
        aria-label={label}
        className={cx(
          "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/20",
          hasCopied
            ? "text-primary-200"
            : "text-slate-400 hover:bg-slate-100 hover:text-primary-200",
          className,
        )}
        type="button"
        onClick={handleCopy}
      >
        {hasCopied ? (
          <CheckIcon className="h-3.5 w-3.5" />
        ) : (
          <CopyIcon className="h-3.5 w-3.5" />
        )}
      </button>
    </Tooltip>
  );
};

export default CopyButton;
