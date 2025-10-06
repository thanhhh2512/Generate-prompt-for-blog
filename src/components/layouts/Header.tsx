import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
export function Header() {
  const imgUrl =
    "https://res.cloudinary.com/dlpuepcar/image/upload/w_240,h_240,c_fill,f_webp/v1758506590/marketing-logo_ibeg3s.png";

  return (
    <header className="h-20 flex justify-between items-center px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-sm">
      <SidebarTrigger className="-ml-1" />
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Left side with logo */}
        <div className="flex items-center space-x-3">
          <img
            src={imgUrl}
            alt="Logo Marketing Generator"
            className="rounded-md"
            width={240}
            height={240}
            fetchPriority="high"
            decoding="async"
            loading="eager"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
