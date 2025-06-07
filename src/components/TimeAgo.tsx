"use client";
import { useState, useEffect } from "react";

interface TimeAgoProps {
  date: string;
  updateInterval?: number; // 업데이트 간격 (밀리초)
}

export default function TimeAgo({
  date,
  updateInterval = 60000,
}: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState("");

  const calculateTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - postDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}일 전`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}개월 전`;
  };

  useEffect(() => {
    // 초기 계산
    setTimeAgo(calculateTimeAgo(date));

    // 주기적 업데이트
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo(date));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [date, updateInterval]);

  return <span>{timeAgo}</span>;
}
