import boat from "../../assets/images/boat.jpg";

const WhoWeAre = () => {
  return (
    <section className="h-full bg-white">
      <div className="grid md:grid-cols-2 h-full">
        {/* Left side - Text content */}
        <div className="flex flex-col justify-center p-8 md:p-16 text-center">
          <h2 className="text-4xl font-bold text-primary-200 mb-6 text-c">
            Who We Are
          </h2>
          <h4 className="text-xl text-gray-900 mb-4">
            Premier courier company committed to making delivery easy, simple,
            and fast.
          </h4>
          <p className="text-md text-gray-700 mb-4">
            Since 2018, we’ve proudly served customers across Maryland,
            Washington, DC, and Northern Virginia. We hold ourselves to the
            highest standards of integrity in every interaction with our clients
            and vendors. Need something important delivered right away? You’re
            in the right place. Our team of professional couriers handles every
            package with care and ensures it arrives at the right destination,
            at the right time—every time.
          </p>
          <p className="text-md text-gray-700">
            Our goal is to become the industry’s leading courier service by
            offering reliable, prompt, and courteous delivery at competitive
            rates.
          </p>
        </div>

        {/* Right side - Image */}
        <div className="flex items-center justify-center p-8 md:py-16 md:pr-16">
          <div className="relative w-full h-[500px] md:h-[600px] rounded-lg shadow-lg overflow-hidden">
            <img src={boat} alt="Boat" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
