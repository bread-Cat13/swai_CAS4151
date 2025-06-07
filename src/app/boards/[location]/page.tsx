"use client";
import { useState, useEffect, useCallback, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getLocationById } from "@/lib/locations";
import PostSearch from "@/components/PostSearch";
import PostListItem from "@/components/PostListItem";
import ExpiredPostListItem from "@/components/ExpiredPostListItem";
import PostTabs from "@/components/PostTabs";
import { getActiveItems, getExpiredItems } from "@/utils/expiry";
import type { LostItem, Location } from "@/types/database";

interface LocationBoardPageProps {
  params: Promise<{ location: string }>;
}

export default function LocationBoardPage({ params }: LocationBoardPageProps) {
  const { location: locationParam } = use(params);

  const [allPosts, setAllPosts] = useState<LostItem[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<LostItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "expired">("active");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("lost_items")
        .select("*")
        .eq("found_location", locationParam)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        setAllPosts([]);
      } else {
        setAllPosts(data as LostItem[]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  }, [locationParam]);

  const filterPosts = useCallback(() => {
    // 먼저 활성/만료 필터링
    const tabFiltered =
      activeTab === "active"
        ? getActiveItems(allPosts)
        : getExpiredItems(allPosts);

    // 그 다음 검색어 필터링
    if (!searchTerm.trim()) {
      setFilteredPosts(tabFiltered);
      return;
    }

    const searchFiltered = tabFiltered.filter((post) => {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = post.item_name.toLowerCase().includes(searchLower);
      const descriptionMatch =
        post.description?.toLowerCase().includes(searchLower) || false;
      return titleMatch || descriptionMatch;
    });

    setFilteredPosts(searchFiltered);
  }, [allPosts, searchTerm, activeTab]);

  useEffect(() => {
    const fetchLocation = async () => {
      const locationData = await getLocationById(locationParam);
      if (!locationData) {
        notFound();
      }
      setLocation(locationData);
    };

    fetchLocation();
    fetchPosts();
  }, [locationParam, fetchPosts]);

  useEffect(() => {
    filterPosts();
  }, [filterPosts]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleTabChange = (tab: "active" | "expired") => {
    setActiveTab(tab);
  };

  // 활성/만료 게시물 개수 계산
  const activeCount = getActiveItems(allPosts).length;
  const expiredCount = getExpiredItems(allPosts).length;

  if (!location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-slate-600">페이지를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{location.emoji}</div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2 leading-tight">
            {location.name}
          </h1>
          <div className="text-2xl font-semibold text-slate-700 mb-4">
            분실물 게시판
          </div>
        </div>

        {/* 탭 */}
        <PostTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          activeCount={activeCount}
          expiredCount={expiredCount}
        />

        {/* 검색창 */}
        <div className="mb-8">
          <PostSearch onSearch={handleSearch} searchTerm={searchTerm} />
        </div>

        {/* 검색 결과 정보 */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-slate-600">
            {searchTerm ? (
              <span>
                &apos;<strong className="text-sky-600">{searchTerm}</strong>
                &apos; 검색 결과:
                <strong className="text-sky-600 ml-1">
                  {filteredPosts.length}개
                </strong>
              </span>
            ) : (
              <span>
                {activeTab === "active" ? "활성" : "만료된"}{" "}
                <strong className="text-sky-600">
                  {filteredPosts.length}개
                </strong>
                의 분실물
              </span>
            )}
          </div>

          {/* 새로고침 버튼 */}
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            새로고침
          </button>
        </div>

        {/* 로딩 상태 */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-slate-600">게시물을 불러오는 중...</p>
          </div>
        ) : (
          /* 게시물 목록 */
          <>
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) =>
                  activeTab === "active" ? (
                    <PostListItem
                      key={post.id}
                      post={post}
                      location={locationParam}
                      searchTerm={searchTerm}
                    />
                  ) : (
                    <ExpiredPostListItem
                      key={post.id}
                      post={post}
                      location={locationParam}
                      searchTerm={searchTerm}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">
                  {searchTerm ? "🔍" : activeTab === "active" ? "📦" : "📁"}
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  {searchTerm
                    ? "검색 결과가 없습니다"
                    : activeTab === "active"
                    ? "등록된 분실물이 없습니다"
                    : "만료된 분실물이 없습니다"}
                </h3>
                <p className="text-slate-500">
                  {searchTerm
                    ? "다른 검색어로 시도해보세요"
                    : activeTab === "active"
                    ? "첫 번째 분실물을 등록해보세요!"
                    : "아직 만료된 분실물이 없습니다"}
                </p>
              </div>
            )}
          </>
        )}

        {/* 뒤로가기 버튼 */}
        <div className="mt-12 text-center">
          <Link
            href="/boards"
            className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
          >
            ← 게시판 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
