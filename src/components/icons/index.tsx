import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

type PasswordVisibilityIconProps = IconProps & {
  isVisible: boolean;
};

const getIconClassName = (
  className: string | undefined,
  defaultClassName: string,
) => className || defaultClassName;

export const CheckIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m5 13 4 4L19 7" />
  </svg>
);

export const ChevronDownIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4")}
    fill="currentColor"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

export const CloseIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const DashboardIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4 shrink-0")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const EditIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const LogoutIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4 shrink-0")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
    <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
    <path d="M14 21h5a2 2 0 0 0 2-2" />
  </svg>
);

export const PasswordVisibilityIcon = ({
  className,
  isVisible,
  ...props
}: PasswordVisibilityIconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-5 w-5")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    {isVisible ? (
      <>
        <path d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.58 10.58a2 2 0 002.83 2.83" />
        <path d="M9.88 4.24A10.7 10.7 0 0112 4c5 0 8.5 4 10 8a14 14 0 01-2.09 3.54" />
        <path d="M6.61 6.61A13.1 13.1 0 002 12c1.5 4 5 8 10 8a10.6 10.6 0 005.39-1.48" />
      </>
    )}
  </svg>
);

export const ProfileIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4 shrink-0")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

export const TrashIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="m19 6-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </svg>
);

export const UploadIcon = ({
  className,
  ...props
}: IconProps) => (
  <svg
    aria-hidden="true"
    className={getIconClassName(className, "h-4 w-4")}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
  </svg>
);
