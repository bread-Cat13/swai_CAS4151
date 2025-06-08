import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import { parseNaturalDate } from "@/utils/dateParser";

const openai = new OpenAI({
  apiKey: process.env.PPLX_API_KEY!,
  baseURL: "https://api.perplexity.ai",
});

// 캐싱 시스템
interface DateFilter {
  startDate?: string;
  endDate?: string;
  keywords: string[];
}

interface CacheEntry {
  data: {
    message: string;
    items: LostItem[];
    searchInfo: {
      original: string;
      campus: string;
      processing_mode: string;
      exact_keywords: string[];
      expanded_keywords: string[];
      location_keywords: string[];
      time_keywords: string[];
      date_filter: DateFilter;
      has_location_filter: boolean;
      exact_matches: number;
      expanded_matches: number;
      total_results: number;
    };
  };
  timestamp: number;
}

interface LostItem {
  id: string;
  item_name: string;
  description?: string;
  found_location?: {
    name: string;
    emoji: string;
    campus: string;
  };
  found_date: string;
  status: string;
}

const searchCache = new Map<string, CacheEntry>();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10분

// 검색 정보 인터페이스
interface SearchInfo {
  exact_keywords: string[];
  expanded_keywords: string[];
  location_keywords: string[];
  time_keywords: string[];
}

// 로컬 키워드 매핑
const libraryMappings: { [key: string]: { [campus: string]: string[] } } = {
  신중도: { 신촌: ["연세삼성학술정보관"] },
  중도: {
    신촌: ["중앙도서관"],
    송도: ["언더우드 기념 도서관"],
  },
  언기도: { 송도: ["언더우드 기념 도서관"] },
  도서관: {
    신촌: ["중앙도서관", "연세삼성학술정보관"],
    송도: ["언더우드 기념 도서관"],
  },
};

// 색상 키워드 매핑
const colorMappings: { [key: string]: string[] } = {
  검은색: ["검은", "검정", "블랙", "black"],
  하얀색: ["흰", "흰색", "화이트", "white"],
  빨간색: ["빨강", "레드", "red"],
  파란색: ["파랑", "블루", "blue"],
  노란색: ["노랑", "옐로우", "yellow"],
  초록색: ["초록", "그린", "green"],
};

// 물건 종류 매핑
const itemMappings: { [key: string]: string[] } = {
  휴대폰: ["핸드폰", "폰", "아이폰", "갤럭시", "스마트폰"],
  지갑: ["wallet", "월렛", "카드지갑"],
  우산: ["양산", "umbrella"],
  가방: ["백팩", "책가방", "숄더백", "토트백"],
  이어폰: ["에어팟", "헤드폰", "이어버드", "airpods"],
  충전기: ["어댑터", "케이블", "선"],
};

// 로컬 키워드 처리기
function processKeywordsLocally(message: string, campus: string): SearchInfo {
  const words = message
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1);

  const exactKeywords: string[] = [...words];
  const expandedKeywords: string[] = [];
  const locationKeywords: string[] = [];

  // 도서관 별명 처리
  words.forEach((word) => {
    const mapping = libraryMappings[word];
    if (mapping && mapping[campus]) {
      locationKeywords.push(...mapping[campus]);
      expandedKeywords.push(...mapping[campus]);
    }
  });

  // 색상 확장
  words.forEach((word) => {
    Object.entries(colorMappings).forEach(([standard, variants]) => {
      if (variants.includes(word)) {
        expandedKeywords.push(standard, ...variants);
      }
    });
  });

  // 물건 종류 확장
  words.forEach((word) => {
    Object.entries(itemMappings).forEach(([standard, variants]) => {
      if (variants.includes(word) || word.includes(standard)) {
        expandedKeywords.push(standard, ...variants);
      }
    });
  });

  return {
    exact_keywords: exactKeywords,
    expanded_keywords: [...new Set(expandedKeywords)],
    location_keywords: [...new Set(locationKeywords)],
    time_keywords: [],
  };
}

// AI 사용 여부 결정
function shouldUseAI(message: string): boolean {
  // AI 사용을 극도로 제한 - 정말 복잡한 경우만
  return (
    message.length > 100 && // 매우 긴 문장만
    message.includes("같은 느낌의") && // 매우 추상적 표현만
    !message.match(/\d+월/) && // 월 표현은 AI 사용 안함
    !message.match(/어제|오늘|내일|지난주|이번주/) // 시간 표현도 AI 사용 안함
  );
}

