import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@components/ui/card";
import React from "react";

type PromptTypeSelectorProps = {
  isTemplate: boolean;
  handleChange: (isTemplate: boolean) => void;
};

const PromptTypeSelector = ({isTemplate, handleChange}: PromptTypeSelectorProps) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">프롬프트 유형</CardTitle>
        <CardDescription className="text-white/70">일반 프롬프트 또는 템플릿으로 저장할 수 있습니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-white">
            <input
                type="radio"
                name="promptType"
                checked={!isTemplate}
                onChange={() => handleChange(false)}
                aria-label="일반 프롬프트 선택"
            />
            일반 프롬프트
          </label>
          <label className="flex items-center gap-2 text-white">
            <input
                type="radio"
                name="promptType"
                checked={isTemplate}
                onChange={() => handleChange(true)}
                aria-label="템플릿 선택"
            />
            템플릿
          </label>
        </div>
      </CardContent>
    </Card>
);

export default PromptTypeSelector; 