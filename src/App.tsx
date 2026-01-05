import Header from "./components/Header";
import Hero from "./components/molecules/Hero";

function App() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <article className="bg-white text-black">More content here...</article>
      </main>
    </div>
  );
}

export default App;
