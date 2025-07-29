"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CountrySelector } from "@/components/country-selector"
import { UserDataCard } from "@/components/user-data-card"
import { EmptyState } from "@/components/empty-state"
import type { UserData, Country } from "@/types/user"

interface DesktopLayoutProps {
  selectedCountry: Country
  onCountryChange: (countryName: string) => void
  onGenerate: () => void
  userData: UserData | null
  onCopy: (text: string, fieldName: string) => void
  onCopyJson: () => void
  isGenerating: boolean
}

export function DesktopLayout({
  selectedCountry,
  onCountryChange,
  onGenerate,
  userData,
  onCopy,
  onCopyJson,
  isGenerating,
}: DesktopLayoutProps) {
  return (
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
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    onCountryChange={onCountryChange}
                    id="country-select-desktop"
                  />

                  <Button onClick={onGenerate} className="w-full" disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate User Data"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Generated Data */}
            <div className="space-y-8">
              {userData ? (
                <UserDataCard userData={userData} onCopy={onCopy} onCopyJson={onCopyJson} variant="desktop" />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
