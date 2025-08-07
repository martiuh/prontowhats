const DB_NAME = "PronoWhatsDB";
const DB_VERSION = 2;
const COUNTRIES_STORE = "countries";
const DIAL_CODES_STORE = "dialCodes";
const METADATA_STORE = "metadata";

export type CountryData = {
  code: string;
  name_en: string;
  name_es: string;
  dial_code: string;
};

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Countries store - indexed by country code
        if (!db.objectStoreNames.contains(COUNTRIES_STORE)) {
          const countryStore = db.createObjectStore(COUNTRIES_STORE, {
            keyPath: "code",
          });
          countryStore.createIndex("name_es", "name_es", { unique: false });
        }

        // Dial codes store - indexed by dial code for fast lookup
        if (!db.objectStoreNames.contains(DIAL_CODES_STORE)) {
          db.createObjectStore(DIAL_CODES_STORE, { keyPath: "dial_code" });
        }

        // Metadata store for timestamps
        if (!db.objectStoreNames.contains(METADATA_STORE)) {
          db.createObjectStore(METADATA_STORE, { keyPath: "key" });
        }
      };
    });
  }

  async setCountries(countries: CountryData[]): Promise<void> {
    const db = await this.init();
    const transaction = db.transaction(
      [COUNTRIES_STORE, DIAL_CODES_STORE, METADATA_STORE],
      "readwrite"
    );

    const countryStore = transaction.objectStore(COUNTRIES_STORE);
    const dialCodeStore = transaction.objectStore(DIAL_CODES_STORE);
    const metadataStore = transaction.objectStore(METADATA_STORE);

    // Group countries by dial code
    const dialCodeMap = new Map<string, CountryData[]>();

    for (const country of countries) {
      // Store in countries store
      countryStore.put(country);

      // Group by dial code for dial code store
      const existing = dialCodeMap.get(country.dial_code) || [];
      existing.push(country);
      dialCodeMap.set(country.dial_code, existing);
    }

    // Store dial code mappings
    for (const [dialCode, countriesWithCode] of dialCodeMap) {
      dialCodeStore.put({
        dial_code: dialCode,
        countries: countriesWithCode,
      });
    }

    // Update metadata
    metadataStore.put({
      key: "lastUpdated",
      value: Date.now(),
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getCountries(): Promise<CountryData[]> {
    try {
      const db = await this.init();
      const transaction = db.transaction([COUNTRIES_STORE], "readonly");
      const store = transaction.objectStore(COUNTRIES_STORE);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || []);
      });
    } catch (error) {
      console.error("Failed to get countries from IndexedDB:", error);
      return [];
    }
  }

  async getCountryByCode(code: string): Promise<CountryData | undefined> {
    try {
      const db = await this.init();
      const transaction = db.transaction([COUNTRIES_STORE], "readonly");
      const store = transaction.objectStore(COUNTRIES_STORE);

      return new Promise((resolve, reject) => {
        const request = store.get(code.toUpperCase());
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      console.error("Failed to get country by code from IndexedDB:", error);
      return undefined;
    }
  }

  async getCountryByDialCode(dialCode: string): Promise<CountryData | null> {
    try {
      const db = await this.init();
      const transaction = db.transaction([DIAL_CODES_STORE], "readonly");
      const store = transaction.objectStore(DIAL_CODES_STORE);

      return new Promise((resolve, reject) => {
        const request = store.get(dialCode);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result?.countries?.[0] || null);
        };
      });
    } catch (error) {
      console.error(
        "Failed to get countries by dial code from IndexedDB:",
        error
      );
      return null;
    }
  }

  async isDataFresh(maxAge: number = 24 * 60 * 60 * 1000): Promise<boolean> {
    try {
      const db = await this.init();
      const transaction = db.transaction([METADATA_STORE], "readonly");
      const store = transaction.objectStore(METADATA_STORE);

      return new Promise((resolve) => {
        const request = store.get("lastUpdated");
        request.onerror = () => resolve(false);
        request.onsuccess = () => {
          const result = request.result;
          if (!result?.value) {
            resolve(false);
          } else {
            const age = Date.now() - result.value;
            resolve(age < maxAge);
          }
        };
      });
    } catch (error) {
      return false;
    }
  }
}

const dbManager = new IndexedDBManager();

export const countryCodes = {
  setCountries: (countries: CountryData[]) => dbManager.setCountries(countries),
  getCountries: () => dbManager.getCountries(),
  getCountryByCode: (code: string) => dbManager.getCountryByCode(code),
  getCountryByDialCode: (dialCode: string) =>
    dbManager.getCountryByDialCode(dialCode),
  isDataFresh: (maxAge?: number) => dbManager.isDataFresh(maxAge),
};

export async function loadCountryCodes(): Promise<void> {
  try {
    const isDataFresh = await countryCodes.isDataFresh();

    if (isDataFresh) {
      const cachedCountries = await countryCodes.getCountries();
      if (cachedCountries.length > 0) {
        return;
      }
    }

    const json = await import("../../json/country-codes.json");
    const countries = json.default.countries as CountryData[];

    await countryCodes.setCountries(countries);
  } catch (error) {
    console.error("Failed to load country codes:", error);
  }
}
