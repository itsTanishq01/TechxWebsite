
import React, { useState, useEffect } from 'react';
import { Droplet, Calculator, Ruler, Filter } from 'lucide-react';
import { irrigationData, growthStages, calculateWaterRequirement, type CropIrrigationData } from '@/data/irrigationData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WaterRequirementResult {
  min: number;
  max: number;
  totalMin: number;
  totalMax: number;
}

// Crop categories
type CropCategory = 'all' | 'cereals' | 'vegetables' | 'fruits';

// Define crop categories mapping
const cropCategories: Record<string, CropCategory> = {
  'Rice': 'cereals',
  'Wheat': 'cereals',
  'Maize': 'cereals',
  'Barley': 'cereals',
  'Jowar (Sorghum)': 'cereals',
  'Bajra (Pearl Millet)': 'cereals',
  'Sugarcane': 'cereals',
  'Potato': 'vegetables',
  'Tomato': 'vegetables',
  'Onion': 'vegetables',
  'Brinjal (Eggplant)': 'vegetables',
  'Cauliflower': 'vegetables',
  'Cabbage': 'vegetables',
  'Carrot': 'vegetables',
  'Green Peas': 'vegetables',
  'Lady Finger (Okra)': 'vegetables',
  'Spinach': 'vegetables',
  'Radish': 'vegetables',
  'Pumpkin': 'vegetables',
  'Bitter Gourd': 'vegetables',
  'Bottle Gourd': 'vegetables',
  'Cucumber': 'vegetables',
  'Mango': 'fruits',
  'Banana': 'fruits',
  'Apple': 'fruits',
  'Grapes': 'fruits',
  'Orange': 'fruits',
  'Guava': 'fruits',
  'Pomegranate': 'fruits',
  'Papaya': 'fruits',
  'Pineapple': 'fruits',
  'Watermelon': 'fruits',
  'Muskmelon': 'fruits',
  'Lemon': 'fruits',
  'Litchi': 'fruits',
};

// For crops not explicitly categorized, default to 'cereals'
irrigationData.forEach(crop => {
  if (!cropCategories[crop.crop]) {
    cropCategories[crop.crop] = 'cereals';
  }
});

