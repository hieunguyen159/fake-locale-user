"use client";

import { useState, useCallback } from "react";
import { getCountryData } from "@/lib/actions";
import { generateFakeUser } from "@/utils/user-generator";
import type { UserData, Country } from "@/types/user";
import { DEFAULT_COUNTRY, COUNTRIES_DATA } from "@/constants/countries";
import { useStatsContext } from "@/components/stats-context";

export const useUserGenerator = () => {
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(DEFAULT_COUNTRY);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { incrementGeneration, totalGenerated } = useStatsContext();

  const handleCountryChange = useCallback((countryName: string) => {
    const country = COUNTRIES_DATA.find((c) => c.name === countryName);
    if (country) {
      setSelectedCountry(country);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const countryLists = getCountryData(selectedCountry.code);
      if (countryLists) {
        const data = generateFakeUser(countryLists, selectedCountry.name);
        setUserData(data);
        await incrementGeneration(selectedCountry.code);
      }
    } catch (error) {
      console.error("Error generating user data:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCountry, incrementGeneration]);

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCopyJson = useCallback(async () => {
    if (userData) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(userData, null, 2));
      } catch (err) {
        console.error("Failed to copy JSON: ", err);
      }
    }
  }, [userData]);

  return {
    selectedCountry,
    userData,
    isGenerating,
    handleCountryChange,
    handleGenerate,
    handleCopy,
    handleCopyJson,
    totalGenerated,
  };
};
