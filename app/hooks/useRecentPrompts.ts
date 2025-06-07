import {useEffect, useState} from "react";
import {DashboardPrompt, getRecentPrompts} from "@/app/api/dashboardApi";

export const useRecentPrompts = (pageSize: number = 4) => {
  const [data, setData] = useState<DashboardPrompt[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      setError(null);
      try {
        const prompts = await getRecentPrompts(pageSize);
        setData(prompts);
      } catch (e: any) {
        setError(e.message || "최근 프롬프트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [pageSize]);

  return {data, loading, error};
}; 