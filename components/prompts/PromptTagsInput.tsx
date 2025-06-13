import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@components/ui/card";
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";
import {Badge} from "@components/ui/badge";
import {Label} from "@components/ui/label";
import {X, Plus} from "lucide-react";
import React from "react";

type PromptTagsInputProps = {
  tags: string[];
  newTag: string;
  handleNewTagChange: (v: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
};

const PromptTagsInput = ({
                           tags,
                           newTag,
                           handleNewTagChange,
                           handleAddTag,
                           handleRemoveTag,
                           handleKeyPress,
                         }: PromptTagsInputProps) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">태그</CardTitle>
        <CardDescription className="text-white/70">프롬프트를 쉽게 찾을 수 있도록 관련 태그를 추가하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
              placeholder="태그 입력 후 Enter"
              value={newTag}
              onChange={(e) => handleNewTagChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
          />
          <Button onClick={handleAddTag} variant="outline"
                  className="border-white/30 text-white hover:bg-white/10">
            <Plus className="h-4 w-4"/>
          </Button>
        </div>
        {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-white/10 text-white/70 pr-1">
                    {tag}
                    <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-400 transition-colors"
                        aria-label="태그 삭제"
                    >
                      <X className="h-3 w-3"/>
                    </button>
                  </Badge>
              ))}
            </div>
        )}
      </CardContent>
    </Card>
);

export default PromptTagsInput; 