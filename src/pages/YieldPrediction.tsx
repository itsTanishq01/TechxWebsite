import { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Droplet, Leaf, MountainSnow, Thermometer, Gauge, Wheat, Database, History } from "lucide-react";
import { YieldResult } from "@/components/yield-prediction/YieldResult";
import { YieldPredictionHistory } from "@/components/yield-prediction/YieldPredictionHistory";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FormValues {
  cropType: string;
  region: string;
  soilPh: string;
  nitrogen: string;
  organicMatter: string;
  rainfall: string;
  temperature: string;
  humidity: string;
}

const initialFormValues: FormValues = {
  cropType: "",
  region: "",
  soilPh: "",
  nitrogen: "",
  organicMatter: "",
  rainfall: "",
  temperature: "",
  humidity: ""
};

// Helper function to generate random value within a range
const getRandomValue = (min: number, max: number, decimals = 0): string => {
  const value = min + Math.random() * (max - min);
  return decimals === 0 ? Math.round(value).toString() : value.toFixed(decimals);
};

const YieldPrediction = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ yield: number; confidence: number } | null>(null);
  const [isOpenSoil, setIsOpenSoil] = useState(true);
  const [isOpenClimate, setIsOpenClimate] = useState(true);
  const [activeTab, setActiveTab] = useState("input");
  const resultRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const handleInputChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const fetchSampleData = () => {
    // Generate random values each time
    const randomSampleData: FormValues = {
      cropType: "wheat",
      region: "north",
      soilPh: getRandomValue(5.0, 8.0, 1),
      nitrogen: getRandomValue(80, 200),
      organicMatter: getRandomValue(2.0, 5.0, 1),
      rainfall: getRandomValue(500, 1200),
      temperature: getRandomValue(15, 30, 1),
      humidity: getRandomValue(40, 80)
    };
    
    setFormValues(randomSampleData);
    toast({
      title: "Sample Data Loaded",
      description: "Random sample values have been loaded into the form. You can modify them before submitting.",
    });
  };

  const savePredictionToDatabase = async (predictionData: {
    yield: number;
    confidence: number;
  }) => {
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, skipping save to database");
      return;
    }

    try {
      const { error } = await supabase.from('yield_predictions').insert({
        user_id: user.id,
        crop_type: formValues.cropType || "wheat",
        region: formValues.region || "north",
        soil_ph: parseFloat(formValues.soilPh),
        nitrogen: parseFloat(formValues.nitrogen),
        organic_matter: parseFloat(formValues.organicMatter),
        rainfall: parseFloat(formValues.rainfall),
        temperature: parseFloat(formValues.temperature),
        humidity: parseFloat(formValues.humidity),
        predicted_yield: predictionData.yield,
        confidence_score: predictionData.confidence
      });

      if (error) throw error;

      toast({
        title: "Prediction Saved",
        description: "Your yield prediction has been saved to your history.",
      });
    } catch (error: any) {
      console.error("Error saving prediction:", error);
      toast({
        title: "Failed to Save",
        description: error.message || "There was an error saving your prediction.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = Object.entries(formValues);
    const emptyFields = requiredFields.filter(([_, value]) => !value);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        crop_type: formValues.cropType,
        region: formValues.region,
        soil_ph: parseFloat(formValues.soilPh),
        nitrogen: parseFloat(formValues.nitrogen),
        organic_matter: parseFloat(formValues.organicMatter),
        rainfall: parseFloat(formValues.rainfall),
        temperature: parseFloat(formValues.temperature),
        humidity: parseFloat(formValues.humidity)
      };

      console.log("Sending payload:", payload);

      let data;
      try {
        const response = await fetch('https://techxyieldprediction.onrender.com/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        data = await response.json();
        console.log("Received prediction data:", data);
      } catch (error) {
        console.error("Error predicting yield:", error);
        toast({
          title: "Using Sample Data",
          description: "Unable to connect to prediction service. Using sample prediction data instead.",
          variant: "destructive",
        });
        
        const mockYield = 3.5 + (Math.random() * 2);
        const mockConfidence = 0.6 + (Math.random() * 0.3);
        data = {
          predicted_yield: mockYield,
          confidence_score: mockConfidence
        };
      }
      
      const predictionResult = {
        yield: data.predicted_yield,
        confidence: data.confidence_score 
      };
      
      setPrediction(predictionResult);

      // Save prediction to database
      if (isAuthenticated && user) {
        await savePredictionToDatabase(predictionResult);
      }

      // Switch to results tab
      setActiveTab("results");

      toast({
        title: "Prediction Complete",
        description: "Your yield prediction has been calculated successfully.",
      });
    } catch (error) {
      console.error("Error predicting yield:", error);
      toast({
        title: "Prediction Failed",
        description: "There was an error calculating your yield prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormValues(initialFormValues);
    setPrediction(null);
    setActiveTab("input");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Crop Yield Prediction</h1>
          <p className="text-muted-foreground">
            Enter your farm details to get an accurate prediction of your crop yield
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="input">Input Data</TabsTrigger>
            <TabsTrigger value="results" disabled={!prediction}>Results</TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="mt-0">
            <div className="flex justify-center mb-6">
              <Button 
                onClick={fetchSampleData} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                Fetch Sample Data
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <Collapsible
                open={isOpenSoil}
                onOpenChange={setIsOpenSoil}
                className="mb-6 border rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-medium">Soil Properties</h2>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isOpenSoil ? "transform rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="soilPh">
                        Soil pH
                      </Label>
                      <Input
                        id="soilPh"
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        placeholder="6.5"
                        value={formValues.soilPh}
                        onChange={(e) => handleInputChange("soilPh", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Typical range: 5.5-8.0</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nitrogen">
                        Nitrogen (kg/ha)
                      </Label>
                      <Input
                        id="nitrogen"
                        type="number"
                        min="0"
                        placeholder="120"
                        value={formValues.nitrogen}
                        onChange={(e) => handleInputChange("nitrogen", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Typical range: 80-200 kg/ha</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organicMatter">
                        Organic Matter (%)
                      </Label>
                      <Input
                        id="organicMatter"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        placeholder="3.5"
                        value={formValues.organicMatter}
                        onChange={(e) => handleInputChange("organicMatter", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Typical range: 2-5%</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={isOpenClimate}
                onOpenChange={setIsOpenClimate}
                className="mb-6 border rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-background hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <MountainSnow className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-medium">Climate Conditions</h2>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isOpenClimate ? "transform rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rainfall" className="flex items-center gap-2">
                        <Droplet className="h-4 w-4" /> Rainfall (mm)
                      </Label>
                      <Input
                        id="rainfall"
                        type="number"
                        min="0"
                        placeholder="800"
                        value={formValues.rainfall}
                        onChange={(e) => handleInputChange("rainfall", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Annual average</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature" className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4" /> Temperature (°C)
                      </Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="-20"
                        max="50"
                        placeholder="25"
                        value={formValues.temperature}
                        onChange={(e) => handleInputChange("temperature", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Average growing season</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="humidity" className="flex items-center gap-2">
                        <Gauge className="h-4 w-4" /> Humidity (%)
                      </Label>
                      <Input
                        id="humidity"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="65"
                        value={formValues.humidity}
                        onChange={(e) => handleInputChange("humidity", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Average growing season</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="hidden">
                <input 
                  type="text" 
                  value={formValues.cropType || "wheat"} 
                  onChange={(e) => handleInputChange("cropType", e.target.value)} 
                />
                <input 
                  type="text" 
                  value={formValues.region || "north"} 
                  onChange={(e) => handleInputChange("region", e.target.value)} 
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className="min-w-[150px]"
                >
                  {isLoading ? "Calculating..." : "Predict Yield"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={resetForm}
                  className="min-w-[150px]"
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="results" className="mt-0">
            {prediction && (
              <div ref={resultRef} className="scroll-mt-20">
                <YieldResult 
                  yieldValue={prediction.yield} 
                  confidence={prediction.confidence} 
                  cropType={formValues.cropType || "wheat"}
                />
                
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={() => setActiveTab("input")} 
                    variant="outline"
                    className="min-w-[150px] mr-2"
                  >
                    Back to Input
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("history")} 
                    variant="outline"
                    className="min-w-[150px]"
                  >
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <YieldPredictionHistory />
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => setActiveTab("input")} 
                variant="outline"
                className="min-w-[150px]"
              >
                Back to Input
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default YieldPrediction;

