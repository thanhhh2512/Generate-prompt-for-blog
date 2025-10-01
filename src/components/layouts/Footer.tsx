import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 text-center text-sm py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Left: Copyright */}
          <div className="text-left">
            <p className="text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Tạ Trọng Thành. All rights reserved.
            </p>
          </div>

          {/* Center: Organization */}
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Website tạo nội dung marketing chuyên nghiệp bằng AI
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              version 2.3.1
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex justify-end items-center space-x-4">
            <a
              href="https://cusc.ctu.edu.vn/cms"
              className="inline-flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink size={14} />
              <span>Website</span>
            </a>
            <a
              href="https://www.facebook.com/CUSC.CE"
              className="inline-flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink size={14} />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
