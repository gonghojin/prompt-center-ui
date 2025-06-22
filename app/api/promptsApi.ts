import {fetchWithAuth} from "@/app/api/fetchWithAuth";

export type PromptCreatePayload = {
  title: string;
  description: string;
  content: string;
  createdBy: any;
  tags: string[];
  tagIds: number[];
  inputVariables?: any[];
  variablesSchema?: any;
  categoryId: number;
  visibility: string;
  status: string;
};

export const getPromptsList = async (params: Record<string, string>) => {
  const queryString = new URLSearchParams(params).toString();
  const res = await fetchWithAuth(`/api/v1/prompts/advanced-search?${queryString}`);
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
  return res.json();
};

export const getPromptDetail = async (id: string) => {
  const res = await fetchWithAuth(`/api/v1/prompts/${id}`);
  if (!res.ok) throw new Error("프롬프트 상세 조회 실패");
  return res.json();
};

export const createPrompt = async (data: PromptCreatePayload) => {
  const res = await fetchWithAuth("/api/v1/prompts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorMsg = "프롬프트 생성에 실패했습니다.";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};

// 좋아요 상태/카운트 조회
export const getPromptLikeStatus = async (promptId: string): Promise<{
  liked: boolean;
  likeCount: number
}> => {
  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/like-status`);
  if (!res.ok) throw new Error("좋아요 정보를 불러오지 못했습니다.");
  return res.json();
};

// 좋아요 추가
export const likePrompt = async (promptId: string): Promise<{ likeCount: number }> => {
  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/like`, {method: "POST"});
  if (!res.ok) throw new Error("좋아요 추가 실패");
  return res.json();
};

// 좋아요 취소
export const unlikePrompt = async (promptId: string): Promise<{ likeCount: number }> => {
  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/like`, {method: "DELETE"});
  if (!res.ok) throw new Error("좋아요 취소 실패");
  return res.json();
};

// 조회수 기록 API 
export const recordPromptView = async (
    promptId: string,
    anonymousId?: string
): Promise<{ viewCount: number }> => {
  const body: { anonymousId?: string } = {};

  // 비로그인 사용자인 경우 anonymousId 포함
  if (anonymousId) {
    body.anonymousId = anonymousId;
  }

  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/view`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("프롬프트를 찾을 수 없습니다.");
    } else if (res.status === 400) {
      throw new Error("잘못된 요청입니다.");
    }
    throw new Error("조회수 기록 실패");
  }

  // 실제 백엔드 응답: { success: true, totalViewCount: 1, newView: true }
  const data = await res.json();
  return {viewCount: data.totalViewCount};
};

// 조회수 조회 API
export const getPromptViewCount = async (promptId: string): Promise<{ viewCount: number }> => {
  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/view-count/total`);
  if (!res.ok) throw new Error("조회수 조회 실패");

  // 실제 백엔드 응답: 단순 숫자 (예: 1)
  const count = await res.json();
  return {viewCount: count};
};

// 여러 프롬프트 조회수 일괄 조회 (향후 확장용)
export const getBatchPromptViewCounts = async (promptIds: string[]): Promise<Record<string, number>> => {
  const params = new URLSearchParams();
  promptIds.forEach(id => params.append('ids', id));
  const res = await fetchWithAuth(`/api/v1/prompts/views/batch?${params.toString()}`);
  if (!res.ok) throw new Error("조회수 일괄 조회 실패");
  return res.json();
};

export const deletePrompt = async (id: string) => {
  const res = await fetchWithAuth(`/api/v1/prompts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    let errorMsg = "프롬프트 삭제에 실패했습니다.";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
    }
    throw new Error(errorMsg);
  }
  return res.json();
};