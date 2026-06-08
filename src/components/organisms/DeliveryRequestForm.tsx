import React from "react";

const DeliveryRequestForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
    console.log("delivery request submit", data);
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="border-b border-slate-200 px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Schedule a Delivery
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Share pickup and delivery details so we can prepare the right vehicle
          and timing.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 px-6 py-8 sm:px-8"
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
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Delivery location
            <input
              name="delivery"
              type="text"
              placeholder="Facility or address"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
            />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Date / time needed
            <input
              name="datetime"
              type="datetime-local"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Vehicle type
            <select
              name="vehicle"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
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

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Phone
            <input
              name="phone"
              type="tel"
              placeholder="(123) 456-7890"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Rush delivery required?
            <select
              name="rush"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
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
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-primary-200 focus:ring-2 focus:ring-primary-200/30"
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full justify-center rounded-full bg-primary-200 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 transition duration-200 hover:bg-primary-300"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default DeliveryRequestForm;
