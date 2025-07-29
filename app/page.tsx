"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define regions and countries for selection
const regionsData = [
  {
    name: "Asian",
    countries: [
      { name: "Vietnam", code: "VN" },
      { name: "Japan", code: "JP" },
      { name: "China", code: "CN" },
      { name: "India", code: "IN" },
      { name: "South Korea", code: "KR" },
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
      { name: "Argentina", code: "AR" },
      { name: "Colombia", code: "CO" },
    ],
  },
  {
    name: "African",
    countries: [
      { name: "Nigeria", code: "NG" },
      { name: "South Africa", code: "ZA" },
      { name: "Egypt", code: "EG" },
    ],
  },
  {
    name: "Oceanian",
    countries: [
      { name: "Australia", code: "AU" },
      { name: "New Zealand", code: "NZ" },
    ],
  },
]

// Simple fake data generation function
const generateFakeData = (region: string, country: string) => {
  let firstName = "John"
  let lastName = "Doe"
  let emailDomain = "example.com"
  let phonePrefix = "1"
  let addressStreet = "123 Main St"
  let addressCity = "Anytown"
  let addressZip = "12345"

  // Basic customization based on region
  if (region === "Asian") {
    const asianFirstNames = ["Minh", "Akira", "Wei", "Priya", "Jian"]
    const asianLastNames = ["Nguyen", "Tanaka", "Wang", "Singh", "Kim"]
    firstName = asianFirstNames[Math.floor(Math.random() * asianFirstNames.length)]
    lastName = asianLastNames[Math.floor(Math.random() * asianLastNames.length)]
    emailDomain = "asia.net"
    phonePrefix = "84" // Example for Vietnam
    addressStreet = "456 Tran Hung Dao"
    addressCity = "Ho Chi Minh City"
    addressZip = "70000"
  } else if (region === "European") {
    const europeanFirstNames = ["Hans", "Marie", "Pierre", "Sofia", "Luca"]
    const europeanLastNames = ["Schmidt", "Dubois", "Smith", "Garcia", "Rossi"]
    firstName = europeanFirstNames[Math.floor(Math.random() * europeanFirstNames.length)]
    lastName = europeanLastNames[Math.floor(Math.random() * europeanLastNames.length)]
    emailDomain = "europe.org"
    phonePrefix = "49" // Example for Germany
    addressStreet = "789 Berliner Str."
    addressCity = "Berlin"
    addressZip = "10115"
  } else if (region === "North American") {
    const naFirstNames = ["Michael", "Emily", "David", "Sarah", "Chris"]
    const naLastNames = ["Johnson", "Williams", "Brown", "Jones", "Miller"]
    firstName = naFirstNames[Math.floor(Math.random() * naFirstNames.length)]
    lastName = naLastNames[Math.floor(Math.random() * naLastNames.length)]
    emailDomain = "na.com"
    phonePrefix = "1" // Example for US/Canada
    addressStreet = "1000 Maple Ave"
    addressCity = "Springfield"
    addressZip = "90210"
  } else if (region === "South American") {
    const saFirstNames = ["Maria", "Jose", "Ana", "Pedro", "Sofia"]
    const saLastNames = ["Silva", "Santos", "Rodriguez", "Gonzales", "Lima"]
    firstName = saFirstNames[Math.floor(Math.random() * saFirstNames.length)]
    lastName = saLastNames[Math.floor(Math.random() * saLastNames.length)]
    emailDomain = "sa.com"
    phonePrefix = "55" // Example for Brazil
    addressStreet = "Rua Augusta, 2000"
    addressCity = "São Paulo"
    addressZip = "01304-000"
  } else if (region === "African") {
    const afFirstNames = ["Fatima", "Kwame", "Aisha", "Chidi", "Zola"]
    const afLastNames = ["Okoro", "Nkosi", "Diallo", "Musa", "Adeyemi"]
    firstName = afFirstNames[Math.floor(Math.random() * afFirstNames.length)]
    lastName = afLastNames[Math.floor(Math.random() * afLastNames.length)]
    emailDomain = "africa.net"
    phonePrefix = "234" // Example for Nigeria
    addressStreet = "Plot 10 Victoria Island"
    addressCity = "Lagos"
    addressZip = "101241"
  } else if (region === "Oceanian") {
    const ocFirstNames = ["Liam", "Olivia", "Noah", "Ava", "Jack"]
    const ocLastNames = ["Smith", "Jones", "Williams", "Brown", "Wilson"]
    firstName = ocFirstNames[Math.floor(Math.random() * ocFirstNames.length)]
    lastName = ocLastNames[Math.floor(Math.random() * ocLastNames.length)]
    emailDomain = "oceania.org"
    phonePrefix = "61" // Example for Australia
    addressStreet = "50 George St"
    addressCity = "Sydney"
    addressZip = "2000"
  }

  const fullName = `${firstName} ${lastName}`
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${emailDomain}`
  const phone = `+${phonePrefix} ${Math.floor(100000000 + Math.random() * 900000000)}`
  const address = `${addressStreet}, ${addressCity}, ${country}, ${addressZip}`

  return {
    fullName,
    email,
    phone,
    address,
  }
}

interface UserData {
  fullName: string
  email: string
  phone: string
  address: string
}

export default function Component() {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined)
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined)
  const [availableCountries, setAvailableCountries] = useState<{ name: string; code: string }[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Detect browser location and set defaults
    if (typeof window !== "undefined") {
      const userLocale = navigator.language // e.g., "en-US", "vi-VN"
      const countryCode = userLocale.split("-")[1]?.toUpperCase()

      let detectedRegion: string | undefined
      let detectedCountry: string | undefined

      for (const region of regionsData) {
        const foundCountry = region.countries.find((c) => c.code === countryCode)
        if (foundCountry) {
          detectedRegion = region.name
          detectedCountry = foundCountry.name
          break
        }
      }

      if (detectedRegion) {
        setSelectedRegion(detectedRegion)
        const countriesInRegion = regionsData.find((r) => r.name === detectedRegion)?.countries || []
        setAvailableCountries(countriesInRegion)
        if (detectedCountry) {
          setSelectedCountry(detectedCountry)
        } else if (countriesInRegion.length > 0) {
          // Fallback to first country in region if specific country not found
          setSelectedCountry(countriesInRegion[0].name)
        }
      } else {
        // Default to Asian/Vietnam if no detection or unknown country
        setSelectedRegion("Asian")
        setAvailableCountries(regionsData.find((r) => r.name === "Asian")?.countries || [])
        setSelectedCountry("Vietnam")
      }
    }
  }, [])

  useEffect(() => {
    // Update available countries when region changes
    if (selectedRegion) {
      const countries = regionsData.find((r) => r.name === selectedRegion)?.countries || []
      setAvailableCountries(countries)
      // Reset country if the previously selected country is not in the new region
      // Or if the new region has no countries, clear selected country
      if (!countries.some((c) => c.name === selectedCountry) || countries.length === 0) {
        setSelectedCountry(countries.length > 0 ? countries[0].name : undefined)
      }
    } else {
      setAvailableCountries([])
      setSelectedCountry(undefined)
    }
  }, [selectedRegion])

  const handleGenerate = () => {
    if (selectedRegion && selectedCountry) {
      const data = generateFakeData(selectedRegion, selectedCountry)
      setUserData(data)
    } else {
      toast({
        title: "Selection Missing",
        description: "Please select both a region and a country to generate data.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: `${fieldName} has been copied.`,
        })
      })
      .catch((err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard. Please try again.",
          variant: "destructive",
        })
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Choose the location where you want to mock data.
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="location-select" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger
                id="location-select"
                className="w-full max-w-xs mx-auto border-gray-300 focus:border-black focus:ring-black"
              >
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

          <div className="space-y-2">
            <label htmlFor="country-select" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <Select
              value={selectedCountry}
              onValueChange={setSelectedCountry}
              disabled={!selectedRegion || availableCountries.length === 0}
            >
              <SelectTrigger
                id="country-select"
                className="w-full max-w-xs mx-auto border-gray-300 focus:border-black focus:ring-black"
              >
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full max-w-xs bg-black text-white hover:bg-gray-800 transition-colors duration-200 py-2.5 text-base font-semibold"
          >
            GENERATE
          </Button>
        </div>

        {userData && (
          <Card className="mt-10 w-full max-w-md mx-auto shadow-lg border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Generated User Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(userData).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                >
                  <div className="flex flex-col items-start flex-grow pr-2">
                    <span className="text-xs font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-base font-semibold text-gray-800 break-all text-left">{value}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(value, key.replace(/([A-Z])/g, " $1").trim())}
                    className="ml-2 shrink-0 text-gray-600 hover:text-black"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy {key.replace(/([A-Z])/g, " $1").trim()}</span>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
