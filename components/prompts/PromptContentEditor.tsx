import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@components/ui/card";
import {Textarea} from "@components/ui/textarea";
import React from "react";

type PromptContentEditorProps = {
  content: string;
  handleContentChange: (v: string) => void;
};

const PromptContentEditor = ({content, handleContentChange}: PromptContentEditorProps) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">프롬프트 내용</CardTitle>
        <CardDescription className="text-white/70">프롬프트의 상세 내용을 작성해주세요. 마크다운 문법을
          지원합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
            placeholder={`프롬프트 내용을 입력하세요...\n\n예시:\n# 제목\n## 부제목\n- 목록 항목\n\code\n코드 블록\n\`}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[400px] font-mono"
        />
      </CardContent>
    </Card>
);

export default PromptContentEditor; 