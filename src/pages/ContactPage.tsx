import { useEffect } from "react";
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
    </div>
  );
};

export default ContactPage;
