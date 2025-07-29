"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getCountryData, getPhonePrefix, type CountryLists } from "@/lib/actions"

interface UserData {
  fullName: string
  address: string
  phoneNumber: string
  email: string
  birthday: string
}

// Only countries that have data folders available
const countriesData = [
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

// Helper to get country code from country name
const getCountryCodeFromName = (countryName: string): string | undefined => {
  const foundCountry = countriesData.find((c) => c.name === countryName)
  return foundCountry?.code
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

  // Ensure phone number is generated as a string
  const phonePrefix = getPhonePrefix(countryName)
  const phoneNumber = `+${phonePrefix} ${randomNum(100, 999)} ${randomNum(100, 999)} ${randomNum(1000, 9999)}`

  const address = `${randomNum(1, 999)} ${randomItem(streets)}, ${randomItem(cities)}, ${randomItem(states)}`
  const birthDate = new Date(randomNum(1950, 2005), randomNum(0, 11), randomNum(1, 28))
  const formattedBirthday = `${String(birthDate.getDate()).padStart(2, "0")}/${String(birthDate.getMonth() + 1).padStart(2, "0")}/${birthDate.getFullYear()}`

  return { fullName, address, phoneNumber, email, birthday: formattedBirthday }
}

export default function Home() {
  const { toast } = useToast()
  const [selectedCountryName, setSelectedCountryName] = useState<string>("")
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("")
  const [userData, setUserData] = useState<UserData | null>(null)
  console.log({selectedCountryCode,selectedCountryName})
  useEffect(() => {
      // Fallback default
      setSelectedCountryName("United States")
      setSelectedCountryCode("US")
    
  }, [])

  const handleCountryChange = (countryName: string) => {
    setSelectedCountryName(countryName)
    const countryCode = getCountryCodeFromName(countryName)
    if (countryCode) {
      setSelectedCountryCode(countryCode)
    }
  }

  const handleGenerate = useCallback(async () => {
    if (selectedCountryName && selectedCountryCode) {
      try {
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
      } catch (error) {
        console.error("Error generating user data:", error)
        toast({
          title: "Generation Failed",
          description: "An error occurred while generating user data. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Selection Missing",
        description: "Please select a country to generate data.",
        variant: "destructive",
      })
    }
  }, [selectedCountryName, selectedCountryCode, toast])

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
  console.log({selectedCountryName, selectedCountryCode})
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="text-center py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">UserMint</h1>
            <p className="text-gray-600">Generate realistic fake user data</p>
          </div>

          {/* Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="country-select-mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Country
                </Label>
                <Select value={selectedCountryName} onValueChange={handleCountryChange}>
                  <SelectTrigger id="country-select-mobile" className="w-full">
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countriesData.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate} className="w-full">
                Generate User Data
              </Button>
            </CardContent>
          </Card>

          {/* Generated Data */}
          {userData && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-center">Generated User</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries({
                  "Full Name": userData.fullName,
                  Address: userData.address,
                  Phone: userData.phoneNumber,
                  Email: userData.email,
                  Birthday: userData.birthday,
                }).map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
                      <div className="text-sm font-semibold text-gray-900 truncate">{value}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 flex-shrink-0"
                      onClick={() => handleCopy(value, label)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button onClick={handleCopyJson} className="w-full mt-4 bg-gray-100 text-gray-800 hover:bg-gray-200">
                  Copy as JSON
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">UserMint</h1>
              <p className="text-xl text-gray-600">Generate realistic fake user data for testing and development</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Controls */}
              <div className="space-y-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="country-select-desktop" className="block text-sm font-medium text-gray-700 mb-3">
                        Select Country
                      </Label>
                      <Select value={selectedCountryName} onValueChange={handleCountryChange}>
                        <SelectTrigger id="country-select-desktop" className="w-full h-12">
                          <SelectValue placeholder="Choose a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countriesData.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleGenerate} className="w-full">
                      Generate User Data
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Generated Data */}
              <div className="space-y-8">
                {userData ? (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">Generated User Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries({
                        "Full Name": userData.fullName,
                        Address: userData.address,
                        "Phone Number": userData.phoneNumber,
                        Email: userData.email,
                        Birthday: userData.birthday,
                      }).map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
                            <div className="text-lg font-semibold text-gray-900">{value}</div>
                          </div>
                          <Button variant="ghost" size="icon" className="ml-4" onClick={() => handleCopy(value, label)}>
                            <Copy className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        onClick={handleCopyJson}
                        className="w-full mt-6 bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        Copy as JSON
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-lg">
                    <CardContent className="p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <Copy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Generated</h3>
                      <p className="text-gray-500">Select a country and click "Generate User Data" to get started.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
