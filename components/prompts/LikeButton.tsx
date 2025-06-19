import {useEffect, useState} from "react";
import {Heart, Loader2} from "lucide-react";
import {Button} from "@components/ui/button";
import {likePrompt, unlikePrompt} from "@/app/api/promptsApi";

interface LikeButtonProps {
  promptId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  onChange?: (liked: boolean, likeCount: number) => void;
}

export const LikeButton = ({
                             promptId,
                             initialLiked,
                             initialLikeCount,
                             onChange,
                           }: LikeButtonProps) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  // promptId 변경 시 상태 동기화
  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [promptId, initialLiked, initialLikeCount]);

  const handleToggleLike = async () => {
    if (loading) return;
    setLoading(true);
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked((prev) => !prev);
    setLikeCount((count) => prevLiked ? count - 1 : count + 1);
    try {
      let data;
      if (prevLiked) {
        data = await unlikePrompt(promptId);
      } else {
        data = await likePrompt(promptId);
      }
      setLikeCount(data.likeCount);
      setLiked(!prevLiked);
      onChange?.(!prevLiked, data.likeCount);
    } catch (e: any) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      alert(e.message || "좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <Button
          size="sm"
          variant="ghost"
          className={`flex items-center gap-1 p-1 transition-transform ${liked ? "text-pink-400 scale-110" : "text-white/70 hover:text-pink-400"}`}
          onClick={handleToggleLike}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
          tabIndex={0}
          disabled={loading}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !loading) handleToggleLike();
          }}
      >
        {loading ? (
            <Loader2 className="h-3 w-3 animate-spin"/>
        ) : (
            <Heart className={liked ? "h-3 w-3 fill-pink-400 text-pink-400" : "h-3 w-3"}/>
        )}
        <span className="text-xs">{likeCount}</span>
      </Button>
  );
}; 