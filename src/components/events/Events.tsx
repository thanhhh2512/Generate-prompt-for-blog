import React, { useState, useEffect } from "react";
import {
  Settings,
  Calendar,
  Zap,
  CheckCircle,
  XCircle,
  X,
  Plus,
  MapPin,
  Users,
  Gift,
  Globe,
  Save,
  CalendarIcon,
  CircleCheckBig,
} from "lucide-react";
import { format } from "date-fns";
import type {
  EventInfo,
  ChannelStyle,
  EventTemplate,
  ExtraOptions,
  EventPromptConfig,
  CompleteEventData,
} from "@/lib/types";
import { channels } from "@/data/channels";
import { eventTemplates } from "@/data/eventTemplates";
import { generateEventPrompt } from "@/utils/promptGenerator";
import { useSidebarContext } from "@/hooks/use-sidebar-context";
import { useFormDataStore } from "@/stores/form-data-store";
import { Button } from "../ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ToastProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
        type === "success"
          ? "bg-green-500/90 text-white"
          : "bg-red-500/90 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="mr-3" size={20} />
      ) : (
        <XCircle className="mr-3" size={20} />
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:bg-black/20 rounded-lg p-1 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

function Events() {
  const { addItem } = useSidebarContext();
  const { getEventData, selectedItem, clearSelectedItem } = useFormDataStore();

  const [eventInfo, setEventInfo] = useState<EventInfo>({
    name: "",
    time: "",
    location: "",
    highlights: [""],
    audience: "",
    offers: [""],
    registrationLink: "",
  });

  const [selectedChannel, setSelectedChannel] = useState<ChannelStyle | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<EventTemplate | null>(null);
  const [extraOptions, setExtraOptions] = useState<ExtraOptions>({
    contentLength: "medium",
    withEmojis: true,
    urgencyToggle: false,
  });

  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  // Load data from sidebar selection
  useEffect(() => {
    if (selectedItem?.type === "event") {
      const eventData = getEventData();
      if (eventData) {
        console.log("📅 Loading event data into form:", eventData);

        // Kiểm tra xem dữ liệu có đầy đủ hay chỉ có eventInfo cũ
        const dataAsRecord = eventData as unknown as Record<string, unknown>;
        if (dataAsRecord.eventInfo) {
          // Dữ liệu mới có đầy đủ thông tin
          const completeData = eventData as unknown as CompleteEventData;
          setEventInfo(completeData.eventInfo);
          setSelectedChannel(completeData.selectedChannel || null);
          setSelectedTemplate(completeData.selectedTemplate || null);
          setExtraOptions(
            completeData.extraOptions || {
              contentLength: "medium",
              withEmojis: true,
              urgencyToggle: false,
            }
          );
          console.log("✅ Đã tải đầy đủ dữ liệu bao gồm tùy chọn bổ sung");
        } else {
          // Dữ liệu cũ chỉ có eventInfo
          setEventInfo(eventData as unknown as EventInfo);
          console.log("⚠️ Chỉ tải được thông tin cơ bản (dữ liệu cũ)");
        }

        showToast("success", `Đã tải dữ liệu: "${selectedItem.title}"`);
        // Clear selection after loading
        setTimeout(() => clearSelectedItem(), 100);
      }
    }
  }, [selectedItem, getEventData, clearSelectedItem]);

  const saveToSidebar = () => {
    if (!eventInfo.name.trim()) {
      showToast("error", "Tên sự kiện không được để trống");
      return;
    }

    try {
      // Bao gồm tất cả dữ liệu: thông tin sự kiện + tùy chọn bổ sung
      const completeData = {
        eventInfo,
        selectedChannel,
        selectedTemplate,
        extraOptions,
      };

      const savedItem = addItem({
        title: eventInfo.name.trim(),
        type: "event",
        data: completeData as unknown as Record<string, unknown>,
      });

      console.log("💾 Đã lưu sự kiện (bao gồm tùy chọn bổ sung):", savedItem);
      showToast(
        "success",
        `Đã lưu "${eventInfo.name}" vào danh sách! Dữ liệu sẽ được giữ nguyên dù bạn tải lại trang.`
      );
    } catch (error) {
      console.error("❌ Lỗi khi lưu sự kiện:", error);
      showToast("error", "Không thể lưu sự kiện. Vui lòng thử lại.");
    }
  };

  const handleEventInfoChange = (
    field: keyof EventInfo,
    value: string | string[]
  ) => {
    setEventInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "highlights" | "offers",
    index: number,
    value: string
  ) => {
    setEventInfo((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "highlights" | "offers") => {
    setEventInfo((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field: "highlights" | "offers", index: number) => {
    setEventInfo((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const generateContent = () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (!eventInfo.name.trim()) {
        showToast("error", "Vui lòng nhập tên sự kiện!");
        return;
      }

      if (!eventInfo.time) {
        showToast("error", "Vui lòng chọn thời gian sự kiện!");
        return;
      }

      if (!eventInfo.location.trim()) {
        showToast("error", "Vui lòng nhập địa điểm sự kiện!");
        return;
      }

      if (!eventInfo.audience.trim()) {
        showToast("error", "Vui lòng nhập đối tượng tham gia!");
        return;
      }

      // if (!eventInfo.registrationLink.trim()) {
      //   showToast("error", "Vui lòng nhập link đăng ký!");
      //   return;
      // }

      if (!selectedChannel) {
        showToast("error", "Vui lòng chọn kênh truyền thông!");
        return;
      }

      if (!selectedTemplate) {
        showToast("error", "Vui lòng chọn mẫu nội dung!");
        return;
      }

      const config: EventPromptConfig = {
        eventInfo: {
          ...eventInfo,
          highlights: eventInfo.highlights.filter((h) => h.trim() !== ""),
          offers: eventInfo.offers.filter((o) => o.trim() !== ""),
        },
        channelStyle: selectedChannel,
        templateStyle: selectedTemplate,
        extraOptions,
      };

      const prompt = generateEventPrompt(config);

      if (!prompt || prompt.trim() === "") {
        showToast("error", "Có lỗi xảy ra khi tạo prompt. Vui lòng thử lại!");
        return;
      }

      setGeneratedPrompt(prompt);
      showToast("success", "Tạo prompt thành công! 🎉");
    } catch (error) {
      console.error("Error generating prompt:", error);
      showToast("error", "Có lỗi xảy ra khi tạo prompt. Vui lòng thử lại!");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      showToast("success", "Đã sao chép prompt vào clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      showToast("error", "Không thể sao chép. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-8xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Thông tin sự kiện
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nhập thông tin chi tiết về sự kiện
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tên sự kiện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eventInfo.name}
                  onChange={(e) =>
                    handleEventInfoChange("name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ngày hội Công nghệ CUSC 2024"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Nhập tên sự kiện hấp dẫn và thu hút
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Thời gian <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full px-4 py-3 h-12 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all justify-start text-left font-normal",
                          !eventInfo.time && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventInfo.time ? (
                          format(new Date(eventInfo.time), "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={
                          eventInfo.time ? new Date(eventInfo.time) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const currentTime = eventInfo.time
                              ? new Date(eventInfo.time)
                              : new Date();
                            const newDateTime = new Date(date);
                            newDateTime.setHours(currentTime.getHours());
                            newDateTime.setMinutes(currentTime.getMinutes());
                            handleEventInfoChange(
                              "time",
                              newDateTime.toISOString().slice(0, 16)
                            );
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "px-4 py-3 h-12 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all justify-start text-left font-normal w-full",
                          !eventInfo.time && "text-muted-foreground"
                        )}
                      >
                        {eventInfo.time ? (
                          format(new Date(eventInfo.time), "HH:mm")
                        ) : (
                          <span>Chọn giờ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <div className="flex items-center space-x-2">
                        <div className="grid grid-cols-1">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Giờ
                          </label>
                          <select
                            value={
                              eventInfo.time
                                ? new Date(eventInfo.time).getHours()
                                : 9
                            }
                            onChange={(e) => {
                              const hours = parseInt(e.target.value);
                              const currentTime = eventInfo.time
                                ? new Date(eventInfo.time)
                                : new Date();
                              currentTime.setHours(hours);
                              handleEventInfoChange(
                                "time",
                                currentTime.toISOString()
                              );
                            }}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-1">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Phút
                          </label>
                          <select
                            value={
                              eventInfo.time
                                ? new Date(eventInfo.time).getMinutes()
                                : 0
                            }
                            onChange={(e) => {
                              const minutes = parseInt(e.target.value);
                              const currentTime = eventInfo.time
                                ? new Date(eventInfo.time)
                                : new Date();
                              currentTime.setMinutes(minutes);
                              handleEventInfoChange(
                                "time",
                                currentTime.toISOString()
                              );
                            }}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i}>
                                {i.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  Địa điểm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eventInfo.location}
                  onChange={(e) =>
                    handleEventInfoChange("location", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Hội trường A, Trường ĐH Cần Thơ"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Users className="w-4 h-4 mr-1" />
                  Đối tượng tham gia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eventInfo.audience}
                  onChange={(e) =>
                    handleEventInfoChange("audience", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Sinh viên IT, Chuyên gia công nghệ, Doanh nghiệp"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Điểm nổi bật / Chương trình
                </label>
                <div className="space-y-3">
                  {eventInfo.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) =>
                          handleArrayChange("highlights", index, e.target.value)
                        }
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Hội thảo AI và Machine Learning"
                      />
                      {eventInfo.highlights.length > 1 && (
                        <button
                          onClick={() => removeArrayItem("highlights", index)}
                          className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addArrayItem("highlights")}
                  className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm điểm nổi bật
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Gift className="w-4 h-4 mr-1" />
                  Ưu đãi / Quà tặng
                </label>
                <div className="space-y-3">
                  {eventInfo.offers.map((offer, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={offer}
                        onChange={(e) =>
                          handleArrayChange("offers", index, e.target.value)
                        }
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Quà lưu niệm, Học bổng 50%, Certificate tham dự"
                      />
                      {eventInfo.offers.length > 1 && (
                        <button
                          onClick={() => removeArrayItem("offers", index)}
                          className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addArrayItem("offers")}
                  className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm ưu đãi
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="w-4 h-4 mr-1" />
                  Link đăng ký
                </label>
                <input
                  type="url"
                  value={eventInfo.registrationLink}
                  onChange={(e) =>
                    handleEventInfoChange("registrationLink", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="https://cusc.ctu.edu.vn/su-kien"
                />
              </div>
            </div>
          </div>

          {/* Channel Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mr-3">
                <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
            <div className="grid gap-3">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm ${
                    selectedChannel?.id === channel.id
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {channel.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Chọn mẫu nội dung <span className="text-red-500">*</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Chọn phong cách viết phù hợp
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              {eventTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm ${
                    selectedTemplate?.id === template.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Extra Options */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mr-3">
                <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Tùy chọn bổ sung
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tinh chỉnh nội dung theo ý muốn
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Độ dài nội dung
                </label>
                <select
                  value={extraOptions.contentLength}
                  onChange={(e) =>
                    setExtraOptions((prev) => ({
                      ...prev,
                      contentLength: e.target.value as
                        | "short"
                        | "medium"
                        | "detailed",
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="short">📄 Ngắn gọn (50-100 từ)</option>
                  <option value="medium">📃 Trung bình (100-200 từ)</option>
                  <option value="detailed">📋 Chi tiết (200-300 từ)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emojis"
                    checked={extraOptions.withEmojis}
                    onChange={(e) =>
                      setExtraOptions((prev) => ({
                        ...prev,
                        withEmojis: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-green-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <label
                    htmlFor="emojis"
                    className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    🎭 Sử dụng emoji
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="urgency"
                    checked={extraOptions.urgencyToggle}
                    onChange={(e) =>
                      setExtraOptions((prev) => ({
                        ...prev,
                        urgencyToggle: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-green-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <label
                    htmlFor="urgency"
                    className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ⚡ Tạo tính cấp thiết
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="sticky bottom-6">
            <button
              onClick={generateContent}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Tạo Prompt
            </button>
          </div>
        </div>

        {/* Right Panel - Generated Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Generated Prompt
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nội dung marketing cho sự kiện
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={saveToSidebar}
                disabled={!eventInfo.name.trim()}
                className="flex items-center gap-2 px-4 py-2 h-14 w-20 rounded-xl font-medium transition-all bg-green-200 dark:bg-blue-900/20 hover:bg-green-300 dark:hover:bg-blue-900/30 text-green-600 dark:text-green-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Save className="w-4 h-4" />
                Lưu
              </Button>
              {generatedPrompt && (
                <Button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 h-14 w-20 rounded-xl font-medium transition-all bg-gray-200 dark:bg-blue-900/20 hover:bg-gray-300 dark:hover:bg-blue-900/30 text-gray-600 dark:text-green-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 "
                >
                  {copied ? <CircleCheckBig /> : "Sao chép"}
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            {generatedPrompt ? (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 min-h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-600">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                  {generatedPrompt}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center border border-gray-200 dark:border-gray-600 border-dashed">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Sẵn sàng tạo nội dung
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Điền thông tin sự kiện bên trái và nhấn "Tạo Prompt" để tạo
                    nội dung marketing chuyên nghiệp
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;
