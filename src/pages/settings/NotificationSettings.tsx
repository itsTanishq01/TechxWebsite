
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { Loader2 } from "lucide-react";

const NotificationSettings = () => {
  const { settings, isLoading, updateNotifications } = useUserSettings();
  const [notifications, setNotifications] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (settings) {
      setNotifications(settings.notifications_enabled);
    }
  }, [settings]);

  const handleToggleNotifications = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      setNotifications(checked);
      await updateNotifications(checked);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Loading notification settings...</CardDescription>
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
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage your notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <span className="text-sm text-muted-foreground">
              Receive updates and alerts for important activities
            </span>
          </div>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={handleToggleNotifications}
            disabled={isUpdating}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <span className="text-sm text-muted-foreground">
              Receive notifications via email
            </span>
          </div>
          <Switch
            id="email-notifications"
            checked={notifications}
            onCheckedChange={handleToggleNotifications}
            disabled={!notifications || isUpdating}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <span className="text-sm text-muted-foreground">
              Receive push notifications in your browser
            </span>
          </div>
          <Switch
            id="push-notifications"
            checked={notifications}
            onCheckedChange={handleToggleNotifications}
            disabled={!notifications || isUpdating}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
