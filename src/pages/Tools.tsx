import { Link } from "react-router-dom";
import { Sun, TestTube, Leaf, Beaker, Droplet, Cloud } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const toolItems = [
  {
    title: "Ideal Growing Conditions",
    description: "Reference guide for optimal growing conditions for various crops and plants.",
    icon: <Sun className="h-12 w-12 mb-4 text-yellow-500" />,
    path: "/tools/ideal-conditions",
  },
  {
    title: "Fertilizer Recommendation",
    description: "Get personalized fertilizer recommendations based on your soil analysis.",
    icon: <Beaker className="h-12 w-12 mb-4 text-emerald-500" />,
    path: "/tools/fertilizer-recommendation",
  },
  {
    title: "Irrigation Calculator",
    description: "Calculate water requirements for crops based on growth stage and field area.",
    icon: <Droplet className="h-12 w-12 mb-4 text-blue-500" />,
    path: "/tools/irrigation-calculator",
  },
  {
    title: "Weather Forecast",
    description: "Get accurate weather forecasts and alerts for your farm location.",
    icon: <Cloud className="h-12 w-12 mb-4 text-sky-500" />,
    path: "/tools/weather-forecast",
  },
  // Add more tools here in the future
];

export default function Tools() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Agricultural Tools</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our collection of specialized tools and resources to optimize your farming practices 
            and enhance productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {toolItems.map((item, index) => (
            <Card key={index} className="flex flex-col h-full transform transition-transform hover:scale-105">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center">{item.icon}</div>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
                <CardDescription className="text-center">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full">
                  <Link to={item.path}>Open Tool</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
