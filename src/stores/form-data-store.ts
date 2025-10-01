import { useState, useEffect } from 'react';
import type { SidebarItem, CourseInfo, EventInfo } from '@/lib/types';

// Global state sử dụng một singleton pattern đơn giản
class FormDataManager {
    private listeners: Array<() => void> = [];
    private _selectedItem: SidebarItem | null = null;
    private _activeTab: "courses" | "events" = "courses";

    get selectedItem() {
        return this._selectedItem;
    }

    get activeTab() {
        return this._activeTab;
    }

    setActiveTab(tab: "courses" | "events") {
        this._activeTab = tab;
        this.notifyListeners();
    }

    loadItemData(item: SidebarItem) {
        this._selectedItem = item;
        this._activeTab = item.type === "course" ? "courses" : "events";
        this.notifyListeners();
    }

    clearSelectedItem() {
        this._selectedItem = null;
        this.notifyListeners();
    }

    getCourseData(): CourseInfo | null {
        if (this._selectedItem?.type === "course" && this._selectedItem.data) {
            return this._selectedItem.data as unknown as CourseInfo;
        }
        return null;
    }

    getEventData(): EventInfo | null {
        if (this._selectedItem?.type === "event" && this._selectedItem.data) {
            return this._selectedItem.data as unknown as EventInfo;
        }
        return null;
    }

    subscribe(callback: () => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
}

// Singleton instance
export const formDataManager = new FormDataManager();

// Custom hook để sử dụng trong React components
export function useFormDataStore() {
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const unsubscribe = formDataManager.subscribe(() => {
            forceUpdate({});
        });
        return unsubscribe;
    }, []);

    return {
        selectedItem: formDataManager.selectedItem,
        activeTab: formDataManager.activeTab,
        loadItemData: formDataManager.loadItemData.bind(formDataManager),
        setActiveTab: formDataManager.setActiveTab.bind(formDataManager),
        clearSelectedItem: formDataManager.clearSelectedItem.bind(formDataManager),
        getCourseData: formDataManager.getCourseData.bind(formDataManager),
        getEventData: formDataManager.getEventData.bind(formDataManager),
    };
}