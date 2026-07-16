import { useState, type FormEvent } from "react";
import FieldSuggestions from "../atoms/FieldSuggestions";
import FormSubmitButton from "../atoms/FormSubmitButton";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import FormSuccessModal from "../molecules/FormSuccessModal";
import FormShell from "../molecules/FormShell";
import { apiBaseUrl } from "../../utils/api";
import {
  getFormSuggestions,
  saveFormSuggestions,
} from "../../utils/formSuggestions";
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

const requestInformationSuggestionFields = [
  "name",
  "email",
  "phone",
  "organization",
] as const;

type RequestInformationResponse = {
  message?: string;
  errors?: RequestInformationFieldErrors;
};

const requestInformationEndpoint = `${apiBaseUrl}/api/request-information`;

const RequestInformationForm = () => {
  const [errors, setErrors] = useState<RequestInformationFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [suggestions, setSuggestions] = useState(() =>
    getFormSuggestions(requestInformationSuggestionFields),
  );

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const validationErrors = validateRequestInformationFields(fd);

    setErrors(validationErrors);
    setSubmitError("");

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
    const name = typeof data.name === "string" ? data.name.trim() : "";

    try {
      setIsSubmitting(true);

      const response = await fetch(requestInformationEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = (await response.json()) as RequestInformationResponse;

      if (!response.ok) {
        if (responseData.errors && Object.keys(responseData.errors).length > 0) {
          setErrors(responseData.errors);
          scrollToFirstErrorField(
            form,
            requestInformationFieldOrder.filter(
              (fieldName) => responseData.errors?.[fieldName],
            ),
          );
        }

        setSubmitError(
          responseData.message ||
            "We could not send your message. Please check the form and try again.",
        );
        return;
      }

      setSubmittedName(name);
      saveFormSuggestions(requestInformationSuggestionFields, data);
      setSuggestions(getFormSuggestions(requestInformationSuggestionFields));
      form.reset();
      setErrors({});
      setIsConfirmationOpen(true);
    } catch {
      setSubmitError(
        "We could not reach the server. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAnotherRequest = () => {
    setIsConfirmationOpen(false);
    setSubmitError("");
    setErrors({});
    setSubmittedName("");
  };

  const submittedDisplayName = submittedName.trim() || "there";

  return (
    <FormShell
      icon="💬"
      eyebrow="Get in Touch"
      title="Request Information"
      description="Tell us about your needs and we will respond with pricing, timelines, and next steps."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-8 px-6 py-8 sm:px-10"
        aria-label="Request information form"
      >
        <input type="hidden" name="source" value="request-information" />
        <FieldSuggestions
          id="request-information-name-suggestions"
          values={suggestions.name}
        />
        <FieldSuggestions
          id="request-information-email-suggestions"
          values={suggestions.email}
        />
        <FieldSuggestions
          id="request-information-phone-suggestions"
          values={suggestions.phone}
        />
        <FieldSuggestions
          id="request-information-organization-suggestions"
          values={suggestions.organization}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Name"
            name="name"
            type="text"
            autoComplete="name"
            list="request-information-name-suggestions"
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
            list="request-information-email-suggestions"
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
            list="request-information-phone-suggestions"
            placeholder="(123) 456-7890"
            required
            error={errors.phone}
            onChange={() => clearFieldError("phone")}
          />

          <Input
            label="Organization"
            name="organization"
            type="text"
            autoComplete="organization"
            list="request-information-organization-suggestions"
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

        {submitError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {submitError}
          </p>
        ) : null}

        <FormSubmitButton disabled={isSubmitting} isLoading={isSubmitting}>
          Send Message
        </FormSubmitButton>
      </form>

      <FormSuccessModal
        isOpen={isConfirmationOpen}
        title="Request Received"
        titleId="request-information-success-title"
        onClose={handleSubmitAnotherRequest}
        onContinue={handleSubmitAnotherRequest}
      >
        Thanks <strong>{submittedDisplayName}</strong> for getting in touch!
        Your request has been received, and an agent will get back to you
        shortly.
      </FormSuccessModal>
    </FormShell>
  );
};

export default RequestInformationForm;
