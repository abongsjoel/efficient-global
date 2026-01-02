import { useState } from "react";
import Hamburger from "./atoms/Hamburger";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <Hamburger onClick={() => setIsOpen(!isOpen)} />

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
