import city from "../../assets/city.jpg";

const Hero = () => {
  return (
    <article
      className="h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${city})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="flex flex-col gap-2 items-center relative z-10">
        <h1 className="text-primary-200 text-6xl font-bold text-center px-4 uppercase font-saira">
          Efficient Global
        </h1>
        <h2 className="text-white text-3xl">
          Delivering Your Products Fast and Securely
        </h2>
      </div>
    </article>
  );
};

export default Hero;
