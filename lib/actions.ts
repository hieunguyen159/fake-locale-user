"use server"

import { promises as fs } from "fs"
import path from "path"

export interface CountryLists {
  cities: string[]
  femaleFirstNames: string[]
  lastNames: string[]
  maleFirstNames: string[]
  states: string[]
  streets: string[]
  // Add other lists if they exist and are needed, e.g., postCodes: string[]
}

const dataDir = path.join(process.cwd(), "data")

async function readListFile(countryCode: string, fileName: string): Promise<string[]> {
  try {
    const filePath = path.join(dataDir, countryCode, "lists", fileName)
    const content = await fs.readFile(filePath, "utf-8")
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  } catch (error) {
    console.error(`Error reading file ${fileName} for country ${countryCode}:`, error)
    return []
  }
}

export async function getCountryData(countryCode: string): Promise<CountryLists | null> {
  try {
    const [cities, femaleFirstNames, lastNames, maleFirstNames, states, streets] = await Promise.all([
      readListFile(countryCode, "cities.txt"),
      readListFile(countryCode, "female_first.txt"),
      readListFile(countryCode, "last.txt"),
      readListFile(countryCode, "male_first.txt"),
      readListFile(countryCode, "states.txt"),
      readListFile(countryCode, "street.txt"),
    ])

    return {
      cities,
      femaleFirstNames,
      lastNames,
      maleFirstNames,
      states,
      streets,
    }
  } catch (error) {
    console.error(`Failed to load country data for ${countryCode}:`, error)
    return null
  }
}

// Simple mapping for phone prefixes (can be expanded with more data if available)
export function getPhonePrefix(countryName: string): string {
  switch (countryName) {
    case "Vietnam":
      return "84"
    case "Japan":
      return "81"
    case "Germany":
      return "49"
    case "France":
      return "33"
    case "United Kingdom":
      return "44"
    case "Spain":
      return "34"
    case "Italy":
      return "39"
    case "United States":
      return "1"
    case "Canada":
      return "1"
    case "Mexico":
      return "52"
    case "Brazil":
      return "55"
    case "Australia":
      return "61"
    case "New Zealand":
      return "64"
    case "China":
      return "86"
    case "India":
      return "91"
    case "South Korea":
      return "82"
    case "Iran":
      return "98"
    case "Denmark":
      return "45"
    case "Finland":
      return "358"
    case "Ireland":
      return "353"
    case "Netherlands":
      return "31"
    case "Norway":
      return "47"
    case "Serbia":
      return "381"
    case "Turkey":
      return "90"
    case "Ukraine":
      return "380"
    case "Switzerland":
      return "41"
    case "LEGO":
      return "42" // Fictional prefix for LEGO
    // Add more as needed
    default:
      return "00" // Default or unknown prefix
  }
}
