import Header from "../components/Header";
import Hero from "../components/molecules/Hero";
import AboutUs from "../components/molecules/AboutUs";
import OurExperience from "../components/molecules/OurExperience";
import Services from "../components/molecules/Services";
import WhoWeServe from "../components/molecules/WhoWeServe";
import Contact from "../components/molecules/Contact";
import ScrollIndicator from "../components/atoms/ScrollIndicator";

const Home = () => {
  return (
    <section className="h-screen overflow-hidden">
      <Header />
      <ScrollIndicator />
      <main className="snap-y snap-mandatory h-[calc(100vh-7rem)] overflow-y-scroll scroll-smooth">
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
      </main>
    </section>
  );
};

export default Home;
