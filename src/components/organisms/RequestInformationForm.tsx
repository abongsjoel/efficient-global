import React from "react";
import {
  Field,
  FormShell,
  Input,
  SubmitButton,
  Textarea,
} from "../molecules/FormFields";

const RequestInformationForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
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
        className="space-y-8 px-6 py-8 sm:px-10"
        aria-label="Request information form"
      >
        <input type="hidden" name="source" value="request-information" />

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Name" required>
            <Input
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </Field>

          <Field label="Email" required>
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

        <Field label="Message" required>
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
