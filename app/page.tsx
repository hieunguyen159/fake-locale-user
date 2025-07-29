"use client"

import { Toaster } from "@/components/ui/toaster"
import { MobileLayout } from "@/components/mobile-layout"
import { DesktopLayout } from "@/components/desktop-layout"
import { useUserGenerator } from "@/hooks/use-user-generator"

export default function Home() {
  const { selectedCountry, userData, isGenerating, handleCountryChange, handleGenerate, handleCopy, handleCopyJson } =
    useUserGenerator()

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileLayout
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        onGenerate={handleGenerate}
        userData={userData}
        onCopy={handleCopy}
        onCopyJson={handleCopyJson}
        isGenerating={isGenerating}
      />

      <DesktopLayout
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        onGenerate={handleGenerate}
        userData={userData}
        onCopy={handleCopy}
        onCopyJson={handleCopyJson}
        isGenerating={isGenerating}
      />

      <Toaster />
    </div>
  )
}
