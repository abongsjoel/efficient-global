import { useState, useEffect } from "react";

const ScrollIndicator = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sections = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "services", label: "Services" },
    { id: "who-we-serve", label: "Who We Serve" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Find which section is currently in view
      const currentSection = Math.floor(scrollPosition / windowHeight);
      setActiveSection(Math.min(currentSection, sections.length - 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections.length]);

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index].id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            activeSection === index
              ? "bg-primary-200 scale-125"
              : "bg-slate-300 hover:bg-slate-400"
          }`}
          title={section.label}
        />
      ))}
    </div>
  );
};

export default ScrollIndicator;
