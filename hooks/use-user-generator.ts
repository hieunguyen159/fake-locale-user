"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { getCountryData } from "@/lib/actions"
import { generateFakeUser } from "@/utils/user-generator"
import type { UserData, Country } from "@/types/user"
import { DEFAULT_COUNTRY, COUNTRIES_DATA } from "@/constants/countries"

export const useUserGenerator = () => {
  const { toast } = useToast()
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleCountryChange = useCallback((countryName: string) => {
    const country = COUNTRIES_DATA.find((c) => c.name === countryName)
    if (country) {
      setSelectedCountry(country)
    }
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!selectedCountry) {
      toast({
        title: "Selection Missing",
        description: "Please select a country to generate data.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const countryLists = await getCountryData(selectedCountry.code)
      if (countryLists) {
        const data = generateFakeUser(countryLists, selectedCountry.name)
        setUserData(data)
      } else {
        toast({
          title: "Data Not Available",
          description: `Could not load data for ${selectedCountry.name}. Please try another country.`,
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
    } finally {
      setIsGenerating(false)
    }
  }, [selectedCountry, toast])

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

  return {
    selectedCountry,
    userData,
    isGenerating,
    handleCountryChange,
    handleGenerate,
    handleCopy,
    handleCopyJson,
  }
}
