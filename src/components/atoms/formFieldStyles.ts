export const formLabelStyles = "block text-sm font-medium text-slate-700";

export const formControlStyles =
  "w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30";

export const formErrorControlStyles =
  "!border-red-400 focus:!border-red-500 focus:!ring-red-200/60";

export const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");
