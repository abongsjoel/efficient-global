import Header from "../components/Header";
import Hero from "../components/molecules/Hero";

const Home = () => {
  return (
    <section className="h-screen overflow-hidden">
      <Header />
      <main className="snap-y snap-mandatory h-[calc(100vh-7rem)] overflow-y-scroll">
        <Hero />
        <article className="bg-white text-black snap-start h-full">
          More content here...
        </article>
      </main>
    </section>
  );
};

export default Home;
