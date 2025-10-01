import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Settings,
  FileText,
  Zap,
  CheckCircle,
  XCircle,
  X,
  Plus,
  Hash,
  Globe,
  Save,
  CalendarIcon,
  CircleCheckBig,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import type {
  CourseInfo,
  ChannelStyle,
  TemplateStyle,
  ExtraOptions,
  PromptConfig,
  CompleteCourseData,
} from "@/lib/types";
import { templates } from "@/data/templates";
import { generatePrompt } from "@/utils/promptGenerator";
import { useSidebarContext } from "@/hooks/use-sidebar-context";
import { useFormDataStore } from "@/stores/form-data-store";
import { ChannelSelector } from "@/components/ui/channel-selector";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";

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

function Courses() {
  const { addItem } = useSidebarContext();
  const { getCourseData, selectedItem, clearSelectedItem } = useFormDataStore();

  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    courseName: "",
    startDate: "",
    duration: "",
    learningMode: "online",
    keyHighlights: [""],
    registrationLink: "",
    relatedHashtags: [""],
  });

  const [selectedChannel, setSelectedChannel] = useState<ChannelStyle | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateStyle | null>(null);
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

  // NOTE: minimal change – added search state for template picker UX improvement.
  // Do not alter existing template selection logic.
  const [templateSearchQuery, setTemplateSearchQuery] = useState<string>("");

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const hideToast = () => {
    setToast(null);
  };

  // NOTE: minimal change – added template filtering for improved UX.
  // Keep existing template groups and preserve selection logic.
  const filteredTemplates = useMemo(() => {
    if (!templateSearchQuery.trim()) return templates;
    return templates.filter(
      (template) =>
        template.name
          .toLowerCase()
          .includes(templateSearchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(templateSearchQuery.toLowerCase())
    );
  }, [templateSearchQuery]);

  const originalTemplates = useMemo(() => {
    const originalIds = [
      "inspirational",
      "quick-benefits",
      "curiosity-driven",
      "natural",
    ];
    return filteredTemplates.filter((t) => originalIds.includes(t.id));
  }, [filteredTemplates]);

  const marketingTemplates = useMemo(() => {
    const marketingIds = [
      "aida",
      "abc-checklist",
      "three-s",
      "bab",
      "four-p",
      "pas",
    ];
    return filteredTemplates.filter((t) => marketingIds.includes(t.id));
  }, [filteredTemplates]);

  // Track if data has been loaded to prevent infinite loops
  const loadedItemRef = useRef<string | null>(null);

  // Load data from sidebar selection
  useEffect(() => {
    if (
      selectedItem?.type === "course" &&
      selectedItem.id !== loadedItemRef.current
    ) {
      const courseData = getCourseData();
      if (courseData) {
        // Mark this item as loaded to prevent re-loading
        loadedItemRef.current = selectedItem.id;

        // Kiểm tra xem dữ liệu có đầy đủ hay chỉ có courseInfo cũ
        const dataAsRecord = courseData as unknown as Record<string, unknown>;
        if (dataAsRecord.courseInfo) {
          // Dữ liệu mới có đầy đủ thông tin
          const completeData = courseData as unknown as CompleteCourseData;
          setCourseInfo(completeData.courseInfo);
          setSelectedChannel(completeData.selectedChannel || null);
          setSelectedTemplate(completeData.selectedTemplate || null);
          setExtraOptions(
            completeData.extraOptions || {
              contentLength: "medium",
              withEmojis: true,
              urgencyToggle: false,
            }
          );
        } else {
          // Dữ liệu cũ chỉ có courseInfo
          setCourseInfo(courseData as unknown as CourseInfo);
        }

        showToast("success", `Đã tải dữ liệu: "${selectedItem.title}"`);

        // Clear selection after loading - use a delay to prevent infinite loop
        setTimeout(() => {
          clearSelectedItem();
          loadedItemRef.current = null;
        }, 100);
      }
    }
  }, [selectedItem, getCourseData, clearSelectedItem]);

  const saveToSidebar = () => {
    if (!courseInfo.courseName.trim()) {
      showToast("error", "Tên khóa học không được để trống");
      return;
    }

    try {
      const completeData = {
        courseInfo,
        selectedChannel,
        selectedTemplate,
        extraOptions,
      };

      addItem({
        title: courseInfo.courseName.trim(),
        type: "course",
        data: completeData as unknown as Record<string, unknown>,
      });
      showToast(
        "success",
        `Đã lưu "${courseInfo.courseName}" vào danh sách! Dữ liệu sẽ được giữ nguyên dù bạn tải lại trang.`
      );
    } catch (error) {
      console.error("Lỗi khi lưu khóa học:", error);
      showToast("error", "Không thể lưu khóa học. Vui lòng thử lại.");
    }
  };

  const handleCourseInfoChange = (
    field: keyof CourseInfo,
    value: string | string[] | "online" | "offline" | "hybrid"
  ) => {
    setCourseInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "keyHighlights" | "relatedHashtags",
    index: number,
    value: string
  ) => {
    setCourseInfo((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "keyHighlights" | "relatedHashtags") => {
    setCourseInfo((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "keyHighlights" | "relatedHashtags",
    index: number
  ) => {
    setCourseInfo((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const generateContent = () => {
    try {
      if (!courseInfo.courseName.trim()) {
        showToast("error", "Vui lòng nhập tên khóa học!");
        return;
      }

      if (!courseInfo.startDate) {
        showToast("error", "Vui lòng chọn ngày khai giảng!");
        return;
      }

      if (!courseInfo.duration.trim()) {
        showToast("error", "Vui lòng nhập thời lượng khóa học!");
        return;
      }

      if (!courseInfo.registrationLink.trim()) {
        showToast("error", "Vui lòng nhập link đăng ký!");
        return;
      }

      if (!selectedChannel) {
        showToast("error", "Vui lòng chọn kênh truyền thông!");
        return;
      }

      if (!selectedTemplate) {
        showToast("error", "Vui lòng chọn mẫu nội dung!");
        return;
      }

      const config: PromptConfig = {
        courseInfo: {
          ...courseInfo,
          keyHighlights: courseInfo.keyHighlights.filter(
            (h) => h.trim() !== ""
          ),
          relatedHashtags: courseInfo.relatedHashtags.filter(
            (h) => h.trim() !== ""
          ),
        },
        channelStyle: selectedChannel,
        templateStyle: selectedTemplate,
        extraOptions,
      };

      const prompt = generatePrompt(config);

      if (!prompt || prompt.trim() === "") {
        showToast("error", "Có lỗi xảy ra khi tạo prompt. Vui lòng thử lại!");
        return;
      }

      setGeneratedPrompt(prompt);
      showToast("success", "Tạo prompt thành công!");
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
          {/* Course Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Thông tin khóa học
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nhập thông tin chi tiết về khóa học
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tên khóa học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseInfo.courseName}
                  onChange={(e) =>
                    handleCourseInfoChange("courseName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Khóa học lập trình Python căn bản"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Nhập tên khóa học rõ ràng và hấp dẫn
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Ngày khai giảng <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full px-4 py-3 h-12 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all justify-start text-left font-normal",
                        !courseInfo.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {courseInfo.startDate ? (
                        format(new Date(courseInfo.startDate), "dd/MM/yyyy")
                      ) : (
                        <span>Chọn ngày khai giảng</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        courseInfo.startDate
                          ? new Date(courseInfo.startDate)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          handleCourseInfoChange(
                            "startDate",
                            format(date, "yyyy-MM-dd")
                          );
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Thời lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={courseInfo.duration}
                  onChange={(e) =>
                    handleCourseInfoChange("duration", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="3 tháng"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="learningMode"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Hình thức học *
                </label>
                <Select
                  value={courseInfo.learningMode}
                  onValueChange={(value) =>
                    handleCourseInfoChange(
                      "learningMode",
                      value as unknown as "online" | "offline" | "hybrid"
                    )
                  }
                >
                  <SelectTrigger className="w-full h-12" id="learningMode">
                    <SelectValue placeholder="Chọn hình thức học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Trực tuyến</SelectItem>
                    <SelectItem value="offline">Trực tiếp</SelectItem>
                    <SelectItem value="hybrid">Kết hợp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Hash className="w-4 h-4 mr-1" />
                  Điểm nổi bật
                </label>
                <div className="space-y-3">
                  {courseInfo.keyHighlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) =>
                          handleArrayChange(
                            "keyHighlights",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Học với chuyên gia giàu kinh nghiệm"
                      />
                      {courseInfo.keyHighlights.length > 1 && (
                        <button
                          onClick={() =>
                            removeArrayItem("keyHighlights", index)
                          }
                          className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addArrayItem("keyHighlights")}
                  className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm điểm nổi bật
                </button>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="w-4 h-4 mr-1" />
                  Link đăng ký <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={courseInfo.registrationLink}
                  onChange={(e) =>
                    handleCourseInfoChange("registrationLink", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://cusc.ctu.edu.vn/dang-ky"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Hash className="w-4 h-4 mr-1" />
                  Hashtags liên quan
                </label>
                <div className="space-y-3">
                  {courseInfo.relatedHashtags.map((hashtag, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={hashtag}
                        onChange={(e) =>
                          handleArrayChange(
                            "relatedHashtags",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="#Python #Programming"
                      />
                      {courseInfo.relatedHashtags.length > 1 && (
                        <button
                          onClick={() =>
                            removeArrayItem("relatedHashtags", index)
                          }
                          className="px-3 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addArrayItem("relatedHashtags")}
                  className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm hashtag
                </button>
              </div>
            </div>
          </div>

          {/* NOTE: moved duplicated Channel Selection UI into ChannelSelector.tsx for maintainability. */}
          {/* Do not change selection logic or props interface. */}
          <ChannelSelector
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
            variant="purple"
          />

          {/* Template Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
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

            {/* NOTE: minimal change – added search bar for template filtering. */}
            {/* Keep existing selection logic intact. */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm mẫu (AIDA, PAS, 4P, …)"
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* NOTE: minimal change – grouped templates using accordion for better UX. */}
            {/* Preserve existing template selection behavior. */}
            <Accordion type="multiple" className="w-full" defaultValue={[]}>
              {originalTemplates.length > 0 && (
                <AccordionItem value="original-templates">
                  <AccordionTrigger className="text-sm font-medium">
                    Cách viết hiện có ({originalTemplates.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-3 pt-2">
                      {originalTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedTemplate(template);
                            }
                          }}
                          tabIndex={0}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            selectedTemplate?.id === template.id
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                {template.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {template.description}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant={
                                selectedTemplate?.id === template.id
                                  ? "default"
                                  : "outline"
                              }
                              className="ml-3 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTemplate(template);
                              }}
                            >
                              {selectedTemplate?.id === template.id
                                ? "Đã chọn"
                                : "Chọn"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {marketingTemplates.length > 0 && (
                <AccordionItem value="marketing-templates">
                  <AccordionTrigger className="text-sm font-medium">
                    Khung công thức marketing ({marketingTemplates.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-3 pt-2">
                      {marketingTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedTemplate(template);
                            }
                          }}
                          tabIndex={0}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            selectedTemplate?.id === template.id
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm"
                              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                {template.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {template.description}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant={
                                selectedTemplate?.id === template.id
                                  ? "default"
                                  : "outline"
                              }
                              className="ml-3 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTemplate(template);
                              }}
                            >
                              {selectedTemplate?.id === template.id
                                ? "Đã chọn"
                                : "Chọn"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {templateSearchQuery.trim() && filteredTemplates.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p>Không tìm thấy mẫu phù hợp với "{templateSearchQuery}"</p>
              </div>
            )}
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
                <label
                  htmlFor="contentLength"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Độ dài nội dung
                </label>
                <Select
                  value={extraOptions.contentLength}
                  onValueChange={(value) =>
                    setExtraOptions((prev) => ({
                      ...prev,
                      contentLength: value as "short" | "medium" | "detailed",
                    }))
                  }
                >
                  <SelectTrigger className="w-full h-12" id="contentLength">
                    <SelectValue placeholder="Chọn độ dài" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Ngắn gọn (50-100 từ)</SelectItem>
                    <SelectItem value="medium">
                      Trung bình (100-200 từ)
                    </SelectItem>
                    <SelectItem value="detailed">
                      Chi tiết (200-300 từ)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center">
                  <Checkbox
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-primary-foreground"
                    id="emojis"
                    checked={extraOptions.withEmojis}
                    onCheckedChange={(checked) =>
                      setExtraOptions((prev) => ({
                        ...prev,
                        withEmojis: checked as boolean,
                      }))
                    }
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
                  <Checkbox
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-primary-foreground"
                    id="urgency"
                    checked={extraOptions.urgencyToggle}
                    onCheckedChange={(checked) =>
                      setExtraOptions((prev) => ({
                        ...prev,
                        urgencyToggle: checked as boolean,
                      }))
                    }
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
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 hover:scale-105"
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
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Generated Prompt
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nội dung marketing đã được tạo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={saveToSidebar}
                disabled={!courseInfo.courseName.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl h-12 w-20 font-medium transition-all bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Save className="w-4 h-4" />
                Lưu
              </Button>
              {generatedPrompt && (
                <Button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 h-12 w-20 rounded-xl font-medium transition-all bg-gray-200 dark:bg-blue-900/20 hover:bg-gray-300 dark:hover:bg-blue-900/30 text-gray-600 dark:text-blue-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 "
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
                    <Zap className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Sẵn sàng tạo nội dung
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Điền thông tin bên trái và nhấn "Tạo Prompt" để tạo nội dung
                    marketing chuyên nghiệp
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

export default Courses;
