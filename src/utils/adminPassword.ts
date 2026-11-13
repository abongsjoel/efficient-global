// Mirrors the backend rules in adminService.validateAdminPasswordChange.
export const minAdminPasswordLength = 8;
export const maxAdminPasswordLength = 72;

export const adminPasswordRequirementMessage =
  "Password must include a lowercase letter, uppercase letter, number, and special character.";

export const getPasswordRequirementStatuses = (password: string) => [
  {
    label: `${minAdminPasswordLength}-${maxAdminPasswordLength} characters`,
    isMet:
      password.length >= minAdminPasswordLength &&
      password.length <= maxAdminPasswordLength,
  },
  {
    label: "Lowercase letter",
    isMet: /[a-z]/.test(password),
  },
  {
    label: "Uppercase letter",
    isMet: /[A-Z]/.test(password),
  },
  {
    label: "Number",
    isMet: /[0-9]/.test(password),
  },
  {
    label: "Special character",
    isMet: /[^A-Za-z0-9\s]/.test(password),
  },
];

// Returns an empty string when the password meets every rule.
export const getAdminPasswordError = (
  password: string,
  emptyMessage: string,
) => {
  if (!password.trim()) {
    return emptyMessage;
  }

  if (password.length < minAdminPasswordLength) {
    return `Password must be at least ${minAdminPasswordLength} characters.`;
  }

  if (password.length > maxAdminPasswordLength) {
    return `Password must be ${maxAdminPasswordLength} characters or fewer.`;
  }

  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9\s]/.test(password)
  ) {
    return adminPasswordRequirementMessage;
  }

  return "";
};
