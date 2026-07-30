import { PasswordVisibilityIcon } from "../icons";

type PasswordVisibilityButtonProps = {
  isVisible: boolean;
  onClick: () => void;
};

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
    <PasswordVisibilityIcon isVisible={isVisible} />
  </button>
);

export default PasswordVisibilityButton;
