import { useState } from "react";

export type Validator = (
  value: string,
  values: Record<string, string>,
) => string | undefined;

export type ValidationSchema = Record<string, Validator[]>;

// small set of composable validators; each returns a message when invalid
export const validators = {
  required:
    (message = "This field is required"): Validator =>
    (value) =>
      value.trim() ? undefined : message,
  email:
    (message = "Enter a valid email address"): Validator =>
    (value) =>
      !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? undefined
        : message,
  phone:
    (message = "Enter a valid phone number"): Validator =>
    (value) =>
      !value.trim() || value.replace(/\D/g, "").length >= 7
        ? undefined
        : message,
};

export function useFormValidation(schema: ValidationSchema) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  // only validate-as-you-type after the first submit attempt
  const [submitted, setSubmitted] = useState(false);

  const collect = (form: HTMLFormElement) =>
    Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

  const runField = (name: string, values: Record<string, string>) => {
    for (const rule of schema[name] ?? []) {
      const message = rule(values[name] ?? "", values);
      if (message) return message;
    }
    return undefined;
  };

  // validate the whole form; returns true when everything passes
  const validate = (form: HTMLFormElement) => {
    const values = collect(form);
    const next: Record<string, string> = {};
    for (const name of Object.keys(schema)) {
      const message = runField(name, values);
      if (message) next[name] = message;
    }
    setErrors(next);
    setSubmitted(true);
    return Object.keys(next).length === 0;
  };

  // re-check a single field as the user edits, once they've tried to submit
  const revalidate = (form: HTMLFormElement, name: string) => {
    if (!submitted || !(name in schema)) return;
    const values = collect(form);
    setErrors((prev) => {
      const next = { ...prev };
      const message = runField(name, values);
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  };

  return { errors, validate, revalidate };
}
