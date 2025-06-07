import BoardCard from "./BoardCard";
import type { BoardData } from "@/types/board"; // 공통 타입 import

interface BoardGalleryProps {
  boardsData: BoardData[];
}

export default function BoardGallery({ boardsData }: BoardGalleryProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {boardsData.map((board) => (
        <BoardCard
          key={board.location.id}
          location={board.location}
          itemCount={board.itemCount}
          lastUpdated={board.lastUpdated}
        />
      ))}
    </div>
  );
}
