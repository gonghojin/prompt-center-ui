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