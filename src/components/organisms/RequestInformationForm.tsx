import React from "react";

interface RequestInformationFormProps {
  source: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RequestInformationForm: React.FC<RequestInformationFormProps> = ({
  source,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-6"
      aria-label="Request information form"
    >
      <input type="hidden" name="source" value={source} />

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
    </form>
  );
};

export default RequestInformationForm;
