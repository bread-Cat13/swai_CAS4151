"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import CampusSelector from "./CampusSelector";

interface ChatSearchBoxProps {
  campus?: "신촌" | "송도";
  onCampusChange?: (campus: "신촌" | "송도") => void;
}

interface LostItem {
  id: string;
  item_name: string;
  description: string;
  found_date: string;
  created_at: string;
  found_location: {
    name: string;
    emoji: string;
  };
}

interface Message {
  role: "assistant" | "user";
  content: string;
  items?: LostItem[];
}

export default function ChatSearchBox({
  campus = "신촌",
  onCampusChange,
}: ChatSearchBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요! 분실물 찾아드리겠습니다. 어떤 물건을 잃어버리셨나요?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 채팅 메시지 자동 스크롤 (채팅창 내부만)
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  // 텍스트 영역 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          campus,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "관련 분실물을 찾았습니다.",
          items: data.items || [],
        },
      ]);
    } catch (error) {
      console.error("Search error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      id="search_anchor"
      ref={containerRef}
      className="w-full max-w-4xl lg:max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 scroll-mt-20 p-4 sm:p-6"
    >
      {/* 채팅 영역 - 모바일 최적화 */}
      <div className="h-80 sm:h-96 overflow-y-auto border border-slate-300 rounded-xl p-3 sm:p-4 bg-slate-50 space-y-3 mb-4">
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-lg text-sm sm:text-base ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
                    : "bg-white text-slate-800 border border-slate-200"
                }`}
              >
                {message.content}
              </div>
            </div>

            {/* 분실물 결과 카드 - 모바일 최적화 */}
            {message.items && message.items.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/boards/item/${item.id}`}
                    className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl flex-shrink-0">
                        {item.found_location.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-800 text-sm sm:text-base truncate">
                          {item.item_name}
                        </h4>
                        <p className="text-xs sm:text-sm text-blue-600 truncate">
                          📍 {item.found_location.name}
                        </p>
                        <p className="text-xs text-blue-500">
                          {new Date(item.found_date).toLocaleDateString(
                            "ko-KR"
                          )}{" "}
                          습득
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="text-blue-500 text-xs sm:text-sm flex-shrink-0">
                        👆 클릭
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-800 border border-slate-200 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">검색 중...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 - 모바일 반응형 개선 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-3">
        {/* 캠퍼스 선택 - 모바일에서는 상단에 */}
        <div className="order-1 sm:order-none flex-shrink-0">
          <CampusSelector
            campus={campus}
            onChange={(c) => onCampusChange?.(c)}
          />
        </div>

        {/* 입력 폼 - 모바일에서는 하단에 */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 flex-1 order-2 sm:order-none"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`${campus} 캠퍼스에서 분실물을 찾기...`}
              className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all text-slate-800 bg-white resize-none min-h-[48px] max-h-[120px] text-sm sm:text-base"
              rows={1}
              style={{
                lineHeight: "1.5",
                scrollbarWidth: "thin",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
            ) : (
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
