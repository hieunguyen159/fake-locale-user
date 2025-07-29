"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getCountryData, getPhonePrefix, type CountryLists } from "@/lib/actions"

interface UserData {
  fullName: string
  address: string
  phoneNumber: string
  email: string
  birthday: string
}

// Expanded regions and countries data with codes
const regionsData = [
  {
    name: "Asian",
    countries: [
      { name: "Vietnam", code: "VN" },
      { name: "Japan", code: "JP" },
      { name: "China", code: "CN" },
      { name: "India", code: "IN" },
      { name: "South Korea", code: "KR" },
      { name: "Iran", code: "IR" },
    ],
  },
  {
    name: "European",
    countries: [
      { name: "Germany", code: "DE" },
      { name: "France", code: "FR" },
      { name: "United Kingdom", code: "GB" },
      { name: "Spain", code: "ES" },
      { name: "Italy", code: "IT" },
      { name: "Denmark", code: "DK" },
      { name: "Finland", code: "FI" },
      { name: "Ireland", code: "IE" },
      { name: "Netherlands", code: "NL" },
      { name: "Norway", code: "NO" },
      { name: "Serbia", code: "RS" },
      { name: "Turkey", code: "TR" },
      { name: "Ukraine", code: "UA" },
      { name: "Switzerland", code: "CH" },
    ],
  },
  {
    name: "North American",
    countries: [
      { name: "United States", code: "US" },
      { name: "Canada", code: "CA" },
      { name: "Mexico", code: "MX" },
    ],
  },
  {
    name: "South American",
    countries: [
      { name: "Brazil", code: "BR" },
      // Add other South American countries if data exists
    ],
  },
  {
    name: "Oceanian",
    countries: [
      { name: "Australia", code: "AU" },
      { name: "New Zealand", code: "NZ" },
    ],
  },
  {
    name: "Fictional", // For LEGO data
    countries: [{ name: "LEGO", code: "LEGO" }],
  },
]

// Helper to get country code from country name
const getCountryCodeFromName = (countryName: string): string | undefined => {
  for (const region of regionsData) {
    const foundCountry = region.countries.find((c) => c.name === countryName)
    if (foundCountry) {
      return foundCountry.code
    }
  }
  return undefined
}

