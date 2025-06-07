"use client";
import { useState, useEffect } from "react";

interface ExpirationTimerProps {
  createdAt: string;
  className?: string;
}

export default function ExpirationTimer({
  createdAt,
  className = "",
}: ExpirationTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false); // 24시간 이내 여부

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const created = new Date(createdAt);
      const expirationDate = new Date(
        created.getTime() + 14 * 24 * 60 * 60 * 1000
      ); // 14일 후

      const timeDiff = expirationDate.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft("만료됨");
        setIsExpired(true);
        setIsUrgent(false);
        return;
      }

      const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (timeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
      );
      const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

      if (days === 0) {
        // 24시간 이내 - 실시간 시:분:초 카운트다운
        setIsUrgent(true);
        const hoursStr = hours.toString().padStart(2, "0");
        const minutesStr = minutes.toString().padStart(2, "0");
        const secondsStr = seconds.toString().padStart(2, "0");
        setTimeLeft(`만료까지 ${hoursStr}:${minutesStr}:${secondsStr}`);
      } else {
        // 24시간 이상 - D-day 형식
        setIsUrgent(false);
        setTimeLeft(`만료까지 D-${days}`);
      }

      setIsExpired(false);
    };

    // 초기 실행
    updateTimer();

    // 24시간 이내면 1초마다, 그 외엔 1분마다 업데이트
    const interval = setInterval(updateTimer, isUrgent ? 1000 : 60000);

    return () => clearInterval(interval);
  }, [createdAt, isUrgent]);

  return (
    <span
      className={`text-xs font-medium ${
        isExpired
          ? "bg-red-100 text-red-700"
          : isUrgent
          ? "bg-orange-100 text-orange-700 animate-pulse" // 24시간 이내는 깜빡임 효과
          : "bg-green-100 text-green-700"
      } px-2 py-1 rounded-full ${className}`}
    >
      {timeLeft}
    </span>
  );
}
