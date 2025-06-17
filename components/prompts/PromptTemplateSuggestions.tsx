import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@components/ui/card";
import {Button} from "@components/ui/button";
import {Code2, Palette, BarChart3} from "lucide-react";
import React from "react";

type PromptTemplateSuggestionsProps = {
  handleTemplateClick: (content: string) => void;
};

const PromptTemplateSuggestions = ({handleTemplateClick}: PromptTemplateSuggestionsProps) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">템플릿 제안</CardTitle>
        <CardDescription className="text-white/70">카테고리별 추천 템플릿을 사용해보세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
            variant="outline"
            className="w-full justify-start border-white/30 text-white hover:bg-white/10"
            onClick={() => handleTemplateClick("API 설계 템플릿 내용")}
        >
          <Code2 className="h-4 w-4 mr-2"/>
          API 설계 템플릿
        </Button>
        <Button
            variant="outline"
            className="w-full justify-start border-white/30 text-white hover:bg-white/10"
            onClick={() => handleTemplateClick("UI 컴포넌트 템플릿 내용")}
        >
          <Palette className="h-4 w-4 mr-2"/>
          UI 컴포넌트 템플릿
        </Button>
        <Button
            variant="outline"
            className="w-full justify-start border-white/30 text-white hover:bg-white/10"
            onClick={() => handleTemplateClick("데이터 분석 템플릿 내용")}
        >
          <BarChart3 className="h-4 w-4 mr-2"/>
          데이터 분석 템플릿
        </Button>
      </CardContent>
    </Card>
);

export default PromptTemplateSuggestions; 