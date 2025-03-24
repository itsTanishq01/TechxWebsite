
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Thermometer, Droplet, Leaf, Beaker } from "lucide-react";
import { cn } from "@/lib/utils";

interface NutrientCondition {
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
  "Temperature_C"?: number;
  "Temperature (°C)"?: number;
  "Humidity_%"?: number;
  "Humidity (%)"?: number;
  pH: number;
  "Rainfall_mm"?: number;
  "Rainfall (mm)"?: number;
}

interface CropInfo {
  ideal_conditions: NutrientCondition;
  best_practices: string[];
}

interface CropData {
  [category: string]: {
    [cropName: string]: CropInfo;
  };
}

const cropData: CropData = {
  "Fruits": {
    "Mango": {
      "ideal_conditions": {
        "Nitrogen": 150,
        "Phosphorus": 50,
        "Potassium": 150,
        "Temperature_C": 24,
        "Humidity_%": 60,
        "pH": 5.5,
        "Rainfall_mm": 1000
      },
      "best_practices": [
        "Prune regularly to maintain tree health.",
        "Apply organic manure during the flowering stage.",
        "Ensure well-drained soil to prevent root rot."
      ]
    },
    "Banana": {
      "ideal_conditions": {
        "Nitrogen": 200,
        "Phosphorus": 60,
        "Potassium": 250,
        "Temperature_C": 27,
        "Humidity_%": 75,
        "pH": 6.5,
        "Rainfall_mm": 2000
      },
      "best_practices": [
        "Use drip irrigation for efficient water management.",
        "Apply potassium-rich fertilizers for better fruit quality.",
        "Protect from strong winds using windbreaks."
      ]
    },
    "Apple": {
      "ideal_conditions": {
        "Nitrogen": 100,
        "Phosphorus": 40,
        "Potassium": 150,
        "Temperature_C": 15,
        "Humidity_%": 50,
        "pH": 6.0,
        "Rainfall_mm": 1200
      },
      "best_practices": [
        "Prune trees to improve air circulation and sunlight penetration.",
        "Apply calcium sprays to prevent bitter pit disorder.",
        "Use mulch to retain soil moisture and suppress weeds."
      ]
    },
    "Grapes": {
      "ideal_conditions": {
        "Nitrogen": 80,
        "Phosphorus": 30,
        "Potassium": 150,
        "Temperature_C": 22,
        "Humidity_%": 55,
        "pH": 6.5,
        "Rainfall_mm": 900
      },
      "best_practices": [
        "Train vines properly to maximize sunlight exposure.",
        "Apply fungicides to prevent powdery mildew.",
        "Harvest at the right sugar-acid balance for best quality."
      ]
    },
    "Orange": {
      "ideal_conditions": {
        "Nitrogen": 120,
        "Phosphorus": 40,
        "Potassium": 180,
        "Temperature_C": 25,
        "Humidity_%": 65,
        "pH": 6.0,
        "Rainfall_mm": 1500
      },
      "best_practices": [
        "Use drip irrigation to maintain consistent soil moisture.",
        "Apply micronutrients like zinc and iron for healthy fruiting.",
        "Control pests like citrus psyllid to prevent disease."
      ]
    },
    "Guava": {
      "ideal_conditions": {
        "Nitrogen": 100,
        "Phosphorus": 30,
        "Potassium": 120,
        "Temperature_C": 23,
        "Humidity_%": 70,
        "pH": 6.5,
        "Rainfall_mm": 1200
      },
      "best_practices": [
        "Prune trees to increase fruit yield and reduce disease risks.",
        "Apply organic mulch to conserve moisture.",
        "Use balanced fertilization with nitrogen and potassium."
      ]
    },
    "Pomegranate": {
      "ideal_conditions": {
        "Nitrogen": 90,
        "Phosphorus": 40,
        "Potassium": 150,
        "Temperature_C": 28,
        "Humidity_%": 50,
        "pH": 6.5,
        "Rainfall_mm": 500
      },
      "best_practices": [
        "Train branches for better sunlight penetration.",
        "Use organic mulch to retain soil moisture.",
        "Apply potassium-rich fertilizers for better fruit set."
      ]
    },
    "Papaya": {
      "ideal_conditions": {
        "Nitrogen": 150,
        "Phosphorus": 60,
        "Potassium": 200,
        "Temperature_C": 26,
        "Humidity_%": 80,
        "pH": 6.5,
        "Rainfall_mm": 1500
      },
      "best_practices": [
        "Avoid water stagnation to prevent root rot.",
        "Regularly monitor for viral diseases like papaya ringspot virus.",
        "Provide staking support for young plants."
      ]
    },
    "Pineapple": {
      "ideal_conditions": {
        "Nitrogen": 100,
        "Phosphorus": 40,
        "Potassium": 250,
        "Temperature_C": 30,
        "Humidity_%": 75,
        "pH": 5.5,
        "Rainfall_mm": 1200
      },
      "best_practices": [
        "Maintain proper spacing for airflow and disease control.",
        "Apply nitrogen fertilizers for faster vegetative growth.",
        "Mulch to control weeds and conserve moisture."
      ]
    },
    "Watermelon": {
      "ideal_conditions": {
        "Nitrogen": 80,
        "Phosphorus": 50,
        "Potassium": 180,
        "Temperature_C": 28,
        "Humidity_%": 65,
        "pH": 6.5,
        "Rainfall_mm": 800
      },
      "best_practices": [
        "Ensure well-drained soil to prevent root diseases.",
        "Use plastic mulch to conserve soil moisture.",
        "Irrigate at flowering and fruiting stages for better yield."
      ]
    },
    "Muskmelon": {
      "ideal_conditions": {
        "Nitrogen": 70,
        "Phosphorus": 40,
        "Potassium": 160,
        "Temperature_C": 27,
        "Humidity_%": 60,
        "pH": 6.5,
        "Rainfall_mm": 750
      },
      "best_practices": [
        "Provide trellis support for better fruit quality.",
        "Use drip irrigation to maintain consistent soil moisture.",
        "Control pests like aphids to prevent viral diseases."
      ]
    },
    "Lemon": {
      "ideal_conditions": {
        "Nitrogen": 120,
        "Phosphorus": 50,
        "Potassium": 150,
        "Temperature_C": 25,
        "Humidity_%": 60,
        "pH": 6.0,
        "Rainfall_mm": 1400
      },
      "best_practices": [
        "Prune to shape and improve air circulation.",
        "Apply organic compost for better soil fertility.",
        "Protect from citrus leaf miner and aphids."
      ]
    },
    "Litchi": {
      "ideal_conditions": {
        "Nitrogen": 100,
        "Phosphorus": 40,
        "Potassium": 120,
        "Temperature_C": 22,
        "Humidity_%": 70,
        "pH": 6.5,
        "Rainfall_mm": 1500
      },
      "best_practices": [
        "Maintain high humidity to prevent fruit cracking.",
        "Apply organic manure during flowering.",
        "Provide wind protection to avoid flower drop."
      ]
    },
    "Jackfruit": {
      "ideal_conditions": {
        "Nitrogen": 120,
        "Phosphorus": 40,
        "Potassium": 200,
        "Temperature_C": 28,
        "Humidity_%": 75,
        "pH": 6.0,
        "Rainfall_mm": 1800
      },
      "best_practices": [
        "Use organic mulch to retain soil moisture.",
        "Regularly prune to encourage fruiting.",
        "Apply fertilizers with micronutrients for better growth."
      ]
    },
    "Coconut": {
      "ideal_conditions": {
        "Nitrogen": 150,
        "Phosphorus": 60,
        "Potassium": 250,
        "Temperature_C": 30,
        "Humidity_%": 80,
        "pH": 6.0,
        "Rainfall_mm": 2000
      },
      "best_practices": [
        "Apply salt or potassium to increase yield.",
        "Provide irrigation during drought periods.",
        "Protect young seedlings from pests like rhinoceros beetles."
      ]
    }
  },
  "Crops": {
    "Rice": {
      "ideal_conditions": {
        "Nitrogen": 80.5,
        "Phosphorus": 45.3,
        "Potassium": 40.1,
        "Temperature (°C)": 24.5,
        "Humidity (%)": 82.5,
        "pH": 6.5,
        "Rainfall (mm)": 230.2
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Wheat": {
      "ideal_conditions": {
        "Nitrogen": 75.2,
        "Phosphorus": 50.7,
        "Potassium": 42.8,
        "Temperature (°C)": 20.2,
        "Humidity (%)": 60.3,
        "pH": 6.8,
        "Rainfall (mm)": 120.5
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Maize": {
      "ideal_conditions": {
        "Nitrogen": 78.4,
        "Phosphorus": 48.6,
        "Potassium": 39.5,
        "Temperature (°C)": 22.5,
        "Humidity (%)": 65.9,
        "pH": 6.3,
        "Rainfall (mm)": 85.7
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Sugarcane": {
      "ideal_conditions": {
        "Nitrogen": 120.3,
        "Phosphorus": 60.5,
        "Potassium": 55.7,
        "Temperature (°C)": 28.5,
        "Humidity (%)": 75.3,
        "pH": 5.9,
        "Rainfall (mm)": 180.6
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Cotton": {
      "ideal_conditions": {
        "Nitrogen": 110.7,
        "Phosphorus": 47.9,
        "Potassium": 50.3,
        "Temperature (°C)": 25.1,
        "Humidity (%)": 78.5,
        "pH": 6.7,
        "Rainfall (mm)": 90.4
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Chickpea (Gram)": {
      "ideal_conditions": {
        "Nitrogen": 42.5,
        "Phosphorus": 68.2,
        "Potassium": 75.1,
        "Temperature (°C)": 18.9,
        "Humidity (%)": 55.8,
        "pH": 7.2,
        "Rainfall (mm)": 82.3
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Pigeon Peas (Arhar/Tur)": {
      "ideal_conditions": {
        "Nitrogen": 20.5,
        "Phosphorus": 65.3,
        "Potassium": 22.7,
        "Temperature (°C)": 27.1,
        "Humidity (%)": 50.4,
        "pH": 6.4,
        "Rainfall (mm)": 130.7
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Groundnut": {
      "ideal_conditions": {
        "Nitrogen": 25.7,
        "Phosphorus": 52.9,
        "Potassium": 28.4,
        "Temperature (°C)": 29.3,
        "Humidity (%)": 45.6,
        "pH": 6.1,
        "Rainfall (mm)": 100.2
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Mustard": {
      "ideal_conditions": {
        "Nitrogen": 30.4,
        "Phosphorus": 58.1,
        "Potassium": 35.6,
        "Temperature (°C)": 22.7,
        "Humidity (%)": 40.2,
        "pH": 6.7,
        "Rainfall (mm)": 75.8
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Barley": {
      "ideal_conditions": {
        "Nitrogen": 65.9,
        "Phosphorus": 48.5,
        "Potassium": 41.3,
        "Temperature (°C)": 19.5,
        "Humidity (%)": 58.9,
        "pH": 6.9,
        "Rainfall (mm)": 110.6
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Jowar (Sorghum)": {
      "ideal_conditions": {
        "Nitrogen": 55.2,
        "Phosphorus": 49.6,
        "Potassium": 38.7,
        "Temperature (°C)": 26.3,
        "Humidity (%)": 54.1,
        "pH": 6.5,
        "Rainfall (mm)": 90.3
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Bajra (Pearl Millet)": {
      "ideal_conditions": {
        "Nitrogen": 50.1,
        "Phosphorus": 46.2,
        "Potassium": 37.8,
        "Temperature (°C)": 28.0,
        "Humidity (%)": 42.7,
        "pH": 6.3,
        "Rainfall (mm)": 70.9
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Sunflower": {
      "ideal_conditions": {
        "Nitrogen": 40.6,
        "Phosphorus": 55.8,
        "Potassium": 45.7,
        "Temperature (°C)": 25.5,
        "Humidity (%)": 48.9,
        "pH": 6.2,
        "Rainfall (mm)": 95.5
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Soybean": {
      "ideal_conditions": {
        "Nitrogen": 78.3,
        "Phosphorus": 50.5,
        "Potassium": 47.2,
        "Temperature (°C)": 27.6,
        "Humidity (%)": 52.4,
        "pH": 6.4,
        "Rainfall (mm)": 105.3
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    },
    "Sesame": {
      "ideal_conditions": {
        "Nitrogen": 30.2,
        "Phosphorus": 45.1,
        "Potassium": 33.6,
        "Temperature (°C)": 30.0,
        "Humidity (%)": 38.5,
        "pH": 6.0,
        "Rainfall (mm)": 85.0
      },
      "best_practices": [
        "Use data-driven decision making for precision farming.",
        "Regularly monitor and adjust soil nutrients based on real-time conditions.",
        "Integrate IoT sensors and AI to improve yield predictions."
      ]
    }
  },
  "Vegetables": {
    "Potato": {
      "ideal_conditions": {
        "Nitrogen": 79.89,
        "Phosphorus": 47.88,
        "Potassium": 39.87,
        "Temperature (°C)": 23.19,
        "Humidity (%)": 82.17,
        "pH": 6.38,
        "Rainfall (mm)": 236.18
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Tomato": {
      "ideal_conditions": {
        "Nitrogen": 100.23,
        "Phosphorus": 82.01,
        "Potassium": 50.05,
        "Temperature (°C)": 27.38,
        "Humidity (%)": 80.36,
        "pH": 5.98,
        "Rainfall (mm)": 104.63
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Onion": {
      "ideal_conditions": {
        "Nitrogen": 20.75,
        "Phosphorus": 67.54,
        "Potassium": 20.05,
        "Temperature (°C)": 20.05,
        "Humidity (%)": 21.61,
        "pH": 5.78,
        "Rainfall (mm)": 105.92
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Brinjal": {
      "ideal_conditions": {
        "Nitrogen": 40.02,
        "Phosphorus": 67.47,
        "Potassium": 19.24,
        "Temperature (°C)": 29.12,
        "Humidity (%)": 65.12,
        "pH": 7.13,
        "Rainfall (mm)": 67.88
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Cauliflower": {
      "ideal_conditions": {
        "Nitrogen": 20.99,
        "Phosphorus": 47.28,
        "Potassium": 19.87,
        "Temperature (°C)": 28.27,
        "Humidity (%)": 85.95,
        "pH": 6.74,
        "Rainfall (mm)": 48.44
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Cabbage": {
      "ideal_conditions": {
        "Nitrogen": 101.2,
        "Phosphorus": 28.74,
        "Potassium": 29.94,
        "Temperature (°C)": 25.54,
        "Humidity (%)": 58.87,
        "pH": 6.81,
        "Rainfall (mm)": 158.07
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Carrot": {
      "ideal_conditions": {
        "Nitrogen": 23.18,
        "Phosphorus": 132.53,
        "Potassium": 200.11,
        "Temperature (°C)": 23.87,
        "Humidity (%)": 81.87,
        "pH": 6.25,
        "Rainfall (mm)": 69.91
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Green Peas": {
      "ideal_conditions": {
        "Nitrogen": 20.73,
        "Phosphorus": 67.73,
        "Potassium": 20.29,
        "Temperature (°C)": 27.74,
        "Humidity (%)": 48.06,
        "pH": 5.79,
        "Rainfall (mm)": 149.46
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Lady Finger": {
      "ideal_conditions": {
        "Nitrogen": 49.88,
        "Phosphorus": 59.05,
        "Potassium": 50.04,
        "Temperature (°C)": 33.72,
        "Humidity (%)": 92.4,
        "pH": 6.74,
        "Rainfall (mm)": 142.63
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    },
    "Spinach": {
      "ideal_conditions": {
        "Nitrogen": 18.77,
        "Phosphorus": 66.36,
        "Potassium": 19.41,
        "Temperature (°C)": 24.51,
        "Humidity (%)": 64.8,
        "pH": 6.99,
        "Rainfall (mm)": 45.68
      },
      "best_practices": [
        "Ensure proper soil testing before planting to maintain optimal nutrient balance.",
        "Maintain appropriate irrigation practices to avoid overwatering or drought stress.",
        "Regularly monitor pH levels to ensure they remain within the suitable range."
      ]
    }
  }
};

const CropInfoDashboard = ({ name, data }: { name: string; data: CropInfo }) => {
  const conditions = data.ideal_conditions;
  const temperature = conditions["Temperature_C"] || conditions["Temperature (°C)"] || 0;
  const humidity = conditions["Humidity_%"] || conditions["Humidity (%)"] || 0;
  const rainfall = conditions["Rainfall_mm"] || conditions["Rainfall (mm)"] || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Leaf className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold">{name}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Beaker className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Nutrients (ppm)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Nitrogen</span>
                  <span className="text-xl font-medium">{conditions.Nitrogen}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Phosphorus</span>
                  <span className="text-xl font-medium">{conditions.Phosphorus}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Potassium</span>
                  <span className="text-xl font-medium">{conditions.Potassium}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">pH</span>
                  <span className="text-xl font-medium">{conditions.pH}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">Environmental Conditions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-red-400" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Temperature</span>
                    <span className="text-xl font-medium">{temperature}°C</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplet className="h-4 w-4 text-blue-400" />
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Humidity</span>
                    <span className="text-xl font-medium">{humidity}%</span>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Rainfall</span>
                  <span className="text-xl font-medium">{rainfall} mm</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Best Practices</CardTitle>
          <CardDescription>Recommended approaches for optimal growth</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.best_practices.map((practice, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 mt-1 flex h-2 w-2 rounded-full bg-primary"></span>
                <span>{practice}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default function IdealConditions() {
  const [category, setCategory] = useState<keyof typeof cropData>("Fruits");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  
  useEffect(() => {
    if (!selectedCrop || !cropData[category][selectedCrop]) {
      const firstCropInCategory = Object.keys(cropData[category])[0];
      setSelectedCrop(firstCropInCategory);
    }
  }, [category, selectedCrop]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ideal Growing Conditions</h1>
          <p className="text-muted-foreground">
            Reference guide for optimal growing conditions for various crops and plants.
          </p>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="w-full md:w-1/3">
              <label className="text-sm font-medium mb-2 block">Select Category</label>
              <Select
                value={category as string}
                onValueChange={(value) => {
                  const strValue = String(value);
                  if (strValue in cropData) {
                    setCategory(strValue as keyof typeof cropData);
                    setSelectedCrop("");
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(cropData).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-2/3">
              <label className="text-sm font-medium mb-2 block">Select Crop</label>
              <Select
                value={selectedCrop}
                onValueChange={(value) => {
                  setSelectedCrop(String(value));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a crop" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(cropData[category] || {}).map((cropName) => (
                    <SelectItem key={cropName} value={cropName}>
                      {cropName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedCrop && cropData[category][selectedCrop] && (
            <CropInfoDashboard 
              name={selectedCrop} 
              data={cropData[category][selectedCrop]} 
            />
          )}
        </Card>
      </div>
    </div>
  );
}
