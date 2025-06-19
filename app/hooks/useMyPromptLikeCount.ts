import {useCallback, useEffect, useState} from "react";
import {useAuth} from "@/app/hooks/useAuth";

export const useMyPromptLikeCount = () => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {accessToken} = useAuth();

  const fetchCount = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/prompts/my/like-statistics", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("총 좋아요 수를 불러오지 못했습니다.");
      const data = await res.json();
      setCount(data.totalLikeCount);
    } catch (e: any) {
      setError(e.message || "총 좋아요 수를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    isLoading,
    error,
    setCount,
    reload: fetchCount,
  };
}; 