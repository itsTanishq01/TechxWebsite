
import React, { useState, useEffect } from "react";
import { Calendar, Wheat, Clock, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface HarvestStatsProps {
  crop: string | null;
  temperature: number;
}

interface CropInfo {
  name: string;
  baseTemperature: number;
  gddToHarvest: number;
  growingSeason: string;
  daysToHarvest: string;
}

const cropData: Record<string, CropInfo> = {
  "corn": {
    name: "Corn",
    baseTemperature: 10,
    gddToHarvest: 2700,
    growingSeason: "Spring-Summer",
    daysToHarvest: "80-100"
  },
  "millet": {
    name: "Millet",
    baseTemperature: 8,
    gddToHarvest: 1800,
    growingSeason: "Summer",
    daysToHarvest: "60-90"
  },
  "peanut": {
    name: "Peanut",
    baseTemperature: 10,
    gddToHarvest: 2500,
    growingSeason: "Spring-Summer",
    daysToHarvest: "120-150"
  },
  "rice": {
    name: "Rice",
    baseTemperature: 10,
    gddToHarvest: 2500,
    growingSeason: "Spring-Summer",
    daysToHarvest: "105-150"
  },
  "sugarcane": {
    name: "Sugarcane",
    baseTemperature: 12,
    gddToHarvest: 6000,
    growingSeason: "Year-round",
    daysToHarvest: "270-365"
  },
  "vegetable": {
    name: "Vegetable",
    baseTemperature: 8,
    gddToHarvest: 1500,
    growingSeason: "Varies by type",
    daysToHarvest: "50-120"
  },
  "wheat": {
    name: "Wheat",
    baseTemperature: 3,
    gddToHarvest: 2000,
    growingSeason: "Fall-Spring",
    daysToHarvest: "120-240"
  }
};

const HarvestStats: React.FC<HarvestStatsProps> = ({ crop, temperature }) => {
  const [minTemp, setMinTemp] = useState<number>(Math.max(0, temperature - 5));
  const [maxTemp, setMaxTemp] = useState<number>(Math.min(40, temperature + 5));
  const [daysInput, setDaysInput] = useState<number>(30);
  
  // Normalize crop name to match our data keys
  const normalizeCropName = (cropName: string | null): string => {
    if (!cropName) return "wheat"; // Default
    
    const lowerCrop = cropName.toLowerCase();
    
    // Handle common variations and extract the main crop name
    if (lowerCrop.includes("corn")) return "corn";
    if (lowerCrop.includes("maize")) return "corn";
    if (lowerCrop.includes("millet")) return "millet";
    if (lowerCrop.includes("peanut")) return "peanut";
    if (lowerCrop.includes("rice")) return "rice";
    if (lowerCrop.includes("cane")) return "sugarcane";
    if (lowerCrop.includes("sugar")) return "sugarcane";
    
    // Handle vegetables
    if (lowerCrop.includes("vegetable")) return "vegetable";
    if (lowerCrop.includes("tomato")) return "vegetable";
    if (lowerCrop.includes("potato")) return "vegetable";
    if (lowerCrop.includes("onion")) return "vegetable";
    if (lowerCrop.includes("lettuce")) return "vegetable";
    if (lowerCrop.includes("cabbage")) return "vegetable";
    
    // Handle grains
    if (lowerCrop.includes("wheat")) return "wheat";
    
    // Default to wheat if no match
    return "wheat";
  };
  
  const normalizedCrop = normalizeCropName(crop);
  const cropInfo = cropData[normalizedCrop] || cropData.wheat;
  
  // Calculate Growing Degree Days (GDD)
  const calculateDailyGDD = (tMax: number, tMin: number, baseTemp: number): number => {
    const avgTemp = (tMax + tMin) / 2;
    return Math.max(0, avgTemp - baseTemp); // GDD can't be negative
  };
  
  // Calculate total GDD for a period
  const dailyGDD = calculateDailyGDD(maxTemp, minTemp, cropInfo.baseTemperature);
  const totalGDD = dailyGDD * daysInput;
  
  // Calculate percentage completion and estimated days to harvest
  const harvestPercentage = Math.min(100, (totalGDD / cropInfo.gddToHarvest) * 100);
  const daysToHarvest = Math.ceil((cropInfo.gddToHarvest - totalGDD) / dailyGDD);
  
  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-amber-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Wheat className="h-5 w-5 mr-2 text-amber-600" />
            Crop Harvest Calculator
          </CardTitle>
          <CardDescription>Estimated harvest time for {cropInfo.name}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Growing Degree Days (GDD)</h4>
              <div className="text-2xl font-bold">{dailyGDD.toFixed(1)}<span className="text-sm ml-1">°C/day</span></div>
              <p className="text-xs text-muted-foreground">Base temp: {cropInfo.baseTemperature}°C</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Total for harvest</h4>
              <div className="text-2xl font-bold">{cropInfo.gddToHarvest}<span className="text-sm ml-1">GDD</span></div>
              <p className="text-xs text-muted-foreground">Typical days: {cropInfo.daysToHarvest}</p>
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="min-temp" className="text-xs">Min Temp (°C)</Label>
                <Input 
                  id="min-temp"
                  type="number"
                  value={minTemp}
                  onChange={(e) => setMinTemp(Number(e.target.value))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max-temp" className="text-xs">Max Temp (°C)</Label>
                <Input 
                  id="max-temp"
                  type="number" 
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(Number(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="days" className="text-xs">Growing Period (days)</Label>
              <Input 
                id="days"
                type="number" 
                value={daysInput}
                onChange={(e) => setDaysInput(Number(e.target.value))}
                className="h-8"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span>GDD Accumulation Progress</span>
                <span>{Math.round(harvestPercentage)}%</span>
              </div>
              <Progress value={harvestPercentage} className="h-2" />
            </div>
            
            <div className="bg-muted/30 p-3 rounded text-center">
              <div className="flex justify-center items-center mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Estimated Harvest</span>
              </div>
              {totalGDD >= cropInfo.gddToHarvest ? (
                <div className="text-green-600 font-bold">Ready for harvest!</div>
              ) : (
                <div className="text-lg font-bold">
                  {daysToHarvest > 0 ? `${daysToHarvest} days` : "Ready for harvest!"}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HarvestStats;
