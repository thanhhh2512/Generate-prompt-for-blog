// NOTE: Added 404 page for unauthorized access and invalid routes. Do not refactor core app logic.
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";

interface NotFoundPageProps {
  onBackToLogin: () => void;
}

export function NotFoundPage({ onBackToLogin }: NotFoundPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-2xl">404 - Không tìm thấy trang</CardTitle>
          <CardDescription className="text-base">
            Trang không tồn tại hoặc bạn chưa đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Vui lòng đăng nhập để truy cập ứng dụng Marketing Generator.
          </p>
          <Button
            onClick={onBackToLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại đăng nhập
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
