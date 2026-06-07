import { useLocation } from "react-router-dom";
import contactHero from "../assets/images/contact-hero.jpg";

const ContactPage = () => {
  const location = useLocation();
  const source =
    (location.state as { source?: string } | null)?.source ??
    "request-information";

  console.log({ source });

  return (
    <>
      <section
        id="contact-page-top"
        className="relative overflow-hidden bg-slate-950 text-white"
      >
        hola
        <div className="absolute inset-0">
          <img
            src={contactHero}
            alt="Medical courier delivery"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>
        {/* <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.32em] text-primary-200">
              Request a Quote
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Request a medical courier delivery quote
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-100/85">
              Tell us where, when, and what you need delivered. Our team will
              follow up with a tailored service plan for safe, compliant,
              time-critical healthcare logistics.
            </p>
          </div>
        </div> */}
      </section>

      {/* <section className="bg-slate-50 text-slate-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-8">
              <div className="rounded-[2rem] bg-white p-10 shadow-2xl">
                <p className="text-sm uppercase tracking-[0.32em] text-primary-200">
                  Get Started
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Share your delivery details and we&apos;ll handle the rest.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-700">
                  Efficient Global specializes in medical courier services for
                  hospitals, labs, clinics, and pharmacies. Complete the form to
                  request a quote for specimen transport, pharmacy deliveries,
                  diagnostic materials, or other healthcare logistics.
                </p>
              </div>

              <div className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-primary-200">
                      Why choose us
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold">
                      Fast, secure, compliant delivery tailored for healthcare
                    </h3>
                  </div>

                  <ul className="space-y-4 text-sm leading-7 text-slate-200">
                    <li>• Same-day specimen and medical records transport</li>
                    <li>• Dedicated medical courier service area</li>
                    <li>• HIPAA-aware handling and chain-of-custody support</li>
                    <li>
                      • Flexible vehicle options for urgent,
                      temperature-sensitive loads
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-10 shadow-2xl">
              <p className="text-sm uppercase tracking-[0.32em] text-primary-200">
                Quote Request
              </p>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                Delivery details
              </h3>

              <form className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Pickup location
                    <input
                      type="text"
                      placeholder="Facility or address"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Delivery location
                    <input
                      type="text"
                      placeholder="Facility or address"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Date / time needed
                    <input
                      type="datetime-local"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Vehicle type
                    <select className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30">
                      <option>Medical specimen delivery</option>
                      <option>Pharmacy or medication transport</option>
                      <option>Lab documents and samples</option>
                      <option>Urgent courier / same day</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Name
                    <input
                      type="text"
                      placeholder="Your name"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Email
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Phone
                    <input
                      type="tel"
                      placeholder="(123) 456-7890"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Rush delivery required?
                    <select className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30">
                      <option>No</option>
                      <option>Yes, rush delivery</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Additional instructions
                  <textarea
                    rows={5}
                    placeholder="Provide weight, dimensions, handling instructions, or any special notes"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-full bg-primary-200 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-primary-300"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default ContactPage;
