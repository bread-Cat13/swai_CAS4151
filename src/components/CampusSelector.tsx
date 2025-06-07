"use client";
import { useState, useEffect, useRef } from "react";
import { Building2, ChevronDown } from "lucide-react";

const campuses = ["신촌", "송도"] as const;

interface Props {
  campus: "신촌" | "송도";
  onChange: (campus: "신촌" | "송도") => void;
}

export default function CampusSelector({ campus, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (selectedCampus: "신촌" | "송도") => {
    onChange(selectedCampus);
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="relative" ref={ref}>
      {/* 모바일 최적화된 버튼 */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-300 transition-all duration-200 min-w-[80px] sm:min-w-[90px] shadow-sm"
        aria-label={`현재 선택된 캠퍼스: ${campus}. 클릭하여 캠퍼스 변경`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Building2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
        <span className="text-sm font-medium text-slate-700 truncate">
          {campus}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 - 모바일 최적화 */}
      {open && (
        <>
          {/* 모바일에서 배경 오버레이 */}
          <div className="fixed inset-0 z-40 sm:hidden" aria-hidden="true" />

          <div
            className={`
              absolute z-50 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden
              left-1/2 transform -translate-x-1/2 sm:left-0 sm:transform-none
              w-32 sm:w-28
            `}
            role="listbox"
            aria-label="캠퍼스 선택"
          >
            {campuses.map((c, index) => (
              <button
                key={c}
                onClick={() => handleSelect(c)}
                className={`
                  w-full text-center sm:text-left px-4 py-3 sm:py-2 text-sm transition-colors duration-150
                  hover:bg-slate-100 focus:bg-slate-100 focus:outline-none
                  ${
                    campus === c
                      ? "font-semibold text-sky-600 bg-sky-50"
                      : "text-slate-700"
                  }
                  ${index === 0 ? "rounded-t-xl" : ""}
                  ${index === campuses.length - 1 ? "rounded-b-xl" : ""}
                `}
                role="option"
                aria-selected={campus === c}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(c);
                  }
                }}
              >
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {campus === c && (
                    <div className="w-2 h-2 bg-sky-600 rounded-full flex-shrink-0" />
                  )}
                  <span>{c}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
