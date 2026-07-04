export const scrollToFirstErrorField = (
  form: HTMLFormElement,
  fieldNames: string[],
) => {
  const firstFieldName = fieldNames.find((fieldName) =>
    form.elements.namedItem(fieldName),
  );

  if (!firstFieldName) {
    return;
  }

  window.requestAnimationFrame(() => {
    const field = form.elements.namedItem(firstFieldName);

    if (!(field instanceof HTMLElement)) {
      return;
    }

    field.scrollIntoView({ behavior: "smooth", block: "center" });
    field.focus({ preventScroll: true });
  });
};
