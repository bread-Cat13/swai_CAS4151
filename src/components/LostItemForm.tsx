"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LocationSelectWithSearch from "./LocationSelectWithSearch";
import ImageUpload from "./ImageUpload";

export default function LostItemForm() {
  const router = useRouter();
  const [selectedCampus, setSelectedCampus] = useState<"신촌" | "송도">("신촌");
  const [formData, setFormData] = useState({
    itemName: "",
    foundLocation: "",
    storedLocation: "",
    sameLocation: false,
    foundDate: "",
    description: "",
    finderName: "",
    contactInfo: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(checked && name === "sameLocation"
          ? { storedLocation: prev.foundLocation }
          : {}),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleLocationChange =
    (field: "foundLocation" | "storedLocation") => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "foundLocation" && prev.sameLocation
          ? { storedLocation: value }
          : {}),
      }));
    };

  const handleImageUpload = (imageUrl: string | null) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: imageUrl || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("lost_items")
        .insert([
          {
            item_name: formData.itemName,
            found_location: formData.foundLocation,
            stored_location: formData.sameLocation
              ? formData.foundLocation
              : formData.storedLocation,
            found_date: formData.foundDate,
            description: formData.description || null,
            finder_name: formData.finderName || null,
            contact_info: formData.contactInfo || null,
            image_url: formData.imageUrl || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        router.push(`/boards/${formData.foundLocation}/${data.id}`);
      }
    } catch (error) {
      alert("등록에 실패했습니다: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">분실물 등록</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 캠퍼스 선택 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            캠퍼스 선택 *
          </label>
          <select
            value={selectedCampus}
            onChange={(e) =>
              setSelectedCampus(e.target.value as "신촌" | "송도")
            }
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-800"
            disabled={isSubmitting}
            required
          >
            <option value="신촌" className="text-slate-800">
              신촌 캠퍼스
            </option>
            <option value="송도" className="text-slate-800">
              송도 캠퍼스
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            물건명 *
          </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-slate-50 text-slate-800"
            placeholder="예: 아이폰 14, 지갑, 에어팟 등"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            습득 장소 *
          </label>
          <LocationSelectWithSearch
            campus={selectedCampus}
            value={formData.foundLocation}
            onChange={handleLocationChange("foundLocation")}
            placeholder="습득한 장소를 검색하세요"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            맡겨둔 장소 *
          </label>
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="sameLocation"
                checked={formData.sameLocation}
                onChange={handleChange}
                className="mr-2 text-sky-600 focus:ring-sky-500"
                disabled={isSubmitting}
              />
              <span className="text-sm text-slate-600">습득 장소와 동일</span>
            </label>
          </div>
          <LocationSelectWithSearch
            campus={selectedCampus}
            value={formData.storedLocation}
            onChange={handleLocationChange("storedLocation")}
            placeholder="보관 중인 장소를 검색하세요"
            disabled={formData.sameLocation || isSubmitting}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            습득 날짜 *
          </label>
          <input
            type="date"
            name="foundDate"
            value={formData.foundDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-slate-50 text-slate-800"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            상세 설명 (선택사항)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-slate-50 text-slate-800 whitespace-pre-line"
            placeholder={"물건 특징, 습득 상황 등을\n 자세히 적어주세요"}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            닉네임 (선택사항)
          </label>
          <input
            type="text"
            name="finderName"
            value={formData.finderName}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-slate-50 text-slate-800"
            placeholder="익명으로 등록 시 비워두세요"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            연락처 (선택사항)
          </label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors bg-slate-50 text-slate-800"
            placeholder="연락받을 이메일 또는 전화번호"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            사진 (선택사항)
          </label>
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.imageUrl}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "등록 중..." : "분실물 등록하기"}
        </button>
      </form>
    </div>
  );
}
