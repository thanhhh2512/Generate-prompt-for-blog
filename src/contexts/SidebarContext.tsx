import type { ReactNode } from "react";
import { useSidebarItems } from "@/hooks/use-sidebar-items";
import { SidebarContext } from "@/contexts/sidebar-context";

interface SidebarItemsProviderProps {
  children: ReactNode;
}

// Main provider component - only component export for Fast Refresh
export function SidebarItemsProvider({ children }: SidebarItemsProviderProps) {
  const sidebarItems = useSidebarItems();

  return (
    <SidebarContext.Provider value={sidebarItems}>
      {children}
    </SidebarContext.Provider>
  );
}
