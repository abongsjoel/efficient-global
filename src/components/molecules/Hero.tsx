import city from "../../assets/city.jpg";

const Hero = () => {
  return (
    <article
      className="h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${city})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <h1 className="text-primary-200 text-7xl font-bold text-center px-4 relative z-10">
        Efficient Global
      </h1>
      <h2>Hi</h2>
    </article>
  );
};

export default Hero;
