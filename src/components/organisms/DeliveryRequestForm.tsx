import React from "react";

const DeliveryRequestForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
    console.log("delivery request submit", data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6"
      aria-label="Schedule delivery form"
    >
      <input type="hidden" name="source" value="schedule-delivery" />

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Pickup location
          <input
            name="pickup"
            type="text"
            placeholder="Facility or address"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Delivery location
          <input
            name="delivery"
            type="text"
            placeholder="Facility or address"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Date / time needed
          <input
            name="datetime"
            type="datetime-local"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Vehicle type
          <select
            name="vehicle"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          >
            <option>Medical specimen delivery</option>
            <option>Pharmacy or medication transport</option>
            <option>Lab documents and samples</option>
            <option>Urgent courier / same day</option>
          </select>
        </label>
      </div>

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

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input
            name="phone"
            type="tel"
            placeholder="(123) 456-7890"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Rush delivery required?
          <select
            name="rush"
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          >
            <option>No</option>
            <option>Yes, rush delivery</option>
          </select>
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Additional instructions
        <textarea
          name="instructions"
          rows={5}
          placeholder="Provide weight, dimensions, handling instructions, or any special notes"
          className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
        />
      </label>

      <button
        type="submit"
        className="inline-flex w-full justify-center rounded-full bg-primary-200 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition hover:bg-primary-300"
      >
        Submit Request
      </button>
    </form>
  );
};

export default DeliveryRequestForm;
