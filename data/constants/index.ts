// Auto-generated country data exports

import type { AUCountryData } from './countries/AU';
import type { CACountryData } from './countries/CA';
import type { CHCountryData } from './countries/CH';
import type { DECountryData } from './countries/DE';
import type { DKCountryData } from './countries/DK';
import type { ESCountryData } from './countries/ES';
import type { FRCountryData } from './countries/FR';
import type { GBCountryData } from './countries/GB';
import type { RSCountryData } from './countries/RS';
import type { UACountryData } from './countries/UA';
import type { USCountryData } from './countries/US';
import { auData } from './countries/AU';
import { caData } from './countries/CA';
import { chData } from './countries/CH';
import { deData } from './countries/DE';
import { dkData } from './countries/DK';
import { esData } from './countries/ES';
import { frData } from './countries/FR';
import { gbData } from './countries/GB';
import { rsData } from './countries/RS';
import { uaData } from './countries/UA';
import { usData } from './countries/US';
import type { CommonData } from './common';
import { commonData } from './common';

// Country data mapping
export const COUNTRY_DATA_MAP = {
  AU: auData,
  CA: caData,
  CH: chData,
  DE: deData,
  DK: dkData,
  ES: esData,
  FR: frData,
  GB: gbData,
  RS: rsData,
  UA: uaData,
  US: usData,
} as const;

// Type for country data
export type CountryDataMap = typeof COUNTRY_DATA_MAP;
export type CountryCode = keyof CountryDataMap;

// Individual country exports
export { auData };
export { caData };
export { chData };
export { deData };
export { dkData };
export { esData };
export { frData };
export { gbData };
export { rsData };
export { uaData };
export { usData };

// Type exports
export type { AUCountryData };
export type { CACountryData };
export type { CHCountryData };
export type { DECountryData };
export type { DKCountryData };
export type { ESCountryData };
export type { FRCountryData };
export type { GBCountryData };
export type { RSCountryData };
export type { UACountryData };
export type { USCountryData };
export { commonData };
export type { CommonData };
