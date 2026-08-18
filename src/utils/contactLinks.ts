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
