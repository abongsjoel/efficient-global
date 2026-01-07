interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-primary-200 text-white px-6 py-3 rounded hover:bg-primary-100 font-semibold transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
