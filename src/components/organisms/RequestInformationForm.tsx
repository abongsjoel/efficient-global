import React from "react";

const RequestInformationForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
    console.log("request information submit", data);
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="border-b border-slate-200 px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Request Information
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Tell us about your needs and we will respond with pricing, timelines,
          and next steps.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 px-6 py-8 sm:px-8"
        aria-label="Request information form"
      >
        <input type="hidden" name="source" value="request-information" />

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input
              name="name"
              type="text"
              placeholder="Your name"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-700">
          Organization (optional)
          <input
            name="organization"
            type="text"
            placeholder="Hospital, clinic, lab, or company"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Message
          <textarea
            name="message"
            rows={6}
            placeholder="How can we help?"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-full bg-primary-200 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition duration-200 hover:bg-primary-300"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default RequestInformationForm;
