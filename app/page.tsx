"use client";

import { Toaster } from "@/components/ui/toaster";
import { MobileLayout } from "@/components/mobile-layout";
import { DesktopLayout } from "@/components/desktop-layout";
import { StatsDisplay } from "@/components/stats-display";
import { RealtimeIndicator } from "@/components/realtime-indicator";
import { useUserGenerator } from "@/hooks/use-user-generator";

export default function Home() {
  const {
    selectedCountry,
    userData,
    isGenerating,
    handleCountryChange,
    handleGenerate,
    handleCopy,
    handleCopyJson,
    totalGenerated,
  } = useUserGenerator();

  return (
    <div className="bg-gray-50">
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

      {/* Stats Footer */}
      <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-auto">
        <div className="bg-white/90 backdrop-blur-sm border rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <StatsDisplay />
            <RealtimeIndicator />
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
