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
        } md:flex flex-col md:flex-row gap-4 absolute md:relative top-full right-0 md:left-auto w-64 md:w-auto bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none md:items-center`}
      >
        <li>
          <a
            href="/"
            className="border-b-2 border-black pb-1 font-semibold block text-center md:inline md:text-left"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/services"
            className="hover:border-b-2 hover:border-black pb-1 block text-center md:inline md:text-left"
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="/services"
            className="bg-primary-200 text-white px-6 py-3 rounded hover:bg-primary-100 md:inline-block block text-center"
          >
            Opportunities
          </a>
        </li>
        <li>
          <a
            href="/services"
            className="bg-primary-200 text-white px-6 py-3 rounded hover:bg-primary-100 md:inline-block block text-center md:mt-0 mt-2"
          >
            Get In Touch
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
