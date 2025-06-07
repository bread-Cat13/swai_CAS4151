import { supabase } from "./supabase";

export async function uploadImage(file: File): Promise<string | null> {
  try {
    console.log("업로드 시작:", file.name, file.size, file.type);

    // 파일 유효성 검사
    const validationError = validateImageFile(file);
    if (validationError) {
      console.error("파일 유효성 검사 실패:", validationError);
      return null;
    }

    // 파일 이름 생성 (중복 방지)
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `lost-items/${fileName}`;

    console.log("업로드 경로:", filePath);

    // Supabase Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from("lost-items-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type, // MIME 타입 명시적 설정
      });

    if (uploadError) {
      console.error("업로드 오류:", uploadError);
      return null;
    }

    console.log("업로드 성공, URL 생성 중...");

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from("lost-items-images").getPublicUrl(filePath);

    console.log("생성된 URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    return null;
  }
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // URL에서 파일 경로 추출
    const urlParts = imageUrl.split("/");
    const bucketIndex = urlParts.findIndex(
      (part) => part === "lost-items-images"
    );
    if (bucketIndex === -1) return false;

    const filePath = urlParts.slice(bucketIndex + 1).join("/");
    console.log("삭제할 파일 경로:", filePath);

    const { error } = await supabase.storage
      .from("lost-items-images")
      .remove([filePath]);

    if (error) {
      console.error("이미지 삭제 오류:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("이미지 삭제 오류:", error);
    return false;
  }
}

// 이미지 파일 유효성 검사
export function validateImageFile(file: File): string | null {
  console.log("파일 검사:", file.name, file.size, file.type);

  // 파일 크기 체크 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return "파일 크기는 5MB 이하여야 합니다.";
  }

  // 파일 타입 체크
  if (!file.type.startsWith("image/")) {
    return "이미지 파일만 업로드 가능합니다.";
  }

  // 지원되는 형식 체크
  const supportedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!supportedTypes.includes(file.type)) {
    return "JPEG, PNG, GIF, WebP 형식만 지원됩니다.";
  }

  return null; // 유효함
}
