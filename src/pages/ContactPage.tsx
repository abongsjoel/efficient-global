import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import contactHero from "../assets/images/contact-hero.jpg";
import PageHero from "../components/organisms/PageHero";
import DeliveryRequestForm from "../components/organisms/DeliveryRequestForm";
import RequestInformationForm from "../components/organisms/RequestInformationForm";

const ContactPage = () => {
  const location = useLocation();
  const initialSource =
    (location.state as { source?: string } | null)?.source ??
    "request-information";
  const [source, setSource] = useState(initialSource);

  useEffect(() => {
    const el = document.getElementById("start");
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

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
          <div className="mb-10 flex items-center justify-end">
            <div className="inline-flex gap-2 rounded-full border border-slate-300 bg-slate-100 p-1">
              <button
                onClick={() => setSource("request-information")}
                className={`w-40 rounded-full py-2 text-sm font-medium transition duration-200 ${
                  source === "request-information"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Get Information
              </button>
              <button
                onClick={() => setSource("schedule-delivery")}
                className={`w-40 rounded-full py-2 text-sm font-medium transition duration-200 ${
                  source === "schedule-delivery"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Schedule Delivery
              </button>
            </div>
          </div>

          {source === "request-information" ? (
            <RequestInformationForm />
          ) : (
            <DeliveryRequestForm />
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
