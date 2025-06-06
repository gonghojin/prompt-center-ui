import { fetchWithAuth } from "@/app/api/fetchWithAuth";

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