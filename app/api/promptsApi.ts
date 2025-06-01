import type { ApiPrompt } from "@/app/types/prompt";

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
  const res = await fetch(`/api/v1/prompts/advanced-search?${queryString}`);
  if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
  return res.json();
};

export const getPromptDetail = async (id: string) => {
  const res = await fetch(`/api/v1/prompts/${id}`);
  if (!res.ok) throw new Error("프롬프트 상세 조회 실패");
  return res.json();
};

export const createPrompt = async (data: PromptCreatePayload) => {
  const res = await fetch("/api/v1/prompts/", {
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