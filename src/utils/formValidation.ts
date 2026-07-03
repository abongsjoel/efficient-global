export type ContactFieldErrors = Partial<Record<"email" | "phone", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneCharacterPattern = /^\+?[0-9\s().-]+$/;

const getStringValue = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export const validateContactFields = (formData: FormData) => {
  const email = getStringValue(formData.get("email"));
  const phone = getStringValue(formData.get("phone"));
  const errors: ContactFieldErrors = {};
  const phoneDigits = phone.replace(/\D/g, "");

  if (!email) {
    errors.email = "Enter an email address.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Enter a phone number.";
  } else if (
    !phoneCharacterPattern.test(phone) ||
    phoneDigits.length < 10 ||
    phoneDigits.length > 15
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  return errors;
};
