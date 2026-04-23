import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "카카오 비즈보드 대시보드",
  description: "스파르타코딩클럽 카카오 모먼트 광고 성과 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="font-bold text-lg text-yellow-500">
                📊 카카오 비즈보드
              </Link>
              <div className="flex gap-6 text-sm font-medium">
                <Link href="/jobs" className="text-gray-600 hover:text-yellow-500 transition-colors">
                  취업지원금찾기
                </Link>
                <Link href="/seongsu" className="text-gray-600 hover:text-yellow-500 transition-colors">
                  성수 팝업
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
