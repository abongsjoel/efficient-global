import { useNavigate } from "react-router-dom";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

const Contact = () => {
  const navigate = useNavigate();

  const handleScheduleDelivery = () => {
    navigate("/contact", { state: { source: "schedule-delivery" } });
  };

  const handleRequestInformation = () => {
    navigate("/contact", { state: { source: "request-information" } });
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-50 text-slate-950"
    >
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary-200/15 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-slate-900/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Badge>Contact</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Schedule a Medical Delivery
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            If your organization needs dependable medical courier services,
            Efficient Global Delivery is ready to help. Contact us today to
            schedule a delivery or request more information about our services.
          </p>
        </div>

        <div className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-2xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-200/10 text-2xl">
                  📞
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary-200">
                    Phone
                  </p>
                  <p className="text-lg font-semibold text-slate-950">
                    Call us directly
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-200/10 text-2xl">
                  ✉️
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary-200">
                    Email
                  </p>
                  <p className="text-lg font-semibold text-slate-950">
                    Send us a message
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-200/10 text-2xl">
                  📍
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary-200">
                    Service Area
                  </p>
                  <p className="text-lg font-semibold text-slate-950">
                    Twin Cities & Surrounding Minnesota Communities
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
              <Button onClick={handleScheduleDelivery}>
                Schedule Delivery
              </Button>
              <Button variant="inverse" onClick={handleRequestInformation}>
                Request Information
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
