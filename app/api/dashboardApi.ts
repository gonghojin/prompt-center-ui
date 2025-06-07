import {fetchWithAuth} from "@/app/api/fetchWithAuth";

export type PromptStatisticsResponse = {
  totalCount: number;
  currentCount: number;
  previousCount: number;
  percentageChange: number;
};

export const getPromptStatistics = async (
  startDate: string,
  endDate: string
): Promise<PromptStatisticsResponse> => {
  const params = new URLSearchParams({ startDate, endDate }).toString();
  const res = await fetchWithAuth(`/api/v1/dashboard/prompt-statistics?${params}`);
  if (!res.ok) throw new Error("프롬프트 통계 정보를 불러오지 못했습니다.");
  return res.json();
};

export type DashboardPrompt = {
  id: string;
  title: string;
  description: string;
  authorId: number;
  categoryId: number;
  categoryName: string;
  createdByName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favoriteCount: number;
  viewCount: number;
  public: boolean;
};

export type RecentPromptsResponse = DashboardPrompt[];

export const getRecentPrompts = async (pageSize: number = 4): Promise<RecentPromptsResponse> => {
  const params = new URLSearchParams({pageSize: String(pageSize)}).toString();
  const res = await fetchWithAuth(`/api/v1/dashboard/prompts/recent?${params}`);
  if (!res.ok) throw new Error("최근 프롬프트를 불러오지 못했습니다.");
  return res.json();
};

export type RootCategoryStatistic = {
  categoryId: number;
  categoryName: string;
  promptCount: number;
};

export type RootCategoryStatisticsResponse = {
  categories: RootCategoryStatistic[];
};

export const getRootCategoryStatistics = async (): Promise<RootCategoryStatisticsResponse> => {
  const res = await fetchWithAuth("/api/v1/dashboard/categories/root/statistics");
  if (!res.ok) throw new Error("카테고리별 통계를 불러오지 못했습니다.");
  return res.json();
}; 