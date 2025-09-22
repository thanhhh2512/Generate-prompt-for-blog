import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  const imgUrl =
    "https://res.cloudinary.com/dlpuepcar/image/upload/v1758506590/marketing-logo_ibeg3s.png";
  return (
    <header className="h-16 flex justify-between items-center px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <img src={imgUrl} alt="Logo" className="w-60 h-60 rounded-md" />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
