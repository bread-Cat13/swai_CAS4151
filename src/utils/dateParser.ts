export function parseNaturalDate(text: string): {
  startDate?: string;
  endDate?: string;
  keywords: string[];
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  //   const currentMonth = now.getMonth(); // 0-based

  const lowerText = text.toLowerCase();

  // 상대적 시간 표현
  if (lowerText.includes("저번주") || lowerText.includes("지난주")) {
    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(now.getDate() - 7 - now.getDay());
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

    return {
      startDate: lastWeekStart.toISOString().split("T")[0],
      endDate: lastWeekEnd.toISOString().split("T")[0],
      keywords: ["저번주", "지난주"],
    };
  }

  if (lowerText.includes("이번주")) {
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

    return {
      startDate: thisWeekStart.toISOString().split("T")[0],
      endDate: thisWeekEnd.toISOString().split("T")[0],
      keywords: ["이번주"],
    };
  }

  // 월 표현
  const monthMatch = lowerText.match(/(\d+)월/);
  if (monthMatch) {
    const month = parseInt(monthMatch[1]) - 1; // 0-based
    const monthStart = new Date(currentYear, month, 1);
    const monthEnd = new Date(currentYear, month + 1, 0);

    return {
      startDate: monthStart.toISOString().split("T")[0],
      endDate: monthEnd.toISOString().split("T")[0],
      keywords: [`${month + 1}월`],
    };
  }

  // 주차 표현 (6월 첫째주, 6월 둘째주 등)
  const weekMatch = lowerText.match(
    /(\d+)월\s*(첫째주|둘째주|셋째주|넷째주|1주|2주|3주|4주)/
  );
  if (weekMatch) {
    const month = parseInt(weekMatch[1]) - 1;
    const weekNum =
      weekMatch[2].includes("첫째") || weekMatch[2].includes("1")
        ? 1
        : weekMatch[2].includes("둘째") || weekMatch[2].includes("2")
        ? 2
        : weekMatch[2].includes("셋째") || weekMatch[2].includes("3")
        ? 3
        : 4;

    const monthStart = new Date(currentYear, month, 1);
    const firstDayOfWeek = monthStart.getDay();
    const weekStart = new Date(
      currentYear,
      month,
      1 + (weekNum - 1) * 7 - firstDayOfWeek
    );
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return {
      startDate: weekStart.toISOString().split("T")[0],
      endDate: weekEnd.toISOString().split("T")[0],
      keywords: [`${month + 1}월`, weekMatch[2]],
    };
  }

  // 어제, 오늘, 내일
  if (lowerText.includes("어제")) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];
    return { startDate: dateStr, endDate: dateStr, keywords: ["어제"] };
  }

  if (lowerText.includes("오늘")) {
    const dateStr = now.toISOString().split("T")[0];
    return { startDate: dateStr, endDate: dateStr, keywords: ["오늘"] };
  }

  if (lowerText.includes("내일")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    return { startDate: dateStr, endDate: dateStr, keywords: ["내일"] };
  }

  return { keywords: [] };
}
