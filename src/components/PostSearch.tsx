"use client";
import { useState } from "react";

interface PostSearchProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

export default function PostSearch({ onSearch, searchTerm }: PostSearchProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearch = (value: string) => {
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setLocalSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="게시물 검색 (제목, 내용)"
          className="w-full px-4 py-3 pl-12 pr-10 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white text-slate-800 shadow-lg"
        />

        {/* 검색 아이콘 */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 클리어 버튼 */}
        {localSearchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
