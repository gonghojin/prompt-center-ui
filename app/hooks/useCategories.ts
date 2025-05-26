import { useState, useEffect } from "react";
import { Category } from "../types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const rootsResponse = await fetch("/api/v1/categories/roots");
      if (!rootsResponse.ok) throw new Error("루트 카테고리를 불러오지 못했습니다.");
      const rootsData = await rootsResponse.json();
      setRootCategories(rootsData);

      const allResponse = await fetch("/api/v1/categories");
      if (!allResponse.ok) throw new Error("카테고리를 불러오지 못했습니다.");
      const allData = await allResponse.json();
      setCategories(allData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    rootCategories,
    loading,
    error,
    refetch: fetchCategories,
  };
}; 