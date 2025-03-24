
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Beaker, ChevronRight, Droplets, FlaskConical, Leaf, RefreshCw, TestTube } from "lucide-react";
import { toast } from "sonner";

interface NutrientLevels {
  Nitrogen_mg_kg: number;
  Phosphorus_mg_kg: number;
  Potassium_mg_kg: number;
  Sulfur_mg_kg: number;
  Calcium_mg_kg: number;
  Magnesium_mg_kg: number;
}

interface RecommendationResult {
  recommendations: string[];
  nutrientStatus: {
    [key: string]: "optimal" | "moderate" | "low" | "deficient";
  };
}

// Icon mapping for nutrient status
const statusIcons = {
  optimal: <Leaf className="h-5 w-5 text-green-500" />,
  moderate: <Leaf className="h-5 w-5 text-yellow-500" />,
  low: <Leaf className="h-5 w-5 text-orange-500" />,
  deficient: <Leaf className="h-5 w-5 text-red-500" />,
};

export default function FertilizerRecommendation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [nutrientLevels, setNutrientLevels] = useState<NutrientLevels | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  
  useEffect(() => {
    // First check if we have data from location state (direct navigation)
    if (location.state?.nutrientLevels) {
      setNutrientLevels(location.state.nutrientLevels);
      const result = recommendFertilizer(location.state.nutrientLevels);
      setRecommendations(result);
      
      // Save to localStorage for persistence
      localStorage.setItem('fertilizerRecommendationData', JSON.stringify(location.state.nutrientLevels));
    } else {
      // Then check localStorage for previously saved data
      const savedData = localStorage.getItem('fertilizerRecommendationData');
      const soilAnalysisData = localStorage.getItem('soilAnalysisData');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setNutrientLevels(parsedData);
        const result = recommendFertilizer(parsedData);
        setRecommendations(result);
      } else if (soilAnalysisData) {
        // If no fertilizer data but soil analysis data exists, try to extract nutrient data
        try {
          const parsedSoilData = JSON.parse(soilAnalysisData);
          
          // Extract nutrient data from soil analysis data
          const extractedNutrientData: NutrientLevels = {
            Nitrogen_mg_kg: parsedSoilData.Nitrogen_mg_kg || 0,
            Phosphorus_mg_kg: parsedSoilData.Phosphorus_mg_kg || 0,
            Potassium_mg_kg: parsedSoilData.Potassium_mg_kg || 0,
            Sulfur_mg_kg: parsedSoilData.Sulfur_mg_kg || 0,
            Calcium_mg_kg: parsedSoilData.Calcium_mg_kg || 0,
            Magnesium_mg_kg: parsedSoilData.Magnesium_mg_kg || 0
          };
          
          setNutrientLevels(extractedNutrientData);
          const result = recommendFertilizer(extractedNutrientData);
          setRecommendations(result);
          
          // Save for future use
          localStorage.setItem('fertilizerRecommendationData', JSON.stringify(extractedNutrientData));
          
          toast.success("Loaded data from your latest soil analysis");
        } catch (error) {
          console.error("Error parsing soil analysis data:", error);
          toast.error("No soil analysis data found. Please complete soil analysis first.");
        }
      } else {
        // If no data, show a message
        toast.error("No soil analysis data found. Please complete soil analysis first.");
      }
    }
  }, [location.state]);

  // Function to generate fertilizer recommendations based on nutrient levels
  const recommendFertilizer = (levels: NutrientLevels): RecommendationResult => {
    const recommendations: string[] = [];
    const nutrientStatus: {[key: string]: "optimal" | "moderate" | "low" | "deficient"} = {};

    // Nitrogen (mg/kg)
    if (levels.Nitrogen_mg_kg < 20) {
      recommendations.push("Severely deficient in Nitrogen. Apply Urea or Ammonium Nitrate.");
      nutrientStatus["Nitrogen"] = "deficient";
    } else if (levels.Nitrogen_mg_kg < 40) {
      recommendations.push("Low Nitrogen levels. Use NPK 20-20-20 or organic manure.");
      nutrientStatus["Nitrogen"] = "low";
    } else if (levels.Nitrogen_mg_kg < 80) {
      recommendations.push("Moderate Nitrogen levels. Supplement with compost if needed.");
      nutrientStatus["Nitrogen"] = "moderate";
    } else {
      nutrientStatus["Nitrogen"] = "optimal";
    }

    // Phosphorus (mg/kg)
    if (levels.Phosphorus_mg_kg < 10) {
      recommendations.push("Severely deficient in Phosphorus. Use Single Super Phosphate (SSP) or DAP.");
      nutrientStatus["Phosphorus"] = "deficient";
    } else if (levels.Phosphorus_mg_kg < 25) {
      recommendations.push("Low Phosphorus levels. Apply Rock Phosphate or bone meal.");
      nutrientStatus["Phosphorus"] = "low";
    } else if (levels.Phosphorus_mg_kg < 50) {
      recommendations.push("Moderate Phosphorus levels. Consider balanced NPK if needed.");
      nutrientStatus["Phosphorus"] = "moderate";
    } else {
      nutrientStatus["Phosphorus"] = "optimal";
    }

    // Potassium (mg/kg)
    if (levels.Potassium_mg_kg < 30) {
      recommendations.push("Severely deficient in Potassium. Use Muriate of Potash (MOP) or SOP.");
      nutrientStatus["Potassium"] = "deficient";
    } else if (levels.Potassium_mg_kg < 60) {
      recommendations.push("Low Potassium levels. Apply potassium sulfate or compost.");
      nutrientStatus["Potassium"] = "low";
    } else if (levels.Potassium_mg_kg < 120) {
      recommendations.push("Moderate Potassium levels. Use banana peel compost or wood ash.");
      nutrientStatus["Potassium"] = "moderate";
    } else {
      nutrientStatus["Potassium"] = "optimal";
    }

    // Sulfur (mg/kg)
    if (levels.Sulfur_mg_kg < 10) {
      recommendations.push("Severely deficient in Sulfur. Apply Ammonium Sulfate or Gypsum.");
      nutrientStatus["Sulfur"] = "deficient";
    } else if (levels.Sulfur_mg_kg < 20) {
      recommendations.push("Low Sulfur levels. Use elemental sulfur if necessary.");
      nutrientStatus["Sulfur"] = "low";
    } else if (levels.Sulfur_mg_kg < 40) {
      recommendations.push("Moderate Sulfur levels. Monitor levels for crop-specific needs.");
      nutrientStatus["Sulfur"] = "moderate";
    } else {
      nutrientStatus["Sulfur"] = "optimal";
    }

    // Calcium (mg/kg)
    if (levels.Calcium_mg_kg < 500) {
      recommendations.push("Severely deficient in Calcium. Apply Lime or Gypsum.");
      nutrientStatus["Calcium"] = "deficient";
    } else if (levels.Calcium_mg_kg < 1000) {
      recommendations.push("Low Calcium levels. Use calcium nitrate if needed.");
      nutrientStatus["Calcium"] = "low";
    } else if (levels.Calcium_mg_kg < 2000) {
      recommendations.push("Moderate Calcium levels. Maintain soil pH balance.");
      nutrientStatus["Calcium"] = "moderate";
    } else {
      nutrientStatus["Calcium"] = "optimal";
    }

    // Magnesium (mg/kg)
    if (levels.Magnesium_mg_kg < 50) {
      recommendations.push("Severely deficient in Magnesium. Apply Magnesium Sulfate (Epsom salt).");
      nutrientStatus["Magnesium"] = "deficient";
    } else if (levels.Magnesium_mg_kg < 100) {
      recommendations.push("Low Magnesium levels. Use Dolomite Lime or Magnesium Oxide.");
      nutrientStatus["Magnesium"] = "low";
    } else if (levels.Magnesium_mg_kg < 200) {
      recommendations.push("Moderate Magnesium levels. Supplement with organic amendments if necessary.");
      nutrientStatus["Magnesium"] = "moderate";
    } else {
      nutrientStatus["Magnesium"] = "optimal";
    }

    return {
      recommendations: recommendations.length > 0 ? recommendations : ["Soil nutrient levels are optimal."],
      nutrientStatus
    };
  };

  const handleGoToSoilAnalysis = () => {
    navigate("/soil-analysis");
  };

  // Color mapping for nutrient status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal": return "bg-green-100 text-green-800 border-green-300";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-orange-100 text-orange-800 border-orange-300";
      case "deficient": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // If no nutrient data, show a message to redirect to soil analysis
  if (!nutrientLevels) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Fertilizer Recommendation</h1>
          <p className="text-muted-foreground">Personalized fertilizer recommendations based on your soil analysis</p>
        </div>
        
        <div className="enhanced-tile bg-background p-8 rounded-lg text-center max-w-2xl mx-auto">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4 text-foreground">No Soil Data Available</h2>
          <p className="mb-6 text-foreground">Please complete a soil analysis first to get personalized fertilizer recommendations.</p>
          <Button onClick={handleGoToSoilAnalysis} className="bg-[#2c7d32] hover:bg-[#388e3c]">
            Go to Soil Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Fertilizer Recommendation</h1>
        <p className="text-muted-foreground">Personalized fertilizer recommendations based on your soil analysis</p>
      </div>
      
      <div className="space-y-8">
        {/* Nutrient Levels Summary */}
        <div className="enhanced-tile bg-background p-6 rounded-lg">
          <div className="flex items-center mb-6">
            <TestTube className="mr-2 h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-foreground">Soil Nutrient Summary</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Nitrogen Card */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Nitrogen (N)</CardTitle>
                <CardDescription>Primary Nutrient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{nutrientLevels.Nitrogen_mg_kg} mg/kg</div>
                <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(recommendations?.nutrientStatus['Nitrogen'] || 'optimal')}`}>
                  {statusIcons[recommendations?.nutrientStatus['Nitrogen'] || 'optimal']}
                  <span className="ml-1 capitalize">{recommendations?.nutrientStatus['Nitrogen'] || 'Optimal'}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Phosphorus Card */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Phosphorus (P)</CardTitle>
                <CardDescription>Primary Nutrient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{nutrientLevels.Phosphorus_mg_kg} mg/kg</div>
                <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(recommendations?.nutrientStatus['Phosphorus'] || 'optimal')}`}>
                  {statusIcons[recommendations?.nutrientStatus['Phosphorus'] || 'optimal']}
                  <span className="ml-1 capitalize">{recommendations?.nutrientStatus['Phosphorus'] || 'Optimal'}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Potassium Card */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Potassium (K)</CardTitle>
                <CardDescription>Primary Nutrient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{nutrientLevels.Potassium_mg_kg} mg/kg</div>
                <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(recommendations?.nutrientStatus['Potassium'] || 'optimal')}`}>
                  {statusIcons[recommendations?.nutrientStatus['Potassium'] || 'optimal']}
                  <span className="ml-1 capitalize">{recommendations?.nutrientStatus['Potassium'] || 'Optimal'}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Sulfur Card */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Sulfur (S)</CardTitle>
                <CardDescription>Secondary Nutrient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{nutrientLevels.Sulfur_mg_kg} mg/kg</div>
                <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(recommendations?.nutrientStatus['Sulfur'] || 'optimal')}`}>
                  {statusIcons[recommendations?.nutrientStatus['Sulfur'] || 'optimal']}
                  <span className="ml-1 capitalize">{recommendations?.nutrientStatus['Sulfur'] || 'Optimal'}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Calcium Card */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Calcium (Ca)</CardTitle>
                <CardDescription>Secondary Nutrient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{nutrientLevels.Calcium_mg_kg} mg/kg</div>
                <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(recommendations?.nutrientStatus['Calcium'] || 'optimal')}`}>
                  {statusIcons[recommendations?.nutrientStatus['Calcium'] || 'optimal']}
                  <span className="ml-1 capitalize">{recommendations?.nutrientStatus['Calcium'] || 'Optimal'}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Magnesium Card */}
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Magnesium (Mg)</CardTitle>
                <CardDescription>Secondary Nutrient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{nutrientLevels.Magnesium_mg_kg} mg/kg</div>
                <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(recommendations?.nutrientStatus['Magnesium'] || 'optimal')}`}>
                  {statusIcons[recommendations?.nutrientStatus['Magnesium'] || 'optimal']}
                  <span className="ml-1 capitalize">{recommendations?.nutrientStatus['Magnesium'] || 'Optimal'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Fertilizer Recommendations */}
        <div className="enhanced-tile bg-background p-6 rounded-lg">
          <div className="flex items-center mb-6">
            <Beaker className="mr-2 h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-foreground">Fertilizer Recommendations</h2>
          </div>
          
          <div className="space-y-4">
            {recommendations?.recommendations.map((recommendation, index) => {
              // Extract the nutrient name from the recommendation
              const nutrientMatch = recommendation.match(/^(Severely deficient|Low|Moderate) (in )?([A-Za-z]+)/);
              const nutrient = nutrientMatch ? nutrientMatch[3] : null;
              
              // Determine severity level
              let severityColor = "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700";
              if (recommendation.includes("Severely deficient")) {
                severityColor = "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800";
              } else if (recommendation.includes("Low")) {
                severityColor = "bg-orange-50 border-orange-300 dark:bg-orange-900/20 dark:border-orange-800";
              } else if (recommendation.includes("Moderate")) {
                severityColor = "bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-800";
              } else if (recommendation.includes("optimal")) {
                severityColor = "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-800";
              }
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${severityColor}`}>
                  <div className="flex items-start">
                    {nutrient === "Nitrogen" && <FlaskConical className="h-5 w-5 mt-0.5 mr-2 text-blue-600" />}
                    {nutrient === "Phosphorus" && <TestTube className="h-5 w-5 mt-0.5 mr-2 text-orange-600" />}
                    {nutrient === "Potassium" && <Beaker className="h-5 w-5 mt-0.5 mr-2 text-purple-600" />}
                    {nutrient === "Sulfur" && <Beaker className="h-5 w-5 mt-0.5 mr-2 text-yellow-600" />}
                    {nutrient === "Calcium" && <Droplets className="h-5 w-5 mt-0.5 mr-2 text-green-600" />}
                    {nutrient === "Magnesium" && <Droplets className="h-5 w-5 mt-0.5 mr-2 text-teal-600" />}
                    {!nutrient && <Leaf className="h-5 w-5 mt-0.5 mr-2 text-green-600" />}
                    <div>
                      <p className="font-medium text-foreground">{recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={handleGoToSoilAnalysis}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Update Soil Analysis</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
