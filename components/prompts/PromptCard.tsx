import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@components/ui/card";
import {Button} from "@components/ui/button";
import Link from "next/link";
import {Clock, Eye, Share2, User} from "lucide-react";
import {CategoryBadge} from "@components/category/CategoryBadge";
import ReactMarkdown from "react-markdown";
import {Prompt} from "@/app/types/prompt";
import {PromptTags} from "./PromptTags";
import type {FC} from "react";
import {FavoriteButton} from "./FavoriteButton";
import {LikeButton} from "./LikeButton";

interface PromptCardProps {
  prompt: Prompt;
  onLike: (id: string) => void;
  onShare: (id: string) => void;
}

export const PromptCard: FC<PromptCardProps> = ({prompt, onLike, onShare}) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-purple-400">{prompt.icon}</div>
          <div>
            <CategoryBadge category={prompt.category} className="border-white/30 text-white/70 text-xs mb-2" />
            <CardTitle className="text-white text-lg group-hover:text-purple-400 transition-colors">
              {prompt.title}
            </CardTitle>
          </div>
        </div>
      </div>
      <CardDescription className="prose prose-invert prose-sm max-w-none text-white/70">
        <ReactMarkdown
          components={{
            p: (props) => <p className="text-white/70" {...props}>{props.children}</p>,
            ul: (props) => <ul className="list-disc list-inside" {...props}>{props.children}</ul>,
            ol: (props) => <ol className="list-decimal list-inside" {...props}>{props.children}</ol>,
            a: (props) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300"
              >
                {props.children}
              </a>
            ),
          }}
        >
          {prompt.description}
        </ReactMarkdown>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <PromptTags tags={prompt.tags} />
      <div className="flex items-center justify-between text-xs text-white/60 mb-4">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {prompt.author}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {prompt.updatedAt}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-white/60">
          <LikeButton
              promptId={prompt.id}
              initialLiked={prompt.liked ?? false}
              initialLikeCount={prompt.favoriteCount ?? 0}
          />
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {prompt.viewCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white/70 hover:text-white p-1"
            onClick={() => onShare(prompt.id)}
            aria-label="공유"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <FavoriteButton
              promptId={prompt.id}
              initialFavorite={!!prompt.favorite}
          />
          <Link href={`/prompts/${prompt.id}`} tabIndex={0} aria-label="프롬프트 상세 보기">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              보기
            </Button>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
); 