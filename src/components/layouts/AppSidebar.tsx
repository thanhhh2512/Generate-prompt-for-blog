import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit3, GraduationCap, Calendar } from "lucide-react";
import { useSidebarContext } from "@/hooks/use-sidebar-context";
import { useFormDataStore } from "@/stores/form-data-store";
import type { SidebarItem } from "@/lib/types";

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { items, updateItem, deleteItem } = useSidebarContext();
  const { loadItemData, setActiveTab } = useFormDataStore();
  const [editingItem, setEditingItem] = useState<SidebarItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<SidebarItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Thông báo khi load dữ liệu từ localStorage (chỉ chạy một lần)
  React.useEffect(() => {
    let hasRun = false;
    const timer = setTimeout(() => {
      if (!hasRun && items.length > 0) {
        hasRun = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [items.length]);

  const handleEdit = (item: SidebarItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingItem && editTitle.trim()) {
      updateItem(editingItem.id, { ...editingItem, title: editTitle.trim() });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setEditTitle("");
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingItem(null);
    setEditTitle("");
  };

  const handleDelete = (item: SidebarItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      deleteItem(deletingItem.id);
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "course":
        return <GraduationCap className="h-4 w-4" />;
      case "event":
        return <Calendar className="h-4 w-4" />;
      default:
        return <GraduationCap className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group items by type
  const courseItems = items.filter((item) => item.type === "course");
  const eventItems = items.filter((item) => item.type === "event");

  return (
    <>
      <Sidebar className="w-64 border-r border-border/40" {...props}>
        <SidebarHeader className="border-b border-border/40 px-4 py-3">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              Saved Items
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{items.length} mục đã lưu</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          {courseItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Courses
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {courseItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <div
                        className="w-full justify-between p-2 h-auto group cursor-pointer hover:bg-accent/50 flex items-center gap-2 rounded-md"
                        onClick={() => {
                          loadItemData(item);
                          setActiveTab("courses");
                        }}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIconForType(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {eventItems.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Events
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {eventItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <div
                        className="w-full justify-between p-2 h-auto group cursor-pointer hover:bg-accent/50 flex items-center gap-2 rounded-md"
                        onClick={() => {
                          loadItemData(item);
                          setActiveTab("events");
                        }}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIconForType(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {items.length === 0 && (
            <div className="flex items-center justify-center h-32 text-center">
              <div className="text-sm text-muted-foreground">
                Chưa lưu mục nào. Hãy tạo một mục mới từ tab Khóa học hoặc Sự
                kiện.
              </div>
            </div>
          )}
        </SidebarContent>
      </Sidebar>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Make changes to your saved item here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="col-span-3"
                placeholder="Enter title..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editTitle.trim()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa mục "{deletingItem?.title}" không? Hành
              động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
