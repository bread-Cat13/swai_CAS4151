"use client";
import { useState } from "react";
import { submitOpinion } from "@/utils/analytics"; // generateUserHash 제거

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    email: "",
    type: "",
    details: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const success = await submitOpinion(
        formData.email,
        formData.type,
        formData.details
      );

      if (success) {
        setSubmitStatus("success");
        setFormData({ email: "", type: "", details: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("의견 전송 실패:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            의견을 들려주세요
          </h2>
          <p className="text-lg text-slate-600">
            FindU 서비스 개선을 위한 소중한 의견을 기다립니다
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                이메일 *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white text-slate-800 disabled:opacity-50"
                placeholder="이메일을 입력해주세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                문의 유형 *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white text-slate-800 disabled:opacity-50"
              >
                <option value="">문의 유형을 선택해주세요</option>
                <option value="버그 신고">버그 신고</option>
                <option value="기능 제안">기능 제안</option>
                <option value="개선 사항">개선 사항</option>
                <option value="일반 문의">일반 문의</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                상세 내용 *
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                required
                rows={6}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-white text-slate-800 disabled:opacity-50"
                placeholder="의견이나 문의사항을 자세히 적어주세요"
              />
            </div>

            {submitStatus === "success" && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
                의견이 성공적으로 전송되었습니다. 소중한 의견 감사합니다!
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                전송 중 오류가 발생했습니다. 다시 시도해주세요.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  전송 중...
                </>
              ) : (
                "의견 보내기"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
