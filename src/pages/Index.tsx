
import { Bot, Leaf, ScanSearch, Wheat, Wrench } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  const products = [
    {
      id: 1,
      title: "AI Agri Assistant",
      description: "Ask agricultural questions in your local language. Get expert advice on farming, crops, and more.",
      icon: <Bot size={24} />,
      path: "/chatbot",
    },
    {
      id: 2,
      title: "Soil Health & Crop Suggestion",
      description: "IoT & AI insights for optimal soil health. Get personalized crop suggestions based on your soil data.",
      icon: <Leaf size={24} />,
      path: "/soil-analysis",
    },
    {
      id: 3,
      title: "Disease Detection",
      description: "Upload images of your crops for AI analysis. Quickly identify plant diseases and get treatment options.",
      icon: <ScanSearch size={24} />,
      path: "/disease-detection",
    },
    {
      id: 4,
      title: "Yield Prediction",
      description: "Predict your expected crop yield based on soil properties and climate conditions.",
      icon: <Wheat size={24} />,
      path: "/yield-prediction",
    },
    {
      id: 5,
      title: "Agricultural Tools",
      description: "Access specialized farming tools including ideal growing conditions, calculators, and more.",
      icon: <Wrench size={24} />,
      path: "/tools",
    },
  ];

  return (
    <div className="flex flex-col">
      {!isAuthenticated && (
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in">
                Smart Solutions for Modern Agriculture
              </h1>
              <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "150ms" }}>
                Combining AI, IoT, and agricultural expertise to enhance farming productivity and sustainability.
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <Button size="lg" asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={`py-16 px-4 ${isAuthenticated ? 'pt-8' : 'bg-muted/30'}`}>
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{isAuthenticated ? 'Your Dashboard' : 'Our Solutions'}</h2>
            <p className="text-muted-foreground">
              {isAuthenticated 
                ? 'Access your agricultural technology tools' 
                : 'Discover our innovative agricultural technology solutions'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                title={product.title}
                description={product.description}
                icon={product.icon}
                path={product.path}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farming?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of farmers who are already using our platform to enhance productivity and sustainability.
              </p>
              <Button size="lg" asChild>
                <Link to="/login">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
