import {Star} from "lucide-react";
import {Button} from "@components/ui/button";
import {useFavorite} from "@/app/hooks/useFavorite";

interface FavoriteButtonProps {
  promptId: string;
  initialFavorite: boolean;
  onSuccess?: (isFavorite: boolean) => void;
  onError?: (e: Error) => void;
  size?: "sm" | "lg" | "default" | "icon";
}

export const FavoriteButton = ({
                                 promptId,
                                 initialFavorite,
                                 onSuccess,
                                 onError,
                                 size = "sm",
                               }: FavoriteButtonProps) => {
  const {isFavorite, loading, toggleFavorite} = useFavorite({
    promptId,
    initialFavorite,
    onSuccess,
    onError,
  });

  return (
      <Button
          size={size}
          variant="ghost"
          className={
            isFavorite
                ? "text-yellow-400 hover:text-yellow-300 p-1"
                : "text-white/70 hover:text-yellow-300 p-1"
          }
          onClick={toggleFavorite}
          aria-label={isFavorite ? "즐겨찾기 취소" : "즐겨찾기 추가"}
          title={isFavorite ? "즐겨찾기 취소" : "즐겨찾기 추가"}
          disabled={loading}
          tabIndex={0}
      >
        <Star className={isFavorite ? "h-4 w-4 fill-current" : "h-4 w-4"}/>
      </Button>
  );
}; 