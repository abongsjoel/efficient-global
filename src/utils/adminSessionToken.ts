const adminSessionTokenStorageKey = "efficient_global_admin_session_token";

// Dispatched on `window` when the server stops accepting the stored session,
// for example because the admin was deactivated, so the app can go back to the
// login page instead of showing "Not authenticated" errors.
export const adminSessionEndedEvent = "efficient_global_admin_session_ended";

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
