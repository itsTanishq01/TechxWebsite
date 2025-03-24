import { ReactNode } from "react";
import { Bell, LogOut, User, History, Info, FileText, Settings } from "lucide-react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

type MenuItem = {
  icon: ReactNode;
  label: string;
  path: string;
};

const SettingsLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  const menuItems: MenuItem[] = [
    { icon: <User size={18} />, label: "Account", path: "/settings/account" },
    { icon: <Settings size={18} />, label: "Preferences", path: "/settings/preferences" },
    { icon: <Bell size={18} />, label: "Notifications", path: "/settings/notifications" },
    { icon: <History size={18} />, label: "Login History", path: "/settings/login-history" },
    { icon: <Info size={18} />, label: "About App", path: "/settings/about" },
    { icon: <FileText size={18} />, label: "Terms & Conditions", path: "/settings/terms" },
  ];

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        <Card className="md:row-span-2 h-fit">
          <CardHeader className="px-3 py-4">
            <CardTitle className="text-base">Settings</CardTitle>
            <CardDescription className="text-xs">Manage your preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="flex flex-col w-full">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center w-full px-3 py-2 text-sm 
                    border-b border-border 
                    hover:bg-accent/50 transition-colors
                    ${isActive ? 'bg-accent/50 text-primary font-medium' : 'text-foreground'}
                  `}
                >
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 w-8 text-center">{item.icon}</div>
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
            <div className="p-3">
              <Button 
                variant="destructive" 
                className="w-full mt-2 gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
