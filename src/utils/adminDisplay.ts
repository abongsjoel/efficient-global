export const formatAdminRole = (role = "") => role.replace(/_/g, " ");

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});

const parseDate = (value: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDateTime = (value: string) => {
  if (!value) {
    return "-";
  }

  const date = parseDate(value);

  return date ? dateTimeFormatter.format(date) : value;
};

// Returns null for blank or unparseable input so callers can fall back to the
// single-line rendering instead of splitting a value they cannot interpret.
export const formatDateTimeParts = (value: string) => {
  const date = parseDate(value);

  return date
    ? { date: dateFormatter.format(date), time: timeFormatter.format(date) }
    : null;
};
