// NOTE: Added route protection guard. Do not refactor core app logic.
import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { checkAuth } = useAuthStore();

  if (!checkAuth()) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
