import { useState, useEffect } from "react";
import { Category } from "../types/category";
import { fetchRootCategories, fetchAllCategories } from "@/app/api/categoriesApi";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const rootsData = await fetchRootCategories();
      setRootCategories(rootsData);

      const allData = await fetchAllCategories();
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