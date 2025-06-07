"use client";

interface ViewToggleProps {
  view: "gallery" | "list";
  onViewChange: (view: "gallery" | "list") => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-lg border border-slate-200">
      <button
        onClick={() => onViewChange("gallery")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          view === "gallery"
            ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          view === "list"
            ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
