import { createElement, Fragment } from "react";

export const formLabelStyles = "block text-sm font-medium text-slate-700";

export const formControlStyles =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition duration-200 hover:border-slate-300 focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-200/20";

export const formErrorControlStyles =
  "!border-red-400 !bg-red-50/40 hover:!border-red-400 focus:!border-red-500 focus:!bg-white focus:!ring-4 focus:!ring-red-500/20";

export const formErrorMessageStyles =
  "mt-2 flex items-center gap-1.5 text-sm font-normal text-red-600";

export const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export const renderRequiredLabel = (label: string, required?: boolean) => (
  createElement(
    Fragment,
    null,
    label,
    required
      ? createElement(
          "span",
          { "aria-hidden": "true", className: "ml-1 text-primary-200" },
          "*",
        )
      : null,
  )
);

export const renderErrorMessage = (id: string, error: string) =>
  createElement(
    "span",
    { id, role: "alert", className: formErrorMessageStyles },
    createElement(
      "svg",
      {
        "aria-hidden": "true",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        className: "h-4 w-4 shrink-0",
      },
      createElement("path", {
        fillRule: "evenodd",
        d: "M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-5a.9.9 0 00-.9 1l.35 4.5a.55.55 0 001.1 0L10.9 6a.9.9 0 00-.9-1zm0 8a1 1 0 100 2 1 1 0 000-2z",
        clipRule: "evenodd",
      }),
    ),
    error,
  );
