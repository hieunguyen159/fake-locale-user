"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CountrySelector } from "@/components/country-selector"
import { UserDataCard } from "@/components/user-data-card"
import type { UserData, Country } from "@/types/user"

interface MobileLayoutProps {
  selectedCountry: Country
  onCountryChange: (countryName: string) => void
  onGenerate: () => void
  userData: UserData | null
  onCopy: (text: string, fieldName: string) => void
  onCopyJson: () => void
  isGenerating: boolean
}

export function MobileLayout({
  selectedCountry,
  onCountryChange,
  onGenerate,
  userData,
  onCopy,
  onCopyJson,
  isGenerating,
}: MobileLayoutProps) {
  return (
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
            <CountrySelector
              selectedCountry={selectedCountry}
              onCountryChange={onCountryChange}
              id="country-select-mobile"
            />

            <Button onClick={onGenerate} className="w-full" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate User Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Data */}
        {userData && <UserDataCard userData={userData} onCopy={onCopy} onCopyJson={onCopyJson} variant="mobile" />}
      </div>
    </div>
  )
}