export async function POST(req: NextRequest) {
  try {
    const { message, campus }: { message: string; campus: string } =
      await req.json();

    console.log("🔍 검색 요청:", { message, campus });

    // 캐시 확인
    const cacheKey = `${message.toLowerCase()}_${campus}`;
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      console.log("📦 캐시에서 결과 반환");
      return NextResponse.json(cached.data);
    }

    // 날짜 파싱
    const dateInfo = parseNaturalDate(message);
    console.log("📅 날짜 파싱 결과:", dateInfo);

    let searchInfo: SearchInfo;

    // AI 사용 결정
    if (shouldUseAI(message)) {
      console.log("🤖 AI 처리 모드");
      try {
        const completion = await openai.chat.completions.create({
          model: "sonar-pro",
          messages: [
            {
              role: "system",
              content: `JSON: {"exact_keywords":[], "expanded_keywords":[], "location_keywords":[], "time_keywords":[]}
    도서관: 신중도→연세삼성학술정보관, 중도→중앙도서관(신촌)/언더우드 기념 도서관(송도), 언기도→언더우드 기념 도서관
    시간: 어제,오늘,지난주,이번주,6월,5월`,
            },
            { role: "user", content: message },
          ],
          temperature: 0.1,
          max_tokens: 150,
        });

        const aiResponse = completion.choices[0]?.message?.content || "{}";
        console.log("🤖 원본 AI 응답:", aiResponse);

        // 강화된 JSON 정리
        let cleanedResponse = aiResponse
          .trim()
          .replace(/```json/g, "")
          .replace(/```\s*/gi, "")
          .replace(/`/g, "")
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // 제어 문자 제거

        // JSON 추출 시도
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedResponse = jsonMatch[0];
        }

        console.log("🧹 정리된 응답:", cleanedResponse);

        // JSON 파싱 시도
        try {
          searchInfo = JSON.parse(cleanedResponse);

          // 기본 구조 검증 및 보완
          searchInfo = {
            exact_keywords: Array.isArray(searchInfo.exact_keywords)
              ? searchInfo.exact_keywords
              : [],
            expanded_keywords: Array.isArray(searchInfo.expanded_keywords)
              ? searchInfo.expanded_keywords
              : [],
            location_keywords: Array.isArray(searchInfo.location_keywords)
              ? searchInfo.location_keywords
              : [],
            time_keywords: Array.isArray(searchInfo.time_keywords)
              ? searchInfo.time_keywords
              : [],
          };

          searchInfo.time_keywords = [
            ...(searchInfo.time_keywords || []),
            ...dateInfo.keywords,
          ];
          console.log("✅ AI 분석 성공:", searchInfo);
        } catch (parseError) {
          console.log("❌ JSON 파싱 실패:", parseError);
          throw parseError; // catch 블록으로 이동
        }
      } catch (aiError) {
        console.log("❌ AI 실패, 로컬 처리로 전환", aiError);
        searchInfo = processKeywordsLocally(message, campus);
        searchInfo.time_keywords = dateInfo.keywords;
      }
    } else {
      console.log("⚡ 로컬 처리 모드");
      searchInfo = processKeywordsLocally(message, campus);
      searchInfo.time_keywords = dateInfo.keywords;
    }

    let locationIds: string[] = [];
    let hasLocationFilter = false;

    try {
      const { data: allLocations } = await supabase
        .from("locations")
        .select("id, name, campus")
        .eq("campus", campus);

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
        } else {
          locationIds = allLocations?.map((loc) => loc.id) || [];
        }
      } else {
        locationIds = allLocations?.map((loc) => loc.id) || [];
      }
    } catch (locationErr) {
      console.error("❌ 위치 필터링 에러:", locationErr);
    }

    // 분실물 검색 (수정됨)
    let query = supabase
      .from("lost_items")
      .select(
        `
    *,
    found_location:locations!lost_items_found_location_fkey(name, emoji, campus)
  `
      )
      .eq("status", "active")
      .in("found_location", locationIds);

    if (hasLocationFilter && locationIds.length > 0) {
      query = query.in("found_location", locationIds);
    }

    if (dateInfo.startDate && dateInfo.endDate) {
      query = query
        .gte("found_date", dateInfo.startDate)
        .lte("found_date", dateInfo.endDate);
    }

    const { data: allItems, error: queryError } = await query.limit(30);

    if (queryError) throw queryError;

    // 키워드 매칭 (최적화)
    const exactMatches: LostItem[] = [];
    const expandedMatches: LostItem[] = [];

    if (allItems) {
      const nonTimeKeywords = searchInfo.exact_keywords.filter(
        (keyword: string) => !dateInfo.keywords.includes(keyword)
      );

      if (nonTimeKeywords.length > 0) {
        allItems.forEach((item) => {
          const itemName = item.item_name || "";
          const description = item.description || "";
          const locationName = item.found_location?.name || "";

          const searchText =
            `${itemName} ${description} ${locationName}`.toLowerCase();

          const isExactMatch = nonTimeKeywords.every((keyword: string) =>
            searchText.includes(keyword.toLowerCase())
          );

          if (isExactMatch) {
            exactMatches.push(item);
          }
        });

        if (
          exactMatches.length < 5 &&
          searchInfo.expanded_keywords?.length > 0
        ) {
          const exactIds = exactMatches.map((item) => item.id);
          allItems.forEach((item) => {
            if (exactIds.includes(item.id)) return;

            const itemName = item.item_name || "";
            const description = item.description || "";
            const locationName = item.found_location?.name || "";

            const searchText =
              `${itemName} ${description} ${locationName}`.toLowerCase();

            const isExpandedMatch = searchInfo.expanded_keywords.some(
              (keyword: string) => searchText.includes(keyword.toLowerCase())
            );

            if (isExpandedMatch) {
              expandedMatches.push(item);
            }
          });
        }
      } else {
        exactMatches.push(...allItems.slice(0, 15));
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
      responseMessage = `${campusText}${timeText}"${message}"와 관련된 분실물을 찾지 못했습니다. 다른 키워드로 검색해보시거나, 더 구체적인 정보를 입력해주세요.`;
    }

    const result = {
      message: responseMessage,
      items: combinedItems,
      searchInfo: {
        original: message,
        campus: campus,
        processing_mode: shouldUseAI(message) ? "AI" : "Local",
        exact_keywords: searchInfo.exact_keywords,
        expanded_keywords: searchInfo.expanded_keywords,
        location_keywords: searchInfo.location_keywords,
        time_keywords: searchInfo.time_keywords,
        date_filter: dateInfo,
        has_location_filter: hasLocationFilter,
        exact_matches: exactCount,
        expanded_matches: expandedCount,
        total_results: totalCount,
      },
    };

    // 캐시에 저장
    searchCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    // 캐시 크기 제한 (메모리 관리)
    if (searchCache.size > 100) {
      const oldestKey = searchCache.keys().next().value;
      if (oldestKey) {
        searchCache.delete(oldestKey);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Search API Error:", error);
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
