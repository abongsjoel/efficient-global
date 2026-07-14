import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FormSubmitButton from "../atoms/FormSubmitButton";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import FormShell from "../molecules/FormShell";
import RequestInformationSuccessModal from "../molecules/RequestInformationSuccessModal";
import { apiBaseUrl } from "../../utils/api";
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

type RequestInformationResponse = {
  message?: string;
  errors?: RequestInformationFieldErrors;
};

const requestInformationEndpoint = `${apiBaseUrl}/api/request-information`;

const RequestInformationForm = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<RequestInformationFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

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

        {submitError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {submitError}
          </p>
        ) : null}

        <FormSubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </FormSubmitButton>
      </form>

      <RequestInformationSuccessModal
        isOpen={isConfirmationOpen}
        name={submittedName}
        onGoHome={() => navigate("/")}
        onClose={handleSubmitAnotherRequest}
        onSubmitAnotherRequest={handleSubmitAnotherRequest}
      />
    </FormShell>
  );
};

export default RequestInformationForm;
