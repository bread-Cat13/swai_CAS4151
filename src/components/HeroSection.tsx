"use client";
import { useState, useEffect } from "react";
import LostItemForm from "./LostItemForm";
import ChatSearchBox from "./ChatSearchBox";

export default function HeroSection() {
  // 초기 상태를 더 명확하게 설정
  const [activeTab, setActiveTab] = useState<"register" | "search">(() => {
    if (typeof window === "undefined") return "register"; // 기본값을 register로 변경

    const hash = window.location.hash;
    // console.log("🎯 초기 해시:", hash);

    // #search일 때만 search, 나머지는 모두 register
    return hash === "#search" ? "search" : "register";
  });

  const [selectedCampus, setSelectedCampus] = useState<"신촌" | "송도">("신촌");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      // console.log("🔄 HeroSection 해시 변경:", hash);

      // #search일 때만 찾기 탭으로 변경
      if (hash === "#search") {
        // console.log("✅ 찾기 탭으로 변경");
        setActiveTab("search");
      } else {
        // #register, #home, 빈 해시, 기타 모든 경우는 등록 탭
        // console.log("✅ 등록 탭으로 변경");
        setActiveTab("register");
      }
    };

    // 컴포넌트 마운트 시 즉시 실행
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // 탭 클릭 핸들러
  const handleTabClick = (tab: "register" | "search") => {
    // console.log("🎯 탭 클릭:", tab);
    setActiveTab(tab);
    const newHash = tab === "register" ? "#register" : "#search";

    // pushState 대신 replaceState 사용
    window.history.replaceState(null, "", newHash);
    // console.log("🔄 URL 업데이트:", newHash);

    // 강제로 hashchange 이벤트 발생
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <section
      id="home"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 pt-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-slate-800 via-sky-700 to-indigo-800 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
            {activeTab === "search"
              ? "연세대학교 분실물 찾기"
              : "연세대학교 분실물 등록"}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8">
            {activeTab === "search"
              ? "잃어버린 물건을 쉽고 빠르게 찾아보세요"
              : "습득한 물건을 쉽고 빠르게 등록하세요"}
          </p>

          {/* 탭 버튼 */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg border border-slate-200 w-full max-w-md sm:w-auto">
              <button
                onClick={() => handleTabClick("register")}
                className={`w-1/2 sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  activeTab === "register"
                    ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                분실물 등록
              </button>
              <button
                onClick={() => handleTabClick("search")}
                className={`w-1/2 sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  activeTab === "search"
                    ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                분실물 찾기
              </button>
            </div>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "search" ? (
            <ChatSearchBox
              campus={selectedCampus}
              onCampusChange={setSelectedCampus}
            />
          ) : (
            <LostItemForm />
          )}
        </div>
      </div>
    </section>
  );
}
