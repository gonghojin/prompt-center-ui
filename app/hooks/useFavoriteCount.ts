import {useEffect, useState} from "react";
import {fetchWithAuth} from "@/app/api/fetchWithAuth";

export const useFavoriteCount = () => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth("/api/v1/prompts/my/favorites/count");
        if (!res.ok) throw new Error("즐겨찾기 개수를 불러오지 못했습니다.");
        const data = await res.json();
        setCount(data.count ?? 0);
      } catch (err: any) {
        setError(err.message || "즐겨찾기 개수를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCount();
  }, []);

  return {count, isLoading, error};
}; 