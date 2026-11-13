import {
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type MouseEvent,
} from "react";

type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

type UseFormBlurValidationOptions<Field extends string> = {
  // Fields to check when they lose focus. Others in the form are left alone.
  fields: readonly Field[];
  // Fields to re-check alongside another, e.g. the confirmation when the
  // password changes.
  relatedFields?: Partial<Record<Field, readonly Field[]>>;
  setErrors: (
    update: (currentErrors: FieldErrors<Field>) => FieldErrors<Field>,
  ) => void;
  // The same validator the form runs on submit, so both report the same rules.
  validate: (formData: FormData) => FieldErrors<Field>;
};

const getFieldName = (target: EventTarget | null) =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLSelectElement ||
  target instanceof HTMLTextAreaElement
    ? target.name
    : "";

// Keeps the focused field from blurring when a control is pressed, so a blur
// error can't appear, shift the layout, and make the click miss. Use on
// controls that dismiss or reset a form (Cancel, Clear, close buttons).
export const preventBlurOnMouseDown = (event: MouseEvent) => {
  event.preventDefault();
};

// Validates a field when it loses focus, once the user has typed in it.
// Spread `formProps` onto the <form>: focus and change events bubble up to it,
// so the individual fields need no extra handlers. Untouched fields (including
// prefilled ones) are only checked on submit, so tabbing past an empty field
// doesn't flag it before the user has had a chance to fill it in.
//
// Also reports `isFormValid` (the whole form passes `validate`), so the submit
// button can stay disabled until every field is filled in correctly.
export const useFormBlurValidation = <Field extends string>({
  fields,
  relatedFields,
  setErrors,
  validate,
}: UseFormBlurValidationOptions<Field>) => {
  const editedFieldsRef = useRef(new Set<string>());
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const updateFormValidity = () => {
    const form = formRef.current;

    if (form) {
      setIsFormValid(Object.keys(validate(new FormData(form))).length === 0);
    }
  };

  // Re-checked after every render as well as on change: controlled values set
  // in code (prefill, reset) don't fire change events, and typing in an
  // uncontrolled field doesn't re-render. React skips the update when the
  // result hasn't changed, so this settles after at most one extra render.
  useLayoutEffect(() => {
    updateFormValidity();
  });

  const isValidatedField = (name: string): name is Field =>
    (fields as readonly string[]).includes(name);

  const handleChange = (event: FormEvent<HTMLFormElement>) => {
    const name = getFieldName(event.target);

    if (name) {
      editedFieldsRef.current.add(name);
    }

    updateFormValidity();
  };

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    const field = event.target as EventTarget;
    const name = getFieldName(field);

    if (!isValidatedField(name)) {
      return;
    }

    const nextFocusTarget = event.relatedTarget;

    // Focus moved within the field itself, e.g. to its show/hide password button.
    if (
      field instanceof HTMLElement &&
      nextFocusTarget instanceof Node &&
      field.parentElement?.contains(nextFocusTarget)
    ) {
      return;
    }

    const fieldsToValidate = [name, ...(relatedFields?.[name] ?? [])].filter(
      (fieldName) => editedFieldsRef.current.has(fieldName),
    );

    if (fieldsToValidate.length === 0) {
      return;
    }

    const validationErrors = validate(new FormData(event.currentTarget));

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      fieldsToValidate.forEach((fieldName) => {
        if (validationErrors[fieldName]) {
          nextErrors[fieldName] = validationErrors[fieldName];
        } else {
          delete nextErrors[fieldName];
        }
      });

      return nextErrors;
    });
  };

  // Call after the form is reset, so cleared fields count as untouched again.
  const resetEditedFields = () => {
    editedFieldsRef.current.clear();
  };

  return {
    formProps: { onBlur: handleBlur, onChange: handleChange, ref: formRef },
    isFormValid,
    resetEditedFields,
  };
};
