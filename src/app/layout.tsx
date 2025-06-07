import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FindU - 연세대학교 분실물 찾기",
  description: "연세대학교 학생들을 위한 스마트한 분실물 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
