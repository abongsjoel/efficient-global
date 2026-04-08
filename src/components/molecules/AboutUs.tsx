import Badge from "../atoms/Badge";
import boat from "../../assets/images/boat.jpg";

const AboutUs = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 text-slate-950">
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary-200/15 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-slate-900/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <Badge>About Us</Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                About Us
              </h2>
              <h4 className="text-lg text-primary-200">
                About Efficient Global Enterprises
              </h4>
            </div>
            <div className="space-y-6 text-base leading-8 text-slate-700">
              <p>
                Efficient Global Enterprises is a Minnesota-based courier
                delivery service dedicated to providing reliable and
                professional delivery solutions for businesses and individuals.
                Our focus is on dependable service, safe transportation, and
                timely deliveries across the Twin Cities and surrounding areas.
              </p>
              <p>
                With years of hands-on delivery experience, we understand the
                importance of efficiency, accuracy, and professionalism when
                handling time-sensitive packages. Our mission is to support
                businesses by providing courier services they can trust.
              </p>
              <p>
                We take pride in maintaining high standards of safety,
                communication, and customer service to ensure that every
                delivery is completed with care, attention and timely manner.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
              <img
                src={boat}
                alt="Delivery vehicle in service"
                className="h-[520px] w-full object-cover object-center sm:h-[640px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
