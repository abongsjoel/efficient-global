type PasswordVisibilityButtonProps = {
  isVisible: boolean;
  onClick: () => void;
};

const EyeIcon = ({ isVisible }: { isVisible: boolean }) => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
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

const PasswordVisibilityButton = ({
  isVisible,
  onClick,
}: PasswordVisibilityButtonProps) => (
  <button
    type="button"
    aria-label={isVisible ? "Hide password" : "Show password"}
    aria-pressed={isVisible}
    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/20"
    onClick={onClick}
  >
    <EyeIcon isVisible={isVisible} />
  </button>
);

export default PasswordVisibilityButton;
