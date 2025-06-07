"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { scrollToHash } from "@/utils/scroll";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "홈", href: "#home" },
    { name: "분실물 등록", href: "#register" },
    { name: "분실물 찾기", href: "#search" },
    { name: "게시판", href: "/boards" },
    { name: "서비스 설명", href: "#about" },
    { name: "FAQ", href: "#faq" },
    { name: "의견 남기기", href: "#feedback" },
  ];

  // 모바일 메뉴 외부 클릭 처리
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isMobileMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".hamburger-btn")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleNavigation = (href: string) => {
    console.log("🎯 handleNavigation 실행:", href);
    setIsMobileMenuOpen(false);

    // 외부 페이지 (게시판 등)
    if (href.startsWith("/")) {
      router.push(href);
      if (href === "/boards") {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }
      return;
    }

    // 현재 페이지가 메인이 아닌 경우 메인으로 이동
    if (pathname !== "/") {
      router.push(`/${href}`);
      setTimeout(() => {
        scrollToHash(href);
      }, 100);
      return;
    }

    history.replaceState(null, "", href);

    // 메인 페이지에서 해시 이동
    setTimeout(() => {
      scrollToHash(href);
    }, 50);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-2xl px-4 py-4 lg:px-8">
        <div className="container flex flex-wrap items-center justify-between mx-auto text-white">
          <button
            onClick={() => handleNavigation("#home")}
            className="mr-4 cursor-pointer py-1.5 text-white font-bold text-xl sm:text-2xl hover:text-sky-300 transition-colors"
          >
            FindU
          </button>

          {/* 햄버거 버튼 */}
          <button
            className="hamburger-btn lg:hidden relative h-10 w-10 select-none rounded-lg text-center align-middle transition-all hover:bg-slate-600/30 focus:bg-slate-600/30 active:bg-slate-600/50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            aria-label="메뉴 열기"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </span>
          </button>

          {/* 데스크톱 메뉴 */}
          <div className="hidden lg:block">
            <ul className="flex flex-row items-center gap-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className="flex items-center px-3 xl:px-4 py-2 text-sm font-medium text-white hover:text-sky-300 hover:bg-slate-700/30 rounded-lg transition-all duration-200"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" />
      )}

      {/* 모바일 메뉴 */}
      <div
        className={`mobile-menu fixed top-0 right-0 h-full w-47 max-w-[85vw] bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden z-50`}
      >
        <div className="flex items-center justify-between border-b border-slate-600/30 p-4">
          <button
            onClick={() => handleNavigation("#home")}
            className="text-white font-bold text-xl hover:text-sky-300 transition-colors"
          >
            FindU
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white hover:text-sky-300 transition-colors p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <ul className="flex flex-col gap-1 p-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className="flex items-center w-full p-4 text-left text-base text-white hover:text-sky-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
