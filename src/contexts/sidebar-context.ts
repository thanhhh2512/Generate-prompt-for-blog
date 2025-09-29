import { createContext } from "react";
import type { SidebarItem } from "@/lib/types";

export interface SidebarContextType {
    items: SidebarItem[];
    addItem: (item: Omit<SidebarItem, "id" | "createdAt">) => SidebarItem;
    updateItem: (id: string, updates: Partial<SidebarItem>) => void;
    deleteItem: (id: string) => void;
    getItemsByType: (type: "course" | "event") => SidebarItem[];
}

// Export the context so it can be used in hooks
export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);