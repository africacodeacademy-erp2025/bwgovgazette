import { lazy, Suspense } from "react";
import PageLoader from "@/components/ui/PageLoader";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SearchGazettes = lazy(() => import("./pages/SearchGazettes"));
const BrowseTenders = lazy(() => import("./pages/BrowseTenders"));
const SavedItems = lazy(() => import("./pages/SavedItems"));
const Notifications = lazy(() => import("./pages/Notifications"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminSignup = lazy(() => import("./pages/AdminSignup"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const TenderView = lazy(() => import("./pages/TenderView"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SubscriptionPricing = lazy(() => import("./pages/SubscriptionPricing"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const GazetteViewPage = lazy(() => import("./pages/GazetteViewPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const ManageGazettes = lazy(() => import("./pages/admin/ManageGazettes"));
const UploadDocument = lazy(() => import("./pages/admin/UploadDocument"));
const Users = lazy(() => import("./pages/admin/Users"));
const DemoGooey = lazy(() => import("./pages/DemoGooey"));
const DemoSpinner = lazy(() => import("./pages/DemoSpinner"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword"));
const UpdatePasswordPage = lazy(() => import("./pages/UpdatePassword"));
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
          <Suspense fallback={<PageLoader />}>
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
            <Route path="/tender/:id" element={<TenderView />} />
            <Route path="/subscription" element={<SubscriptionPricing />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/gazette/:id" element={<GazetteViewPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo/gooey" element={<DemoGooey />} />
            <Route path="/demo/spinner" element={<DemoSpinner />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/update-password" element={<UpdatePasswordPage />} />
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
        </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
