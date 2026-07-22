import { type MouseEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/useAdminAuth";
import Hamburger from "../atoms/Hamburger";
import type { Admin } from "../../utils/adminAuth";

const getAdminInitials = (admin: Admin) => {
  const displayName = admin.name || admin.username || admin.email;
  const nameParts = displayName.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }

  const fallback = nameParts[0] || admin.email.split("@")[0] || "A";

  return fallback.slice(0, 2).toUpperCase();
};

const getAdminUsername = (admin: Admin) =>
  admin.username || admin.email.split("@")[0] || admin.name;

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { admin, logoutAdminSession } = useAdminAuth();
  const adminMenuRef = useRef<HTMLLIElement | null>(null);
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
    // navigate to contact with delivery form selected
    navigate("/contact?source=schedule-delivery");
  };

  const goContact = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsOpen(false);
    navigate("/contact?source=request-information");
  };

  const handleLogout = async () => {
    await logoutAdminSession();
    setIsAdminMenuOpen(false);
    setIsOpen(false);
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

  useEffect(() => {
    if (!isAdminMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        adminMenuRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsAdminMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdminMenuOpen]);

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
        {admin ? (
          <li
            ref={adminMenuRef}
            className="relative flex justify-center md:block"
          >
            <button
              type="button"
              aria-expanded={isAdminMenuOpen}
              aria-haspopup="menu"
              aria-label={`Open account menu for ${admin.name}`}
              title={admin.name}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold uppercase text-white shadow-sm ring-2 ring-primary-200/25 transition hover:bg-primary-200 hover:text-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/30"
              onClick={() =>
                setIsAdminMenuOpen((currentValue) => !currentValue)
              }
            >
              {getAdminInitials(admin)}
            </button>

            {isAdminMenuOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 text-left text-slate-900 shadow-2xl shadow-slate-900/15"
              >
                <div className="border-b border-slate-100 pb-3">
                  <p className="text-sm font-semibold text-slate-950">
                    {admin.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary-200">
                    {admin.role.replace(/_/g, " ")}
                  </p>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="truncate font-medium text-slate-700">
                      {getAdminUsername(admin)}
                    </p>
                    <p className="truncate text-slate-500">{admin.email}</p>
                  </div>
                </div>

                <div className="space-y-1 border-b border-slate-100 py-3 text-sm">
                  <Link
                    to="/admin"
                    role="menuitem"
                    className="block rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/20"
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin"
                    role="menuitem"
                    className="block rounded-lg px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-200/20"
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Profile
                  </Link>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full rounded-lg bg-red-50 px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export default Menu;
