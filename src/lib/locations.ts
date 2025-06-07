import { supabase } from "./supabase";
import type { Location } from "@/types/database";

// 모든 활성 장소 조회
export async function getActiveLocations(): Promise<Location[]> {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching locations:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

// ID로 특정 장소 조회
export async function getLocationById(locationId: string) {
  try {
    if (!locationId) {
      return null;
    }

    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("id", locationId)
      .maybeSingle(); // single() → maybeSingle()로 변경

    if (error) {
      console.error("위치 조회 에러:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("위치 조회 중 예외:", err);
    return null;
  }
}

// 장소명으로 조회
export function getLocationName(id: string, locations: Location[]): string {
  const location = locations.find((loc) => loc.id === id);
  return location?.name || "알 수 없는 장소";
}

// 클라이언트 사이드에서 사용할 캐시된 장소 목록
let cachedLocations: Location[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export async function getCachedLocations(): Promise<Location[]> {
  const now = Date.now();

  if (cachedLocations.length === 0 || now - lastFetchTime > CACHE_DURATION) {
    cachedLocations = await getActiveLocations();
    lastFetchTime = now;
  }

  return cachedLocations;
}
