"use client";
import { useState } from "react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "분실물을 등록하는데 비용이 있나요?",
      answer:
        "아니요, FindU 서비스는 연세대학교 학생들을 위한 무료 서비스입니다. 분실물 등록과 검색 모두 무료로 이용하실 수 있습니다.",
    },
    {
      question: "분실물을 찾았을 때 어떻게 연락하나요?",
      answer:
        "분실물을 찾으신 분은 해당 게시물에 댓글을 남기거나, 등록된 연락처로 직접 연락하실 수 있습니다. \n개인정보 보호를 위해 연락처는 암호화되어 관리됩니다.",
    },
    {
      question: "AI 검색이 정확하지 않을 때는 어떻게 하나요?",
      answer:
        "AI 검색 결과가 만족스럽지 않다면, 장소별 게시판에서 직접 검색하거나 더 구체적인 키워드로 다시 검색해보세요. \n지속적으로 AI 모델을 개선하고 있습니다.",
    },
    {
      question: "분실물 등록 후 얼마나 오래 보관되나요?",
      answer:
        "분실물은 14일간 활성 상태로 유지됩니다. 만료 후에는 만료 탭에서 확인하거나 재등록 하실 수 있습니다.",
    },
    {
      question: "캠퍼스 외부에서 잃어버린 물건도 등록할 수 있나요?",
      answer:
        "FindU는 연세대학교 캠퍼스 내 분실물에 특화된 서비스입니다. \n캠퍼스 외부 분실물은 해당 지역의 경찰서나 관련 기관에 신고하시기 바랍니다.",
    },
    // {
    //   question: "분실물을 찾은 후에는 어떻게 해야 하나요?",
    //   answer:
    //     "분실물을 찾으신 후에는 해당 게시물을 '찾음' 상태로 변경해주세요. \n이는 다른 사용자들이 불필요한 검색을 하지 않도록 도와줍니다.",
    // },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-lg text-blue-700">
            FindU 이용에 대해 궁금한 점들을 모았습니다
          </p>
        </div>

        <div className="space-y-4 whitespace-pre-line">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-blue-900 pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-blue-600 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-blue-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
