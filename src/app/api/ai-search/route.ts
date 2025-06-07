import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import { parseNaturalDate } from "@/utils/dateParser";

const openai = new OpenAI({
  apiKey: process.env.PPLX_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

export async function POST(req: NextRequest) {
  try {
    const { message, campus } = await req.json();

    console.log("🔍 검색 요청:", { message, campus });

    // 자연어 날짜 파싱
    const dateInfo = parseNaturalDate(message);
    console.log("📅 날짜 파싱 결과:", dateInfo);

    // 간단한 키워드 추출 (폴백용)
    const simpleKeywords = message
      .toLowerCase()
      .split(/\s+/)
      .filter((word: string) => word.length > 1);

    // AI 분석 (날짜 정보 포함)
    let searchInfo;
    try {
      const completion = await openai.chat.completions.create({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: `분실물 검색어를 분석하여 정확한 JSON만 응답하세요.

시간 표현도 인식하세요:
- "저번주", "지난주", "이번주"
- "6월", "5월" 등 월 표현
- "6월 첫째주", "6월 둘째주" 등 주차 표현
- "어제", "오늘", "내일"

형식:
{"exact_keywords": ["키워드1"], "expanded_keywords": ["연관어1"], "location_keywords": ["위치1"], "time_keywords": ["시간1"]}

예시:
- "저번주 과학관 아이폰" → {"exact_keywords": ["저번주", "과학관", "아이폰"], "expanded_keywords": ["iphone"], "location_keywords": ["과학관"], "time_keywords": ["저번주"]}
- "6월 첫째주 지갑" → {"exact_keywords": ["6월", "첫째주", "지갑"], "expanded_keywords": ["wallet"], "time_keywords": ["6월", "첫째주"]}

반드시 유효한 JSON만 응답하세요.`,
          },
          { role: "user", content: message },
        ],
        temperature: 0.1,
      });

      const aiResponse = completion.choices[0]?.message?.content || "{}";
      const cleanedResponse = aiResponse
        .trim()
        .replace(/```/g, "")
        .replace(/```\s*$/g, "")
        .replace(/`/g, "")
        .trim();

      searchInfo = JSON.parse(cleanedResponse);
      console.log("✅ AI 분석 성공:", searchInfo);
    } catch (aiError) {
      console.log("❌ AI 실패, 폴백 사용", aiError);
      searchInfo = {
        exact_keywords: simpleKeywords,
        expanded_keywords: [],
        location_keywords: simpleKeywords.filter(
          (word: string) =>
            word.includes("관") ||
            word.includes("도서관") ||
            word.includes("학생회관")
        ),
        time_keywords: dateInfo.keywords,
      };
    }

    // 위치 필터링
    let locationIds: string[] = [];
    let hasLocationFilter = false;

    try {
      let locationQuery = supabase.from("locations").select("id, name, campus");

      if (campus) {
        locationQuery = locationQuery.eq("campus", campus);
      }

      const { data: allLocations } = await locationQuery;
      console.log("📍 전체 위치:", allLocations);

      if (searchInfo.location_keywords?.length > 0) {
        const matchedLocations =
          allLocations?.filter((loc) =>
            searchInfo.location_keywords.some((keyword: string) =>
              loc.name.toLowerCase().includes(keyword.toLowerCase())
            )
          ) || [];

        if (matchedLocations.length > 0) {
          locationIds = matchedLocations.map((loc) => loc.id);
          hasLocationFilter = true;
          console.log("🎯 매칭된 위치:", matchedLocations);
        } else {
          console.log("⚠️ 위치 매칭 실패, 전체 검색으로 전환");
          locationIds = allLocations?.map((loc) => loc.id) || [];
        }
      } else {
        locationIds = allLocations?.map((loc) => loc.id) || [];
      }
    } catch (locationErr) {
      console.error("❌ 위치 필터링 에러:", locationErr);
    }

    // 분실물 검색
    let query = supabase
      .from("lost_items")
      .select(
        `
        *,
        found_location:locations!lost_items_found_location_fkey(name, emoji, campus)
      `
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    // 위치 필터링 적용
    if (hasLocationFilter && locationIds.length > 0) {
      query = query.in("found_location", locationIds);
    }

    // 날짜 필터링 추가
    if (dateInfo.startDate && dateInfo.endDate) {
      query = query
        .gte("found_date", dateInfo.startDate)
        .lte("found_date", dateInfo.endDate);
      console.log("📅 날짜 필터 적용:", {
        start: dateInfo.startDate,
        end: dateInfo.endDate,
      });
    }

    const { data: allItems, error: queryError } = await query.limit(50);

    console.log("📦 조회된 분실물 수:", allItems?.length || 0);

    if (queryError) {
      console.error("❌ 분실물 조회 에러:", queryError);
      throw queryError;
    }

    // 키워드 매칭
    let exactMatches = [];
    let expandedMatches = [];

    if (allItems) {
      if (searchInfo.exact_keywords?.length > 0) {
        // 시간 키워드는 매칭에서 제외 (이미 날짜 필터로 처리됨)
        const nonTimeKeywords = searchInfo.exact_keywords.filter(
          (keyword: string) => !dateInfo.keywords.includes(keyword)
        );

        if (nonTimeKeywords.length > 0) {
          exactMatches = allItems.filter((item) => {
            const searchText = `${item.item_name} ${item.description || ""} ${
              item.found_location?.name || ""
            }`.toLowerCase();
            return nonTimeKeywords.every((keyword: string) =>
              searchText.includes(keyword.toLowerCase())
            );
          });

          if (
            exactMatches.length < 5 &&
            searchInfo.expanded_keywords?.length > 0
          ) {
            const exactIds = exactMatches.map((item) => item.id);
            expandedMatches = allItems.filter((item) => {
              if (exactIds.includes(item.id)) return false;
              const searchText = `${item.item_name} ${item.description || ""} ${
                item.found_location?.name || ""
              }`.toLowerCase();
              return searchInfo.expanded_keywords.some((keyword: string) =>
                searchText.includes(keyword.toLowerCase())
              );
            });
          }
        } else {
          // 시간 키워드만 있는 경우 모든 결과 반환
          exactMatches = allItems.slice(0, 15);
        }
      } else {
        exactMatches = allItems.slice(0, 15);
      }
    }

    const combinedItems = [...exactMatches, ...expandedMatches.slice(0, 10)];

    // 응답 생성
    const exactCount = exactMatches.length;
    const expandedCount = expandedMatches.length;
    const totalCount = combinedItems.length;
    const campusText = campus ? `${campus} 캠퍼스에서 ` : "";
    const timeText =
      dateInfo.keywords.length > 0
        ? `${dateInfo.keywords.join(", ")} 기간의 `
        : "";

    let responseMessage = "";
    if (totalCount > 0) {
      if (exactCount > 0 && expandedCount > 0) {
        responseMessage = `${campusText}${timeText}"${message}"와 정확히 일치하는 ${exactCount}개와 관련된 ${expandedCount}개, 총 ${totalCount}개의 분실물을 찾았습니다!`;
      } else if (exactCount > 0) {
        responseMessage = `${campusText}${timeText}"${message}"와 정확히 일치하는 ${exactCount}개의 분실물을 찾았습니다!`;
      } else {
        responseMessage = `${campusText}${timeText}"${message}"와 관련된 ${expandedCount}개의 분실물을 찾았습니다.`;
      }
    } else {
      if (hasLocationFilter || dateInfo.keywords.length > 0) {
        responseMessage = `${campusText}${timeText}"${message}"와 관련된 분실물을 찾지 못했습니다. 다른 키워드나 시간대로 검색해보시거나, 더 구체적인 정보를 입력해주세요.`;
      } else {
        responseMessage = `${campusText}"${message}"와 관련된 분실물을 찾지 못했습니다. 물건의 종류, 색상, 발견 장소, 시간 등 더 자세한 정보를 입력해주세요.`;
      }
    }

    return NextResponse.json({
      message: responseMessage,
      items: combinedItems,
      searchInfo: {
        original: message,
        campus: campus,
        exact_keywords: searchInfo.exact_keywords,
        expanded_keywords: searchInfo.expanded_keywords,
        location_keywords: searchInfo.location_keywords,
        time_keywords: searchInfo.time_keywords,
        date_filter: dateInfo,
        has_location_filter: hasLocationFilter,
        filtered_locations: locationIds.length,
        exact_matches: exactCount,
        expanded_matches: expandedCount,
        total_results: totalCount,
      },
    });
  } catch (error) {
    console.error("❌ AI Search API Error:", error);
    return NextResponse.json(
      {
        message: "검색 중 오류가 발생했습니다. 다시 시도해주세요.",
        items: [],
        error: true,
        errorDetails: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
