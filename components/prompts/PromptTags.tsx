import { Badge } from "@components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@components/ui/tooltip";
import type { FC } from "react";

interface PromptTagsProps {
  tags: string[];
}

export const PromptTags: FC<PromptTagsProps> = ({ tags }) => (
  <div className="flex flex-wrap gap-1 mb-4">
    {tags.slice(0, 3).map((tag, idx) => (
      <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-white/70">
        {tag}
      </Badge>
    ))}
    {tags.length > 3 && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className="text-xs bg-white/10 text-white/70 cursor-pointer"
            tabIndex={0}
            aria-label={`추가 태그 ${tags.length - 3}개 더 보기`}
          >
            +{tags.length - 3}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{tags.slice(3).join(", ")}</TooltipContent>
      </Tooltip>
    )}
  </div>
); 