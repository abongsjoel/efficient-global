import { useState, type FormEvent } from "react";
import Dropdown from "../atoms/Dropdown";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import { requestTypeOptions, rushDeliveryOptions } from "../../utils/constants";
import {
  type DeliveryRequestFieldErrors,
  validateDeliveryRequestFields,
} from "../../utils/formValidation";

const DeliveryRequestForm = () => {
  const [errors, setErrors] = useState<DeliveryRequestFieldErrors>({});

  const clearFieldError = (field: keyof DeliveryRequestFieldErrors) => {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const validationErrors = validateDeliveryRequestFields(fd);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

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
        noValidate
        className="space-y-8 px-6 py-8 sm:px-8"
        aria-label="Schedule delivery form"
      >
        <input type="hidden" name="source" value="schedule-delivery" />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Pickup location"
            name="pickup"
            type="text"
            placeholder="Facility or address"
            required
            error={errors.pickup}
            onChange={() => clearFieldError("pickup")}
          />

          <Input
            label="Delivery location"
            name="delivery"
            type="text"
            placeholder="Facility or address"
            required
            error={errors.delivery}
            onChange={() => clearFieldError("delivery")}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Date / time needed"
            name="datetime"
            type="datetime-local"
            required
            error={errors.datetime}
            onChange={() => clearFieldError("datetime")}
          />

          <Dropdown
            label="Request type"
            name="vehicle"
            defaultValue=""
            placeholder="Select a request type"
            options={requestTypeOptions}
            required
            error={errors.vehicle}
            onChange={() => clearFieldError("vehicle")}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            error={errors.name}
            onChange={() => clearFieldError("name")}
          />

          <Input
            label="Email"
            name="email"
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            error={errors.email}
            onChange={() => clearFieldError("email")}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(123) 456-7890"
            required
            error={errors.phone}
            onChange={() => clearFieldError("phone")}
          />

          <Dropdown
            label="Rush delivery required?"
            name="rush"
            options={rushDeliveryOptions}
            required
            error={errors.rush}
            onChange={() => clearFieldError("rush")}
          />
        </div>

        <TextArea
          label="Additional instructions"
          name="instructions"
          rows={5}
          placeholder="Provide weight, dimensions, handling instructions, or any special notes"
        />

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
