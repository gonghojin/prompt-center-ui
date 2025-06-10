"use client"

import type React from "react"
import {useState} from "react"
import Link from "next/link"
import {Button} from "@components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@components/ui/card"
import {Input} from "@components/ui/input"
import {Label} from "@components/ui/label"
import {Textarea} from "@components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@components/ui/select"
import {Switch} from "@components/ui/switch"
import {Badge} from "@components/ui/badge"
import {
  ArrowLeft,
  BarChart3,
  Code2,
  Eye,
  FileText,
  Globe,
  Lock,
  Palette,
  Plus,
  Save,
  X,
} from "lucide-react"
import {useCategories} from "@/app/hooks/useCategories"
import {CategorySelect} from "@/components/category/CategorySelect"
import {fetchWithAuth} from "@/app/api/fetchWithAuth"

const PromptVisibility = {
  PUBLIC: "PUBLIC",
  TEAM: "TEAM",
  PRIVATE: "PRIVATE",
} as const;

const PromptStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED",
} as const;

const TEMP_SYSTEM_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "temp@system.local",
  name: "System User",
};

type TemplateVariable = {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
};

type PromptTypeSelectorProps = {
  isTemplate: boolean;
  handleChange: (isTemplate: boolean) => void;
};
const PromptTypeSelector = ({ isTemplate, handleChange }: PromptTypeSelectorProps) => (
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
        <FileText className="h-5 w-5" />
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

type PromptTemplateVariablesProps = {
  templateVariables: TemplateVariable[];
  newVariable: TemplateVariable;
  handleNewVariableChange: (v: Partial<TemplateVariable>) => void;
  handleAddVariable: () => void;
  handleRemoveVariable: (idx: number) => void;
};
const PromptTemplateVariables = ({
  templateVariables,
  newVariable,
  handleNewVariableChange,
  handleAddVariable,
  handleRemoveVariable,
}: PromptTemplateVariablesProps) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
    <CardHeader>
      <CardTitle className="text-white">템플릿 변수</CardTitle>
      <CardDescription className="text-white/70">템플릿에서 사용할 변수들을 정의하세요</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="varName" className="text-white">변수명</Label>
          <Input
            id="varName"
            value={newVariable.name}
            onChange={(e) => handleNewVariableChange({ name: e.target.value })}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="varType" className="text-white">타입</Label>
          <Select
            value={newVariable.type}
            onValueChange={(value) => handleNewVariableChange({ type: value })}
          >
            <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <SelectValue placeholder="타입 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">문자열</SelectItem>
              <SelectItem value="number">숫자</SelectItem>
              <SelectItem value="boolean">불리언</SelectItem>
              <SelectItem value="array">배열</SelectItem>
              <SelectItem value="object">객체</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="varDescription" className="text-white">설명</Label>
        <Input
          id="varDescription"
          value={newVariable.description}
          onChange={(e) => handleNewVariableChange({ description: e.target.value })}
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="varRequired"
          checked={newVariable.required}
          onChange={(e) => handleNewVariableChange({ required: e.target.checked })}
          className="rounded border-white/30"
        />
        <Label htmlFor="varRequired" className="text-white">필수 변수</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="varDefault" className="text-white">기본값</Label>
        <Input
          id="varDefault"
          value={newVariable.defaultValue}
          onChange={(e) => handleNewVariableChange({ defaultValue: e.target.value })}
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
        />
      </div>
      <Button onClick={handleAddVariable} variant="outline" className="border-white/30 text-white hover:bg-white/10">
        <Plus className="h-4 w-4 mr-2" />
        변수 추가
      </Button>
      {templateVariables.length > 0 && (
        <div className="mt-4 space-y-2">
          {templateVariables.map((variable, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-white/10">
              <div>
                <p className="text-white font-medium">{variable.name} <span className="text-xs text-white/50">({variable.type})</span></p>
                <p className="text-white/60 text-sm">{variable.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveVariable(index)}
                className="text-red-400 hover:text-red-300"
                aria-label="변수 삭제"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

type PromptContentEditorProps = {
  content: string;
  handleContentChange: (v: string) => void;
};
const PromptContentEditor = ({ content, handleContentChange }: PromptContentEditorProps) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
    <CardHeader>
      <CardTitle className="text-white">프롬프트 내용</CardTitle>
      <CardDescription className="text-white/70">프롬프트의 상세 내용을 작성해주세요. 마크다운 문법을 지원합니다.</CardDescription>
    </CardHeader>
    <CardContent>
      <Textarea
        placeholder={`프롬프트 내용을 입력하세요...\n\n예시:\n# 제목\n## 부제목\n- 목록 항목\n\`\`\`code\n코드 블록\n\`\`\``}
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[400px] font-mono"
      />
    </CardContent>
  </Card>
);

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
        <Button onClick={handleAddTag} variant="outline" className="border-white/30 text-white hover:bg-white/10">
          <Plus className="h-4 w-4" />
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
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

type PromptVisibilitySettingsProps = {
  visibility: typeof PromptVisibility[keyof typeof PromptVisibility];
  selectedTeams: string[];
  teams: string[];
  handleVisibilityChange: (v: typeof PromptVisibility[keyof typeof PromptVisibility]) => void;
  handleToggleTeam: (team: string) => void;
};
const PromptVisibilitySettings = ({
  visibility,
  selectedTeams,
  teams,
  handleVisibilityChange,
  handleToggleTeam,
}: PromptVisibilitySettingsProps) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        {visibility === PromptVisibility.PUBLIC ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
        공개 설정
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="public" className="text-white">전체 공개</Label>
          <p className="text-white/60 text-sm">모든 사용자가 볼 수 있습니다</p>
        </div>
        <Switch
          id="public"
          checked={visibility === PromptVisibility.PUBLIC}
          onCheckedChange={(checked) => handleVisibilityChange(checked ? PromptVisibility.PUBLIC : PromptVisibility.PRIVATE)}
        />
      </div>
      {visibility !== PromptVisibility.PUBLIC && (
        <div className="space-y-3">
          <Label className="text-white">팀 접근 권한</Label>
          <div className="space-y-2">
            {teams.map((team) => (
              <div key={team} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={team}
                  checked={selectedTeams.includes(team)}
                  onChange={() => handleToggleTeam(team)}
                  className="rounded border-white/30"
                />
                <Label htmlFor={team} className="text-white/80 text-sm">{team}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

type PromptTemplateSuggestionsProps = {
  handleTemplateClick: (content: string) => void;
};
const PromptTemplateSuggestions = ({ handleTemplateClick }: PromptTemplateSuggestionsProps) => (
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
        <Code2 className="h-4 w-4 mr-2" />
        API 설계 템플릿
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start border-white/30 text-white hover:bg-white/10"
        onClick={() => handleTemplateClick("UI 컴포넌트 템플릿 내용")}
      >
        <Palette className="h-4 w-4 mr-2" />
        UI 컴포넌트 템플릿
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start border-white/30 text-white hover:bg-white/10"
        onClick={() => handleTemplateClick("데이터 분석 템플릿 내용")}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        데이터 분석 템플릿
      </Button>
    </CardContent>
  </Card>
);

type PromptSaveActionsProps = {
  handleSubmit: () => void;
  handleDraftSave: () => void;
};
const PromptSaveActions = ({handleSubmit, handleDraftSave}: PromptSaveActionsProps) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
    <CardHeader>
      <CardTitle className="text-white">저장 옵션</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
      >
        <Save className="h-4 w-4 mr-2" />
        저장하고 게시
      </Button>
      <Button
          onClick={handleDraftSave}
          variant="outline"
          className="w-full border-white/30 text-white hover:bg-white/10"
      >
        임시 저장
      </Button>
    </CardContent>
  </Card>
);

export default function NewPromptPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const { categories, rootCategories } = useCategories();
  const [isTemplate, setIsTemplate] = useState(false);
  const [templateVariables, setTemplateVariables] = useState<TemplateVariable[]>([]);
  const [newVariable, setNewVariable] = useState<TemplateVariable>({
    name: "",
    type: "string",
    description: "",
    required: false,
    defaultValue: "",
  });
  const [visibility, setVisibility] = useState<typeof PromptVisibility[keyof typeof PromptVisibility]>(PromptVisibility.PUBLIC);

  const teams = [
    "Backend Team",
    "Frontend Team",
    "Data Science Team",
    "Design Team",
    "Architecture Team",
    "QA Team",
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleToggleTeam = (team: string) => {
    setSelectedTeams((prev) => (prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]));
  };
  const handleAddVariable = () => {
    if (newVariable.name.trim()) {
      setTemplateVariables([...templateVariables, { ...newVariable }]);
      setNewVariable({
        name: "",
        type: "string",
        description: "",
        required: false,
        defaultValue: "",
      });
    }
  };
  const handleRemoveVariable = (index: number) => {
    setTemplateVariables(templateVariables.filter((_, i) => i !== index));
  };
  const handleNewVariableChange = (v: Partial<TemplateVariable>) => {
    setNewVariable((prev) => ({ ...prev, ...v }));
  };
  const handleTemplateClick = (templateContent: string) => {
    setContent(templateContent);
  };
  const handleSubmit = async () => {
    if (!title || !description || !content || !category) {
      alert("필수 필드를 모두 입력해주세요.");
      return;
    }
    const promptData = {
      title,
      description,
      content,
      createdBy: TEMP_SYSTEM_USER,
      tags,
      tagIds: [],
      inputVariables: templateVariables,
      variablesSchema: {},
      categoryId: parseInt(category),
      visibility,
      status: PromptStatus.PUBLISHED,
    };
    try {
      const response = await fetchWithAuth("/api/v1/prompts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(promptData),
      });
      if (!response.ok) {
        let errorMsg = "프롬프트 게시에 실패했습니다.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
        }
        throw new Error(errorMsg);
      }
      alert("프롬프트가 성공적으로 게시되었습니다.");
      window.location.href = "/prompts";
    } catch (error) {
      alert(error instanceof Error ? error.message : "프롬프트 게시 중 오류가 발생했습니다.");
    }
  };

  const handleDraftSave = async () => {
    if (!title || !description || !content || !category) {
      alert("필수 필드를 모두 입력해주세요.");
      return;
    }
    const promptData = {
      title,
      description,
      content,
      createdBy: TEMP_SYSTEM_USER,
      tags,
      tagIds: [],
      inputVariables: templateVariables,
      variablesSchema: {},
      categoryId: parseInt(category),
      visibility,
      status: PromptStatus.DRAFT,
    };
    try {
      const response = await fetchWithAuth("/api/v1/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptData),
      });
      if (!response.ok) {
        let errorMsg = "프롬프트 임시 저장에 실패했습니다.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      alert("프롬프트가 임시 저장되었습니다.");
      window.location.href = "/prompts";
    } catch (error) {
      alert(error instanceof Error ? error.message : "프롬프트 임시 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 페이지 액션 헤더 (공통 헤더 아래) */}
      <div className="border-b border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prompts" className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link href="/" className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                PromptHub
              </span>
            </Link>
            <span className="text-white/70">/ 새 프롬프트 작성</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Eye className="h-4 w-4 mr-2" />
              미리보기
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <PromptTypeSelector isTemplate={isTemplate} handleChange={setIsTemplate} />
            <PromptBasicInfoForm
              title={title}
              description={description}
              category={category}
              categories={categories}
              rootCategories={rootCategories}
              handleTitleChange={setTitle}
              handleDescriptionChange={setDescription}
              handleCategoryChange={setCategory}
            />
            {isTemplate && (
              <PromptTemplateVariables
                templateVariables={templateVariables}
                newVariable={newVariable}
                handleNewVariableChange={handleNewVariableChange}
                handleAddVariable={handleAddVariable}
                handleRemoveVariable={handleRemoveVariable}
              />
            )}
            <PromptContentEditor content={content} handleContentChange={setContent} />
            <PromptTagsInput
              tags={tags}
              newTag={newTag}
              handleNewTagChange={setNewTag}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              handleKeyPress={handleKeyPress}
            />
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <PromptVisibilitySettings
              visibility={visibility}
              selectedTeams={selectedTeams}
              teams={teams}
              handleVisibilityChange={setVisibility}
              handleToggleTeam={handleToggleTeam}
            />
            <PromptTemplateSuggestions handleTemplateClick={handleTemplateClick} />
            <PromptSaveActions handleSubmit={handleSubmit} handleDraftSave={handleDraftSave}/>
          </div>
        </div>
      </div>
    </div>
  );
}
