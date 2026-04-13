interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "inverse";
}

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  variant = "primary",
}: ButtonProps) => {
  const baseStyles = "px-6 py-3 rounded font-semibold transition-colors";
  const variantStyles =
    variant === "inverse"
      ? "bg-white text-primary-200 border border-primary-200 hover:bg-primary-100"
      : "bg-primary-200 text-white hover:bg-primary-100";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
