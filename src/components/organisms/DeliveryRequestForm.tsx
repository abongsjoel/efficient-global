import { useState, type FormEvent, type ReactNode } from "react";
import Dropdown from "../atoms/Dropdown";
import FormSubmitButton from "../atoms/FormSubmitButton";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";
import FormSuccessModal from "../molecules/FormSuccessModal";
import FormShell from "../molecules/FormShell";
import { apiBaseUrl } from "../../utils/api";
import { requestTypeOptions, rushDeliveryOptions } from "../../utils/constants";
import {
  getFormSuggestions,
  saveFormSuggestions,
} from "../../utils/formSuggestions";
import { scrollToFirstErrorField } from "../../utils/formFocus";
import {
  type DeliveryRequestFieldErrors,
  validateDeliveryRequestFields,
} from "../../utils/formValidation";

const deliveryRequestFieldOrder: Array<keyof DeliveryRequestFieldErrors> = [
  "pickup",
  "delivery",
  "datetime",
  "vehicle",
  "name",
  "email",
  "phone",
  "rush",
];

const deliveryRequestSuggestionFields = [
  "pickup",
  "delivery",
  "name",
  "email",
  "phone",
] as const;

type DeliveryRequestResponse = {
  message?: string;
  errors?: DeliveryRequestFieldErrors;
};

const deliveryRequestEndpoint = `${apiBaseUrl}/api/delivery-request`;

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
    {children}
  </p>
);

const DeliveryRequestForm = () => {
  const [errors, setErrors] = useState<DeliveryRequestFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [suggestions, setSuggestions] = useState(() =>
    getFormSuggestions(deliveryRequestSuggestionFields),
  );

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const validationErrors = validateDeliveryRequestFields(fd);

    setErrors(validationErrors);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      scrollToFirstErrorField(
        form,
        deliveryRequestFieldOrder.filter(
          (fieldName) => validationErrors[fieldName],
        ),
      );
      return;
    }

    const data = Object.fromEntries(fd.entries());
    const name = typeof data.name === "string" ? data.name.trim() : "";

    try {
      setIsSubmitting(true);

      const response = await fetch(deliveryRequestEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = (await response.json()) as DeliveryRequestResponse;

      if (!response.ok) {
        if (responseData.errors && Object.keys(responseData.errors).length > 0) {
          setErrors(responseData.errors);
          scrollToFirstErrorField(
            form,
            deliveryRequestFieldOrder.filter(
              (fieldName) => responseData.errors?.[fieldName],
            ),
          );
        }

        setSubmitError(
          responseData.message ||
            "We could not send your delivery request. Please check the form and try again.",
        );
        return;
      }

      setSubmittedName(name);
      saveFormSuggestions(deliveryRequestSuggestionFields, data);
      setSuggestions(getFormSuggestions(deliveryRequestSuggestionFields));
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
      icon="🚚"
      eyebrow="Schedule a Delivery"
      title="Schedule a Delivery"
      description="Share pickup and delivery details so we can prepare the right vehicle and timing."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-8 px-6 py-8 sm:px-10"
        aria-label="Schedule delivery form"
      >
        <input type="hidden" name="source" value="schedule-delivery" />

        <div className="space-y-6">
          <SectionLabel>Route &amp; timing</SectionLabel>
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Pickup location"
              name="pickup"
              type="text"
              placeholder="Facility or address"
              required
              error={errors.pickup}
              suggestions={suggestions.pickup}
              onChange={() => clearFieldError("pickup")}
            />

            <Input
              label="Delivery location"
              name="delivery"
              type="text"
              placeholder="Facility or address"
              required
              error={errors.delivery}
              suggestions={suggestions.delivery}
              onChange={() => clearFieldError("delivery")}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Date / time needed"
              name="datetime"
              type="datetime-local"
              required
              className="invalid:text-slate-400"
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
        </div>

        <div className="space-y-6 border-t border-slate-100 pt-8">
          <SectionLabel>Your details</SectionLabel>
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              required
              error={errors.name}
              suggestions={suggestions.name}
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
              suggestions={suggestions.email}
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
              suggestions={suggestions.phone}
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
        </div>

        {submitError ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {submitError}
          </p>
        ) : null}

        <FormSubmitButton disabled={isSubmitting} isLoading={isSubmitting}>
          Submit Request
        </FormSubmitButton>
      </form>

      <FormSuccessModal
        isOpen={isConfirmationOpen}
        title="Delivery Request Received"
        titleId="delivery-request-success-title"
        onClose={handleSubmitAnotherRequest}
        onContinue={handleSubmitAnotherRequest}
      >
        Thanks <strong>{submittedDisplayName}</strong> for scheduling a
        delivery! Your request has been received, and an agent will get back to
        you shortly.
      </FormSuccessModal>
    </FormShell>
  );
};

export default DeliveryRequestForm;
