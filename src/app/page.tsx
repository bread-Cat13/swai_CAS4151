"use client";
import { useEffect } from "react";
import { trackVisitor } from "@/utils/analytics";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import FeedbackForm from "@/components/FeedBackForm";

export default function Home() {
  useEffect(() => {
    setTimeout(() => {
      trackVisitor();
    }, 1000);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar 제거 - 이제 layout.tsx에서 처리 */}
      <HeroSection />
      <AboutSection />
      <FAQSection />
      <FeedbackForm />

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-2">FindU</h3>
          <p className="text-blue-200 mb-4">연세대학교 분실물 관리 서비스</p>
          <p className="text-blue-300 text-sm">
            © 2025 FindU. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
