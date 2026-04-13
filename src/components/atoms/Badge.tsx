import type { ReactNode } from "react";

type BadgeVariant = "primary" | "secondary";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  primary:
    "inline-flex rounded-full border border-primary-200/25 bg-primary-200/10 px-4 py-1 text-sm uppercase tracking-[0.24em] text-primary-200",
  secondary:
    "inline-flex rounded-full border border-slate-300/25 bg-slate-100 px-4 py-1 text-sm uppercase tracking-[0.24em] text-slate-700",
};

const Badge = ({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) => (
  <span className={`${badgeStyles[variant]} ${className}`.trim()}>
    {children}
  </span>
);

export default Badge;
