import type {JSX} from "react";
import {FC} from "react";
import {Card, CardContent} from "@components/ui/card";
import {Button} from "@components/ui/button";
import {Badge} from "@components/ui/badge";
import Link from "next/link";
import {Clock, Copy, Eye, Heart, Star} from "lucide-react";
import {CategoryBadge} from "@components/category/CategoryBadge";
import {getRelativeTime} from "@/app/lib/getRelativeTime";
import type {Category} from "@/app/types/category";
import {categoryIconMap} from "@/lib/categoryIconMap";

export type FavoritePrompt = {
  id: string;
  title: string;
  description: string;
  category: Category;
  author: string;
  favoriteCount: number;
  viewCount: number;
  updatedAt: string;
  tags: string[];
  icon?: JSX.Element;
};

interface FavoritePromptCardProps {
  prompt: FavoritePrompt;
  onRemoveFavorite: (id: string) => void;
  onCopy: (id: string) => void;
}

export const FavoritePromptCard: FC<FavoritePromptCardProps> = ({
                                                                  prompt,
                                                                  onRemoveFavorite,
                                                                  onCopy,
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
                <span>by {prompt.author}</span>
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
              <Button
                  size="sm"
                  variant="ghost"
                  className="text-yellow-400 hover:text-yellow-300 p-1"
                  onClick={() => onRemoveFavorite(prompt.id)}
                  aria-label="즐겨찾기 취소"
                  tabIndex={0}
              >
                <Star className="h-4 w-4 fill-current"/>
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