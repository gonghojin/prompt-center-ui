import {useCallback, useEffect, useState} from "react";
import type {FavoritePrompt} from "@/app/types/prompt";

type ApiResponse = {
  content: FavoritePrompt[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

type UseFavoritePromptsReturn = {
  favoritePrompts: FavoritePrompt[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setCurrentPage: (p: number) => void;
  reload: () => void;
  setFavoritePrompts: React.Dispatch<React.SetStateAction<FavoritePrompt[]>>;
};

export const useFavoritePrompts = (
    initialPage = 0,
    initialSize = 20,
    initialSort = "createdAt",
    initialOrder = "desc"
): UseFavoritePromptsReturn => {
  const [favoritePrompts, setFavoritePrompts] = useState<FavoritePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [reloadFlag, setReloadFlag] = useState(false);

  const fetchFavoritePrompts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (!accessToken) {
        setError("로그인이 필요합니다.");
        setIsLoading(false);
        return;
      }
      const params = new URLSearchParams({
        page: String(currentPage),
        size: String(initialSize),
        sort: initialSort,
        order: initialOrder,
      });
      if (searchQuery) params.append("searchKeyword", searchQuery);
      const res = await fetch(`/api/v1/prompts/my/favorites?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "즐겨찾기 목록을 불러오지 못했습니다.");
        setIsLoading(false);
        return;
      }
      const data: ApiResponse = await res.json();
      setFavoritePrompts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (e: any) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, initialSize, initialSort, initialOrder, searchQuery]);

  useEffect(() => {
    fetchFavoritePrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, reloadFlag]);

  const reload = () => setReloadFlag((f) => !f);

  return {
    favoritePrompts,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalElements,
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    reload,
    setFavoritePrompts,
  };
}; 