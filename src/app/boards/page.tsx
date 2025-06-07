"use client";
import { useState, useEffect, useCallback } from "react";
import { getActiveLocations } from "@/lib/locations";
import { supabase } from "@/lib/supabase";
import LocationSearch from "@/components/LocationSearch";
import ViewToggle from "@/components/ViewToggle";
import BoardGallery from "@/components/BoardGallery";
import BoardList from "@/components/BoardList";
import type { BoardData } from "@/types/board";
import { getActiveItems } from "@/utils/expiry";

export default function BoardsPage() {
  const [boardsData, setBoardsData] = useState<BoardData[]>([]);
  const [filteredData, setFilteredData] = useState<BoardData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [view, setView] = useState<"gallery" | "list">("gallery");
  const [loading, setLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState<"신촌" | "송도">("신촌");

  const fetchBoardsData = useCallback(async () => {
    setLoading(true);
    try {
      const allLocations = await getActiveLocations();
      const filteredLocations = allLocations.filter(
        (loc) => loc.campus === selectedCampus
      );

      const boardsDataPromises = filteredLocations.map(async (location) => {
        const { data: allItems } = await supabase
          .from("lost_items")
          .select("created_at")
          .eq("found_location", location.id)
          .eq("status", "active")
          .order("created_at", { ascending: false });

        const activeItems = allItems ? getActiveItems(allItems) : [];
        const itemCount = activeItems.length;
        const lastUpdated =
          activeItems.length > 0
            ? new Date(activeItems[0].created_at).toLocaleDateString("ko-KR")
            : "등록된 분실물 없음";

        return {
          location,
          itemCount,
          lastUpdated,
        };
      });

      const data = await Promise.all(boardsDataPromises);
      setBoardsData(data);
      setFilteredData(data);
      setSelectedLocation(null); // 캠퍼스 변경 시 검색 초기화
    } catch (error) {
      console.error("Error fetching boards data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCampus]);

  useEffect(() => {
    fetchBoardsData();
  }, [fetchBoardsData]);

  useEffect(() => {
    if (selectedLocation) {
      setFilteredData(
        boardsData.filter((board) => board.location.id === selectedLocation)
      );
    } else {
      setFilteredData(boardsData);
    }
  }, [selectedLocation, boardsData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 캠퍼스 탭 추가 */}
        <div className="flex gap-2 justify-center mb-6">
          {["신촌", "송도"].map((campus) => (
            <button
              key={campus}
              onClick={() => setSelectedCampus(campus as "신촌" | "송도")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCampus === campus
                  ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-200 text-slate-700 hover:bg-gray-300"
              }`}
            >
              {campus}캠퍼스
            </button>
          ))}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            장소별 분실물 게시판
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            원하는 장소에서 분실물을 확인해보세요
          </p>
          <LocationSearch
            campus={selectedCampus}
            onLocationSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-slate-600">
            {selectedLocation ? (
              <span>
                <strong>
                  {
                    boardsData.find(
                      (board) => board.location.id === selectedLocation
                    )?.location.name
                  }
                </strong>{" "}
                검색 결과:
                <strong className="text-sky-600 ml-1">
                  {filteredData.length}개 건물
                </strong>
              </span>
            ) : (
              <span>
                전체{" "}
                <strong className="text-sky-600">
                  {filteredData.length}개 건물
                </strong>
              </span>
            )}
          </div>

          <ViewToggle view={view} onViewChange={setView} />
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-slate-600">게시판 정보를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {filteredData.length > 0 ? (
              view === "gallery" ? (
                <BoardGallery boardsData={filteredData} />
              ) : (
                <BoardList boardsData={filteredData} />
              )
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-slate-500">다른 검색어로 시도해보세요</p>
              </div>
            )}
          </>
        )}

        {/* 맨위로 가기 버튼 */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-lg p-3 transition-all"
          aria-label="맨 위로"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
