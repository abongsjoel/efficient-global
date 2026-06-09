import React from "react";
import {
  Field,
  FormShell,
  Input,
  SubmitButton,
  Textarea,
} from "../molecules/FormFields";
import {
  useFormValidation,
  validators as v,
} from "../../hooks/useFormValidation";

const schema = {
  name: [v.required("Tell us your name")],
  email: [v.required("Enter your email"), v.email()],
  message: [v.required("Let us know how we can help")],
};

const RequestInformationForm: React.FC = () => {
  const { errors, validate, revalidate } = useFormValidation(schema);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("request information submit", data);
  };

  return (
    <FormShell
      icon="💬"
      eyebrow="Get in Touch"
      title="Request information"
      description="Tell us about your needs and we will respond with pricing, timelines, and next steps."
    >
      <form
        onSubmit={handleSubmit}
        onChange={(e) =>
          revalidate(e.currentTarget, (e.target as HTMLInputElement).name)
        }
        noValidate
        className="space-y-8 px-6 py-8 sm:px-10"
        aria-label="Request information form"
      >
        <input type="hidden" name="source" value="request-information" />

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

        <Field label="Organization (optional)">
          <Input
            name="organization"
            type="text"
            placeholder="Hospital, clinic, lab, or company"
            autoComplete="organization"
          />
        </Field>

        <Field label="Message" required error={errors.message}>
          <Textarea
            name="message"
            rows={6}
            placeholder="How can we help?"
            required
          />
        </Field>

        <SubmitButton>Send Message</SubmitButton>
      </form>
    </FormShell>
  );
};

export default RequestInformationForm;
