import boat from "../../assets/images/boat.jpg";

const AboutUs = () => {
  return (
    <section className="h-full bg-white">
      <div className="grid md:grid-cols-2 h-full">
        {/* Left side - Text content */}
        <div className="flex flex-col justify-center p-8 md:p-16 text-center">
          <h2 className="text-4xl font-bold text-primary-200 mb-6 text-c">
            About Us
          </h2>
          <h4 className="text-xl  text-primary-100 mb-4">
            About Efficient Global Enterprises
          </h4>
          <p className="text-md text-gray-700 ">
            Efficient Global Enterprises is a Minnesota-based courier delivery
            service dedicated to providing reliable and professional delivery
            solutions for businesses and individuals. Our focus is on dependable
            service, safe transportation, and timely deliveries across the Twin
            Cities and surrounding areas.
          </p>
          <p className="text-md text-gray-700 my-6">
            With years of hands-on delivery experience, we understand the
            importance of efficiency, accuracy, and professionalism when
            handling time-sensitive packages. Our mission is to support
            businesses by providing courier services they can trust.
          </p>
          <p className="text-md text-gray-700">
            We take pride in maintaining high standards of safety,
            communication, and customer service to ensure that every delivery is
            completed with care, attention and timely manner.
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

export default AboutUs;
