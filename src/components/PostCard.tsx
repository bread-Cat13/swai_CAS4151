import Link from "next/link";
import type { LostItem } from "@/types/database";
import TimeAgo from "./TimeAgo"; // 추가

interface PostCardProps {
  post: LostItem;
  location: string;
}

export default function PostCard({ post, location }: PostCardProps) {
  //   const timeAgo = (date: string) => {
  //     const now = new Date();
  //     const postDate = new Date(date);
  //     const diffInHours = Math.floor(
  //       (now.getTime() - postDate.getTime()) / (1000 * 60 * 60)
  //     );

  //     if (diffInHours < 1) return "방금 전";
  //     if (diffInHours < 24) return `${diffInHours}시간 전`;
  //     const diffInDays = Math.floor(diffInHours / 24);
  //     return `${diffInDays}일 전`;
  //   };

  return (
    <Link
      href={`/boards/${location}/${post.id}`}
      className="block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-sky-300"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">
          {post.item_name}
        </h3>
        <div className="text-sm text-slate-500 space-y-1">
          <div>
            습득일: {new Date(post.found_date).toLocaleDateString("ko-KR")}
          </div>
          <div>
            등록: <TimeAgo date={post.created_at} />
          </div>
        </div>
      </div>

      {post.description && (
        <p className="text-slate-600 text-sm line-clamp-2 mb-4">
          {post.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400">
          {post.finder_name || "익명"}
        </div>
        <div className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">
          {post.status === "active" ? "찾는 중" : "완료"}
        </div>
      </div>
    </Link>
  );
}
