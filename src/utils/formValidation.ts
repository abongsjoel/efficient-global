export type ContactFieldErrors = Partial<Record<"email" | "phone", string>>;

export type AdminLoginFieldErrors = Partial<
  Record<"identifier" | "password", string>
>;

export type RequestInformationFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "message", string>
>;

export type DeliveryRequestFieldErrors = Partial<
  Record<
    | "pickup"
    | "delivery"
    | "datetime"
    | "vehicle"
    | "name"
    | "email"
    | "phone"
    | "rush",
    string
  >
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneCharacterPattern = /^\+?[0-9\s().-]+$/;

const getStringValue = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const padDatePart = (value: number) => String(value).padStart(2, "0");

const getCurrentMinuteStart = () => {
  const now = new Date();
  now.setSeconds(0, 0);
  return now;
};

export const getCurrentDateTimeLocalValue = () => {
  const now = getCurrentMinuteStart();
  const year = now.getFullYear();
  const month = padDatePart(now.getMonth() + 1);
  const day = padDatePart(now.getDate());
  const hours = padDatePart(now.getHours());
  const minutes = padDatePart(now.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getDateTimeLocalValueDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

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

export const validateAdminLoginFields = (formData: FormData) => {
  const errors: AdminLoginFieldErrors = {};
  const identifier = getStringValue(formData.get("identifier"));

  if (!identifier) {
    errors.identifier = "Enter your username or email.";
  }

  if (!getStringValue(formData.get("password"))) {
    errors.password = "Enter your password.";
  }

  return errors;
};

export const validateRequestInformationFields = (formData: FormData) => {
  const errors: RequestInformationFieldErrors = {};

  if (!getStringValue(formData.get("name"))) {
    errors.name = "Enter your name.";
  }

  if (!getStringValue(formData.get("message"))) {
    errors.message = "Enter a message.";
  }

  return {
    ...errors,
    ...validateContactFields(formData),
  };
};

export const validateDeliveryRequestFields = (formData: FormData) => {
  const errors: DeliveryRequestFieldErrors = {};
  const datetime = getStringValue(formData.get("datetime"));
  const requiredFields: Array<{
    name: keyof DeliveryRequestFieldErrors;
    message: string;
  }> = [
    { name: "pickup", message: "Enter a pickup location." },
    { name: "delivery", message: "Enter a delivery location." },
    { name: "datetime", message: "Select a date and time." },
    { name: "vehicle", message: "Select a request type." },
    { name: "name", message: "Enter your name." },
    { name: "rush", message: "Select whether rush delivery is required." },
  ];

  requiredFields.forEach(({ name, message }) => {
    if (!getStringValue(formData.get(name))) {
      errors[name] = message;
    }
  });

  if (datetime) {
    const requestedDate = getDateTimeLocalValueDate(datetime);

    if (!requestedDate) {
      errors.datetime = "Enter a valid date and time.";
    } else if (requestedDate < getCurrentMinuteStart()) {
      errors.datetime = "Select a date and time that is not in the past.";
    }
  }

  return {
    ...errors,
    ...validateContactFields(formData),
  };
};
