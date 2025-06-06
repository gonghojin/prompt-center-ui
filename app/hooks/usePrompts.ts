import {useEffect, useState} from "react";
import {useCategories} from "@/app/hooks/useCategories";
import {getSortType} from "@/lib/getSortType";
import {categoryIconMap} from "@/lib/categoryIconMap";
import type {ApiPrompt, Prompt} from "@/app/types/prompt";
import {getPromptsList} from "@/app/api/promptsApi";

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
        if (searchQuery) params.title = searchQuery;
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
            isFavorite: false,
            isPublic: item.public,
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

  const handleLike = (id: string) => {
    setPrompts((prev) => prev.map((p) => p.id === id ? { ...p, favoriteCount: p.favoriteCount + 1 } : p));
  };
  const handleFavorite = (id: string) => {
    setPrompts((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };
  const handleShare = (id: string) => {
    const promptUrl = `${window.location.origin}/prompts/${id}`;
    navigator.clipboard.writeText(promptUrl).then(() => {
      alert("URL이 복사되었습니다!");
    });
  };
  const handleLoadMore = () => setCurrentPage((prev) => prev + 1);

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
    handleLike,
    handleFavorite,
    handleShare,
    handleLoadMore,
    categories,
    rootCategories,
    totalPrompts,
  };
}; 