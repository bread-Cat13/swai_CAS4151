"use client";
import { useState, useRef } from "react";
import { uploadImage, validateImageFile } from "@/lib/imageUpload";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string | null) => void;
  currentImage?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  onImageUpload,
  currentImage,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("파일 선택됨:", file);
    setError(null);

    // 파일 유효성 검사
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // 미리보기 생성
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // 업로드 시작
    setUploading(true);
    try {
      console.log("업로드 시작...");
      const imageUrl = await uploadImage(file);

      if (imageUrl) {
        console.log("업로드 성공:", imageUrl);
        onImageUpload(imageUrl);
        setError(null);
      } else {
        console.error("업로드 실패: imageUrl이 null");
        setError("이미지 업로드에 실패했습니다.");
        setPreview(currentImage || null);
      }
    } catch (error) {
      console.error("업로드 오류:", error);
      setError("이미지 업로드 중 오류가 발생했습니다.");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      // 미리보기 URL 정리
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* 미리보기 또는 업로드 영역 */}
      <div className="relative">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="미리보기"
              className="w-full h-48 object-cover rounded-xl border-2 border-slate-200"
              onError={() => {
                console.error("이미지 로드 실패:", preview);
                setError("이미지를 불러올 수 없습니다.");
              }}
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">업로드 중...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={!disabled ? handleButtonClick : undefined}
            className={`w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center transition-colors ${
              !disabled
                ? "hover:border-sky-400 hover:bg-sky-50 cursor-pointer"
                : "opacity-50"
            }`}
          >
            <div className="text-center text-slate-500">
              <svg
                className="w-12 h-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-sm font-medium">이미지 추가</p>
              <p className="text-xs text-slate-400 mt-1">
                클릭하여 이미지를 선택하세요
              </p>
              <p className="text-xs text-slate-400">
                JPEG, PNG, GIF, WebP (최대 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />

      {/* 업로드 버튼 (미리보기가 없을 때만) */}
      {!preview && !disabled && (
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="w-full py-3 px-4 border-2 border-slate-300 rounded-xl text-slate-600 hover:border-sky-400 hover:text-sky-600 transition-colors disabled:opacity-50"
        >
          {uploading ? "업로드 중..." : "이미지 선택"}
        </button>
      )}
    </div>
  );
}
