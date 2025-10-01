import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, ShieldAlert, AlertTriangle } from "lucide-react"
import { recommendationsData } from "@/lib/data"

interface RecommendationsProps {
  severity: string
}

export default function Recommendations({ severity }: RecommendationsProps) {
  const data = recommendationsData[severity as keyof typeof recommendationsData]

  if (!data) {
    return null // Don't render anything if no severity is selected
  }

  const Icon = severity === "critical" ? ShieldAlert : severity === "warning" ? AlertTriangle : Lightbulb

  return (
    <Card className="border-2 border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          Recommendations for {severity.charAt(0).toUpperCase() + severity.slice(1)} Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 list-disc pl-5">
          {data.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
