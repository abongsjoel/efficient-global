import Header from "./components/Header";
import city from "./assets/city.jpg";

function App() {
  return (
    <div>
      <Header />
      <main>
        <article
          className="h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${city})` }}
        >
          <h1 className="text-white text-5xl font-bold text-center px-4">
            Welcome to Our City
          </h1>
        </article>
        <article className="bg-white text-black">More content here...</article>
      </main>
    </div>
  );
}

export default App;
