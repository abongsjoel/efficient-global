import Header from "../components/Header";
import Hero from "../components/molecules/Hero";
import AboutUs from "../components/molecules/AboutUs";
import OurExperience from "../components/molecules/OurExperience";
import Services from "../components/molecules/Services";

const Home = () => {
  return (
    <section className="h-screen overflow-hidden">
      <Header />
      <main className="snap-y snap-mandatory h-[calc(100vh-7rem)] overflow-y-scroll">
        <Hero />
        <div className="snap-start">
          <AboutUs />
          <OurExperience />
          <Services />
        </div>
      </main>
    </section>
  );
};

export default Home;
