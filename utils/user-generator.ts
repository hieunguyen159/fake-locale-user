import type { UserData } from "@/types/user"
import { getPhonePrefix, type CountryLists } from "@/lib/actions"

export const generateFakeUser = (countryLists: CountryLists, countryName: string): UserData => {
  const { cities, femaleFirstNames, lastNames, maleFirstNames, states, streets } = countryLists

  const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
  const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

  let firstName: string
  const gender = Math.random() > 0.5 ? "male" : "female"
  firstName = gender === "male" ? randomItem(maleFirstNames) : randomItem(femaleFirstNames)
  const lastName = randomItem(lastNames)

  const fullName = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum(1, 100)}@example.com`

  // Ensure phone number is generated as a string
  const phonePrefix = getPhonePrefix(countryName)
  const phoneNumber = `+${phonePrefix} ${randomNum(100, 999)} ${randomNum(100, 999)} ${randomNum(1000, 9999)}`

  const address = `${randomNum(1, 999)} ${randomItem(streets)}, ${randomItem(cities)}, ${randomItem(states)}`
  const birthDate = new Date(randomNum(1950, 2005), randomNum(0, 11), randomNum(1, 28))
  const formattedBirthday = `${String(birthDate.getDate()).padStart(2, "0")}/${String(birthDate.getMonth() + 1).padStart(2, "0")}/${birthDate.getFullYear()}`

  return { fullName, address, phoneNumber, email, birthday: formattedBirthday }
}
