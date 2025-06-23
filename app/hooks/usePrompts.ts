import {useEffect, useState} from "react";
import {useCategories} from "@/app/hooks/useCategories";
import {getSortType} from "@/lib/getSortType";
import {categoryIconMap} from "@/lib/categoryIconMap";
import type {ApiPrompt, Prompt} from "@/app/types/prompt";
import {getPromptsList} from "@/app/api/promptsApi";
import {addFavoritePrompt, removeFavoritePrompt} from "@/app/api/favoritePrompt";

export const usePrompts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const promptsPerPage = 9;
  const { categories, rootCategories } = useCategories();

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalPrompts / promptsPerPage);

  // 페이지네이션 상태
  const canGoBack = currentPage > 0;
  const canLoadMore = currentPage + 1 < totalPages;

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = {
          page: currentPage.toString(),
          size: promptsPerPage.toString(),
          sortType: getSortType(sortBy),
          status: "PUBLISHED",
        };
        if (searchQuery) params.searchKeyword = searchQuery;
        if (selectedCategory !== "all") params.categoryId = selectedCategory;
        const data = await getPromptsList(params);
        const mapped: Prompt[] = (data.content || []).map((item: ApiPrompt) => {
          const category = categories.find((c) => c.id === item.categoryId) || {
            id: 0,
            name: "other",
            displayName: "기타",
            description: "기타 카테고리",
            parentCategoryId: null,
            parentCategoryName: null,
            isSystem: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const icon = categoryIconMap[category.name] || categoryIconMap.default;
          const updatedAt = item.updatedAt ? item.updatedAt.slice(0, 10) : "-";
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            category,
            author: item.createdByName || "-",
            favoriteCount: item.favoriteCount,
            viewCount: item.viewCount,
            updatedAt,
            tags: Array.isArray(item.tags) && typeof item.tags[0] === "string" ? item.tags : (item.tags?.map((t) => t.name) || []),
            icon,
            favorite: item.favorite,
            isPublic: item.public,
            liked: item.liked
          };
        });
        setPrompts(mapped);
        setTotalPrompts(data.totalElements || 0);
      } catch (e: any) {
        setError(e.message || "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };
    if (categories.length > 0) fetchPrompts();
  }, [categories, searchQuery, selectedCategory, sortBy, currentPage]);

  const handleLike = (id: string, liked: boolean, likeCount: number) => {
    setPrompts((prev) => prev.map((p) => p.id === id ? {
      ...p,
      liked,
      favoriteCount: likeCount
    } : p));
  };
  const handleFavorite = async (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;
    const prevFavorite = prompt.favorite;
    // Optimistic UI: 먼저 토글
    setPrompts((prev) =>
        prev.map((p) => p.id === id ? {...p, favorite: !p.favorite} : p)
    );
    try {
      if (prevFavorite) {
        await removeFavoritePrompt(id);
      } else {
        await addFavoritePrompt(id);
      }
    } catch (e: any) {
      // 실패 시 롤백
      setPrompts((prev) =>
          prev.map((p) => p.id === id ? {...p, favorite: prevFavorite} : p)
      );
      alert(e.message || "즐겨찾기 처리 중 오류가 발생했습니다.");
    }
  };
  const handleShare = (id: string) => {
    const promptUrl = `${window.location.origin}/prompts/${id}`;
    navigator.clipboard.writeText(promptUrl).then(() => {
      alert("URL이 복사되었습니다!");
    });
  };
  const handleLoadMore = () => {
    if (canLoadMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleGoBack = () => {
    if (canGoBack) {
      setCurrentPage((prev) => prev - 1);
      // 페이지 상단으로 스크롤
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  const handleGoToFirst = () => {
    setCurrentPage(0);
    // 페이지 상단으로 스크롤
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  // 검색/필터 변경 시 첫 페이지로 리셋
  const resetToFirstPage = () => {
    setCurrentPage(0);
  };

  // 검색어나 카테고리 변경 시 첫 페이지로 리셋
  useEffect(() => {
    resetToFirstPage();
  }, [searchQuery, selectedCategory, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    loading,
    error,
    paginatedPrompts: prompts,
    filteredPrompts: prompts,
    currentPage,
    promptsPerPage,
    totalPages,
    canGoBack,
    canLoadMore,
    handleLike,
    handleFavorite,
    handleShare,
    handleLoadMore,
    handleGoBack,
    handleGoToFirst,
    resetToFirstPage,
    categories,
    rootCategories,
    totalPrompts,
  };
}; 