import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import PaymentSuccess from "./pages/PaymentSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import GazetteViewPage from "./pages/GazetteViewPage";
import AdminLayout from "./pages/admin/AdminLayout";
import ManageGazettes from "./pages/admin/ManageGazettes";
import UploadDocument from "./pages/admin/UploadDocument";
import Users from "./pages/admin/Users";
import CookieNotice from "./components/ui/cookie-notice";

const queryClient = new QueryClient();

// User routes: Login, Signup, Dashboard

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CookieNotice />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/search" element={<SearchGazettes />} />
            <Route path="/tenders" element={<BrowseTenders />} />
            <Route path="/saved" element={<ProtectedRoute><SavedItems /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/tender/:id" element={<TenderView />} />
            <Route path="/subscription" element={<SubscriptionPricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/gazette/:id" element={<GazetteViewPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="gazettes" element={<ManageGazettes />} />
              <Route path="upload" element={<UploadDocument />} />
              <Route path="users" element={<Users />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
