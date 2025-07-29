"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import type { UserData } from "@/types/user"

interface UserDataCardProps {
  userData: UserData
  onCopy: (text: string, fieldName: string) => void
  onCopyJson: () => void
  variant?: "mobile" | "desktop"
}

export function UserDataCard({ userData, onCopy, onCopyJson, variant = "desktop" }: UserDataCardProps) {
  const isMobile = variant === "mobile"

  const dataFields = {
    "Full Name": userData.fullName,
    Address: userData.address,
    [isMobile ? "Phone" : "Phone Number"]: userData.phoneNumber,
    Email: userData.email,
    Birthday: userData.birthday,
  }

  return (
    <Card className={isMobile ? "shadow-sm" : "shadow-lg"}>
      <CardHeader className={isMobile ? "pb-4" : ""}>
        <CardTitle className={isMobile ? "text-lg text-center" : "text-xl"}>
          {isMobile ? "Generated User" : "Generated User Data"}
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "space-y-4" : "space-y-6"}>
        {Object.entries(dataFields).map(([label, value]) => (
          <div
            key={label}
            className={
              isMobile
                ? "flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                : "flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            }
          >
            <div className="flex-1 min-w-0">
              {isMobile ? (
                <>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
                  <div className="text-sm font-semibold text-gray-900 truncate">{value}</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
                  <div className="text-lg font-semibold text-gray-900">{value}</div>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={isMobile ? "ml-2 flex-shrink-0" : "ml-4"}
              onClick={() => onCopy(value, label)}
            >
              <Copy className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
            </Button>
          </div>
        ))}

        <Button
          onClick={onCopyJson}
          className={
            isMobile
              ? "w-full mt-4 bg-gray-100 text-gray-800 hover:bg-gray-200"
              : "w-full mt-6 bg-gray-100 text-gray-800 hover:bg-gray-200"
          }
        >
          Copy as JSON
        </Button>
      </CardContent>
    </Card>
  )
}
