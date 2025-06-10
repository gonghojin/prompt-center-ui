import {useState} from "react";
import {addFavoritePrompt, removeFavoritePrompt} from "@/app/api/favoritePrompt";

interface UseFavoriteProps {
  promptId: string;
  initialFavorite: boolean;
  onSuccess?: (isFavorite: boolean) => void;
  onError?: (e: Error) => void;
}

export const useFavorite = ({
                              promptId,
                              initialFavorite,
                              onSuccess,
                              onError,
                            }: UseFavoriteProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    if (loading) return;
    setLoading(true);
    const prev = isFavorite;
    setIsFavorite(!prev);
    try {
      if (prev) await removeFavoritePrompt(promptId);
      else await addFavoritePrompt(promptId);
      onSuccess?.(!prev);
    } catch (e: any) {
      setIsFavorite(prev);
      onError?.(e);
    } finally {
      setLoading(false);
    }
  };

  return {isFavorite, loading, toggleFavorite};
}; 