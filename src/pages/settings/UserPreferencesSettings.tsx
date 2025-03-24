
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useUserSettings, UnitsSystem, AppLanguage } from "@/contexts/UserSettingsContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const UserPreferencesSettings = () => {
  const { settings, isLoading, updateSettings } = useUserSettings();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<{
    units_system: UnitsSystem;
    language: AppLanguage;
  }>({
    units_system: "metric",
    language: "en",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        units_system: settings.units_system,
        language: settings.language,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
          <CardDescription>Loading preferences...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Preferences</CardTitle>
        <CardDescription>
          Set your preferred units system and language
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Units System</Label>
          <RadioGroup
            value={localSettings.units_system}
            onValueChange={(value: UnitsSystem) => setLocalSettings((prev) => ({ ...prev, units_system: value }))}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="metric" id="metric" />
              <Label htmlFor="metric">Metric (Celsius, kilometers, etc.)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="imperial" id="imperial" />
              <Label htmlFor="imperial">Imperial (Fahrenheit, miles, etc.)</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-medium">Language</Label>
          <RadioGroup
            value={localSettings.language}
            onValueChange={(value: AppLanguage) => setLocalSettings((prev) => ({ ...prev, language: value }))}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="es" id="es" />
              <Label htmlFor="es">Spanish</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fr" id="fr" />
              <Label htmlFor="fr">French</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="de" id="de" />
              <Label htmlFor="de">German</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferencesSettings;
