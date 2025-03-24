
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Json } from "@/integrations/supabase/types";

// Define types that align with Supabase
export type UnitsSystem = "metric" | "imperial";
export type AppLanguage = "en" | "es" | "fr" | "de";
// Make DashboardLayout compatible with Json type from Supabase
export type DashboardLayout = Record<string, unknown>;

interface UserSettings {
  id: string;
  theme: string;
  notifications_enabled: boolean;
  units_system: UnitsSystem;
  language: AppLanguage;
  dashboard_layout: DashboardLayout | null;
}

interface UserSettingsContextType {
  settings: UserSettings | null;
  isLoading: boolean;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateNotifications: (enabled: boolean) => Promise<void>;
  updateUnitsSystem: (system: UnitsSystem) => Promise<void>;
  updateLanguage: (language: AppLanguage) => Promise<void>;
  updateDashboardLayout: (layout: DashboardLayout) => Promise<void>;
}

const defaultSettings: UserSettings = {
  id: "",
  theme: "light",
  notifications_enabled: true,
  units_system: "metric",
  language: "en",
  dashboard_layout: null,
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch user settings when authenticated
  useEffect(() => {
    const fetchSettings = async () => {
      if (!isAuthenticated || !user) {
        setSettings(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSettings(data as UserSettings);
        } else {
          // Create default settings if none exist
          const { data: newSettings, error: insertError } = await supabase
            .from("user_settings")
            .insert([{ user_id: user.id }])
            .select()
            .single();

          if (insertError) throw insertError;
          setSettings(newSettings as UserSettings);
        }
      } catch (error: any) {
        console.error("Error fetching user settings:", error);
        toast({
          title: "Settings Error",
          description: "Failed to load your settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [isAuthenticated, user, toast]);

  // Update all settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user || !settings) return;

    setIsLoading(true);
    try {
      // Convert the DashboardLayout to Json type for Supabase
      const supabaseSettings: any = { 
        ...newSettings, 
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from("user_settings")
        .update(supabaseSettings)
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings((prev) => (prev ? { ...prev, ...newSettings } : null));
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (error: any) {
      console.error("Error updating settings:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper methods for common settings updates
  const updateNotifications = async (enabled: boolean) => {
    await updateSettings({ notifications_enabled: enabled });
  };

  const updateUnitsSystem = async (system: UnitsSystem) => {
    await updateSettings({ units_system: system });
  };

  const updateLanguage = async (language: AppLanguage) => {
    await updateSettings({ language });
  };

  const updateDashboardLayout = async (layout: DashboardLayout) => {
    await updateSettings({ dashboard_layout: layout });
  };

  return (
    <UserSettingsContext.Provider
      value={{
        settings,
        isLoading,
        updateSettings,
        updateNotifications,
        updateUnitsSystem,
        updateLanguage,
        updateDashboardLayout,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider");
  }
  return context;
}
