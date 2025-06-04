import { fetchWithAuth } from "@/app/api/fetchWithAuth";

export const fetchRootCategories = async () => {
  const res = await fetchWithAuth("/api/v1/categories/roots");
  if (!res.ok) throw new Error("루트 카테고리를 불러오지 못했습니다.");
  return res.json();
};

export const fetchAllCategories = async () => {
  const res = await fetchWithAuth("/api/v1/categories");
  if (!res.ok) throw new Error("카테고리를 불러오지 못했습니다.");
  return res.json();
}; 