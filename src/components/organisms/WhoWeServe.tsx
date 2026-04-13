import Badge from "../atoms/Badge";

const WhoWeServe = () => {
  const clients = [
    "Hospitals",
    "Medical laboratories",
    "Pharmacies",
    "Clinics",
    "Medical supply companies",
    "Healthcare offices",
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-primary-200/10 blur-3xl" />
      <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="text-primary-100">Who We Serve</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Who We Serve
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Efficient Global Enterprises proudly supports delivery needs for:
          </p>
        </div>

        <div className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-xl backdrop-blur-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-200/10 text-2xl">
                  🏥
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{client}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-base leading-7 text-slate-200">
              We work with healthcare professionals who require reliable courier
              services for sensitive and time-critical materials.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeServe;
