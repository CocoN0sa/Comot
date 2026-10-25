export const accountExistsStorageKey = "comot_account_exists";

export function hasRegisteredAccount() {
  try {
    return window.localStorage.getItem(accountExistsStorageKey) === "true";
  } catch {
    return false;
  }
}
