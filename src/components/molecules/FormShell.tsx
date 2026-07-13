import type { ReactNode } from "react";

type FormShellProps = {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

const FormShell = ({
  icon,
  eyebrow,
  title,
  description,
  children,
}: FormShellProps) => (
  <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/70">
    <div className="relative border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-8 sm:px-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100" />
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-200/10 text-2xl">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
    {children}
  </div>
);

export default FormShell;
