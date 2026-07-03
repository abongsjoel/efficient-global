import { email_primary, phone_primary } from "../../utils/constants";

const Footer = () => {
  const phoneHref = `tel:${phone_primary.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="bg-slate-950 text-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Efficient Global Enterprises
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Reliable medical courier services across the Twin Cities and
              surrounding Minnesota communities.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Services</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>Medical Courier Services</li>
              <li>Specimen Transport</li>
              <li>Pharmaceutical Delivery</li>
              <li>Same-Day Medical Delivery</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Contact</h4>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>
                📞 Phone:{" "}
                <a
                  href={phoneHref}
                  className="transition duration-200 hover:text-white"
                >
                  {phone_primary}
                </a>
              </p>
              <p>
                ✉️ Email:{" "}
                <a
                  href={`mailto:${email_primary}`}
                  className="transition duration-200 hover:text-white"
                >
                  {email_primary}
                </a>
              </p>
              <p>📍 Twin Cities & Surrounding Areas</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            © 2026 Efficient Global Enterprises. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
