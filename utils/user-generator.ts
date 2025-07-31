import type { UserData } from "@/types/user";
import { type CountryLists } from "@/lib/actions";
// Simple mapping for phone prefixes (can be expanded with more data if available)
export function getPhonePrefix(countryName: string): string {
  switch (countryName) {
    case "Vietnam":
      return "84";
    case "Japan":
      return "81";
    case "Germany":
      return "49";
    case "France":
      return "33";
    case "United Kingdom":
      return "44";
    case "Spain":
      return "34";
    case "Italy":
      return "39";
    case "United States":
      return "1";
    case "Canada":
      return "1";
    case "Mexico":
      return "52";
    case "Brazil":
      return "55";
    case "Australia":
      return "61";
    case "New Zealand":
      return "64";
    case "China":
      return "86";
    case "India":
      return "91";
    case "South Korea":
      return "82";
    case "Iran":
      return "98";
    case "Denmark":
      return "45";
    case "Finland":
      return "358";
    case "Ireland":
      return "353";
    case "Netherlands":
      return "31";
    case "Norway":
      return "47";
    case "Serbia":
      return "381";
    case "Senegal":
      return "221";
    case "Turkey":
      return "90";
    case "Ukraine":
      return "380";
    case "Uganda":
      return "256";
    case "Switzerland":
      return "41";
    case "LEGO":
      return "42"; // Fictional prefix for LEGO
    // Add more as needed
    default:
      return "00"; // Default or unknown prefix
  }
}
export const generateFakeUser = (
  countryLists: CountryLists,
  countryName: string
): UserData => {
  const {
    cities,
    femaleFirstNames,
    lastNames,
    maleFirstNames,
    states,
    streets,
  } = countryLists;

  const randomItem = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];
  const randomNum = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  let firstName: string;
  const gender = Math.random() > 0.5 ? "male" : "female";
  firstName =
    gender === "male"
      ? randomItem(maleFirstNames)
      : randomItem(femaleFirstNames);
  const lastName = randomItem(lastNames);

  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum(
    1,
    100
  )}@example.com`;

  // Ensure phone number is generated as a string
  const phonePrefix = getPhonePrefix(countryName);
  const phoneNumber = `+${phonePrefix} ${randomNum(100, 999)} ${randomNum(
    100,
    999
  )} ${randomNum(1000, 9999)}`;

  const address = `${randomNum(1, 999)} ${randomItem(streets)}, ${randomItem(
    cities
  )}, ${randomItem(states)}`;
  const birthDate = new Date(
    randomNum(1950, 2005),
    randomNum(0, 11),
    randomNum(1, 28)
  );
  const formattedBirthday = `${String(birthDate.getDate()).padStart(
    2,
    "0"
  )}/${String(birthDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${birthDate.getFullYear()}`;

  return { fullName, address, phoneNumber, email, birthday: formattedBirthday };
};
