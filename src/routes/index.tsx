import { RouteObject } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Settings from "@/pages/Settings";
import AboutUs from "@/pages/AboutUs";
import NotFound from "@/pages/NotFound";
import Chatbot from "@/pages/Chatbot";
import SoilAnalysis from "@/pages/SoilAnalysis";
import DiseaseDetection from "@/pages/DiseaseDetection";
import YieldPrediction from "@/pages/YieldPrediction";
import Tools from "@/pages/Tools";
import IdealConditions from "@/pages/tools/IdealConditions";
import FertilizerRecommendation from "@/pages/tools/FertilizerRecommendation";
import IrrigationCalculator from "@/pages/tools/IrrigationCalculator";
import WeatherForecast from "@/pages/tools/WeatherForecast";

// Import the settings components
import SettingsLayout from "@/pages/settings/SettingsLayout";
import AccountSettings from "@/pages/settings/AccountSettings";
import NotificationSettings from "@/pages/settings/NotificationSettings";
import LoginHistorySettings from "@/pages/settings/LoginHistorySettings";
import AboutAppSettings from "@/pages/settings/AboutAppSettings";
import TermsSettings from "@/pages/settings/TermsSettings";
import UserPreferencesSettings from "@/pages/settings/UserPreferencesSettings";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";

// Define public routes (no authentication required)
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout><Index /></AppLayout>
  },
  {
    path: "/login",
    element: <AppLayout><Login /></AppLayout>
  },
  {
    path: "/about",
    element: <AppLayout><AboutUs /></AppLayout>
  }
];

// Define protected routes (authentication required)
const protectedRoutes: RouteObject[] = [
  {
    path: "/chatbot",
    element: <AppLayout><ProtectedRoute><Chatbot /></ProtectedRoute></AppLayout>
  },
  {
    path: "/soil-analysis",
    element: <AppLayout><ProtectedRoute><SoilAnalysis /></ProtectedRoute></AppLayout>
  },
  {
    path: "/disease-detection",
    element: <AppLayout><ProtectedRoute><DiseaseDetection /></ProtectedRoute></AppLayout>
  },
  {
    path: "/yield-prediction",
    element: <AppLayout><ProtectedRoute><YieldPrediction /></ProtectedRoute></AppLayout>
  },
  {
    path: "/tools",
    element: <AppLayout><ProtectedRoute><Tools /></ProtectedRoute></AppLayout>
  },
  {
    path: "/tools/ideal-conditions",
    element: <AppLayout><ProtectedRoute><IdealConditions /></ProtectedRoute></AppLayout>
  },
  {
    path: "/tools/fertilizer-recommendation",
    element: <AppLayout><ProtectedRoute><FertilizerRecommendation /></ProtectedRoute></AppLayout>
  },
  {
    path: "/tools/irrigation-calculator",
    element: <AppLayout><ProtectedRoute><IrrigationCalculator /></ProtectedRoute></AppLayout>
  },
  {
    path: "/tools/weather-forecast",
    element: <AppLayout><ProtectedRoute><WeatherForecast /></ProtectedRoute></AppLayout>
  }
];

// Define settings routes
const settingsRoutes: RouteObject[] = [
  {
    path: "/settings",
    element: <AppLayout><ProtectedRoute><SettingsLayout /></ProtectedRoute></AppLayout>,
    children: [
      { path: "account", element: <AccountSettings /> },
      { path: "preferences", element: <UserPreferencesSettings /> },
      { path: "notifications", element: <NotificationSettings /> },
      { path: "login-history", element: <LoginHistorySettings /> },
      { path: "about", element: <AboutAppSettings /> },
      { path: "terms", element: <TermsSettings /> }
    ]
  }
];

// Fallback route
const fallbackRoutes: RouteObject[] = [
  {
    path: "*",
    element: <AppLayout><NotFound /></AppLayout>
  }
];

// Combine all routes
const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...settingsRoutes,
  ...fallbackRoutes
];

export default routes;
