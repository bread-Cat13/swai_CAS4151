import Link from "next/link";
import TimeAgo from "./TimeAgo";
import ExpirationTimer from "./ExpirationTimer";
import type { LostItem } from "@/types/database";

interface PostListItemProps {
  post: LostItem;
  location: string;
  searchTerm?: string;
}

export default function PostListItem({
  post,
  location,
  searchTerm,
}: PostListItemProps) {
  // 검색어 하이라이트 함수
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Link
      href={`/boards/${location}/${post.id}`}
      className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-sky-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-bold text-slate-800">
              {searchTerm
                ? highlightText(post.item_name, searchTerm)
                : post.item_name}
            </h3>

            {/* "찾는 중" 제거하고 만료 타이머만 표시 */}
            {post.status === "active" && (
              <ExpirationTimer createdAt={post.created_at} />
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <span className="text-slate-500">습득일:</span>
              <span className="ml-2 text-slate-700 font-medium">
                {new Date(post.found_date).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <div>
              <span className="text-slate-500">등록:</span>
              <span className="ml-2 text-slate-700 font-medium">
                <TimeAgo date={post.created_at} />
              </span>
            </div>
            <div>
              <span className="text-slate-500">등록자:</span>
              <span className="ml-2 text-slate-700 font-medium">
                {post.finder_name || "익명"}
              </span>
            </div>
          </div>

          {post.description && (
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
              {searchTerm
                ? highlightText(post.description, searchTerm)
                : post.description}
            </p>
          )}
        </div>

        <div className="ml-4 text-right">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-xs text-slate-400">상세보기 →</div>
        </div>
      </div>
    </Link>
  );
}
