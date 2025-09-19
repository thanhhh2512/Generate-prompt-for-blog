import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className="h-16 flex justify-between items-center px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              CUSC Marketing Generator
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tạo nội dung marketing chuyên nghiệp
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
