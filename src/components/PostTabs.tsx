"use client";

interface PostTabsProps {
  activeTab: "active" | "expired";
  onTabChange: (tab: "active" | "expired") => void;
  activeCount: number;
  expiredCount: number;
}

export default function PostTabs({
  activeTab,
  onTabChange,
  activeCount,
  expiredCount,
}: PostTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl p-1 shadow-lg border border-slate-200 mb-6">
      <button
        type="button"
        onClick={() => onTabChange("active")}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all font-medium ${
          activeTab === "active"
            ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span className="text-lg">🟢</span>
        <span className="text-base">활성</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ml-1 ${
            activeTab === "active"
              ? "bg-white/20 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {activeCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("expired")}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all font-medium ${
          activeTab === "expired"
            ? "bg-gradient-to-r from-slate-600 to-gray-600 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <span className="text-lg">🔴</span>
        <span className="text-base">만료</span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ml-1 ${
            activeTab === "expired"
              ? "bg-white/20 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {expiredCount}
        </span>
      </button>
    </div>
  );
}
