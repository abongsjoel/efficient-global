import city from "../../assets/images/city.jpg";

const experiencePoints = [
  "Safely operating vehicles in highly congested city environments with a strong safety record",
  "Completing high-volume deliveries efficiently and on schedule",
  "Using GPS and route optimization to ensure timely deliveries",
  "Carefully loading and securing packages to prevent damage",
  "Delivering packages to residential and business locations",
  "Maintaining detailed mileage and fuel tracking for operational efficiency",
  "Verifying delivery accuracy against order documentation",
  "Providing professional customer service and resolving customer inquiries",
];

const OurExperience = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary-200/10 blur-3xl" />
      <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl">
              <img
                src={city}
                alt="City delivery experience"
                className="h-[560px] w-full object-cover object-center opacity-90 sm:h-[640px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent" />
              <div className="absolute top-6 left-6 right-6 rounded-3xl border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-primary-200">
                  Minneapolis delivery network
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  Experience in every route, from downtown businesses to
                  neighborhood residences.
                </p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-primary-200">
                  City expertise
                </p>
                <p className="mt-4 text-base leading-7 text-slate-200">
                  Proven delivery performance in busy urban streets and
                  high-density neighborhoods.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-primary-200/10 p-6 shadow-xl backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-primary-200">
                  Reliable tracking
                </p>
                <p className="mt-4 text-base leading-7 text-slate-200">
                  GPS coordination and route optimization ensure your shipments
                  arrive when they should.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full bg-primary-200/20 px-4 py-1 text-sm uppercase tracking-[0.24em] text-primary-100">
                Built on experience
              </span>
              <h2 className="mt-6 text-5xl font-bold leading-tight text-white md:text-6xl">
                Our Experience
              </h2>
              <p className="mt-6 text-lg text-slate-300">
                Our team brings extensive delivery expertise from major
                logistics platforms and time-sensitive operations across the
                Minneapolis area.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-primary-200">
                What we deliver
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                Logistics that prioritize reliability and efficiency.
              </h3>
              <div className="mt-8 space-y-4">
                {experiencePoints.map((point, index) => (
                  <div className="flex items-start gap-4" key={point}>
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-200 text-sm font-bold text-slate-950">
                      {index + 1}
                    </div>
                    <p className="text-base leading-7 text-slate-200">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurExperience;
