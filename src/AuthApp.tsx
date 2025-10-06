// NOTE: Added authentication wrapper to handle login/logout routing. Do not refactor core app logic.
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { LoginPage } from "@/components/auth/LoginPage";
import { NotFoundPage } from "@/components/auth/NotFoundPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import App from "./App";

type AppState = "loading" | "login" | "app" | "404";

export function AuthApp() {
  const [appState, setAppState] = useState<AppState>("loading");
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    const isAuthenticated = checkAuth();
    setAppState(isAuthenticated ? "app" : "login");
  }, [checkAuth]);

  const handleLoginSuccess = () => {
    setAppState("app");
  };

  const handleLogout = () => {
    setAppState("login");
  };

  const handleBackToLogin = () => {
    setAppState("login");
  };

  // Show loading state briefly to avoid flash
  if (appState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (appState === "login") {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (appState === "404") {
    return <NotFoundPage onBackToLogin={handleBackToLogin} />;
  }

  return (
    <ProtectedRoute
      fallback={<NotFoundPage onBackToLogin={handleBackToLogin} />}
    >
      <App onLogout={handleLogout} />
    </ProtectedRoute>
  );
}
