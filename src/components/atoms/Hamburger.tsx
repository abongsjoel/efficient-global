import { type FC } from "react";

interface HamburgerProps {
  onClick: () => void;
}

const Hamburger: FC<HamburgerProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex flex-col gap-1 p-2"
      aria-label="Toggle menu"
    >
      <span className="w-6 h-0.5 bg-black"></span>
      <span className="w-6 h-0.5 bg-black"></span>
      <span className="w-6 h-0.5 bg-black"></span>
    </button>
  );
};

export default Hamburger;
