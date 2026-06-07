import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import contactHero from "../assets/images/contact-hero.jpg";

const ContactPage = () => {
  const location = useLocation();
  const source =
    (location.state as { source?: string } | null)?.source ??
    "request-information";

  useEffect(() => {
    const el = document.getElementById("start");
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
    console.log("contact submit", data);
  };

  return (
    <div id="start" className="snap-start">
      <section
        id="contact-page-top"
        className="relative overflow-hidden bg-slate-950 text-white"
      >
        <div className="absolute inset-0">
          <img
            src={contactHero}
            alt="Medical courier delivery"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.32em] text-primary-200">
              {source === "request-information"
                ? "Get in Touch"
                : "Schedule a Delivery"}
            </p>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {source === "request-information"
                ? "Questions about our services?"
                : "Schedule your medical courier delivery"}
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-100/85">
              {source === "request-information"
                ? "Tell us about your needs or ask a question and our team will respond promptly."
                : "Provide pickup and delivery details, preferred time, and any handling requirements to request a delivery or get a quote."}
            </p>
          </div>
        </div>
      </section>
      <section></section>

      <section id="contact-form" className="bg-slate-50 text-slate-900 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            aria-label="Contact form"
          >
            <input type="hidden" name="source" value={source} />
            {source === "request-information" ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Name
                    <input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Email
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Organization (optional)
                  <input
                    name="organization"
                    type="text"
                    placeholder="Hospital, clinic, lab, or company"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Message
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="How can we help?"
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-full bg-primary-200 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-primary-300"
                >
                  Send Message
                </button>
              </>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Pickup location
                    <input
                      name="pickup"
                      type="text"
                      placeholder="Facility or address"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Delivery location
                    <input
                      name="delivery"
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
                      name="datetime"
                      type="datetime-local"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Vehicle type
                    <select
                      name="vehicle"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    >
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
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Email
                    <input
                      name="email"
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
                      name="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Rush delivery required?
                    <select
                      name="rush"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
                    >
                      <option>No</option>
                      <option>Yes, rush delivery</option>
                    </select>
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Additional instructions
                  <textarea
                    name="instructions"
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
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
