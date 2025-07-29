import { Card, CardContent } from "@/components/ui/card"

export function EmptyState() {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="text-gray-400 mb-4">
          <div className="text-6xl mb-4">📊</div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Generated</h3>
        <p className="text-gray-500">Select a country and click "Generate User Data" to get started.</p>
      </CardContent>
    </Card>
  )
}
