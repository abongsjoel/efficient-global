import { useState } from "react";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      {/* Hamburger Button - visible on mobile, hidden on desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col gap-1 p-2"
        aria-label="Toggle menu"
      >
        <span className="w-6 h-0.5 bg-black"></span>
        <span className="w-6 h-0.5 bg-black"></span>
        <span className="w-6 h-0.5 bg-black"></span>
      </button>

      {/* Menu - hidden on mobile unless open, always visible on desktop */}
      <ul
        className={`${
          isOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row gap-4 absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0`}
      >
        <li>
          <a href="/" className="border-b-2 border-black pb-1 font-semibold">
            Home
          </a>
        </li>
        <li>
          <a
            href="/services"
            className="hover:border-b-2 hover:border-black pb-1"
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="/services"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Opportunities
          </a>
        </li>
        <li>
          <a
            href="/services"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Get In Touch
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
