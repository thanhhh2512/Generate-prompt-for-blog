import { createContext, useContext } from "react";

interface ToastContextType {
  showToast: (type: "success" | "error", message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op function if not within provider (for optional usage)
    return {
      showToast: () => {},
    };
  }
  return context;
}

export { ToastContext };