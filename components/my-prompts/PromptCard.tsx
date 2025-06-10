import {FC} from "react";
import {Card, CardContent} from "@components/ui/card";
import {Button} from "@components/ui/button";
import {Badge} from "@components/ui/badge";
import Link from "next/link";
import {Clock, Copy, Edit, Eye, Heart, Share2, Trash2} from "lucide-react";
import {CategoryBadge} from "@components/category/CategoryBadge";
import {getRelativeTime} from "@/app/lib/getRelativeTime";
import type {Prompt} from "@/app/types/prompt";
import {categoryIconMap} from "@/lib/categoryIconMap";
import {FavoriteButton} from "@components/prompts/FavoriteButton";

interface PromptCardProps {
  prompt: Prompt;
  statusLabel: Record<string, string>;
  statusColor: Record<string, string>;
  visibilityLabel: Record<string, string>;
  visibilityColor: Record<string, string>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onCopy: (id: string) => void;
  onFavoriteSuccess?: (id: string, isFavorite: boolean) => void;
}

export const PromptCard: FC<PromptCardProps> = ({
                                                  prompt,
                                                  statusLabel,
                                                  statusColor,
                                                  visibilityLabel,
                                                  visibilityColor,
                                                  onEdit,
                                                  onDelete,
                                                  onShare,
                                                  onCopy,
                                                  onFavoriteSuccess,
                                                }) => {
  const icon = prompt.icon || categoryIconMap[prompt.category.name] || categoryIconMap.default;
  return (
      <Card
          className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {icon && <span className="mr-1">{icon}</span>}
                <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                <CategoryBadge category={prompt.category}
                               className="border-white/30 text-white/70 text-xs"/>
                {prompt.status && (
                    <Badge
                        className={statusColor[prompt.status] || ""}>{statusLabel[prompt.status] || prompt.status}</Badge>
                )}
                {prompt.visibility && (
                    <Badge variant="outline"
                           className={(visibilityColor[prompt.visibility] || "") + " text-xs"}>
                      {visibilityLabel[prompt.visibility] || prompt.visibility}
                    </Badge>
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
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3"/>
                {prompt.favoriteCount}
              </span>
                <span className="flex items-center gap-1">
                <Eye className="h-3 w-3"/>
                  {prompt.viewCount}
              </span>
                <span className="flex items-center gap-1">
                <Clock className="h-3 w-3"/>
                  {getRelativeTime(prompt.updatedAt)}
              </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <FavoriteButton
                  promptId={prompt.id}
                  initialFavorite={!!prompt.favorite}
                  onSuccess={(isFavorite) => onFavoriteSuccess && onFavoriteSuccess(prompt.id, isFavorite)}
              />
              <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white p-1"
                  onClick={() => onShare(prompt.id)}
                  aria-label="공유"
                  tabIndex={0}
              >
                <Share2 className="h-4 w-4"/>
              </Button>
              <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white p-1"
                  onClick={() => onCopy(prompt.id)}
                  aria-label="복사"
                  tabIndex={0}
              >
                <Copy className="h-4 w-4"/>
              </Button>
              <Link href={`/prompts/${prompt.id}/edit`}>
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/70 hover:text-white p-1"
                    onClick={(e) => {
                      e.preventDefault();
                      onEdit(prompt.id);
                    }}
                    aria-label="편집"
                    tabIndex={0}
                >
                  <Edit className="h-4 w-4"/>
                </Button>
              </Link>
              <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-red-400 p-1"
                  onClick={() => onDelete(prompt.id)}
                  aria-label="삭제"
                  tabIndex={0}
              >
                <Trash2 className="h-4 w-4"/>
              </Button>
              <Link href={`/prompts/${prompt.id}`}>
                <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
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