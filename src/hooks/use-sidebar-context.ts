import { useContext } from "react";
import { SidebarContext } from "@/contexts/sidebar-context";

// Hook to access sidebar context
export function useSidebarContext() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebarContext must be used within a SidebarItemsProvider");
    }
    return context;
}

// Hook for saving prompts to sidebar với feedback tốt hơn
export function useSaveToSidebar() {
    const { addItem } = useSidebarContext();

    const savePrompt = (title: string, type: "course" | "event", data?: Record<string, unknown>) => {
        try {
            if (!title.trim()) {
                throw new Error("Tiêu đề không được để trống");
            }

            const savedItem = addItem({
                title: title.trim(),
                type,
                data,
            });

            console.log(`💾 Đã lưu "${title}" vào localStorage`);
            return { success: true, item: savedItem, message: "Đã lưu thành công!" };
        } catch (error) {
            console.error("❌ Lỗi khi lưu:", error);
            return {
                success: false,
                item: null,
                message: error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu"
            };
        }
    };

    return { savePrompt };
}