import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PaymentIndex from "./pages/PaymentIndex";
import ProductIndex from "./pages/ProductIndex";
import Settings from "./pages/Settings";
import Invoice from "./pages/Invoice";
import Analytics from "./pages/Analytics";
import ConstructionCalculator from "./pages/ConstructionCalculator";
import DashboardLayout from "./components/DashboardLayout";
import Customers from "./pages/Customers";
import LoginPage from "./components/auth/LoginPage";
import { authAPI } from "./services/api";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Index />} />
            </Route>

            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PaymentIndex />} />
            </Route>

            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProductIndex />} />
            </Route>

            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Customers />} />
            </Route>

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Settings />} />
            </Route>

            <Route
              path="/invoices"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Invoice />} />
            </Route>

            <Route
              path="/calculator"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ConstructionCalculator />} />
            </Route>

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Analytics />} />
            </Route>

            {/* Root redirect - if authenticated go to dashboard, else login */}
            <Route 
              path="/" 
              element={
                authAPI.isAuthenticated() ? 
                  <Navigate to="/dashboard" replace /> : 
                  <Navigate to="/login" replace />
              } 
            />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;