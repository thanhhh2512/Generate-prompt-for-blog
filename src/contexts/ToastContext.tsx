import type { ReactNode } from "react";
import { ToastContext } from "@/hooks/use-toast";

interface ToastProviderProps {
  children: ReactNode;
  showToast: (type: "success" | "error", message: string) => void;
}

export function ToastProvider({ children, showToast }: ToastProviderProps) {
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}