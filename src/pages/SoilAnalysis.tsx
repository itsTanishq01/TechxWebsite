
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Droplet, Thermometer, Braces, BarChart3, CloudRain, Sun, Wind, MoveHorizontal, Mountain, Activity, Gauge, Database, AlertCircle, ChartBar, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SoilDashboard from "@/components/soil-analysis/SoilDashboard";
import HarvestStats from "@/components/soil-analysis/HarvestStats";

interface SoilFormData {
  Soil_Moisture_: number;
  Bulk_Density_g_cm3: number;
  Porosity_: number;
  Water_Holding_Capacity_: number;
  pH_Level: number;
  Electrical_Conductivity_dS_m: number;
  Organic_Carbon_: number;
  Nitrogen_mg_kg: number;
  Phosphorus_mg_kg: number;
  Potassium_mg_kg: number;
  Sulfur_mg_kg: number;
  Calcium_mg_kg: number;
  Magnesium_mg_kg: number;
  Temperature_C: number;
  Rainfall_mm: number;
  Humidity_: number;
  Solar_Radiation_W_m2: number;
}

interface SoilHealthResponse {
  Soil_Health_Score: number;
}

interface CropRecommendationResponse {
  Recommended_Crop: string;
}

// Default empty form data
const defaultFormData: SoilFormData = {
  Soil_Moisture_: 0,
  Bulk_Density_g_cm3: 0,
  Porosity_: 0,
  Water_Holding_Capacity_: 0,
  pH_Level: 0,
  Electrical_Conductivity_dS_m: 0,
  Organic_Carbon_: 0,
  Nitrogen_mg_kg: 0,
  Phosphorus_mg_kg: 0,
  Potassium_mg_kg: 0,
  Sulfur_mg_kg: 0,
  Calcium_mg_kg: 0,
  Magnesium_mg_kg: 0,
  Temperature_C: 0,
  Rainfall_mm: 0,
  Humidity_: 0,
  Solar_Radiation_W_m2: 0
};

const STORAGE_KEY = 'soil-analysis-form-data';
const SOIL_HEALTH_KEY = 'soil-analysis-health-score';
const CROP_RECOMMENDATION_KEY = 'soil-analysis-crop-recommendation';

