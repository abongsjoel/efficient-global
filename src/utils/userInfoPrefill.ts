export type UserInfoField = "name" | "email" | "phone" | "organization";

export type SavedUserInfo = Partial<Record<UserInfoField, string>>;

export type UserInfoValues<Field extends UserInfoField = UserInfoField> =
  Record<Field, string>;

const userInfoStorageKey = "efficient-global-user-info";
const userInfoFields: UserInfoField[] = [
  "name",
  "email",
  "phone",
  "organization",
];

const getStringValue = (value: FormDataEntryValue | undefined) =>
  typeof value === "string" ? value.trim() : "";

export const createEmptyUserInfoValues = <Field extends UserInfoField>(
  fields: readonly Field[],
) =>
  fields.reduce(
    (values, field) => ({
      ...values,
      [field]: "",
    }),
    {} as UserInfoValues<Field>,
  );

export const getSavedUserInfo = (): SavedUserInfo => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const storedValue = window.localStorage.getItem(userInfoStorageKey);
    const parsedValue = storedValue ? JSON.parse(storedValue) : {};

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return userInfoFields.reduce<SavedUserInfo>((userInfo, field) => {
      const value = parsedValue[field];

      return typeof value === "string" && value.trim()
        ? { ...userInfo, [field]: value.trim() }
        : userInfo;
    }, {});
  } catch {
    return {};
  }
};

export const saveUserInfo = (values: Record<string, FormDataEntryValue>) => {
  if (typeof window === "undefined") {
    return;
  }

  const currentUserInfo = getSavedUserInfo();
  const nextUserInfo = userInfoFields.reduce<SavedUserInfo>(
    (userInfo, field) => {
      const value = getStringValue(values[field]);

      return value ? { ...userInfo, [field]: value } : userInfo;
    },
    { ...currentUserInfo },
  );

  window.localStorage.setItem(userInfoStorageKey, JSON.stringify(nextUserInfo));
};

export const hasSavedUserInfo = (
  userInfo: SavedUserInfo,
  fields: readonly UserInfoField[],
) => fields.some((field) => Boolean(userInfo[field]));

export const applySavedUserInfoValues = <Field extends UserInfoField>(
  values: UserInfoValues<Field>,
  userInfo: SavedUserInfo,
  fields: readonly Field[],
) =>
  fields.reduce<UserInfoValues<Field>>((nextValues, field) => {
    const savedValue = userInfo[field];

    return savedValue ? { ...nextValues, [field]: savedValue } : nextValues;
  }, values);

export const clearSavedUserInfoValues = <Field extends UserInfoField>(
  values: UserInfoValues<Field>,
  userInfo: SavedUserInfo,
  fields: readonly Field[],
) =>
  fields.reduce<UserInfoValues<Field>>((nextValues, field) => {
    const savedValue = userInfo[field];

    if (!savedValue || nextValues[field] !== savedValue) {
      return nextValues;
    }

    return { ...nextValues, [field]: "" };
  }, values);
