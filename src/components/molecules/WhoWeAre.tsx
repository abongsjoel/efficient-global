import boat from "../../assets/images/boat.jpg";

const WhoWeAre = () => {
  return (
    <section className="h-full bg-white">
      <div className="grid md:grid-cols-2 h-full">
        {/* Left side - Text content */}
        <div className="flex flex-col justify-center p-8 md:p-16">
          <h2 className="text-4xl font-bold text-primary-200 mb-6">
            Who We Are
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <p className="text-lg text-gray-700">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
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
