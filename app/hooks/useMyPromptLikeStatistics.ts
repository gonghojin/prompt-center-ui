import {useCallback, useEffect, useState} from "react";
import {getMyPromptLikeStatistics} from "@/app/api/myPromptsApi";

interface UseMyPromptLikeStatisticsReturn {
  count: number;
  isLoading: boolean;
  error: string | null;
  setCount: (count: number | ((prev: number) => number)) => void;
  reload: () => Promise<void>;
  fetchLikeStatistics: () => Promise<number>;
}

export const useMyPromptLikeStatistics = (): UseMyPromptLikeStatisticsReturn => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikeStatistics = useCallback(async (): Promise<number> => {
    try {
      const data = await getMyPromptLikeStatistics();
      return data.totalLikeCount;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const totalLikeCount = await fetchLikeStatistics();
      setCount(totalLikeCount);
    } catch (error) {
      setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchLikeStatistics]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    count,
    isLoading,
    error,
    setCount,
    reload,
    fetchLikeStatistics,
  };
}; 