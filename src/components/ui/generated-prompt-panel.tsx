import React from "react";
import { Zap, Save, Calendar, CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";

// NOTE: moved duplicated Generated Prompt UI into GeneratedPromptPanel.tsx for reuse.
// Do not change prompt generation logic or data shape.

interface GeneratedPromptPanelProps {
  // Content props
  generatedPrompt: string;
  copied: boolean;

  // Actions
  onSave: () => void;
  onCopy: () => void;

  // Validation
  canSave: boolean;

  // Theme variant for different color schemes
  variant?: "blue" | "green";

  // Panel customization
  title?: string;
  description?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateIcon?: React.ReactNode;
}

export function GeneratedPromptPanel({
  generatedPrompt,
  copied,
  onSave,
  onCopy,
  canSave,
  variant = "blue",
  title = "Generated Prompt",
  description = "Nội dung marketing đã được tạo",
  emptyStateTitle = "Sẵn sàng tạo nội dung",
  emptyStateDescription = 'Điền thông tin bên trái và nhấn "Tạo Prompt" để tạo nội dung marketing chuyên nghiệp',
  emptyStateIcon,
}: GeneratedPromptPanelProps) {
  // Theme configuration based on variant
  const themeConfig = {
    blue: {
      headerIcon: "bg-blue-100 dark:bg-blue-900/20",
      headerIconColor: "text-blue-600 dark:text-blue-400",
      saveButton:
        "bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      copyButton:
        "bg-gray-200 dark:bg-blue-900/20 hover:bg-gray-300 dark:hover:bg-blue-900/30 text-gray-600 dark:text-blue-400",
    },
    green: {
      headerIcon: "bg-green-100 dark:bg-green-900/20",
      headerIconColor: "text-green-600 dark:text-green-400",
      saveButton:
        "bg-green-200 dark:bg-blue-900/20 hover:bg-green-300 dark:hover:bg-blue-900/30 text-green-600 dark:text-green-600",
      copyButton:
        "bg-gray-200 dark:bg-blue-900/20 hover:bg-gray-300 dark:hover:bg-blue-900/30 text-gray-600 dark:text-green-600",
    },
  };

  const theme = themeConfig[variant];

  // Default empty state icon based on variant
  const defaultEmptyIcon =
    variant === "green" ? (
      <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    ) : (
      <Zap className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    );

  return (
    // NOTE: Made panel sticky for improved UX while maintaining responsive behavior
    // Using sticky with proper height and overflow management for better scroll behavior
    <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow max-h-[calc(100vh-2rem)] overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 ${theme.headerIcon} rounded-xl flex items-center justify-center mr-3`}
          >
            <Zap className={`w-5 h-5 ${theme.headerIconColor}`} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onSave}
            disabled={!canSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl h-12 w-20 font-medium transition-all ${theme.saveButton} hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            <Save className="w-4 h-4" />
            Lưu
          </Button>
          {generatedPrompt && (
            <Button
              onClick={onCopy}
              className={`flex items-center gap-2 px-4 py-2 h-12 w-20 rounded-xl font-medium transition-all ${theme.copyButton} hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {copied ? <CircleCheckBig /> : "Sao chép"}
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {generatedPrompt ? (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 min-h-[400px] max-h-[calc(100vh-200px)] overflow-y-auto border border-gray-200 dark:border-gray-600">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
              {generatedPrompt}
            </pre>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center border border-gray-200 dark:border-gray-600 border-dashed">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                {emptyStateIcon || defaultEmptyIcon}
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {emptyStateTitle}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {emptyStateDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
