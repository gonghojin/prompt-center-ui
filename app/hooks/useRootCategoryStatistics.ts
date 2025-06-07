import {useEffect, useState} from "react";
import {getRootCategoryStatistics, RootCategoryStatisticsResponse} from "@/app/api/dashboardApi";

export const useRootCategoryStatistics = () => {
  const [data, setData] = useState<RootCategoryStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const stats = await getRootCategoryStatistics();
        setData(stats);
      } catch (e: any) {
        setError(e.message || "카테고리별 통계를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return {data, loading, error};
}; 