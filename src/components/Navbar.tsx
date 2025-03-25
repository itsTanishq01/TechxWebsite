import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wrench, ChevronDown, Sun, Beaker, Droplet, Cloud } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the type for navigation items
interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

// Define the type for dropdown navigation items
interface DropdownNavItem {
  name: string;
  icon?: React.ReactNode;
  items: NavItem[];
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Common navigation items for all users
  const navItems: NavItem[] = [
    { name: "About Us", path: "/about" }
  ];

  // Tools dropdown items
  const toolsItems: NavItem[] = [
    { name: "Ideal Growing Conditions", path: "/tools/ideal-conditions", icon: <Sun className="h-4 w-4 mr-1" /> },
    { name: "Fertilizer Recommendation", path: "/tools/fertilizer-recommendation", icon: <Beaker className="h-4 w-4 mr-1" /> },
    { name: "Irrigation Calculator", path: "/tools/irrigation-calculator", icon: <Droplet className="h-4 w-4 mr-1" /> },
    { name: "Weather Forecast", path: "/tools/weather-forecast", icon: <Cloud className="h-4 w-4 mr-1" /> }
  ];

  // Authentication-dependent navigation items in the requested order
  const authenticatedNavItems: Array<NavItem | DropdownNavItem> = isAuthenticated ? [
    { name: "Chatbot", path: "/chatbot" },
    { name: "Soil Analysis", path: "/soil-analysis" },
    { name: "Disease Detection", path: "/disease-detection" },
    { name: "Yield Prediction", path: "/yield-prediction" },
    { 
      name: "Tools", 
      icon: <Wrench className="h-4 w-4 mr-1" />,
      items: toolsItems
    }
  ] : [];
  
  return (
    // ... keep existing code
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold">KhetSeva</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {/* Authenticated items (non-dropdown) */}
            {isAuthenticated && authenticatedNavItems.map((item) => {
              // Check if it's a dropdown item
              if ('items' in item) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className={`flex items-center text-sm font-medium transition-colors duration-300 ${
                      item.items.some(subItem => isActive(subItem.path))
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}>
                      {item.icon && item.icon}
                      {item.name}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.items.map((subItem) => (
                        <DropdownMenuItem key={subItem.path} asChild>
                          <Link 
                            to={subItem.path}
                            className={`w-full ${
                              isActive(subItem.path) ? "text-primary" : ""
                            }`}
                          >
                            {subItem.icon && subItem.icon}
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              // Regular nav item
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-300 flex items-center ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>
              );
            })}
            
            {/* About Us link for all users */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-300 flex items-center ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0 flex items-center justify-center">
                  <span className="font-medium text-sm">A</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">Login</Button>
              </Link>
            )}
            
            <button
              className="flex md:hidden items-center"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background">
            {/* About Us for mobile */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon && item.icon}
                {item.name}
              </Link>
            ))}
            
            {/* Authenticated items */}
            {isAuthenticated && authenticatedNavItems.map((item) => {
              if ('items' in item) {
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center px-3 py-2 text-base font-medium text-foreground">
                      {item.icon && item.icon}
                      {item.name}
                    </div>
                    <div className="pl-4 space-y-1 border-l border-border ml-3">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                            isActive(subItem.path)
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
