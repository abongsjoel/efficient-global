import Header from "../components/Header";
import Hero from "../components/molecules/Hero";
import WhoWeAre from "../components/molecules/WhoWeAre";

const Home = () => {
  return (
    <section className="h-screen overflow-hidden">
      <Header />
      <main className="snap-y snap-mandatory h-[calc(100vh-7rem)] overflow-y-scroll">
        <Hero />
        <div className="snap-start">
          <WhoWeAre />
          <article className="bg-white text-black h-full">
            More content here...
          </article>
        </div>
      </main>
    </section>
  );
};

export default Home;
