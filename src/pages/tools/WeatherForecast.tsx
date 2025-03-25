import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Cloud, 
  Thermometer, 
  Wind, 
  Droplet, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudFog, 
  CloudLightning, 
  Umbrella,
  Sunrise,
  Sunset,
  AlertTriangle 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  location: z.string().min(1, "Location is required"),
  days: z.coerce.number().int().min(1).max(16),
});

type FormValues = z.infer<typeof formSchema>;

interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    windspeed_10m_max: number[];
    winddirection_10m_dominant: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    relative_humidity_2m_max: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    windspeed_10m_max: string;
    precipitation_sum: string;
    relative_humidity_2m_max: string;
  };
}

const WeatherForecast = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchType, setSearchType] = useState<"coordinates" | "city">("city");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      days: 7,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let latitude: number | null = null;
      let longitude: number | null = null;
      
      if (searchType === "coordinates") {
        const coords = values.location.split(',').map(coord => parseFloat(coord.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          latitude = coords[0];
          longitude = coords[1];
        } else {
          throw new Error("Invalid coordinates format. Please use 'latitude,longitude'");
        }
      } else {
        const geocodingResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(values.location)}&count=1`
        );
        const geocodingData = await geocodingResponse.json();
        
        if (geocodingData.results && geocodingData.results.length > 0) {
          latitude = geocodingData.results[0].latitude;
          longitude = geocodingData.results[0].longitude;
        } else {
          throw new Error("Location not found. Please check the city name or try coordinates.");
        }
      }

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${latitude}&longitude=${longitude}` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,` +
        `uv_index_max,precipitation_sum,precipitation_probability_max,` +
        `windspeed_10m_max,winddirection_10m_dominant,relative_humidity_2m_max` +
        `&timezone=auto&forecast_days=${values.days}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data. Please try again later.");
      }
      
      const data = await weatherResponse.json();
      setWeatherData(data);
      
      toast({
        title: "Weather forecast loaded",
        description: `Successfully retrieved ${values.days} day forecast for ${values.location}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherDescription = (code: number) => {
    const weatherCodes: {[key: number]: string} = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    
    return weatherCodes[code] || "Unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getWeatherIcon = (code: number, size: number = 40) => {
    const codeMap: Record<number, JSX.Element> = {
      0: <Sun size={size} className="text-yellow-500" />,
      1: <Sun size={size} className="text-yellow-500" />,
      2: <Cloud size={size} className="text-blue-300" strokeWidth={1} />,
      3: <Cloud size={size} className="text-gray-400" />,
      45: <CloudFog size={size} className="text-gray-400" />,
      48: <CloudFog size={size} className="text-gray-400" />,
      51: <CloudRain size={size} className="text-blue-300" strokeWidth={1} />,
      53: <CloudRain size={size} className="text-blue-400" />,
      55: <CloudRain size={size} className="text-blue-500" />,
      56: <CloudRain size={size} className="text-blue-300" />,
      57: <CloudRain size={size} className="text-blue-500" />,
      61: <CloudRain size={size} className="text-blue-300" />,
      63: <CloudRain size={size} className="text-blue-400" />,
      65: <CloudRain size={size} className="text-blue-500" />,
      66: <CloudRain size={size} className="text-blue-400" />,
      67: <CloudRain size={size} className="text-blue-500" />,
      71: <CloudSnow size={size} className="text-blue-200" />,
      73: <CloudSnow size={size} className="text-blue-300" />,
      75: <CloudSnow size={size} className="text-blue-400" />,
      77: <CloudSnow size={size} className="text-blue-300" />,
      80: <Umbrella size={size} className="text-blue-400" />,
      81: <Umbrella size={size} className="text-blue-500" />,
      82: <Umbrella size={size} className="text-blue-600" />,
      85: <CloudSnow size={size} className="text-blue-300" />,
      86: <CloudSnow size={size} className="text-blue-400" />,
      95: <CloudLightning size={size} className="text-yellow-400" />,
      96: <CloudLightning size={size} className="text-yellow-500" />,
      99: <CloudLightning size={size} className="text-yellow-600" />,
    };

    return codeMap[code] || <AlertTriangle size={size} className="text-gray-400" />;
  };

  const getUVIndexLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: "Low", color: "text-green-500" };
    if (uvIndex <= 5) return { level: "Moderate", color: "text-yellow-500" };
    if (uvIndex <= 7) return { level: "High", color: "text-orange-500" };
    if (uvIndex <= 10) return { level: "Very High", color: "text-red-500" };
    return { level: "Extreme", color: "text-purple-500" };
  };

  const getPrecipitationClass = (probability: number) => {
    if (probability < 30) return "text-green-500";
    if (probability < 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Weather Forecast Tool</h1>
          <p className="text-muted-foreground">
            Get accurate weather forecasts to plan your farming activities effectively
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/5 border border-white/20 shadow-lg dark:border-white/10">
          <CardHeader>
            <CardTitle>Search Location</CardTitle>
            <CardDescription>
              Enter a city name or geographic coordinates to get weather information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="city" 
              className="w-full mb-6"
              onValueChange={(value) => setSearchType(value as "city" | "coordinates")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="city">City Name</TabsTrigger>
                <TabsTrigger value="coordinates">Coordinates</TabsTrigger>
              </TabsList>
              <TabsContent value="city">
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the name of a city, town, or village
                </p>
              </TabsContent>
              <TabsContent value="coordinates">
                <p className="text-sm text-muted-foreground mb-4">
                  Enter latitude and longitude separated by a comma (e.g., 51.5074,-0.1278)
                </p>
              </TabsContent>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{searchType === "city" ? "City" : "Coordinates"}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={searchType === "city" ? "e.g. New Delhi" : "e.g. 28.6139,77.2090"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {searchType === "city" 
                          ? "Enter a city or location name" 
                          : "Enter latitude and longitude separated by a comma"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forecast Days</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min={1}
                          max={16} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Number of days to forecast (1-16)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Get Forecast"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {weatherData && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold">
                Weather Forecast for {weatherData.latitude.toFixed(2)}°, {weatherData.longitude.toFixed(2)}°
              </h2>
              <p className="text-muted-foreground">{weatherData.timezone}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {weatherData.daily.time.map((date, index) => (
                <Card 
                  key={date} 
                  className="overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg border border-[#aaaaab] shadow-md dark:border-border"
                >
                  <CardHeader className={cn(
                    "p-4 relative overflow-hidden",
                    index === 0 ? "bg-primary/10" : "bg-primary/5",
                  )}>
                    <div className="absolute top-2 right-2">
                      {getWeatherIcon(weatherData.daily.weathercode[index])}
                    </div>
                    <CardTitle className="text-lg">{formatDate(date)}</CardTitle>
                    <CardDescription className="font-medium">
                      {getWeatherDescription(weatherData.daily.weathercode[index])}
                    </CardDescription>
                    <div className="mt-2 text-2xl font-bold flex items-baseline">
                      {weatherData.daily.temperature_2m_max[index]}{weatherData.daily_units.temperature_2m_max}
                      <span className="text-sm text-muted-foreground ml-1">
                        / {weatherData.daily.temperature_2m_min[index]}{weatherData.daily_units.temperature_2m_min}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Wind className="h-5 w-5 mr-2 text-blue-500" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Wind</p>
                          <p className="text-sm">
                            {weatherData.daily.windspeed_10m_max[index]}{weatherData.daily_units.windspeed_10m_max} 
                            <span className="text-xs ml-1">
                              ({getWindDirection(weatherData.daily.winddirection_10m_dominant[index])})
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Droplet className="h-5 w-5 mr-2 text-sky-500" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Humidity</p>
                          <p className="text-sm">
                            {weatherData.daily.relative_humidity_2m_max[index]}{weatherData.daily_units.relative_humidity_2m_max}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Umbrella className="h-5 w-5 mr-2 text-blue-400" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Precipitation</p>
                        <div className="flex items-center gap-1">
                          <p className="text-sm">
                            {weatherData.daily.precipitation_sum[index]}{weatherData.daily_units.precipitation_sum}
                          </p>
                          <span className={cn(
                            "text-xs font-medium rounded-full px-1.5 py-0.5 bg-opacity-20",
                            getPrecipitationClass(weatherData.daily.precipitation_probability_max[index])
                          )}>
                            {weatherData.daily.precipitation_probability_max[index]}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Sun className="h-5 w-5 mr-2 text-yellow-500" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">UV Index</p>
                        <p className={cn("text-sm", getUVIndexLevel(weatherData.daily.uv_index_max[index]).color)}>
                          {weatherData.daily.uv_index_max[index]} ({getUVIndexLevel(weatherData.daily.uv_index_max[index]).level})
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-4 py-3 bg-muted/50 flex justify-between">
                    <div className="flex items-center text-xs">
                      <Sunrise className="h-4 w-4 mr-1 text-orange-400" />
                      {new Date(weatherData.daily.sunrise[index]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="flex items-center text-xs">
                      <Sunset className="h-4 w-4 mr-1 text-red-400" />
                      {new Date(weatherData.daily.sunset[index]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherForecast;
