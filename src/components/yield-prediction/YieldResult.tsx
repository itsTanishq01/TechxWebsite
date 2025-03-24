
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Wheat, AlertCircle, BarChart3 } from "lucide-react";

interface YieldResultProps {
  yieldValue: number;
  confidence: number;
  cropType: string;
}

export function YieldResult({ yieldValue, confidence, cropType }: YieldResultProps) {
  // Format the yield to 2 decimal places
  const formattedYield = yieldValue.toFixed(2);
  const formattedConfidence = (confidence * 100).toFixed(0);
  
  // Determine confidence level label and color
  let confidenceLabel = "Low";
  let confidenceBadgeVariant: "default" | "secondary" | "destructive" | "outline" = "destructive";
  
  if (confidence >= 0.7) {
    confidenceLabel = "High";
    confidenceBadgeVariant = "default";
  } else if (confidence >= 0.5) {
    confidenceLabel = "Medium";
    confidenceBadgeVariant = "secondary";
  }

  // Yield level assessment
  const getYieldAssessment = () => {
    // These thresholds should be adjusted based on crop type in a real app
    if (yieldValue < 2) return "Below average";
    if (yieldValue < 4) return "Average";
    return "Above average";
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg animate-fade-in">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wheat className="h-6 w-6 text-primary" />
            <CardTitle>Yield Prediction Results</CardTitle>
          </div>
          <Badge variant={confidenceBadgeVariant}>
            {confidenceLabel} Confidence ({formattedConfidence}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-primary mb-2">{formattedYield}</div>
          <div className="text-xl text-muted-foreground">Tons per Hectare</div>
        </div>

        <div className="border rounded-md p-4 mt-6">
          <div className="text-sm text-muted-foreground mb-1">Yield Assessment</div>
          <div className="font-medium">{getYieldAssessment()}</div>
        </div>

        {confidence < 0.7 && (
          <Alert className="mt-6" variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              The confidence level for this prediction is {confidenceLabel.toLowerCase()}. Consider adjusting your inputs for more accurate results or consult with an agronomist.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 text-sm text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>Prediction based on provided data and machine learning models</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
