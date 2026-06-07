import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/organisms/Hero";
import AboutUs from "../components/organisms/AboutUs";
import OurExperience from "../components/organisms/OurExperience";
import Services from "../components/organisms/Services";
import WhoWeServe from "../components/organisms/WhoWeServe";
import Contact from "../components/organisms/Contact";

const HomePage = () => {
  const { state } = useLocation() as { state?: { scrollTo?: string } };

  useEffect(() => {
    const section = state?.scrollTo;
    if (!section) return;

    const element = document.getElementById(section);
    if (!element) return;

    window.setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, [state]);

  return (
    <>
      <div id="hero" className="snap-start">
        <Hero />
      </div>
      <div id="about" className="snap-start">
        <AboutUs />
      </div>
      <div id="experience" className="snap-start">
        <OurExperience />
      </div>
      <div className="snap-start">
        <Services />
      </div>
      <div id="who-we-serve" className="snap-start">
        <WhoWeServe />
      </div>
      <div id="contact" className="snap-start">
        <Contact />
      </div>
    </>
  );
};

export default HomePage;
