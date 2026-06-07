import { useLocation } from "react-router-dom";

const ContactPage = () => {
  const location = useLocation();
  const source =
    (location.state as { source?: string } | null)?.source ??
    "request-information";

  console.log({ source });

  return (
    <>
      Hellooo I am the ContactPage Page
      {source ? (
        <div className="mt-4 text-sm text-slate-500">
          Navigated from: <strong>{source}</strong>
        </div>
      ) : null}
    </>
  );
};

export default ContactPage;
