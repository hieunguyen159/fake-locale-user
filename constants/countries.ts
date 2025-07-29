import type { Country } from "@/types/user"

export const COUNTRIES_DATA: Country[] = [
  { name: "Australia", code: "AU" },
  { name: "Canada", code: "CA" },
  { name: "Switzerland", code: "CH" },
  { name: "Germany", code: "DE" },
  { name: "Denmark", code: "DK" },
  { name: "Spain", code: "ES" },
  { name: "France", code: "FR" },
  { name: "United Kingdom", code: "GB" },
  { name: "Serbia", code: "RS" },
  { name: "Ukraine", code: "UA" },
  { name: "United States", code: "US" },
]

export const DEFAULT_COUNTRY: Country = { name: "United States", code: "US" }
