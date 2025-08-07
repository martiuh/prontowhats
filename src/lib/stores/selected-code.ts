const SELECTED_COUNTRY_KEY = "selected_country";

export const selectedCountryRepository = {
  setCode: (code: string): void => {
    try {
      sessionStorage.setItem(SELECTED_COUNTRY_KEY, code.toUpperCase());
    } catch (error) {
      console.error(
        "Failed to save selected country to session storage:",
        error
      );
    }
  },

  getCode: (): string | null => {
    try {
      return sessionStorage.getItem(SELECTED_COUNTRY_KEY);
    } catch (error) {
      console.error(
        "Failed to get selected country from session storage:",
        error
      );
      return null;
    }
  },

  clearCode: (): void => {
    try {
      sessionStorage.removeItem(SELECTED_COUNTRY_KEY);
    } catch (error) {
      console.error(
        "Failed to clear selected country from session storage:",
        error
      );
    }
  },

  hasCode: (): boolean => {
    try {
      return sessionStorage.getItem(SELECTED_COUNTRY_KEY) !== null;
    } catch (error) {
      console.error(
        "Failed to check selected country in session storage:",
        error
      );
      return false;
    }
  },
};
