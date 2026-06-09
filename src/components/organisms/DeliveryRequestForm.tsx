import React from "react";
import {
  Field,
  FormShell,
  Input,
  Select,
  SubmitButton,
  Textarea,
} from "../molecules/FormFields";
import {
  useFormValidation,
  validators as v,
} from "../../hooks/useFormValidation";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
    {children}
  </p>
);

const schema = {
  pickup: [v.required("Enter a pickup location")],
  delivery: [v.required("Enter a delivery location")],
  datetime: [v.required("Choose when the delivery is needed")],
  name: [v.required("Tell us your name")],
  email: [v.required("Enter your email"), v.email()],
  phone: [v.phone()],
};

const DeliveryRequestForm: React.FC = () => {
  const { errors, validate, revalidate } = useFormValidation(schema);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("delivery request submit", data);
  };

  return (
    <FormShell
      icon="🚚"
      eyebrow="Schedule a Delivery"
      title="Request your medical courier delivery"
      description="Share pickup and delivery details so we can prepare the right vehicle and timing."
    >
      <form
        onSubmit={handleSubmit}
        onChange={(e) =>
          revalidate(e.currentTarget, (e.target as HTMLInputElement).name)
        }
        noValidate
        className="space-y-8 px-6 py-8 sm:px-10"
        aria-label="Schedule delivery form"
      >
        <input type="hidden" name="source" value="schedule-delivery" />

        <div className="space-y-6">
          <SectionLabel>Route &amp; timing</SectionLabel>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Pickup location" required error={errors.pickup}>
              <Input
                name="pickup"
                type="text"
                placeholder="Facility or address"
                required
              />
            </Field>

            <Field label="Delivery location" required error={errors.delivery}>
              <Input
                name="delivery"
                type="text"
                placeholder="Facility or address"
                required
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Date / time needed" required error={errors.datetime}>
              <Input name="datetime" type="datetime-local" required />
            </Field>

            <Field label="Vehicle type">
              <Select name="vehicle" defaultValue="Medical specimen delivery">
                <option>Medical specimen delivery</option>
                <option>Pharmacy or medication transport</option>
                <option>Lab documents and samples</option>
                <option>Urgent courier / same day</option>
              </Select>
            </Field>
          </div>
        </div>

        <div className="space-y-6 border-t border-slate-100 pt-8">
          <SectionLabel>Your details</SectionLabel>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Name" required error={errors.name}>
              <Input
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </Field>

            <Field label="Email" required error={errors.email}>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Phone" error={errors.phone}>
              <Input
                name="phone"
                type="tel"
                placeholder="(123) 456-7890"
                autoComplete="tel"
              />
            </Field>

            <Field label="Rush delivery required?">
              <Select name="rush" defaultValue="No">
                <option>No</option>
                <option>Yes, rush delivery</option>
              </Select>
            </Field>
          </div>

          <Field label="Additional instructions">
            <Textarea
              name="instructions"
              rows={5}
              placeholder="Provide weight, dimensions, handling instructions, or any special notes"
            />
          </Field>
        </div>

        <SubmitButton>Submit Request</SubmitButton>
      </form>
    </FormShell>
  );
};

export default DeliveryRequestForm;
