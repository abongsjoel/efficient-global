import { useNavigate } from "react-router-dom";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

type ServiceDetail = {
  title: string;
  subtitle: string;
  description: string;
  bullets?: string[];
  icon: string;
};

const serviceDetails: ServiceDetail[] = [
  {
    title: "Medical Courier Services",
    subtitle: "Reliable and Secure Healthcare Delivery Solutions",
    description:
      "Efficient Global Enterprises provides specialized medical courier services designed to support healthcare providers with safe, reliable, and time-sensitive transportation of medical materials.",
    bullets: [
      "Hospitals, laboratories, clinics, pharmacies, and healthcare organizations",
      "Precision, confidentiality, and professionalism on every delivery",
      "Secure handling for sensitive and critical medical materials",
    ],
    icon: "🩺",
  },
  {
    title: "Specimen Transport",
    subtitle: "Secure Transport of Laboratory Specimens",
    description:
      "Efficient Global Enterprises provides reliable transportation of laboratory specimens and medical samples between healthcare facilities and laboratories.",
    bullets: [
      "Blood samples",
      "Laboratory specimens",
      "Diagnostic samples",
      "Pathology materials",
    ],
    icon: "🧪",
  },
  {
    title: "Pharmaceutical Delivery",
    subtitle: "Safe and Timely Medication Transport",
    description:
      "We provide dependable courier services for pharmacies and healthcare providers requiring transportation of medications and pharmaceutical products.",
    bullets: [
      "Prescription medications",
      "Pharmacy supplies",
      "Medical equipment",
      "Urgent medication deliveries",
    ],
    icon: "💊",
  },
  {
    title: "Medical Supply Delivery",
    subtitle: "Delivery of Critical Medical Equipment and Supplies",
    description:
      "Efficient Global Enterprises supports healthcare providers by delivering essential medical supplies to hospitals, clinics, and healthcare offices.",
    bullets: [
      "Medical equipment",
      "Surgical supplies",
      "Healthcare materials",
      "Diagnostic equipment",
    ],
    icon: "📦",
  },
  {
    title: "Healthcare Document Delivery",
    subtitle: "Secure Delivery of Sensitive Healthcare Documents",
    description:
      "Healthcare organizations often require secure transportation of confidential documents between facilities.",
    bullets: [
      "Patient records",
      "Medical documentation",
      "Laboratory reports",
      "Healthcare administrative documents",
    ],
    icon: "📄",
  },
  {
    title: "Same-Day Medical Delivery",
    subtitle: "Fast and Time-Critical Medical Courier Service",
    description:
      "Efficient Global Enterprises offers same-day courier services for urgent medical deliveries that require immediate transportation.",
    bullets: [
      "Emergency medical deliveries",
      "Time-sensitive laboratory specimens",
      "Urgent pharmacy shipments",
      "Critical healthcare materials",
    ],
    icon: "⚡",
  },
];

const Services = () => {
  const navigate = useNavigate();

  const goContact = () => {
    navigate("/contact");
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-slate-50 text-slate-950"
    >
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-primary-200/15 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-slate-900/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Badge>Services</Badge>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Our Courier Services
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-700">
            Efficient Global Enterprises offers reliable courier solutions
            designed to support businesses and individuals with time-sensitive
            deliveries.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {serviceDetails.map((service) => (
            <div
              key={service.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-200/10 text-2xl">
                    {service.icon}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-primary-200">
                      {service.title}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                      {service.subtitle}
                    </h3>
                  </div>
                </div>
                <p className="text-base leading-7 text-slate-700">
                  {service.description}
                </p>
                {service.bullets?.length ? (
                  <ul className="mt-6 space-y-3 text-slate-700">
                    {service.bullets.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary-200" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-slate-200 bg-slate-950 p-10 shadow-2xl">
          <div className="grid gap-8 rounded-[2rem] bg-slate-950 text-white md:grid-cols-[1.6fr_1fr] md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary-200">
                Need courier support?
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                Request a delivery or contact our medical courier team.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Our team is ready to support urgent and same-day medical
                deliveries across the Twin Cities with secure, compliant
                handling.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-end">
              <Button onClick={goContact}>Request a Delivery</Button>
              <Button variant="inverse" onClick={goContact}>
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
