import {useEffect, useState} from "react";
import {fetchWithAuth} from "@/app/api/fetchWithAuth";
import {useCategories} from "@/app/hooks/useCategories";
import type {Prompt} from "@/app/types/prompt";
import {categoryIconMap} from "@/lib/categoryIconMap";

export type StatusType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
export type VisibilityType = 'PUBLIC' | 'TEAM' | 'PRIVATE';

export const useMyPrompts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [myPrompts, setMyPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statistics, setStatistics] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<Record<StatusType, boolean>>({
    DRAFT: true,
    PUBLISHED: true,
    ARCHIVED: false,
    DELETED: false,
  });
  const [visibilityFilter, setVisibilityFilter] = useState<Record<VisibilityType, boolean>>({
    PUBLIC: true,
    TEAM: true,
    PRIVATE: true,
  });
  const {categories} = useCategories();

  const fetchMyPrompts = async (params: {
    statusFilters?: StatusType[];
    visibilityFilters?: VisibilityType[];
    searchKeyword?: string;
    sortType?: string;
    page?: number;
    size?: number;
  }) => {
    const query = new URLSearchParams();
    if (params.statusFilters && params.statusFilters.length > 0) {
      query.append("statusFilters", params.statusFilters.join(","));
    }
    if (params.visibilityFilters && params.visibilityFilters.length > 0) {
      query.append("visibilityFilters", params.visibilityFilters.join(","));
    }
    if (params.searchKeyword) {
      query.append("searchKeyword", params.searchKeyword);
    }
    if (params.sortType) {
      query.append("sortType", params.sortType);
    }
    query.append("page", String(params.page ?? 0));
    query.append("size", String(params.size ?? 20));

    const res = await fetchWithAuth(`/api/v1/prompts/my?${query.toString()}`);
    if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
    return res.json();
  };

  const fetchPromptStatistics = async () => {
    const res = await fetchWithAuth("/api/v1/prompts/my/statistics");
    if (!res.ok) throw new Error("통계 정보를 불러오지 못했습니다.");
    return res.json();
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const statusArr = Object.entries(statusFilter)
        .filter(([_, v]) => v)
        .map(([k]) => k as StatusType);
        const visibilityArr = Object.entries(visibilityFilter)
        .filter(([_, v]) => v)
        .map(([k]) => k as VisibilityType);
        const promptsRes = await fetchMyPrompts({
          statusFilters: statusArr,
          visibilityFilters: visibilityArr,
          searchKeyword: searchQuery,
          page: currentPage,
          size: 20,
        });
        const mappedPrompts = (promptsRes.content || []).map((item: any) => {
          const categoryObj = categories.find((c) => String(c.id) === String(item.categoryId)) || {
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
          const icon = categoryIconMap[categoryObj.name] || categoryIconMap.default;
          return {
            ...item,
            category: categoryObj,
            icon,
          };
        });
        setMyPrompts(mappedPrompts);
        setTotalPages(promptsRes.totalPages);
        const statsRes = await fetchPromptStatistics();
        setStatistics(statsRes);
      } catch (err: any) {
        setError(err.message || '데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    if (categories.length > 0) loadData();
  }, [statusFilter, visibilityFilter, searchQuery, currentPage, categories]);

  return {
    myPrompts,
    setMyPrompts,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    statistics,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    visibilityFilter,
    setVisibilityFilter,
  };
}; 