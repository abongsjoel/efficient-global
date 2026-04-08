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
          Reliable Medical Courier Services You Can Trust
        </h2>
        <h3 className="text-white text-sm md:text-base text-center px-4 max-w-2xl">
          Efficient Global Enterprises specialize in providing professional and
          dependable medical courier services for healthcare providers
          throughout Minnesota. We specialize in the secure and time-sensitive
          transportation of medical materials, laboratory specimens,
          pharmaceuticals, and healthcare documents.
        </h3>
        <h3 className="text-white text-sm md:text-base text-center px-4 py-6 max-w-2xl">
          Our mission is to support hospitals, laboratories, clinics, and
          pharmacies by providing safe, compliant, and efficient delivery
          services when timing and accuracy matter most.
        </h3>
        <h2 className="text-primary-100 text-xl md:text-2xl font-bold text-center px-4 font-saira">
          Fast. Secure. Compliant.
        </h2>
        <h3 className="text-white text-sm md:text-base text-center px-4 max-w-2xl">
          Serving healthcare providers across the Twin Cities and surrounding
          communities.
        </h3>
        <div className="flex gap-4 mt-6">
          <Button>Request a Delivery</Button>
          <Button>Contact Us</Button>
        </div>
      </div>
    </article>
  );
};

export default Hero;
