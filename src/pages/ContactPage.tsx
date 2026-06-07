import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import contactHero from "../assets/images/contact-hero.jpg";

const ContactPage = () => {
  const location = useLocation();
  const source =
    (location.state as { source?: string } | null)?.source ??
    "request-information";

  console.log({ source });

  useEffect(() => {
    const el = document.getElementById("start");
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  return (
    <div id="start" className="snap-start">
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
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.32em] text-primary-200">
              {source === "request-information"
                ? "Get in Touch"
                : "Schedule a Delivery"}
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
        </div>
      </section>

      <section></section>
    </div>
  );
};

export default ContactPage;
