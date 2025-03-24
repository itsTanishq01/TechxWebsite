
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface LoginHistoryEntry {
  id: string;
  login_timestamp: string;
  device: string | null;
  location: string | null;
}

const LoginHistorySettings = () => {
  const { user } = useAuth();
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('login_history')
          .select('*')
          .eq('user_id', user.id)
          .order('login_timestamp', { ascending: false })
          .limit(10);

        if (error) throw error;

        setLoginHistory(data || []);
      } catch (error) {
        console.error("Error fetching login history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoginHistory();
  }, [user]);

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'PPP p'); // Format: Jan 1, 2021 12:00 PM
    } catch (error) {
      return timestamp;
    }
  };

  const formatDevice = (device: string | null) => {
    if (!device) return "Unknown device";
    
    // Basic device detection
    if (device.includes("iPhone") || device.includes("iPad")) {
      return "iOS Device";
    } else if (device.includes("Android")) {
      return "Android Device";
    } else if (device.includes("Windows")) {
      return "Windows Device";
    } else if (device.includes("Mac")) {
      return "Mac Device";
    } else if (device.includes("Linux")) {
      return "Linux Device";
    }
    
    return "Unknown device";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
        <CardDescription>
          Recent login activities for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading login history...</div>
        ) : loginHistory.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No login history available</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatTimestamp(entry.login_timestamp)}</TableCell>
                  <TableCell>{formatDevice(entry.device)}</TableCell>
                  <TableCell>{entry.location || "Unknown"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginHistorySettings;
