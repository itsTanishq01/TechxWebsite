import { useState } from "react";
import { Upload, FileImage, BarChart, Leaf, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Updated disease detection API URL
const API_URL = "https://techxdiseaseprediction.onrender.com/predict";

// Comprehensive disease database
const DISEASE_DATABASE = {
  'Apple___Apple_scab': {
    'name': 'Apple Scab',
    'description': 'Fungal infection caused by Venturia inaequalis affecting apple trees.',
    'symptoms': 'Dark green or brown spots with a velvety texture on leaves and fruit.',
    'treatment': ['Use fungicides', 'Remove fallen leaves', 'Prune for better air circulation'],
    'prevention': ['Plant resistant varieties', 'Apply preventative fungicides', 'Improve orchard sanitation']
  },
  'Apple___Black_rot': {
    'name': 'Apple Black Rot',
    'description': 'A fungal disease caused by Botryosphaeria obtusa affecting apple trees.',
    'symptoms': 'Dark sunken spots on fruit, wilting leaves, and bark cankers.',
    'treatment': ['Prune infected branches', 'Apply fungicides', 'Remove affected fruit'],
    'prevention': ['Maintain tree vigor', 'Clean pruning tools', 'Remove mummified fruits']
  },
  'Apple___Cedar_apple_rust': {
    'name': 'Cedar Apple Rust',
    'description': 'A fungal disease caused by Gymnosporangium juniperi-virginianae that requires both apple trees and eastern red cedars to complete its life cycle.',
    'symptoms': 'Yellow-orange spots on leaves, leading to early defoliation.',
    'treatment': ['Remove and destroy infected leaves and fruit', 'Apply protective fungicides in early spring', 'Prune nearby cedar trees when possible', 'Improve air circulation around trees'],
    'prevention': ['Plant resistant apple varieties', 'Keep apple trees away from cedar trees', 'Apply preventative fungicide sprays', 'Remove galls from cedar trees before they produce spores']
  },
  'Apple___healthy': {
    'name': 'Healthy Apple',
    'description': 'No disease detected. The apple tree is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper care', 'Regular watering', 'Appropriate fertilization', 'Routine monitoring'],
    'prevention': ['Regular inspection', 'Balanced nutrition', 'Proper pruning', 'Pest management']
  },
  'Blueberry___healthy': {
    'name': 'Healthy Blueberry',
    'description': 'No disease detected. The blueberry plant is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Continue proper watering', 'Pruning', 'Fertilization for healthy growth', 'Soil pH management'],
    'prevention': ['Maintain acidic soil', 'Proper spacing', 'Mulching', 'Bird protection']
  },
  'Cherry_(including_sour)___Powdery_mildew': {
    'name': 'Cherry Powdery Mildew',
    'description': 'A fungal disease caused by Podosphaera clandestina affecting cherry trees.',
    'symptoms': 'White powdery growth on leaves, causing distortion and early leaf drop.',
    'treatment': ['Apply fungicides', 'Prune for air circulation', 'Remove infected leaves'],
    'prevention': ['Use resistant varieties', 'Proper spacing', 'Avoid overhead irrigation']
  },
  'Cherry_(including_sour)___healthy': {
    'name': 'Healthy Cherry',
    'description': 'No disease detected. The cherry tree is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper watering', 'Pruning', 'Fertilization for continued health'],
    'prevention': ['Regular inspection', 'Balanced nutrition', 'Proper pruning techniques']
  },
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    'name': 'Cercospora Leaf Spot (Gray Leaf Spot)',
    'description': 'A fungal disease caused by Cercospora zeae-maydis affecting corn.',
    'symptoms': 'Gray or tan rectangular lesions on leaves, which merge over time.',
    'treatment': ['Rotate crops', 'Apply fungicides', 'Use resistant varieties'],
    'prevention': ['Crop rotation', 'Residue management', 'Timely planting']
  },
  'Corn_(maize)___Common_rust_': {
    'name': 'Common Rust in Corn',
    'description': 'A fungal disease caused by Puccinia sorghi affecting maize plants.',
    'symptoms': 'Reddish-brown pustules on leaves that darken over time.',
    'treatment': ['Use resistant hybrids', 'Apply fungicides', 'Ensure good air circulation'],
    'prevention': ['Plant resistant varieties', 'Early planting', 'Monitor regularly']
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    'name': 'Northern Leaf Blight',
    'description': 'A fungal disease caused by Exserohilum turcicum affecting corn.',
    'symptoms': 'Long, cigar-shaped gray-green lesions on leaves.',
    'treatment': ['Use resistant varieties', 'Apply fungicides', 'Rotate crops'],
    'prevention': ['Crop rotation', 'Residue management', 'Resistant hybrids']
  },
  'Corn_(maize)___healthy': {
    'name': 'Healthy Corn',
    'description': 'No disease detected. The corn plant is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper watering', 'Fertilization', 'Pest management for continued health'],
    'prevention': ['Crop rotation', 'Proper spacing', 'Weed control', 'Balanced nutrients']
  },
  'Grape___Black_rot': {
    'name': 'Grape Black Rot',
    'description': 'A fungal disease caused by Guignardia bidwellii affecting grapevines.',
    'symptoms': 'Reddish-brown leaf spots turning black; shriveled, darkened fruit.',
    'treatment': ['Use fungicides', 'Remove infected plant parts', 'Ensure proper pruning'],
    'prevention': ['Sanitation', 'Trellising for air flow', 'Preventative spraying']
  },
  'Grape___Esca_(Black_Measles)': {
    'name': 'Grape Esca (Black Measles)',
    'description': 'A fungal disease complex affecting grapevines.',
    'symptoms': 'Leaf discoloration, wood decay, and shriveled berries with black streaks.',
    'treatment': ['Remove infected wood', 'Apply fungicides', 'Use proper irrigation techniques'],
    'prevention': ['Clean pruning tools', 'Avoid vine stress', 'Use disease-free propagation material']
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    'name': 'Grape Leaf Blight (Isariopsis Leaf Spot)',
    'description': 'A fungal disease caused by Pseudocercospora vitis.',
    'symptoms': 'Small dark brown spots on leaves that expand into large necrotic areas.',
    'treatment': ['Apply fungicides', 'Prune affected areas', 'Ensure good air circulation'],
    'prevention': ['Proper canopy management', 'Fungicide application', 'Adequate plant spacing']
  },
  'Grape___healthy': {
    'name': 'Healthy Grape',
    'description': 'No disease detected. The grapevine is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper pruning', 'Watering', 'Disease prevention practices for continued health'],
    'prevention': ['Proper trellising', 'Balanced nutrition', 'Canopy management']
  },
  'Orange___Haunglongbing_(Citrus_greening)': {
    'name': 'Citrus Greening (Haunglongbing)',
    'description': 'A bacterial disease caused by Candidatus Liberibacter spp., spread by psyllids.',
    'symptoms': 'Yellowing leaves, small lopsided fruit, and bitter taste.',
    'treatment': ['Control psyllid populations', 'Remove infected trees', 'Use resistant varieties'],
    'prevention': ['Regular scouting for psyllids', 'Insecticide applications', 'Certified disease-free nursery stock']
  },
  'Peach___Bacterial_spot': {
    'name': 'Peach Bacterial Spot',
    'description': 'A bacterial infection caused by Xanthomonas campestris affecting peaches.',
    'symptoms': 'Dark, water-soaked spots on leaves and fruit, leading to premature drop.',
    'treatment': ['Use resistant varieties', 'Apply copper-based sprays', 'Prune infected areas'],
    'prevention': ['Avoid overhead irrigation', 'Space trees properly', 'Fall and spring copper applications']
  },
  'Peach___healthy': {
    'name': 'Healthy Peach',
    'description': 'No disease detected. The peach tree is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper watering', 'Fertilization', 'Pest management for continued health'],
    'prevention': ['Regular pruning', 'Thinning fruit', 'Balanced nutrition']
  },
  'Pepper,_bell___Bacterial_spot': {
    'name': 'Bell Pepper Bacterial Spot',
    'description': 'A bacterial disease caused by Xanthomonas campestris affecting bell peppers.',
    'symptoms': 'Small, water-soaked lesions on leaves and fruit, which turn brown and necrotic.',
    'treatment': ['Use resistant varieties', 'Apply copper-based sprays', 'Avoid overhead watering'],
    'prevention': ['Crop rotation', 'Use disease-free seeds', 'Maintain plant spacing']
  },
  'Pepper,_bell___healthy': {
    'name': 'Healthy Bell Pepper',
    'description': 'No disease detected. The bell pepper plant is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper watering', 'Fertilization', 'Pest management for continued health'],
    'prevention': ['Proper spacing', 'Mulching', 'Consistent watering']
  },
  'Potato___Early_blight': {
    'name': 'Potato Early Blight',
    'description': 'A fungal disease caused by Alternaria solani affecting potato plants.',
    'symptoms': 'Brown spots with concentric rings on leaves, leading to leaf drop.',
    'treatment': ['Rotate crops', 'Apply fungicides', 'Remove infected plant debris'],
    'prevention': ['Use certified seed potatoes', 'Proper plant spacing', 'Maintain consistent soil moisture']
  },
  'Potato___Late_blight': {
    'name': 'Potato Late Blight',
    'description': 'A disease caused by Phytophthora infestans, linked to the Irish Potato Famine.',
    'symptoms': 'Water-soaked lesions, rapid leaf browning, and white fuzzy growth in humid weather.',
    'treatment': ['Apply fungicides', 'Remove infected plants', 'Avoid excessive moisture'],
    'prevention': ['Plant resistant varieties', 'Destroy volunteer potatoes', 'Proper hilling and drainage']
  },
  'Potato___healthy': {
    'name': 'Healthy Potato',
    'description': 'No disease detected. The potato plant is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper irrigation', 'Soil health', 'Disease prevention strategies'],
    'prevention': ['Crop rotation', 'Certified seed potatoes', 'Proper hilling']
  },
  'Raspberry___healthy': {
    'name': 'Healthy Raspberry',
    'description': 'No disease detected. The raspberry plant is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper watering', 'Fertilization', 'Pruning for continued health'],
    'prevention': ['Trellis support', 'Pruning old canes', 'Weed management']
  },
  'Soybean___healthy': {
    'name': 'Healthy Soybean',
    'description': 'No disease detected. The soybean plant is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Ensure proper irrigation', 'Fertilization', 'Pest management for continued health'],
    'prevention': ['Crop rotation', 'Proper planting date', 'Weed control']
  },
  'Squash___Powdery_mildew': {
    'name': 'Squash Powdery Mildew',
    'description': 'A fungal disease caused by Podosphaera xanthii affecting squash plants.',
    'symptoms': 'White powdery growth on leaves, leading to yellowing and defoliation.',
    'treatment': ['Apply fungicides', 'Prune for air circulation', 'Avoid overhead watering'],
    'prevention': ['Resistant varieties', 'Plant spacing', 'Morning irrigation']
  },
  'Strawberry___Leaf_scorch': {
    'name': 'Strawberry Leaf Scorch',
    'description': 'A fungal disease caused by Diplocarpon earlianum affecting strawberries.',
    'symptoms': 'Purple or red spots on leaves that expand and cause leaf drying.',
    'treatment': ['Use fungicides', 'Remove infected leaves', 'Ensure good air circulation'],
    'prevention': ['Crop rotation', 'Avoid overhead irrigation', 'Mulching']
  },
  'Strawberry___healthy': {
    'name': 'Healthy Strawberry',
    'description': 'No disease detected. The strawberry plant is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper watering', 'Fertilization', 'Disease prevention for continued health'],
    'prevention': ['Proper spacing', 'Mulching', 'Remove runners as needed']
  },
  'Tomato___Bacterial_spot': {
    'name': 'Tomato Bacterial Spot',
    'description': 'A bacterial disease caused by Xanthomonas spp. affecting tomato plants.',
    'symptoms': 'Dark water-soaked lesions on leaves and fruit, leading to defoliation.',
    'treatment': ['Use resistant varieties', 'Apply copper-based sprays', 'Avoid overhead watering'],
    'prevention': ['Crop rotation', 'Clean garden tools', 'Remove plant debris']
  },
  'Tomato___Early_blight': {
    'name': 'Tomato Early Blight',
    'description': 'A fungal infection due to Alternaria solani that affects tomato plants.',
    'symptoms': 'Brown to black spots with rings appearing first on lower leaves.',
    'treatment': ['Remove infected leaves', 'Apply fungicides', 'Rotate crops', 'Maintain spacing'],
    'prevention': ['Mulching', 'Stake plants', 'Avoid wetting foliage']
  },
  'Tomato___Late_blight': {
    'name': 'Tomato Late Blight',
    'description': 'A disease caused by Phytophthora infestans affecting tomato plants.',
    'symptoms': 'Water-soaked lesions, rapid leaf browning, and white fuzzy growth in humid weather.',
    'treatment': ['Apply fungicides', 'Remove infected plants', 'Avoid excessive moisture'],
    'prevention': ['Plant resistant varieties', 'Proper spacing', 'Avoid overhead irrigation']
  },
  'Tomato___Leaf_Mold': {
    'name': 'Tomato Leaf Mold',
    'description': 'A fungal disease caused by Passalora fulva affecting tomato plants.',
    'symptoms': 'Yellowing leaves with olive-green fuzzy patches on the undersides.',
    'treatment': ['Improve ventilation', 'Use fungicides', 'Remove infected leaves'],
    'prevention': ['Reduce humidity', 'Increase plant spacing', 'Avoid leaf wetness']
  },
  'Tomato___Septoria_leaf_spot': {
    'name': 'Tomato Septoria Leaf Spot',
    'description': 'A fungal disease caused by Septoria lycopersici affecting tomato plants.',
    'symptoms': 'Small circular spots with dark edges on lower leaves, leading to defoliation.',
    'treatment': ['Remove infected leaves', 'Apply fungicides', 'Practice crop rotation'],
    'prevention': ['Mulching', 'Proper spacing', 'Avoid wetting foliage']
  },
  'Tomato___Spider_mites Two-spotted_spider_mite': {
    'name': 'Tomato Spider Mites (Two-Spotted Spider Mite)',
    'description': 'A pest infestation by Tetranychus urticae that affects tomato plants.',
    'symptoms': 'Tiny yellow speckles on leaves, webbing, and leaf curling.',
    'treatment': ['Use insecticidal soap', 'Apply neem oil', 'Encourage natural predators like ladybugs'],
    'prevention': ['Regular monitoring', 'Maintain plant vigor', 'Increase humidity']
  },
  'Tomato___Target_Spot': {
    'name': 'Tomato Target Spot',
    'description': 'A fungal disease caused by Corynespora cassiicola affecting tomato plants.',
    'symptoms': 'Dark brown spots with concentric rings on leaves and fruit.',
    'treatment': ['Apply fungicides', 'Remove infected plant debris', 'Improve air circulation'],
    'prevention': ['Crop rotation', 'Plant spacing', 'Mulching']
  },
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    'name': 'Tomato Yellow Leaf Curl Virus',
    'description': 'A viral disease spread by whiteflies that affects tomato plants.',
    'symptoms': 'Upward curling leaves, yellowing, and stunted growth.',
    'treatment': ['Control whiteflies', 'Remove infected plants', 'Use resistant varieties'],
    'prevention': ['Reflective mulch', 'Insect netting', 'Whitefly management']
  },
  'Tomato___Tomato_mosaic_virus': {
    'name': 'Tomato Mosaic Virus',
    'description': 'A viral disease caused by the Tomato mosaic virus affecting tomato plants.',
    'symptoms': 'Mottled yellow-green leaves, stunted growth, and deformed fruit.',
    'treatment': ['Use resistant varieties', 'Sanitize tools', 'Remove infected plants'],
    'prevention': ['Clean tools between plants', 'Wash hands after handling tobacco', 'Use disease-free seeds']
  },
  'Tomato___healthy': {
    'name': 'Healthy Tomato',
    'description': 'No disease detected. The tomato plant is in good health.',
    'symptoms': 'No visible symptoms.',
    'treatment': ['Maintain proper watering', 'Fertilization', 'Pest control for continued health'],
    'prevention': ['Proper staking', 'Pruning', 'Regular monitoring']
  }
};

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<null | {
    disease: string;
    confidence: number;
    description: string;
    treatment: string[];
    prevention: string[];
    symptoms?: string;
  }>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setProgress(10);
    
    // Create FormData object to send the image file
    const formData = new FormData();
    formData.append('file', selectedImage);
    
    try {
      setProgress(30);
      
      // Call the disease detection API with updated URL
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      
      setProgress(70);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      setProgress(90);
      
      // Process API response based on the actual structure
      if (data && data.prediction) {
        // Handle new API response format
        let diseaseName;
        let confidence;
        
        if (typeof data.prediction === 'object') {
          // Extract values from the prediction object
          diseaseName = data.prediction.disease_name || data.prediction.disease_code || "Unknown";
          confidence = data.prediction.confidence || 85;
        } else {
          // Fall back to old behavior if prediction is just a string
          diseaseName = data.prediction;
          confidence = data.confidence ? Math.round(data.confidence * 100) : 85;
        }
        
        // Clean up disease name if it has underscores
        const cleanDiseaseName = diseaseName.replace(/_/g, ' ').replace(/___/g, ' - ');
        
        // Check for disease info in our database, using original format as key
        let diseaseCode = diseaseName;
        if (typeof data.prediction === 'object' && data.prediction.disease_code) {
          diseaseCode = data.prediction.disease_code;
        }
        
        // Get disease info from our comprehensive database
        const diseaseInfo = DISEASE_DATABASE[diseaseCode];
        
        if (diseaseInfo) {
          setResults({
            disease: diseaseInfo.name || cleanDiseaseName,
            confidence: typeof confidence === 'number' ? confidence : parseInt(confidence),
            description: diseaseInfo.description,
            treatment: Array.isArray(diseaseInfo.treatment) ? diseaseInfo.treatment : [diseaseInfo.treatment],
            prevention: Array.isArray(DISEASE_DATABASE[diseaseCode]?.prevention) 
              ? DISEASE_DATABASE[diseaseCode].prevention 
              : ["Regular monitoring and good agricultural practices are recommended."],
            symptoms: diseaseInfo.symptoms
          });
        } else {
          // Use default or API-provided information if disease not in database
          setResults({
            disease: cleanDiseaseName,
            confidence: typeof confidence === 'number' ? confidence : parseInt(confidence),
            description: data.details?.description || "No detailed information available for this condition.",
            treatment: data.details?.treatment ? [data.details.treatment] : ["Consult with a local agricultural extension for specific treatment options."],
            prevention: ["Regular monitoring and good agricultural practices are recommended."]
          });
        }
        
        toast.success("Analysis completed successfully");
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Plant Disease Detection</h1>
        <p className="text-muted-foreground">
          Upload images of plant leaves to identify diseases and get treatment recommendations
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-[#c8c8c9] shadow-md dark:border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload Plant Image
            </CardTitle>
            <CardDescription>
              Select a clear image of the affected plant part for best results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 mb-4">
              {previewUrl ? (
                <div className="relative w-full">
                  <img 
                    src={previewUrl} 
                    alt="Selected plant" 
                    className="mx-auto max-h-[300px] rounded-lg object-contain" 
                  />
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                      setResults(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <FileImage className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="mb-4 text-muted-foreground">
                    Drag and drop an image, or click to browse
                  </p>
                  <Label 
                    htmlFor="image-upload" 
                    className="cursor-pointer bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Select Image
                  </Label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
            
            <Button 
              className="w-full h-12 bg-[#2c7d32] hover:bg-[#388e3c]" 
              onClick={analyzeImage} 
              disabled={!selectedImage || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
            
            {isAnalyzing && <Progress value={progress} className="mt-4" />}
          </CardContent>
        </Card>
        
        <Card className={`border border-[#c8c8c9] shadow-md dark:border-border ${results ? '' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart className="mr-2 h-5 w-5" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              {results ? "Disease identified with detailed information" : "Upload and analyze an image to see results"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{results.disease}</h3>
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {results.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {results.description}
                  </p>
                </div>
                
                {results.symptoms && (
                  <div>
                    <h3 className="font-semibold flex items-center mb-2">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Symptoms
                    </h3>
                    <p className="text-sm text-muted-foreground ml-6">{results.symptoms}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold flex items-center mb-2">
                    <Leaf className="h-4 w-4 mr-2" />
                    Treatment Recommendations
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {results.treatment.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center mb-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Prevention Methods
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {results.prevention.map((item, index) => (
                      <li key={index} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Analysis results will appear here after processing
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetection;
