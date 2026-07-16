const maxSuggestionsPerField = 6;
const storageKeyPrefix = "efficient-global-form-suggestions";

const getStorageKey = (field: string) => `${storageKeyPrefix}:${field}`;

const getStoredSuggestions = (field: string) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(getStorageKey(field));
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
};

const saveStoredSuggestions = (field: string, values: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(field), JSON.stringify(values));
};

const addStoredSuggestion = (field: string, value: FormDataEntryValue | undefined) => {
  if (typeof value !== "string") {
    return;
  }

  const nextValue = value.trim();

  if (!nextValue) {
    return;
  }

  const previousValues = getStoredSuggestions(field);
  const nextValues = [
    nextValue,
    ...previousValues.filter(
      (previousValue) => previousValue.toLowerCase() !== nextValue.toLowerCase(),
    ),
  ].slice(0, maxSuggestionsPerField);

  saveStoredSuggestions(field, nextValues);
};

export const getFormSuggestions = <Field extends string>(
  fields: readonly Field[],
) =>
  fields.reduce(
    (suggestions, field) => ({
      ...suggestions,
      [field]: getStoredSuggestions(field),
    }),
    {} as Record<Field, string[]>,
  );

export const saveFormSuggestions = <Field extends string>(
  fields: readonly Field[],
  values: Record<string, FormDataEntryValue>,
) => {
  fields.forEach((field) => addStoredSuggestion(field, values[field]));
};
