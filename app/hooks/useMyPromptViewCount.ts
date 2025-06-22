import {useEffect, useState} from "react";
import {fetchWithAuth} from "@/app/api/fetchWithAuth";

export const useMyPromptViewCount = () => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchViewCount = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth("/api/v1/prompts/my/view-statistics");
      if (!res.ok) throw new Error("조회수 통계를 불러오지 못했습니다.");
      const data = await res.json();
      setCount(data.totalViewCount ?? 0);
    } catch (err: any) {
      setError(err.message || "조회수 통계를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchViewCount();
  }, []);

  const reload = () => {
    fetchViewCount();
  };

  return {count, isLoading, error, setCount, reload};
}; 