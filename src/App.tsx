import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./pages/WelcomeScreen";
import LoginScreen from "./pages/LoginScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import DashboardScreen from "./pages/DashboardScreen";
import ServicesScreen from "./pages/ServicesScreen";
import PayoutScreen from "./pages/PayoutScreen";
import ProfileScreen from "./pages/ProfileScreen";
import TreasuryDashboard from "./pages/TreasuryDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/services" element={<ServicesScreen />} />
          <Route path="/payout" element={<PayoutScreen />} />
          <Route path="/treasury" element={<TreasuryDashboard />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
