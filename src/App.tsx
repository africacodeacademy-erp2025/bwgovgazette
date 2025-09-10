import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SearchGazettes from "./pages/SearchGazettes";
import BrowseTenders from "./pages/BrowseTenders";
import SavedItems from "./pages/SavedItems";
import Notifications from "./pages/Notifications";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import TenderView from "./pages/TenderView";
import NotFound from "./pages/NotFound";
import SubscriptionPricing from "./pages/SubscriptionPricing";
import CookieNotice from "./components/ui/cookie-notice";

const queryClient = new QueryClient();

// User routes: Login, Signup, Dashboard

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieNotice />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchGazettes />} />
          <Route path="/tenders" element={<BrowseTenders />} />
          <Route path="/saved" element={<SavedItems />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/tender/:id" element={<TenderView />} />
          <Route path="/subscription" element={<SubscriptionPricing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
