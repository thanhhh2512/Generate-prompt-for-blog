import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthApp } from "./AuthApp.tsx";
import { ThemeProvider } from "@/contexts/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthApp />
    </ThemeProvider>
  </StrictMode>
);
