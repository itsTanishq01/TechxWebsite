
import { Droplet, Braces, FlaskConical, Thermometer, Gauge, CloudRain, Wind, Sun } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SoilDashboardProps {
  formData: {
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
  };
}

// Soil data interpretation helpers
const getStatus = (value: number, ranges: {min: number; max: number; status: string}[]): string => {
  for (const range of ranges) {
    if (value >= range.min && value <= range.max) {
      return range.status;
    }
  }
  return "Unknown";
};

// Progress bar color based on status
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "optimal":
      return "bg-green-500";
    case "good":
      return "bg-green-400";
    case "adequate":
      return "bg-blue-400";
    case "excellent":
      return "bg-green-600";
    case "safe":
      return "bg-blue-500";
    case "high":
      return "bg-yellow-500";
    case "needs attention":
      return "bg-orange-500";
    case "low":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

// Calculate progress percentage based on standard ranges
const getProgressPercentage = (value: number, min: number, max: number): number => {
  const percentage = ((value - min) / (max - min)) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

// Dashboard parameter card
const ParameterCard = ({ 
  icon, 
  title, 
  description, 
  value, 
  unit, 
  status, 
  progressPercent 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  value: string | number; 
  unit: string; 
  status: string; 
  progressPercent: number;
}) => (
  <div className="rounded-lg bg-black/10 dark:bg-white/5 border border-[#c8c8c9] dark:border-border p-4 flex flex-col">
    <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
      {icon}
      <span>{description}</span>
    </div>
    <h3 className="text-lg font-bold">{title}</h3>
    <div className="text-2xl font-semibold mb-3">
      {value} {unit}
    </div>
    <Progress value={progressPercent} className={`${getStatusColor(status)} h-2`} />
    <div className="mt-2 text-sm">Status: {status}</div>
  </div>
);

export const SoilDashboard = ({ formData }: SoilDashboardProps) => {
  // Determine soil texture (this would normally require more complex calculation)
  const soilTexture = "Clay Loam";
  const soilTextureDescription = "Ideal for water retention and nutrient holding";
  
  // Calculate statuses
  const moistureStatus = getStatus(formData.Soil_Moisture_, [
    { min: 0, max: 10, status: "Low" },
    { min: 10, max: 20, status: "Adequate" },
    { min: 20, max: 30, status: "Good" },
    { min: 30, max: 40, status: "Optimal" },
    { min: 40, max: 100, status: "High" }
  ]);
  
  const densityStatus = getStatus(formData.Bulk_Density_g_cm3, [
    { min: 0, max: 1.0, status: "Low" },
    { min: 1.0, max: 1.3, status: "Good" },
    { min: 1.3, max: 1.6, status: "Adequate" },
    { min: 1.6, max: 2.0, status: "Needs Attention" }
  ]);
  
  const porosityStatus = getStatus(formData.Porosity_, [
    { min: 0, max: 30, status: "Low" },
    { min: 30, max: 45, status: "Adequate" },
    { min: 45, max: 55, status: "Good" },
    { min: 55, max: 100, status: "Excellent" }
  ]);
  
  const whcStatus = getStatus(formData.Water_Holding_Capacity_, [
    { min: 0, max: 20, status: "Low" },
    { min: 20, max: 30, status: "Adequate" },
    { min: 30, max: 40, status: "Good" },
    { min: 40, max: 100, status: "Excellent" }
  ]);
  
  const phStatus = getStatus(formData.pH_Level, [
    { min: 0, max: 5.5, status: "Acidic" },
    { min: 5.5, max: 6.5, status: "Slightly Acidic" },
    { min: 6.5, max: 7.5, status: "Optimal" },
    { min: 7.5, max: 8.5, status: "Slightly Alkaline" },
    { min: 8.5, max: 14, status: "Alkaline" }
  ]);
  
  const ecStatus = getStatus(formData.Electrical_Conductivity_dS_m, [
    { min: 0, max: 1.0, status: "Safe" },
    { min: 1.0, max: 2.0, status: "Adequate" },
    { min: 2.0, max: 3.0, status: "Needs Attention" },
    { min: 3.0, max: 10, status: "High" }
  ]);
  
  const ocStatus = getStatus(formData.Organic_Carbon_, [
    { min: 0, max: 0.5, status: "Low" },
    { min: 0.5, max: 1.0, status: "Adequate" },
    { min: 1.0, max: 2.0, status: "Good" },
    { min: 2.0, max: 10, status: "Optimal" }
  ]);
  
  const nitrogenStatus = getStatus(formData.Nitrogen_mg_kg, [
    { min: 0, max: 50, status: "Low" },
    { min: 50, max: 100, status: "Adequate" },
    { min: 100, max: 200, status: "Good" },
    { min: 200, max: 1000, status: "Optimal" }
  ]);
  
  const phosphorusStatus = getStatus(formData.Phosphorus_mg_kg, [
    { min: 0, max: 10, status: "Low" },
    { min: 10, max: 20, status: "Needs Attention" },
    { min: 20, max: 40, status: "Adequate" },
    { min: 40, max: 100, status: "Optimal" }
  ]);
  
  const potassiumStatus = getStatus(formData.Potassium_mg_kg, [
    { min: 0, max: 50, status: "Low" },
    { min: 50, max: 100, status: "Adequate" },
    { min: 100, max: 200, status: "Good" },
    { min: 200, max: 1000, status: "Optimal" }
  ]);
  
  const sulfurStatus = getStatus(formData.Sulfur_mg_kg, [
    { min: 0, max: 10, status: "Low" },
    { min: 10, max: 20, status: "Adequate" },
    { min: 20, max: 40, status: "Good" },
    { min: 40, max: 100, status: "Optimal" }
  ]);
  
  const calciumStatus = getStatus(formData.Calcium_mg_kg, [
    { min: 0, max: 500, status: "Low" },
    { min: 500, max: 1000, status: "Adequate" },
    { min: 1000, max: 2000, status: "Good" },
    { min: 2000, max: 5000, status: "Optimal" }
  ]);
  
  const magnesiumStatus = getStatus(formData.Magnesium_mg_kg, [
    { min: 0, max: 100, status: "Low" },
    { min: 100, max: 250, status: "Adequate" },
    { min: 250, max: 500, status: "Good" },
    { min: 500, max: 1000, status: "Optimal" }
  ]);
  
  const temperatureStatus = getStatus(formData.Temperature_C, [
    { min: 0, max: 15, status: "Cool" },
    { min: 15, max: 25, status: "Optimal" },
    { min: 25, max: 35, status: "Warm" },
    { min: 35, max: 50, status: "Hot" }
  ]);
  
  const rainfallStatus = getStatus(formData.Rainfall_mm, [
    { min: 0, max: 300, status: "Low" },
    { min: 300, max: 600, status: "Adequate" },
    { min: 600, max: 1000, status: "Good" },
    { min: 1000, max: 2000, status: "High" }
  ]);
  
  const humidityStatus = getStatus(formData.Humidity_, [
    { min: 0, max: 30, status: "Low" },
    { min: 30, max: 50, status: "Adequate" },
    { min: 50, max: 70, status: "Good" },
    { min: 70, max: 100, status: "High" }
  ]);
  
  const solarRadiationStatus = getStatus(formData.Solar_Radiation_W_m2, [
    { min: 0, max: 300, status: "Low" },
    { min: 300, max: 600, status: "Adequate" },
    { min: 600, max: 900, status: "Good" },
    { min: 900, max: 2000, status: "High" }
  ]);

  return (
    <div className="animate-fade-in">
      <div className="enhanced-tile bg-background p-6 rounded-lg mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#2c7d32] mb-6">Soil Properties Dashboard</h2>
          
          {/* Soil Texture Card */}
          <div className="bg-black/10 dark:bg-white/5 border border-[#c8c8c9] dark:border-border rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <FlaskConical size={16} />
              <span>Physical composition of soil</span>
            </div>
            <h3 className="text-lg font-bold">Soil Texture</h3>
            <div className="text-2xl font-semibold mb-1">{soilTexture}</div>
            <p className="text-sm text-muted-foreground">{soilTextureDescription}</p>
          </div>
          
          {/* Parameter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ParameterCard
              icon={<Droplet size={16} />}
              title="Soil Moisture"
              description="Current water content in soil"
              value={formData.Soil_Moisture_}
              unit="%"
              status={moistureStatus}
              progressPercent={getProgressPercentage(formData.Soil_Moisture_, 0, 40)}
            />
            
            <ParameterCard
              icon={<Braces size={16} />}
              title="Bulk Density"
              description="Soil compaction measure"
              value={formData.Bulk_Density_g_cm3}
              unit="g/cm³"
              status={densityStatus}
              progressPercent={getProgressPercentage(formData.Bulk_Density_g_cm3, 0.5, 2.0)}
            />
            
            <ParameterCard
              icon={<Braces size={16} />}
              title="Porosity"
              description="Space for air and water"
              value={formData.Porosity_}
              unit="%"
              status={porosityStatus}
              progressPercent={getProgressPercentage(formData.Porosity_, 0, 60)}
            />
            
            <ParameterCard
              icon={<Droplet size={16} />}
              title="Water Holding Capacity"
              description="Ability to retain water"
              value={formData.Water_Holding_Capacity_}
              unit="%"
              status={whcStatus}
              progressPercent={getProgressPercentage(formData.Water_Holding_Capacity_, 0, 50)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Soil pH"
              description="Acidity/alkalinity level"
              value={formData.pH_Level}
              unit=""
              status={phStatus}
              progressPercent={getProgressPercentage(formData.pH_Level, 0, 14)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Electrical Conductivity"
              description="Salt content measure"
              value={formData.Electrical_Conductivity_dS_m}
              unit="dS/m"
              status={ecStatus}
              progressPercent={getProgressPercentage(formData.Electrical_Conductivity_dS_m, 0, 4)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Organic Carbon"
              description="Soil organic matter"
              value={formData.Organic_Carbon_}
              unit="%"
              status={ocStatus}
              progressPercent={getProgressPercentage(formData.Organic_Carbon_, 0, 3)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Nitrogen (N)"
              description="Essential for plant growth"
              value={formData.Nitrogen_mg_kg}
              unit="mg/kg"
              status={nitrogenStatus}
              progressPercent={getProgressPercentage(formData.Nitrogen_mg_kg, 0, 300)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Phosphorus (P)"
              description="Important for root development"
              value={formData.Phosphorus_mg_kg}
              unit="mg/kg"
              status={phosphorusStatus}
              progressPercent={getProgressPercentage(formData.Phosphorus_mg_kg, 0, 60)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Potassium (K)"
              description="Enhances plant resilience"
              value={formData.Potassium_mg_kg}
              unit="mg/kg"
              status={potassiumStatus}
              progressPercent={getProgressPercentage(formData.Potassium_mg_kg, 0, 500)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Sulfur (S)"
              description="Secondary nutrient"
              value={formData.Sulfur_mg_kg}
              unit="mg/kg"
              status={sulfurStatus}
              progressPercent={getProgressPercentage(formData.Sulfur_mg_kg, 0, 40)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Calcium (Ca)"
              description="Secondary nutrient"
              value={formData.Calcium_mg_kg}
              unit="mg/kg"
              status={calciumStatus}
              progressPercent={getProgressPercentage(formData.Calcium_mg_kg, 0, 3000)}
            />
            
            <ParameterCard
              icon={<FlaskConical size={16} />}
              title="Magnesium (Mg)"
              description="Secondary nutrient"
              value={formData.Magnesium_mg_kg}
              unit="mg/kg"
              status={magnesiumStatus}
              progressPercent={getProgressPercentage(formData.Magnesium_mg_kg, 0, 500)}
            />
            
            <ParameterCard
              icon={<Thermometer size={16} />}
              title="Soil Temperature"
              description="Current soil temperature"
              value={formData.Temperature_C}
              unit="°C"
              status={temperatureStatus}
              progressPercent={getProgressPercentage(formData.Temperature_C, 0, 35)}
            />
            
            <ParameterCard
              icon={<CloudRain size={16} />}
              title="Rainfall"
              description="Recent precipitation"
              value={formData.Rainfall_mm}
              unit="mm"
              status={rainfallStatus}
              progressPercent={getProgressPercentage(formData.Rainfall_mm, 0, 1500)}
            />
            
            <ParameterCard
              icon={<Wind size={16} />}
              title="Humidity"
              description="Atmospheric moisture"
              value={formData.Humidity_}
              unit="%"
              status={humidityStatus}
              progressPercent={getProgressPercentage(formData.Humidity_, 0, 90)}
            />
            
            <ParameterCard
              icon={<Sun size={16} />}
              title="Solar Radiation"
              description="Sunlight intensity"
              value={formData.Solar_Radiation_W_m2}
              unit="W/m²"
              status={solarRadiationStatus}
              progressPercent={getProgressPercentage(formData.Solar_Radiation_W_m2, 0, 1200)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilDashboard;