const IrrigationCalculator = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("seedingStage");
  const [fieldArea, setFieldArea] = useState<string>("1");
  const [waterRequirement, setWaterRequirement] = useState<WaterRequirementResult | null>(null);
  const [cropData, setCropData] = useState<CropIrrigationData | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<CropCategory>('all');
  const { toast } = useToast();
  
  // Filter crops based on selected category and sort alphabetically
  const filteredCrops = irrigationData
    .filter(crop => categoryFilter === 'all' || cropCategories[crop.crop] === categoryFilter)
    .sort((a, b) => a.crop.localeCompare(b.crop));
  
  // Load saved values from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('irrigationCalculatorData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setSelectedCrop(parsedData.selectedCrop || "");
        setSelectedStage(parsedData.selectedStage || "seedingStage");
        setFieldArea(parsedData.fieldArea || "1");
        
        // If we have all required data, calculate immediately
        if (parsedData.selectedCrop && parsedData.selectedStage && parsedData.fieldArea) {
          handleCalculate();
        }
      } catch (error) {
        console.error("Error loading saved irrigation data:", error);
      }
    }
  }, []);
  
  // Update crop data when selected crop changes
  useEffect(() => {
    const crop = irrigationData.find(item => item.crop === selectedCrop);
    setCropData(crop);
  }, [selectedCrop]);
  
  // Save data to localStorage whenever inputs change
  useEffect(() => {
    const dataToSave = {
      selectedCrop,
      selectedStage,
      fieldArea
    };
    localStorage.setItem('irrigationCalculatorData', JSON.stringify(dataToSave));
  }, [selectedCrop, selectedStage, fieldArea]);
  
  const handleCalculate = () => {
    if (!selectedCrop || !selectedStage || !fieldArea) {
      toast({
        title: "Missing Information",
        description: "Please select a crop, growth stage, and enter field area.",
        variant: "destructive"
      });
      return;
    }
    
    const area = parseFloat(fieldArea);
    if (isNaN(area) || area <= 0) {
      toast({
        title: "Invalid Area",
        description: "Please enter a valid field area greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    const crop = irrigationData.find(item => item.crop === selectedCrop);
    const result = calculateWaterRequirement(crop, selectedStage, area);
    
    if (result) {
      setWaterRequirement(result);
      toast({
        title: "Calculation Complete",
        description: "Water requirement has been calculated successfully.",
      });
    } else {
      toast({
        title: "Calculation Error",
        description: "Could not calculate water requirement with the given inputs.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-primary/5 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl lg:text-3xl">Irrigation Water Calculator</CardTitle>
              <CardDescription className="text-base mt-2">
                Calculate irrigation water requirements based on crop type, growth stage, and field area
              </CardDescription>
            </div>
            <Droplet className="h-12 w-12 text-primary" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="crop-select">Select Crop</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-4 w-4" />
                        <span>Filter: {categoryFilter === 'all' ? 'All Crops' : 
                          categoryFilter === 'cereals' ? 'Cereals' : 
                          categoryFilter === 'vegetables' ? 'Vegetables' : 'Fruits'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                        All Crops
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCategoryFilter('cereals')}>
                        Cereals
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCategoryFilter('vegetables')}>
                        Vegetables
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCategoryFilter('fruits')}>
                        Fruits
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Select 
                  value={selectedCrop} 
                  onValueChange={setSelectedCrop}
                >
                  <SelectTrigger id="crop-select">
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {filteredCrops.map((crop) => (
                      <SelectItem key={crop.crop} value={crop.crop}>
                        {crop.crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stage-select">Growth Stage</Label>
                <Select 
                  value={selectedStage} 
                  onValueChange={setSelectedStage}
                >
                  <SelectTrigger id="stage-select">
                    <SelectValue placeholder="Select growth stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {growthStages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="field-area">Field Area (hectares)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="field-area"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={fieldArea}
                    onChange={(e) => setFieldArea(e.target.value)}
                    placeholder="Enter field area in hectares"
                  />
                  <Ruler className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-between space-y-4">
              {cropData && (
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Water Requirements (per day)</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Growth Stage</TableHead>
                        <TableHead>Water Needed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Seeding</TableCell>
                        <TableCell>{cropData.seedingStage}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Vegetative</TableCell>
                        <TableCell>{cropData.vegetativeStage}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Flowering/Fruiting</TableCell>
                        <TableCell>{cropData.floweringFruitingStage}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maturity</TableCell>
                        <TableCell>{cropData.maturityStage}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <Button 
                onClick={handleCalculate}
                className="mt-auto flex items-center space-x-2"
                size="lg"
              >
                <Calculator className="h-5 w-5" />
                <span>Calculate Water Requirement</span>
              </Button>
            </div>
          </div>
        </CardContent>
        
        {waterRequirement && (
          <CardFooter className="flex flex-col bg-primary/5 p-6 rounded-b-lg border-t">
            <div className="w-full space-y-4">
              <h3 className="font-bold text-xl">Irrigation Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border bg-card overflow-hidden">
                  <CardHeader className="bg-primary/10 py-3">
                    <CardTitle className="text-lg">Daily Water Requirement</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold text-primary">
                      {waterRequirement.min}-{waterRequirement.max} mm/day
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Water depth required per day
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border bg-card overflow-hidden">
                  <CardHeader className="bg-primary/10 py-3">
                    <CardTitle className="text-lg">Total Water Volume</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold text-primary">
                      {waterRequirement.totalMin.toLocaleString()}-{waterRequirement.totalMax.toLocaleString()} m³/day
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total volume of water required per day
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-card p-4 rounded-lg border mt-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> These calculations are based on standard irrigation practices. 
                  Actual water needs may vary depending on soil type, climate conditions, and irrigation efficiency.
                  1 mm of water depth over 1 hectare = 10 cubic meters of water.
                </p>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default IrrigationCalculator;
