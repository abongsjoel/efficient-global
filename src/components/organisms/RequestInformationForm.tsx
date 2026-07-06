import { useState, type FormEvent } from "react";
import FormSubmitButton from "../atoms/FormSubmitButton";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import { scrollToFirstErrorField } from "../../utils/formFocus";
import {
  type RequestInformationFieldErrors,
  validateRequestInformationFields,
} from "../../utils/formValidation";

const requestInformationFieldOrder: Array<keyof RequestInformationFieldErrors> = [
  "name",
  "email",
  "phone",
  "message",
];

const RequestInformationForm = () => {
  const [errors, setErrors] = useState<RequestInformationFieldErrors>({});

  const clearFieldError = (field: keyof RequestInformationFieldErrors) => {
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
    const form = e.currentTarget;
    const fd = new FormData(form);
    const validationErrors = validateRequestInformationFields(fd);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstErrorField(
        form,
        requestInformationFieldOrder.filter(
          (fieldName) => validationErrors[fieldName],
        ),
      );
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
        className="space-y-6 px-6 py-7 sm:px-8"
        aria-label="Request information form"
      >
        <input type="hidden" name="source" value="request-information" />

        <div className="grid gap-5 sm:grid-cols-2">
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

        <div className="grid gap-5 sm:grid-cols-2">
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

          <Input
            label="Organization"
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
          required
          error={errors.message}
          onChange={() => clearFieldError("message")}
        />

        <FormSubmitButton>Send Message</FormSubmitButton>
      </form>
    </div>
  );
};

export default RequestInformationForm;
