import { useState, type FormEvent } from "react";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import {
  type ContactFieldErrors,
  validateContactFields,
} from "../../utils/formValidation";

const RequestInformationForm = () => {
  const [errors, setErrors] = useState<ContactFieldErrors>({});

  const clearFieldError = (field: keyof ContactFieldErrors) => {
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
    const validationErrors = validateContactFields(fd);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

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
        noValidate
        className="space-y-8 px-6 py-8 sm:px-8"
        aria-label="Request information form"
      >
        <input type="hidden" name="source" value="request-information" />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input label="Name" name="name" type="text" placeholder="Your name" />

          <Input
            label="Email"
            name="email"
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
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
            error={errors.phone}
            onChange={() => clearFieldError("phone")}
          />

          <Input
            label="Organization (optional)"
            name="organization"
            type="text"
            placeholder="Hospital, clinic, lab, or company"
          />
        </div>

        <TextArea
          label="Message"
          name="message"
          rows={6}
          placeholder="How can we help?"
        />

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