// Dynamic fake data generation function using loaded lists
const generateFakeUser = (countryLists: CountryLists, countryName: string): UserData => {
  const { cities, femaleFirstNames, lastNames, maleFirstNames, states, streets } = countryLists

  const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
  const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

  let firstName: string
  const gender = Math.random() > 0.5 ? "male" : "female"
  firstName = gender === "male" ? randomItem(maleFirstNames) : randomItem(femaleFirstNames)
  const lastName = randomItem(lastNames)

  const fullName = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum(1, 100)}@example.com`
  const phoneNumber = `+${getPhonePrefix(countryName)} ${randomNum(100, 999)} ${randomNum(100, 999)} ${randomNum(1000, 9999)}`
  const address = `${randomNum(1, 999)} ${randomItem(streets)}, ${randomItem(cities)}, ${randomItem(states)}`
  const birthDate = new Date(randomNum(1950, 2005), randomNum(0, 11), randomNum(1, 28))
  const formattedBirthday = `${String(birthDate.getDate()).padStart(2, "0")}/${String(birthDate.getMonth() + 1).padStart(2, "0")}/${birthDate.getFullYear()}`

  return { fullName, address, phoneNumber, email, birthday: formattedBirthday }
}

export default function Home() {
  const { toast } = useToast()
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined)
  const [selectedCountryName, setSelectedCountryName] = useState<string | undefined>(undefined)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | undefined>(undefined)
  const [availableCountriesForSelect, setAvailableCountriesForSelect] = useState<{ name: string; code: string }[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Detect browser's preferred language to set default country
    if (typeof navigator !== "undefined" && navigator.language) {
      const userLocale = navigator.language // e.g., "en-US", "vi-VN"
      const countryCode = userLocale.split("-")[1]?.toUpperCase()

      let detectedRegion: string | undefined
      let detectedCountryName: string | undefined
      let detectedCountryCode: string | undefined

      for (const region of regionsData) {
        const foundCountry = region.countries.find((c) => c.code === countryCode)
        if (foundCountry) {
          detectedRegion = region.name
          detectedCountryName = foundCountry.name
          detectedCountryCode = foundCountry.code
          break
        }
      }

      if (detectedRegion) {
        setSelectedRegion(detectedRegion)
        const countriesInRegion = regionsData.find((r) => r.name === detectedRegion)?.countries || []
        setAvailableCountriesForSelect(countriesInRegion)
        if (detectedCountryName && detectedCountryCode) {
          setSelectedCountryName(detectedCountryName)
          setSelectedCountryCode(detectedCountryCode)
        } else if (countriesInRegion.length > 0) {
          // Fallback to first country in region if specific country not found
          setSelectedCountryName(countriesInRegion[0].name)
          setSelectedCountryCode(countriesInRegion[0].code)
        }
      } else {
        // Default to Asian/Vietnam if no detection or unknown country
        setSelectedRegion("Asian")
        const asianCountries = regionsData.find((r) => r.name === "Asian")?.countries || []
        setAvailableCountriesForSelect(asianCountries)
        setSelectedCountryName("Vietnam")
        setSelectedCountryCode("VN")
      }
    }
  }, [])

  useEffect(() => {
    if (selectedRegion) {
      const countries = regionsData.find((r) => r.name === selectedRegion)?.countries || []
      setAvailableCountriesForSelect(countries)
      // If the current country name is not in the new list, or list is empty, reset
      if (!countries.some((c) => c.name === selectedCountryName) || countries.length === 0) {
        setSelectedCountryName(countries.length > 0 ? countries[0].name : undefined)
        setSelectedCountryCode(countries.length > 0 ? countries[0].code : undefined)
      } else {
        // Ensure selectedCountryCode is updated if selectedCountryName is already valid for the new region
        const currentCountry = countries.find((c) => c.name === selectedCountryName)
        if (currentCountry) {
          setSelectedCountryCode(currentCountry.code)
        }
      }
    } else {
      setAvailableCountriesForSelect([])
      setSelectedCountryName(undefined)
      setSelectedCountryCode(undefined)
    }
  }, [selectedRegion, selectedCountryName])

  const handleGenerate = useCallback(async () => {
    if (selectedRegion && selectedCountryName && selectedCountryCode) {
      const countryLists = await getCountryData(selectedCountryCode)
      if (countryLists) {
        const data = generateFakeUser(countryLists, selectedCountryName)
        setUserData(data)
      } else {
        toast({
          title: "Data Not Available",
          description: `Could not load data for ${selectedCountryName}. Please try another country.`,
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Selection Missing",
        description: "Please select both a region and a country to generate data.",
        variant: "destructive",
      })
    }
  }, [selectedRegion, selectedCountryName, selectedCountryCode, toast])

  const handleCopy = useCallback(
    async (text: string, fieldName: string) => {
      try {
        await navigator.clipboard.writeText(text)
        toast({
          title: "Copied!",
          description: `${fieldName} copied to clipboard.`,
        })
      } catch (err) {
        console.error("Failed to copy: ", err)
        toast({
          title: "Copy Failed",
          description: `Could not copy ${fieldName}. Please try again.`,
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleCopyJson = useCallback(async () => {
    if (userData) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(userData, null, 2))
        toast({
          title: "Copied!",
          description: "User data (JSON) copied to clipboard.",
        })
      } catch (err) {
        console.error("Failed to copy JSON: ", err)
        toast({
          title: "Copy Failed",
          description: "Could not copy JSON data. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [userData, toast])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div
        className={`flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-4xl ${userData ? "md:items-center" : ""}`}
      >
        {/* Left Section: Controls */}
        <div className="flex flex-col items-center justify-center text-center md:w-1/2">
          <h1 className="text-3xl font-bold mb-8">Choose the location where you want to mock data.</h1>

          <div className="w-full max-w-xs space-y-6">
            <div>
              <Label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="location-select" className="w-full">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  {regionsData.map((region) => (
                    <SelectItem key={region.name} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </Label>
              <Select
                value={selectedCountryName}
                onValueChange={(name) => {
                  setSelectedCountryName(name)
                  setSelectedCountryCode(getCountryCodeFromName(name))
                }}
              >
                <SelectTrigger id="country-select" className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {availableCountriesForSelect.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} className="w-full bg-black text-white hover:bg-gray-800">
              GENERATE
            </Button>
          </div>
        </div>

        {/* Right Section: Generated Data */}
        {userData && (
          <Card className="w-full md:w-1/2 max-w-md mt-8 md:mt-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Generated User Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col">
                <Label className="text-sm font-medium text-gray-700">Full name</Label>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{userData.fullName}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(userData.fullName, "Full name")}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy full name</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{userData.address}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(userData.address, "Address")}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy address</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-sm font-medium text-gray-700">Phone number</Label>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{userData.phoneNumber}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(userData.phoneNumber, "Phone number")}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy phone number</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{userData.email}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(userData.email, "Email")}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy email</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="text-sm font-medium text-gray-700">Birthday</Label>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{userData.birthday}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(userData.birthday, "Birthday")}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy birthday</span>
                  </Button>
                </div>
              </div>

              <Button onClick={handleCopyJson} className="w-full mt-4 bg-gray-100 text-gray-800 hover:bg-gray-200">
                Copy as JSON
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  )
}
