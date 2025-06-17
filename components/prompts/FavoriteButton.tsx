import {Star} from "lucide-react";
import {Button} from "@components/ui/button";
import {useFavorite} from "@/app/hooks/useFavorite";
import {useEffect, useState} from "react";

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
  const {loading, toggleFavorite} = useFavorite({
    promptId,
    initialFavorite,
    onSuccess,
    onError,
  });
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  // prop이 바뀔 때마다 동기화
  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const handleToggle = async () => {
    await toggleFavorite();
    setIsFavorite((prev) => !prev);
  };

  return (
      <Button
          size={size}
          variant="ghost"
          className={
            isFavorite
                ? "text-yellow-400 hover:text-yellow-300 p-1"
                : "text-white/70 hover:text-yellow-300 p-1"
          }
          onClick={handleToggle}
          aria-label={isFavorite ? "즐겨찾기 취소" : "즐겨찾기 추가"}
          title={isFavorite ? "즐겨찾기 취소" : "즐겨찾기 추가"}
          disabled={loading}
          tabIndex={0}
      >
        <Star className={isFavorite ? "h-4 w-4 fill-current" : "h-4 w-4"}/>
      </Button>
  );
}; 