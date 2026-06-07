import Hero from "../components/organisms/Hero";
import AboutUs from "../components/organisms/AboutUs";
import OurExperience from "../components/organisms/OurExperience";
import Services from "../components/organisms/Services";
import WhoWeServe from "../components/organisms/WhoWeServe";
import Contact from "../components/organisms/Contact";

const Home = () => {
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
      <div className="snap-start">
        <Contact />
      </div>
    </>
  );
};

export default Home;
