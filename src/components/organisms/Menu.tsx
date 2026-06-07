import { type MouseEvent, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hamburger from "../atoms/Hamburger";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goHome = (event: MouseEvent<HTMLAnchorElement>, section: string) => {
    event.preventDefault();
    setIsOpen(false);
    setActiveSection(section);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: section } });
      return;
    }
    scrollToSection(section);
  };

  const goRequestDelivery = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "contact" } });
      return;
    }
    scrollToSection("contact");
  };

  const goContact = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsOpen(false);
    navigate("/contact");
  };

  useEffect(() => {
    const sections = [
      "hero",
      "about",
      "experience",
      "services",
      "who-we-serve",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px", // Trigger when section is in the middle of viewport
        threshold: 0,
      },
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

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
            href="#hero"
            onClick={(event) => goHome(event, "hero")}
            className={`${
              isHome && activeSection === "hero"
                ? "border-b-2 border-black pb-1 font-semibold"
                : "hover:border-b-2 hover:border-black pb-1"
            } block text-center md:inline md:text-left`}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#about"
            onClick={(event) => goHome(event, "about")}
            className={`${
              isHome && activeSection === "about"
                ? "border-b-2 border-black pb-1 font-semibold"
                : "hover:border-b-2 hover:border-black pb-1"
            } block text-center md:inline md:text-left`}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#services"
            onClick={(event) => goHome(event, "services")}
            className={`${
              isHome && activeSection === "services"
                ? "border-b-2 border-black pb-1 font-semibold"
                : "hover:border-b-2 hover:border-black pb-1"
            } block text-center md:inline md:text-left`}
          >
            Services
          </a>
        </li>

        {/* <li>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hover:border-b-2 hover:border-black pb-1 block text-center md:inline md:text-left cursor-not-allowed opacity-50"
          >
            Blog
          </a>
        </li> */}
        <li>
          <a
            href="#contact"
            onClick={goRequestDelivery}
            className="bg-primary-200 text-white px-6 py-3 rounded hover:bg-primary-100 md:inline-block block text-center"
          >
            Request a Delivery
          </a>
        </li>
        <li>
          <a
            href="/contact"
            onClick={goContact}
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
