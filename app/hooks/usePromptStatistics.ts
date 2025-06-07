import { useState, useEffect } from "react";
import { getPromptStatistics, PromptStatisticsResponse } from "@/app/api/dashboardApi";

const getLast7DaysRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6); // 오늘 포함 7일
  // ISO-8601 포맷 (YYYY-MM-DDTHH:mm:ss)
  const toISO = (d: Date) => d.toISOString().slice(0, 19);
  return {
    startDate: toISO(start),
    endDate: toISO(end),
  };
};

export const usePromptStatistics = () => {
  const [data, setData] = useState<PromptStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const { startDate, endDate } = getLast7DaysRange();
        const stats = await getPromptStatistics(startDate, endDate);
        setData(stats);
      } catch (e: any) {
        setError(e.message || "통계 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { data, loading, error };
}; 