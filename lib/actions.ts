"use server";

import { promises as fs } from "fs";
import path from "path";

export interface CountryLists {
  cities: string[];
  femaleFirstNames: string[];
  lastNames: string[];
  maleFirstNames: string[];
  states: string[];
  streets: string[];
  // Add other lists if they exist and are needed, e.g., postCodes: string[]
}

const dataDir = path.join(process.cwd(), "data");

async function readListFile(
  countryCode: string,
  fileName: string
): Promise<string[]> {
  try {
    const filePath = path.join(dataDir, countryCode, "lists", fileName);
    const content = await fs.readFile(filePath, "utf-8");
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch (error) {
    console.error(
      `Error reading file ${fileName} for country ${countryCode}:`,
      error
    );
    return [];
  }
}

export async function getCountryData(
  countryCode: string
): Promise<CountryLists | null> {
  try {
    const [
      cities,
      femaleFirstNames,
      lastNames,
      maleFirstNames,
      states,
      streets,
    ] = await Promise.all([
      readListFile(countryCode, "cities.txt"),
      readListFile(countryCode, "female_first.txt"),
      readListFile(countryCode, "last.txt"),
      readListFile(countryCode, "male_first.txt"),
      readListFile(countryCode, "states.txt"),
      readListFile(countryCode, "street.txt"),
    ]);

    return {
      cities,
      femaleFirstNames,
      lastNames,
      maleFirstNames,
      states,
      streets,
    };
  } catch (error) {
    console.error(`Failed to load country data for ${countryCode}:`, error);
    return null;
  }
}
