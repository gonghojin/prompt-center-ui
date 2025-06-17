import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@components/ui/card";
import {Input} from "@components/ui/input";
import {Label} from "@components/ui/label";
import {Textarea} from "@components/ui/textarea";
import {CategorySelect} from "@/components/category/CategorySelect";
import {FileText} from "lucide-react";
import React from "react";

type PromptBasicInfoFormProps = {
  title: string;
  description: string;
  category: string;
  categories: any[];
  rootCategories: any[];
  handleTitleChange: (v: string) => void;
  handleDescriptionChange: (v: string) => void;
  handleCategoryChange: (v: string) => void;
};

const PromptBasicInfoForm = ({
                               title,
                               description,
                               category,
                               categories,
                               rootCategories,
                               handleTitleChange,
                               handleDescriptionChange,
                               handleCategoryChange,
                             }: PromptBasicInfoFormProps) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5"/>
          기본 정보
        </CardTitle>
        <CardDescription className="text-white/70">프롬프트의 기본 정보를 입력해주세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">제목 *</Label>
          <Input
              id="title"
              placeholder="프롬프트 제목을 입력하세요"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">설명 *</Label>
          <Textarea
              id="description"
              placeholder="프롬프트에 대한 간단한 설명을 입력하세요"
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-white">카테고리 *</Label>
          <CategorySelect
              categories={categories}
              rootCategories={rootCategories}
              value={category}
              onChange={handleCategoryChange}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
          />
        </div>
      </CardContent>
    </Card>
);

export default PromptBasicInfoForm; 