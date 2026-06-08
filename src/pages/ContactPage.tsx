import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import contactHero from "../assets/images/contact-hero.jpg";
import PageHero from "../components/organisms/PageHero";
import DeliveryRequestForm from "../components/organisms/DeliveryRequestForm";
import RequestInformationForm from "../components/organisms/RequestInformationForm";

const ContactPage = () => {
  const location = useLocation();
  const source =
    (location.state as { source?: string } | null)?.source ??
    "request-informations";

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
      <PageHero
        imageSrc={contactHero}
        imageAlt="Medical courier delivery"
        eyebrow={
          source === "request-information"
            ? "Get in Touch"
            : "Schedule a Delivery"
        }
        title={
          source === "request-information"
            ? "Questions about our services?"
            : "Schedule your medical courier delivery"
        }
        description={
          source === "request-information"
            ? "Tell us about your needs or ask a question and our team will respond promptly."
            : "Provide pickup and delivery details, preferred time, and any handling requirements to request a delivery or get a quote."
        }
      />

      <section id="contact-form" className="bg-slate-50 text-slate-900 py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {source === "request-information" ? (
            <RequestInformationForm source={source} onSubmit={handleSubmit} />
          ) : (
            <DeliveryRequestForm source={source} onSubmit={handleSubmit} />
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
