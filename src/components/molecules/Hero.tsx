import city from "../../assets/images/city.jpg";
import Button from "../atoms/Button";

const Hero = () => {
  return (
    <article
      className="h-[calc(100vh-7rem)] bg-cover bg-center flex items-center justify-center relative snap-start"
      style={{ backgroundImage: `url(${city})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="flex flex-col gap-2 items-center relative z-10">
        <h1 className="text-primary-200 text-3xl md:text-6xl font-bold text-center px-4 uppercase font-saira">
          Efficient Global
        </h1>
        <h2 className="text-white text-xl md:text-3xl text-center px-4">
          Delivering Your Products Fast and Securely
        </h2>
        <h3 className="text-white text-sm md:text-base text-center px-4">
          Rapid Delivery Services Serving Maryland, DC, and Northern Virginia
        </h3>
        <Button className="mt-6">GET A QUOTE</Button>
      </div>
    </article>
  );
};

export default Hero;
