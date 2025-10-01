import { useState, useMemo } from "react";
import { Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import type { ChannelStyle } from "@/lib/types";
import { channels } from "@/data/channels";

interface ChannelSelectorProps {
  selectedChannel: ChannelStyle | null;
  onChannelSelect: (channel: ChannelStyle) => void;
  /**
   * Color variant for the component styling
   * Default: "purple" (matches existing styling)
   */
  variant?: "purple" | "blue" | "green";
}

export function ChannelSelector({
  selectedChannel,
  onChannelSelect,
  variant = "purple",
}: ChannelSelectorProps) {
  // NOTE: moved duplicated Channel Selection UI into ChannelSelector.tsx for maintainability.
  // Do not change selection logic or props interface.
  const [channelSearchQuery, setChannelSearchQuery] = useState<string>("");

  const filteredChannels = useMemo(() => {
    if (!channelSearchQuery.trim()) return channels;
    return channels.filter(
      (channel) =>
        channel.name.toLowerCase().includes(channelSearchQuery.toLowerCase()) ||
        channel.description
          .toLowerCase()
          .includes(channelSearchQuery.toLowerCase())
    );
  }, [channelSearchQuery]);

  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          iconBg: "bg-blue-100 dark:bg-blue-900/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          selectedBorder: "border-blue-500",
          selectedBg: "bg-blue-50 dark:bg-blue-900/20",
          focusRing: "focus:ring-blue-500",
        };
      case "green":
        return {
          iconBg: "bg-green-100 dark:bg-green-900/20",
          iconColor: "text-green-600 dark:text-green-400",
          selectedBorder: "border-green-500",
          selectedBg: "bg-green-50 dark:bg-green-900/20",
          focusRing: "focus:ring-green-500",
        };
      default: // purple
        return {
          iconBg: "bg-purple-100 dark:bg-purple-900/20",
          iconColor: "text-purple-600 dark:text-purple-400",
          selectedBorder: "border-purple-500",
          selectedBg: "bg-purple-50 dark:bg-purple-900/20",
          //   focusRing: "focus:ring-purple-500",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-6">
        <div
          className={`w-10 h-10 ${styles.iconBg} rounded-xl flex items-center justify-center mr-3`}
        >
          <Settings className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Chọn kênh truyền thông <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chọn nền tảng để tối ưu nội dung
          </p>
        </div>
      </div>

      {/* Search functionality to match template picker UX */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kênh (Fanpage, Zalo, TikTok, …)"
            value={channelSearchQuery}
            onChange={(e) => setChannelSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Accordion layout to match template picker style */}
      <Accordion type="multiple" className="w-full" defaultValue={["channels"]}>
        <AccordionItem value="channels">
          <AccordionTrigger className="text-sm font-medium">
            Kênh truyền thông ({filteredChannels.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 pt-2">
              {filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => onChannelSelect(channel)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onChannelSelect(channel);
                    }
                  }}
                  tabIndex={0}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm focus:outline-none  ${
                    styles.focusRing
                  } ${
                    selectedChannel?.id === channel.id
                      ? `${styles.selectedBorder} ${styles.selectedBg} shadow-sm`
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {channel.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {channel.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={
                        selectedChannel?.id === channel.id
                          ? "default"
                          : "outline"
                      }
                      className="ml-3 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChannelSelect(channel);
                      }}
                    >
                      {selectedChannel?.id === channel.id ? "Đã chọn" : "Chọn"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {channelSearchQuery.trim() && filteredChannels.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p>Không tìm thấy kênh phù hợp với "{channelSearchQuery}"</p>
        </div>
      )}
    </div>
  );
}
