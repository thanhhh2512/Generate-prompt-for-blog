import { useState, useEffect, useCallback } from "react";
import type { SidebarItem } from "@/lib/types";

const STORAGE_KEY = "marketing-generator-items";
const STORAGE_VERSION = "1.0"; // Version để handle migration trong tương lai
const STORAGE_VERSION_KEY = "marketing-generator-version";

// Helper function để safely access localStorage
const safeLocalStorage = {
    getItem: (key: string): string | null => {
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                return localStorage.getItem(key);
            }
        } catch (error) {
            console.warn("localStorage không khả dụng:", error);
        }
        return null;
    },
    setItem: (key: string, value: string): void => {
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                localStorage.setItem(key, value);
            }
        } catch (error) {
            console.warn("Không thể lưu vào localStorage:", error);
        }
    },
    removeItem: (key: string): void => {
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn("Không thể xóa từ localStorage:", error);
        }
    }
};

export function useSidebarItems() {
    const [items, setItems] = useState<SidebarItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load items from localStorage on mount
    useEffect(() => {
        const loadItems = () => {
            try {
                const savedVersion = safeLocalStorage.getItem(STORAGE_VERSION_KEY);
                const savedItems = safeLocalStorage.getItem(STORAGE_KEY);

                if (savedItems) {
                    const parsedItems: SidebarItem[] = JSON.parse(savedItems);

                    // Validate items structure
                    const validItems = parsedItems.filter(item =>
                        item.id &&
                        item.title &&
                        item.createdAt &&
                        (item.type === "course" || item.type === "event")
                    );

                    setItems(validItems);
                    console.log(`✅ Đã tải ${validItems.length} mục từ localStorage`);
                } else {
                    console.log("📂 Chưa có dữ liệu được lưu trong localStorage");
                }

                // Set version if not exists
                if (!savedVersion) {
                    safeLocalStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
                }
            } catch (error) {
                console.error("❌ Lỗi khi tải dữ liệu từ localStorage:", error);
                setItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadItems();
    }, []);

    // Save items to localStorage whenever items change (debounced)
    const saveToLocalStorage = useCallback((itemsToSave: SidebarItem[]) => {
        try {
            safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave));
            safeLocalStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
            console.log(`💾 Đã lưu ${itemsToSave.length} mục vào localStorage`);
        } catch (error) {
            console.error("❌ Lỗi khi lưu vào localStorage:", error);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            saveToLocalStorage(items);
        }
    }, [items, isLoading, saveToLocalStorage]);

    const addItem = useCallback((item: Omit<SidebarItem, "id" | "createdAt">) => {
        const newItem: SidebarItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        setItems((prev) => {
            // Kiểm tra xem item đã tồn tại chưa (dựa trên title và type)
            const existingItem = prev.find(
                existingItem =>
                    existingItem.title.toLowerCase().trim() === item.title.toLowerCase().trim() &&
                    existingItem.type === item.type
            );

            if (existingItem) {
                console.log(`⚠️ Mục "${item.title}" đã tồn tại, cập nhật thay vì tạo mới`);
                return prev.map(prevItem =>
                    prevItem.id === existingItem.id
                        ? { ...prevItem, ...item, createdAt: prevItem.createdAt } // Giữ nguyên createdAt
                        : prevItem
                );
            }

            console.log(`✅ Đã thêm mục mới: "${item.title}"`);
            return [newItem, ...prev];
        });

        return newItem;
    }, []);

    const updateItem = useCallback((id: string, updates: Partial<SidebarItem>) => {
        setItems((prev) => {
            const updated = prev.map((item) => {
                if (item.id === id) {
                    const updatedItem = { ...item, ...updates };
                    console.log(`📝 Đã cập nhật mục: "${updatedItem.title}"`);
                    return updatedItem;
                }
                return item;
            });
            return updated;
        });
    }, []);

    const deleteItem = useCallback((id: string) => {
        setItems((prev) => {
            const itemToDelete = prev.find(item => item.id === id);
            if (itemToDelete) {
                console.log(`🗑️ Đã xóa mục: "${itemToDelete.title}"`);
            }
            return prev.filter((item) => item.id !== id);
        });
    }, []);

    const getItemsByType = useCallback((type: "course" | "event") => {
        return items.filter((item) => item.type === type);
    }, [items]);

    // Thêm các function hữu ích
    const clearAllItems = useCallback(() => {
        setItems([]);
        safeLocalStorage.removeItem(STORAGE_KEY);
        console.log("🧹 Đã xóa tất cả dữ liệu");
    }, []);

    const exportItems = useCallback(() => {
        const dataStr = JSON.stringify(items, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `marketing-generator-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        console.log("📤 Đã xuất dữ liệu");
    }, [items]);

    const importItems = useCallback((jsonString: string) => {
        try {
            const importedItems: SidebarItem[] = JSON.parse(jsonString);
            const validItems = importedItems.filter(item =>
                item.id &&
                item.title &&
                item.createdAt &&
                (item.type === "course" || item.type === "event")
            );
            setItems(validItems);
            console.log(`📥 Đã nhập ${validItems.length} mục`);
            return true;
        } catch (error) {
            console.error("❌ Lỗi khi nhập dữ liệu:", error);
            return false;
        }
    }, []);

    return {
        items,
        isLoading,
        addItem,
        updateItem,
        deleteItem,
        getItemsByType,
        clearAllItems,
        exportItems,
        importItems,
        totalItems: items.length,
    };
}