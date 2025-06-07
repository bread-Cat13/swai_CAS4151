import Link from "next/link";
import type { Location } from "@/types/database";

interface BoardCardProps {
  location: Location; // Location 타입 그대로 사용
  itemCount: number;
  lastUpdated: string;
}

export default function BoardCard({
  location,
  itemCount,
  lastUpdated,
}: BoardCardProps) {
  return (
    <Link
      href={`/boards/${location.id}`}
      className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-sky-300"
    >
      <div className="text-center">
        <div className="text-4xl mb-3">{location.emoji}</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {location.name}
        </h3>
        {/* description이 optional이므로 조건부 렌더링 */}
        {location.description && (
          <p className="text-sm text-slate-600 mb-4">{location.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-sky-600">
            <span className="text-sm">📍</span>
            <span className="font-semibold">{itemCount}개 분실물</span>
          </div>
          <div className="text-xs text-slate-500">
            최근 업데이트: {lastUpdated}
          </div>
        </div>
      </div>
    </Link>
  );
}
