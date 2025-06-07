import Link from "next/link";
import type { BoardData } from "@/types/board"; // 공통 타입 import

interface BoardListProps {
  boardsData: BoardData[];
}

export default function BoardList({ boardsData }: BoardListProps) {
  return (
    <div className="space-y-4">
      {boardsData.map((board) => (
        <Link
          key={board.location.id}
          href={`/boards/${board.location.id}`}
          className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-sky-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{board.location.emoji}</div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {board.location.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {board.location.description}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 text-sky-600 mb-1">
                <span className="text-sm">📍</span>
                <span className="font-semibold">
                  {board.itemCount}개 분실물
                </span>
              </div>
              <div className="text-xs text-slate-500">
                최근: {board.lastUpdated}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
