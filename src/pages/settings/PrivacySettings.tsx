
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const PrivacySettings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Manage your privacy and security preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="data-collection">Data Collection</Label>
            <span className="text-sm text-muted-foreground">
              Allow anonymous usage data collection to improve our services
            </span>
          </div>
          <Switch
            id="data-collection"
            defaultChecked={true}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="theme-mode">Theme Mode</Label>
            <span className="text-sm text-muted-foreground">
              Toggle between light and dark theme
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sun size={16} className={theme === "light" ? "text-primary" : "text-muted-foreground"} />
            <Switch
              id="theme-mode"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
            <Moon size={16} className={theme === "dark" ? "text-primary" : "text-muted-foreground"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
