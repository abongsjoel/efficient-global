const adminSessionTokenStorageKey = "efficient_global_admin_session_token";

export const getStoredAdminSessionToken = () =>
  window.sessionStorage.getItem(adminSessionTokenStorageKey) ||
  window.localStorage.getItem(adminSessionTokenStorageKey) ||
  "";

export const storeAdminSessionToken = (
  token: string,
  keepMeLoggedIn: boolean,
) => {
  clearAdminSessionToken();

  if (keepMeLoggedIn) {
    window.localStorage.setItem(adminSessionTokenStorageKey, token);
    return;
  }

  window.sessionStorage.setItem(adminSessionTokenStorageKey, token);
};

export const clearAdminSessionToken = () => {
  window.sessionStorage.removeItem(adminSessionTokenStorageKey);
  window.localStorage.removeItem(adminSessionTokenStorageKey);
};
