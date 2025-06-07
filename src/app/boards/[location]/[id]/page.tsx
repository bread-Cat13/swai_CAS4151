"use client";
import { useState, useEffect, useCallback, use } from "react"; // use 추가
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getLocationById } from "@/lib/locations";
import type { LostItem } from "@/types/database";
import type { Location } from "@/types/database";
import ExpirationTimer from "@/components/ExpirationTimer";

interface PostDetailPageProps {
  params: Promise<{ location: string; id: string }>; // Promise로 변경
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  // React.use()로 params unwrap
  const { location: locationParam, id } = use(params);

  const [post, setPost] = useState<LostItem | null>(null);
  const [foundLocation, setFoundLocation] = useState<Location | null>(null);
  const [storedLocation, setStoredLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  const openEverytimeApp = () => {
    // 에브리타임 앱 딥링크
    const everytimeDeepLink = "everytime://";
    const everytimeWebUrl = "https://everytime.kr";

    // 모바일 환경 감지
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // 모바일에서 앱 열기 시도
      window.location.href = everytimeDeepLink;

      // 앱이 설치되지 않은 경우를 대비해 3초 후 웹사이트로 이동
      setTimeout(() => {
        window.open(everytimeWebUrl, "_blank");
      }, 3000);
    } else {
      // 데스크톱에서는 웹사이트 열기
      window.open(everytimeWebUrl, "_blank");
    }
  };

  // fetchPost를 useCallback으로 감싸기 (id 의존성 추가)
  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("lost_items")
        .select("*")
        .eq("id", id) // unwrapped id 사용
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } else {
        setPost(data as LostItem);

        // 장소 정보 가져오기
        const foundLoc = await getLocationById(data.found_location);
        const storedLoc = await getLocationById(data.stored_location);
        setFoundLocation(foundLoc);
        setStoredLocation(storedLoc);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]); // id를 의존성으로 추가

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const copyToClipboard = async () => {
    if (!post || !foundLocation) return;

    const copyText = `분실물 이름: ${post.item_name}
습득 장소: ${foundLocation.name}
습득 날짜: ${new Date(post.found_date).toLocaleDateString("ko-KR")}
보관 장소: ${storedLocation?.name || foundLocation.name}
상세 설명: ${post.description || "없음"}
기타 연락 수단: ${post.contact_info || "없음"}
사진 링크: ${post.image_url || "없음"}`;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
      alert("복사에 실패했습니다.");
    }
  };

  const downloadImage = async () => {
    if (!post?.image_url) return;

    try {
      const response = await fetch(post.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${post.item_name}_image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
      alert("이미지 다운로드에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-slate-600">게시물을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post || !foundLocation) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 브레드크럼 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link
              href="/boards"
              className="hover:text-slate-700 transition-colors"
            >
              게시판
            </Link>
            <span>›</span>
            <Link
              href={`/boards/${locationParam}`} // unwrapped locationParam 사용
              className="hover:text-slate-700 transition-colors"
            >
              {foundLocation.name}
            </Link>
            <span>›</span>
            <span className="text-slate-700">{post.item_name}</span>
          </div>
        </div>

        {/* 게시물 상세 */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* 헤더 */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-800">
                {post.item_name}
              </h1>

              {/* 만료 타이머 추가 */}
              {post.status === "active" && (
                <ExpirationTimer createdAt={post.created_at} />
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>
                등록일: {new Date(post.created_at).toLocaleDateString("ko-KR")}
              </span>
              <span>
                습득일: {new Date(post.found_date).toLocaleDateString("ko-KR")}
              </span>
              {post.finder_name && <span>등록자: {post.finder_name}</span>}
            </div>
          </div>

          {/* 본문 */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* 기본 정보 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-3">
                    기본 정보
                  </h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="w-20 text-slate-500 text-sm">
                        습득 장소:
                      </span>
                      <span className="text-slate-700 font-medium">
                        {foundLocation.name}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-slate-500 text-sm">
                        보관 장소:
                      </span>
                      <span className="text-slate-700 font-medium">
                        {storedLocation?.name || foundLocation.name}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-20 text-slate-500 text-sm">
                        습득 날짜:
                      </span>
                      <span className="text-slate-700 font-medium">
                        {new Date(post.found_date).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>

                {post.contact_info && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-3">
                      연락처
                    </h3>
                    <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
                      <p className="text-slate-700">{post.contact_info}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 이미지 영역 */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  사진
                </h3>
                {post.image_url ? (
                  <div className="rounded-lg overflow-hidden border border-slate-200 relative aspect-video">
                    <Image
                      src={post.image_url}
                      alt={post.item_name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 h-48 flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">등록된 사진이 없습니다</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 상세 설명 */}
            {post.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">
                  상세 설명
                </h3>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {post.description}
                  </p>
                </div>
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-sky-700 hover:to-indigo-700 transition-all shadow-lg"
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
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copySuccess ? "복사 완료!" : "본문 복사하기"}
              </button>

              {/* 에브리타임 앱 열기 버튼 */}
              <button
                onClick={openEverytimeApp}
                className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                에브리타임 앱 열기
              </button>

              {post.image_url && (
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  이미지 다운로드
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="mt-8 text-center">
          <Link
            href={`/boards/${locationParam}`} // unwrapped locationParam 사용
            className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
          >
            ← {foundLocation.name} 게시판으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
