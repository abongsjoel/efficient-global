import { useNavigate } from "react-router-dom";
import city from "../../assets/images/city.jpg";
import Button from "../atoms/Button";

const HeroParagraph = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={`text-slate-100 text-sm md:text-base leading-relaxed text-center px-4 max-w-2xl ${className}`}
  >
    {children}
  </p>
);

const Hero = () => {
  const navigate = useNavigate();

  const goContact = () => {
    navigate("/contact");
  };

  return (
    <article
      className="h-[calc(100vh-7rem)] bg-cover bg-center flex items-center justify-center relative snap-start"
      style={{ backgroundImage: `url(${city})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="flex flex-col gap-6 items-center relative z-10">
        <h1 className="text-primary-200 text-5xl md:text-7xl font-bold text-center px-4 uppercase font-saira tracking-wide">
          Efficient Global
        </h1>
        <h2 className="text-white text-2xl md:text-3xl font-semibold text-center px-4 leading-snug max-w-3xl">
          Reliable Medical Courier Services You Can Trust
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary-200 to-transparent rounded-full"></div>
        <HeroParagraph>
          Efficient Global Enterprises specialize in providing professional and
          dependable medical courier services for healthcare providers
          throughout Minnesota. We specialize in the secure and time-sensitive
          transportation of medical materials, laboratory specimens,
          pharmaceuticals, and healthcare documents.
        </HeroParagraph>
        <HeroParagraph className="py-2">
          Our mission is to support hospitals, laboratories, clinics, and
          pharmacies by providing safe, compliant, and efficient delivery
          services when timing and accuracy matter most.
        </HeroParagraph>
        <h3 className="text-primary-100 text-2xl md:text-3xl font-semibold text-center px-4 font-saira mt-4">
          Fast. Secure. Compliant.
        </h3>
        <HeroParagraph>
          Serving healthcare providers across the Twin Cities and surrounding
          communities.
        </HeroParagraph>
        <div className="flex gap-4 mt-8">
          <Button onClick={goContact}>Request a Delivery</Button>
          <Button variant="inverse" onClick={goContact}>
            Contact Us
          </Button>
        </div>
      </div>
    </article>
  );
};

export default Hero;
