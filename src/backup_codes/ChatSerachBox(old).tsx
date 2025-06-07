// src/components/ChatSearchBox.tsx
"use client";
import { useState } from "react";

export default function ChatSearchBox() {
  // 기존 ChatSearchBox 함수 내용 그대로 붙여넣기
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "안녕하세요! 분실물을 찾아드리겠습니다. 어떤 물건을 잃어버리셨나요?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "분실물을 찾고 있습니다. 조금 더 자세한 정보를 알려주세요.",
          },
        ]);
      }, 1000);
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">AI 분실물 찾기</h2>
      <div className="h-96 overflow-y-auto border-2 border-slate-200 rounded-xl p-4 mb-4 bg-slate-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-xs ${
                message.role === "user"
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
                  : "bg-white text-slate-800 border-2 border-slate-200"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-slate-50 text-slate-800"
          placeholder="분실물에 대해 설명해주세요..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 flex-shrink-0 min-w-[80px] whitespace-nowrap"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
          ) : (
            "전송"
          )}
        </button>
        {/* <button
          onClick={handleSendMessage}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all shadow-lg"
        >
          전송
        </button> */}
      </div>
    </div>
  );
}
