const getTrimmedValue = (value: string | undefined) =>
  typeof value === "string" ? value.trim() : "";

export const getMailtoHref = (email?: string, subject?: string) => {
  const trimmedEmail = getTrimmedValue(email);

  if (!trimmedEmail) {
    return "";
  }

  const trimmedSubject = getTrimmedValue(subject);

  return trimmedSubject
    ? `mailto:${trimmedEmail}?subject=${encodeURIComponent(trimmedSubject)}`
    : `mailto:${trimmedEmail}`;
};

export const getTelHref = (phone?: string) => {
  // tel: links only accept digits and a leading "+", so drop formatting.
  const dialablePhone = getTrimmedValue(phone).replace(/(?!^\+)\D/g, "");

  return dialablePhone.replace(/\D/g, "").length >= 7
    ? `tel:${dialablePhone}`
    : "";
};
