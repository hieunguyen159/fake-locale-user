"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { COUNTRIES_DATA } from "@/constants/countries"
import type { Country } from "@/types/user"

interface CountrySelectorProps {
  selectedCountry: Country
  onCountryChange: (countryName: string) => void
  id?: string
}

export function CountrySelector({ selectedCountry, onCountryChange, id = "country-select" }: CountrySelectorProps) {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        Select Country
      </Label>
      <Select value={selectedCountry.name} onValueChange={onCountryChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Choose a country">{selectedCountry.name}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES_DATA.map((country) => (
            <SelectItem key={country.code} value={country.name}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
