import { COUNTRY_DATA_MAP, type CountryCode } from "@/data/constants";

export interface CountryLists {
  cities: string[];
  femaleFirstNames: string[];
  lastNames: string[];
  maleFirstNames: string[];
  states: string[];
  streets: string[];
}

export function getCountryData(countryCode: string): CountryLists | null {
  try {
    // Check if the country code is valid
    if (!(countryCode in COUNTRY_DATA_MAP)) {
      console.warn(`Country code ${countryCode} not found in data map`);
      return null;
    }

    const countryData = COUNTRY_DATA_MAP[countryCode as CountryCode];

    return {
      cities: countryData.cities,
      femaleFirstNames: countryData.femaleFirstNames,
      lastNames: countryData.lastNames,
      maleFirstNames: countryData.maleFirstNames,
      states: countryData.states,
      streets: countryData.streets,
    };
  } catch (error) {
    console.error(`Failed to load country data for ${countryCode}:`, error);
    return null;
  }
}