const SoilAnalysis = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('soil-analysis-active-tab') || "input-form";
  });
  const [soilHealth, setSoilHealth] = useState<number | null>(() => {
    const savedScore = localStorage.getItem(SOIL_HEALTH_KEY);
    return savedScore ? parseFloat(savedScore) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedCrop, setRecommendedCrop] = useState<string | null>(() => {
    return localStorage.getItem(CROP_RECOMMENDATION_KEY);
  });
  
  // Form data state with persistence
  const [formData, setFormData] = useState<SoilFormData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : defaultFormData;
  });

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('soil-analysis-active-tab', activeTab);
  }, [activeTab]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Save analysis results to localStorage when they change
  useEffect(() => {
    if (soilHealth !== null) {
      localStorage.setItem(SOIL_HEALTH_KEY, soilHealth.toString());
    }
    
    if (recommendedCrop) {
      localStorage.setItem(CROP_RECOMMENDATION_KEY, recommendedCrop);
    }
  }, [soilHealth, recommendedCrop]);

  // Function to navigate to fertilizer recommendation with nutrient data
  const goToFertilizerRecommendation = () => {
    // Ensure we have valid data before navigating
    if (formData.Nitrogen_mg_kg > 0 || formData.Phosphorus_mg_kg > 0 || formData.Potassium_mg_kg > 0) {
      navigate("/tools/fertilizer-recommendation", {
        state: {
          nutrientLevels: {
            Nitrogen_mg_kg: formData.Nitrogen_mg_kg,
            Phosphorus_mg_kg: formData.Phosphorus_mg_kg,
            Potassium_mg_kg: formData.Potassium_mg_kg,
            Sulfur_mg_kg: formData.Sulfur_mg_kg,
            Calcium_mg_kg: formData.Calcium_mg_kg,
            Magnesium_mg_kg: formData.Magnesium_mg_kg
          }
        }
      });
    } else {
      toast.error("Please complete soil analysis first to get nutrient data");
    }
  };

  // Helper function to get color based on health score
  const getHealthColor = (score: number | null) => {
    if (score === null) return "bg-gray-300";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-green-400";
    if (score >= 40) return "bg-yellow-500";
    if (score >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  // Helper function to get health status text
  const getHealthStatus = (score: number | null) => {
    if (score === null) return "Not analyzed";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    if (score >= 20) return "Poor";
    return "Very Poor";
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  // Generate random data
  const generateRandomData = () => {
    const fields = [
      { name: "Soil_Moisture_", min: 10, max: 40 },
      { name: "Bulk_Density_g_cm3", min: 1.1, max: 1.6 },
      { name: "Porosity_", min: 30, max: 60 },
      { name: "Water_Holding_Capacity_", min: 20, max: 50 },
      { name: "pH_Level", min: 5.5, max: 7.5 },
      { name: "Electrical_Conductivity_dS_m", min: 0.1, max: 4 },
      { name: "Organic_Carbon_", min: 0.5, max: 3 },
      { name: "Nitrogen_mg_kg", min: 50, max: 300 },
      { name: "Phosphorus_mg_kg", min: 5, max: 60 },
      { name: "Potassium_mg_kg", min: 50, max: 500 },
      { name: "Sulfur_mg_kg", min: 5, max: 40 },
      { name: "Calcium_mg_kg", min: 500, max: 3000 },
      { name: "Magnesium_mg_kg", min: 50, max: 500 },
      { name: "Temperature_C", min: 10, max: 35 },
      { name: "Rainfall_mm", min: 100, max: 1500 },
      { name: "Humidity_", min: 20, max: 90 },
      { name: "Solar_Radiation_W_m2", min: 100, max: 1200 }
    ];

    const newData = { ...formData };
    
    fields.forEach(field => {
      const value = getRandomValue(field.min, field.max);
      newData[field.name as keyof SoilFormData] = value;
    });
    
    setFormData(newData);
    // Make sure we don't change the tab when generating random data
    toast.success("Random sample data generated");
  };

  // Get random value with appropriate precision
  const getRandomValue = (min: number, max: number) => {
    const value = Math.random() * (max - min) + min;
    const range = max - min;
    
    if (range < 1) {
      return parseFloat(value.toFixed(2));
    } else if (range < 10) {
      return parseFloat(value.toFixed(1));
    } else {
      return Math.round(value);
    }
  };

  // Submit form to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSoilHealth(null);
    setRecommendedCrop(null);
    
    // Updated API URL
    const apiUrl = "https://techxsoilandcrop.onrender.com";
    
    try {
      // Make parallel API calls for soil health and crop recommendation
      const [soilResponse, cropResponse] = await Promise.all([
        fetch(`${apiUrl}/predict/soil`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }),
        fetch(`${apiUrl}/predict/crop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
      ]);
      
      if (!soilResponse.ok || !cropResponse.ok) {
        throw new Error("Failed to fetch predictions");
      }
      
      const soilData: SoilHealthResponse = await soilResponse.json();
      const cropData: CropRecommendationResponse = await cropResponse.json();
      
      setSoilHealth(soilData.Soil_Health_Score);
      setRecommendedCrop(cropData.Recommended_Crop);
      
      // Switch to the results tab if soil analysis was successful
      if (soilData.Soil_Health_Score) {
        setActiveTab("results");
      }
      
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast.error("Failed to fetch predictions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tooltip component for fields
  const FieldTooltip = ({ children, content }: { children: React.ReactNode, content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help">
            {children}
            <AlertCircle className="h-4 w-4 ml-1 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Soil Analysis & Crop Recommendation</h1>
        <p className="text-muted-foreground">Enter soil parameters to get optimal farming suggestions</p>
      </div>
      
      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab} scrollToTop={true}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="input-form">Soil Input Form</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="stats">Harvest Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input-form" className="animate-fade-in">
          <form onSubmit={handleSubmit} className="enhanced-tile bg-background p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Soil Physical Properties */}
              <div className="col-span-1 lg:col-span-3">
                <h2 className="text-lg font-semibold mb-4">Soil Physical Properties</h2>
                <Separator className="mb-4" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Soil_Moisture_">
                  <FieldTooltip content="Percentage of water content in soil by volume">
                    Soil Moisture (%)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Soil_Moisture_"
                  name="Soil_Moisture_"
                  type="number"
                  placeholder="10-40"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.Soil_Moisture_ || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Bulk_Density_g_cm3">
                  <FieldTooltip content="Mass of soil per unit volume">
                    Bulk Density (g/cm³)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Bulk_Density_g_cm3"
                  name="Bulk_Density_g_cm3"
                  type="number"
                  placeholder="1.1-1.6"
                  step="0.01"
                  min="0.5"
                  max="2.0"
                  value={formData.Bulk_Density_g_cm3 || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Porosity_">
                  <FieldTooltip content="Volume of pore space in soil">
                    Porosity (%)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Porosity_"
                  name="Porosity_"
                  type="number"
                  placeholder="30-60"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.Porosity_ || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Water_Holding_Capacity_">
                  <FieldTooltip content="Amount of water soil can hold against gravity">
                    Water Holding Capacity (%)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Water_Holding_Capacity_"
                  name="Water_Holding_Capacity_"
                  type="number"
                  placeholder="20-50"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.Water_Holding_Capacity_ || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Soil Chemical Properties */}
              <div className="col-span-1 lg:col-span-3">
                <h2 className="text-lg font-semibold mb-4 mt-4">Soil Chemical Properties</h2>
                <Separator className="mb-4" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pH_Level">
                  <FieldTooltip content="Acidity or alkalinity of soil (0-14)">
                    pH Level
                  </FieldTooltip>
                </Label>
                <Input 
                  id="pH_Level"
                  name="pH_Level"
                  type="number"
                  placeholder="5.5-7.5"
                  step="0.1"
                  min="0"
                  max="14"
                  value={formData.pH_Level || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Electrical_Conductivity_dS_m">
                  <FieldTooltip content="Measure of soil salinity">
                    Electrical Conductivity (dS/m)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Electrical_Conductivity_dS_m"
                  name="Electrical_Conductivity_dS_m"
                  type="number"
                  placeholder="0.1-4.0"
                  step="0.01"
                  min="0"
                  value={formData.Electrical_Conductivity_dS_m || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Organic_Carbon_">
                  <FieldTooltip content="Carbon stored in soil organic matter">
                    Organic Carbon (%)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Organic_Carbon_"
                  name="Organic_Carbon_"
                  type="number"
                  placeholder="0.5-3.0"
                  step="0.01"
                  min="0"
                  value={formData.Organic_Carbon_ || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Soil Nutrients */}
              <div className="col-span-1 lg:col-span-3">
                <h2 className="text-lg font-semibold mb-4 mt-4">Soil Nutrients</h2>
                <Separator className="mb-4" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Nitrogen_mg_kg">
                  <FieldTooltip content="Essential nutrient for plant growth">
                    Nitrogen (mg/kg)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Nitrogen_mg_kg"
                  name="Nitrogen_mg_kg"
                  type="number"
                  placeholder="50-300"
                  step="1"
                  min="0"
                  value={formData.Nitrogen_mg_kg || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Phosphorus_mg_kg">
                  <FieldTooltip content="Essential for root development and energy transfer">
                    Phosphorus (mg/kg)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Phosphorus_mg_kg"
                  name="Phosphorus_mg_kg"
                  type="number"
                  placeholder="5-60"
                  step="1"
                  min="0"
                  value={formData.Phosphorus_mg_kg || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Potassium_mg_kg">
                  <FieldTooltip content="Essential for overall plant health and disease resistance">
                    Potassium (mg/kg)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Potassium_mg_kg"
                  name="Potassium_mg_kg"
                  type="number"
                  placeholder="50-500"
                  step="1"
                  min="0"
                  value={formData.Potassium_mg_kg || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Sulfur_mg_kg">
                  <FieldTooltip content="Important for protein synthesis and enzyme activities">
                    Sulfur (mg/kg)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Sulfur_mg_kg"
                  name="Sulfur_mg_kg"
                  type="number"
                  placeholder="5-40"
                  step="1"
                  min="0"
                  value={formData.Sulfur_mg_kg || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Calcium_mg_kg">
                  <FieldTooltip content="Helps maintain chemical balance and improves soil structure">
                    Calcium (mg/kg)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Calcium_mg_kg"
                  name="Calcium_mg_kg"
                  type="number"
                  placeholder="500-3000"
                  step="1"
                  min="0"
                  value={formData.Calcium_mg_kg || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Magnesium_mg_kg">
                  <FieldTooltip content="Essential for chlorophyll production and photosynthesis">
                    Magnesium (mg/kg)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Magnesium_mg_kg"
                  name="Magnesium_mg_kg"
                  type="number"
                  placeholder="50-500"
                  step="1"
                  min="0"
                  value={formData.Magnesium_mg_kg || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {/* Environmental Factors */}
              <div className="col-span-1 lg:col-span-3">
                <h2 className="text-lg font-semibold mb-4 mt-4">Environmental Factors</h2>
                <Separator className="mb-4" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Temperature_C">
                  <FieldTooltip content="Average temperature of the region">
                    Temperature (°C)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Temperature_C"
                  name="Temperature_C"
                  type="number"
                  placeholder="10-35"
                  step="0.1"
                  value={formData.Temperature_C || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Rainfall_mm">
                  <FieldTooltip content="Annual rainfall in the region">
                    Rainfall (mm)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Rainfall_mm"
                  name="Rainfall_mm"
                  type="number"
                  placeholder="100-1500"
                  step="1"
                  min="0"
                  value={formData.Rainfall_mm || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Humidity_">
                  <FieldTooltip content="Average relative humidity in the region">
                    Humidity (%)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Humidity_"
                  name="Humidity_"
                  type="number"
                  placeholder="20-90"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.Humidity_ || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Solar_Radiation_W_m2">
                  <FieldTooltip content="Average solar energy received per unit area">
                    Solar Radiation (W/m²)
                  </FieldTooltip>
                </Label>
                <Input 
                  id="Solar_Radiation_W_m2"
                  name="Solar_Radiation_W_m2"
                  type="number"
                  placeholder="100-1200"
                  step="1"
                  min="0"
                  value={formData.Solar_Radiation_W_m2 || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 mt-8">
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateRandomData} 
                  className="h-14 px-6 text-lg w-full"
                >
                  <Database className="mr-2 h-5 w-5" /> Fetch Sample Data
                </Button>
                <Button 
                  type="submit" 
                  className="h-14 px-6 bg-[#2c7d32] hover:bg-[#388e3c] text-lg w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Leaf className="mr-2 h-5 w-5" /> Predict
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="results" className="animate-fade-in">
          {Object.values(formData).some(value => value > 0) ? (
            <div className="space-y-8">
              {/* Soil Health Meter */}
              <div className="enhanced-tile bg-background p-6 rounded-lg">
                <div className="flex items-center mb-6">
                  <BarChart3 className="mr-2 h-6 w-6 text-[#2c7d32]" />
                  <h2 className="text-2xl font-bold text-[#2c7d32]">Analysis Results</h2>
                </div>
                
                <div className="mb-8 bg-muted/30 p-6 rounded-lg">
                  <div className="flex flex-col gap-6">
                    <div className="w-full bg-muted p-5 rounded-lg shadow-inner">
                      <div className="flex justify-between mb-2">
                        <span className="text-lg font-medium">Soil Health Score</span>
                        <span className="text-lg font-medium">{soilHealth !== null ? `${soilHealth}/100` : "Not analyzed"}</span>
                      </div>
                      <div className="relative h-6 w-full overflow-hidden rounded-full bg-secondary mb-2">
                        <div 
                          className={`h-full transition-all ${getHealthColor(soilHealth)}`} 
                          style={{ width: `${soilHealth ?? 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>20</span>
                        <span>40</span>
                        <span>60</span>
                        <span>80</span>
                        <span>100</span>
                      </div>
                      {soilHealth !== null && (
                        <p className="text-center mt-3 font-medium text-lg">
                          Status: <span className={`
                            ${soilHealth >= 80 ? 'text-green-500' : 
                              soilHealth >= 60 ? 'text-green-400' : 
                              soilHealth >= 40 ? 'text-yellow-500' : 
                              soilHealth >= 20 ? 'text-orange-500' : 'text-red-500'}
                          `}>
                            {getHealthStatus(soilHealth)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              
                {/* Best Crop Recommendation */}
                {recommendedCrop && (
                  <div className="max-w-2xl mx-auto mb-8">
                    <Card className="border-l-4 border-l-[#2c7d32] shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-xl">
                          <span className="mr-3 text-2xl">🌱</span>
                          Recommended Crop
                        </CardTitle>
                        <CardDescription>Best match for your soil conditions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-[#e8f5e9] p-4 rounded-lg mb-4">
                          <p className="text-[#2c7d32] font-medium text-xl text-center">
                            {recommendedCrop}
                          </p>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">General Care Instructions:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Maintain appropriate soil moisture based on crop requirements</li>
                            <li>Apply balanced fertilizer according to soil test recommendations</li>
                            <li>Monitor for pests and diseases regularly</li>
                            <li>Ensure proper spacing between plants for adequate growth</li>
                            <li>Follow local agricultural extension guidelines for best practices</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Additional Actions */}
                {soilHealth !== null && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                    <Button 
                      onClick={goToFertilizerRecommendation}
                      className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-md flex items-center gap-2"
                    >
                      <Beaker className="h-5 w-5" />
                      Get Fertilizer Recommendations
                    </Button>
                  </div>
                )}
                
                {/* Analyze Button (for when data exists but no analysis yet) */}
                {!soilHealth && !recommendedCrop && (
                  <div className="flex justify-center mb-8">
                    <Button 
                      onClick={handleSubmit}
                      className="h-14 px-6 bg-[#2c7d32] hover:bg-[#388e3c] text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Leaf className="mr-2 h-5 w-5" /> Analyze Soil
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Dashboard Content */}
              <SoilDashboard formData={formData} />
            </div>
          ) : (
            <div className="text-center p-12 border border-[#c8c8c9] rounded-lg">
              <div className="mb-4 text-muted-foreground">
                <AlertCircle className="h-16 w-16 mx-auto mb-2" />
                <p className="text-lg">No soil data available</p>
              </div>
              <p className="max-w-md mx-auto mb-6">Either enter your soil parameters manually in the Input Form tab or use the "Fetch Sample Data" button to generate sample data.</p>
              <Button 
                onClick={() => setActiveTab("input-form")}
                className="bg-[#2c7d32] hover:bg-[#388e3c]"
              >
                Go to Input Form
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="animate-fade-in">
          {Object.values(formData).some(value => value > 0) ? (
            <div className="space-y-8">
              <div className="enhanced-tile bg-background p-6 rounded-lg">
                <div className="flex items-center mb-6">
                  <ChartBar className="mr-2 h-6 w-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-amber-600">Harvest Statistics</h2>
                </div>
                
                {recommendedCrop ? (
                  <HarvestStats crop={recommendedCrop} temperature={formData.Temperature_C} />
                ) : (
                  <div className="text-center p-8 border border-dashed border-amber-300 rounded-lg bg-amber-50/50">
                    <p className="text-lg text-amber-800 mb-4">Please complete soil analysis to view harvest statistics</p>
                    <Button 
                      onClick={() => {
                        if (Object.values(formData).every(value => value > 0)) {
                          handleSubmit(new Event('submit') as any);
                        } else {
                          setActiveTab("input-form");
                        }
                      }}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {Object.values(formData).every(value => value > 0) ? "Analyze Soil" : "Enter Soil Data"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-12 border border-[#c8c8c9] rounded-lg">
              <div className="mb-4 text-muted-foreground">
                <AlertCircle className="h-16 w-16 mx-auto mb-2" />
                <p className="text-lg">No soil data available</p>
              </div>
              <p className="max-w-md mx-auto mb-6">Either enter your soil parameters manually in the Input Form tab or use the "Fetch Sample Data" button to generate sample data.</p>
              <Button 
                onClick={() => setActiveTab("input-form")}
                className="bg-[#2c7d32] hover:bg-[#388e3c]"
              >
                Go to Input Form
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SoilAnalysis;
