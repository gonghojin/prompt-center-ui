import {getAccessToken} from "@/app/utils/auth";

export type FavoriteResponse = {
  id: number;
  promptTemplateId: string;
  createdAt: string;
};

export const addFavoritePrompt = async (promptId: string): Promise<FavoriteResponse> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("로그인이 필요합니다.");
  const res = await fetch(`/api/v1/prompts/${promptId}/favorite`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status === 409) throw new Error("이미 즐겨찾기에 추가된 프롬프트입니다.");
  if (!res.ok) throw new Error("즐겨찾기 추가에 실패했습니다.");
  return res.json();
};

export const removeFavoritePrompt = async (promptId: string): Promise<void> => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("로그인이 필요합니다.");
  const res = await fetch(`/api/v1/prompts/${promptId}/favorite`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  if (res.status === 404) throw new Error("즐겨찾기에 없는 프롬프트입니다.");
  if (!res.ok && res.status !== 204) throw new Error("즐겨찾기 삭제에 실패했습니다.");
}; 