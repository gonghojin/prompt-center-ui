import {FC} from "react";
import {Card, CardContent} from "@components/ui/card";
import {Button} from "@components/ui/button";
import {Badge} from "@components/ui/badge";
import Link from "next/link";
import {Clock, Copy, Eye} from "lucide-react";
import {CategoryBadge} from "@components/category/CategoryBadge";
import {getRelativeTime} from "@/app/lib/getRelativeTime";
import {categoryIconMap} from "@/lib/categoryIconMap";
import {FavoriteButton} from "@components/prompts/FavoriteButton";
import {LikeButton} from "@components/prompts/LikeButton";
import type {FavoritePrompt} from "@/app/types/prompt";

interface FavoritePromptCardProps {
  prompt: FavoritePrompt;
  onRemoveFavorite: (id: string) => void;
  onCopy: (id: string) => void;
  onLikeChange?: (liked: boolean, likeCount: number) => void;
}

export const FavoritePromptCard: FC<FavoritePromptCardProps> = ({
                                                                  prompt,
                                                                  onRemoveFavorite,
                                                                  onCopy,
                                                                  onLikeChange,
                                                                }) => {
  const icon = prompt.icon || (prompt.category ? categoryIconMap[prompt.category.name] : undefined) || categoryIconMap.default;
  return (
      <Card
          className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {icon && <span className="mr-1">{icon}</span>}
                <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                {prompt.category && (
                    <CategoryBadge category={prompt.category}
                                   className="border-white/30 text-white/70 text-xs"/>
                )}
              </div>
              <p className="text-white/70 mb-3">{prompt.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {prompt.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary"
                           className="text-xs bg-white/10 text-white/70">
                      {tag}
                    </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span>by {prompt.author || prompt.createdByName}</span>
                <LikeButton
                    promptId={prompt.promptUuid}
                    initialLiked={!!prompt.liked}
                    initialLikeCount={prompt.favoriteCount ?? 0}
                    onChange={onLikeChange}
                />
                <span className="flex items-center gap-1">
                <Eye className="h-3 w-3"/>
                  {prompt.viewCount}
              </span>
                <span className="flex items-center gap-1">
                <Clock className="h-3 w-3"/>
                  {getRelativeTime(prompt.promptUpdatedAt)}
              </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <FavoriteButton
                  promptId={prompt.promptUuid}
                  initialFavorite={true}
                  onSuccess={() => onRemoveFavorite(prompt.promptUuid)}
              />
              <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white p-1"
                  onClick={() => onCopy(prompt.promptUuid)}
                  aria-label="복사"
                  tabIndex={0}
              >
                <Copy className="h-4 w-4"/>
              </Button>
              <Link href={`/prompts/${prompt.promptUuid}`}>
                <Button
                    size="sm"
                    variant="primary"
                    aria-label="보기"
                    tabIndex={0}
                >
                  보기
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}; 