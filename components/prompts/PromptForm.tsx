import {useState, useEffect} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@components/ui/card";
import {Input} from "@components/ui/input";
import {Label} from "@components/ui/label";
import {Textarea} from "@components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@components/ui/select";
import {Switch} from "@components/ui/switch";
import {Badge} from "@components/ui/badge";
import {Button} from "@components/ui/button";
import {CategorySelect} from "@/components/category/CategorySelect";
import {Plus, X, Save} from "lucide-react";

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

type TemplateVariable = {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
};

type PromptFormProps = {
  mode: "create" | "edit";
  initialValues?: any;
  categories?: any[];
  rootCategories?: any[];
  onSubmit: (data: any) => void;
  onDraftSave: (data: any) => void;
  isSaving?: boolean;
  saveError?: string | null;
};

export function PromptForm({
                             mode,
                             initialValues = {},
                             categories = [],
                             rootCategories = [],
                             onSubmit,
                             onDraftSave,
                             isSaving = false,
                             saveError = null,
                           }: PromptFormProps) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [content, setContent] = useState(initialValues.content || "");
  const [category, setCategory] = useState(initialValues.categoryId?.toString() || "");
  const [tags, setTags] = useState<string[]>(initialValues.tags || []);
  const [newTag, setNewTag] = useState("");
  const [templateVariables, setTemplateVariables] = useState<TemplateVariable[]>(initialValues.inputVariables || []);
  const [newVariable, setNewVariable] = useState<TemplateVariable>({
    name: "",
    type: "string",
    description: "",
    required: false,
    defaultValue: "",
  });
  const [visibility, setVisibility] = useState<typeof PromptVisibility[keyof typeof PromptVisibility]>(initialValues.visibility || PromptVisibility.PUBLIC);
  const [status, setStatus] = useState<typeof PromptStatus[keyof typeof PromptStatus]>(initialValues.status || PromptStatus.DRAFT);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setTitle(initialValues.title || "");
      setDescription(initialValues.description || "");
      setContent(initialValues.content || "");
      setCategory(initialValues.categoryId?.toString() || "");
      setTags(initialValues.tags || []);
      setTemplateVariables(initialValues.inputVariables || []);
      setVisibility(initialValues.visibility || PromptVisibility.PUBLIC);
      setStatus(initialValues.status || PromptStatus.DRAFT);
    }
  }, [mode, initialValues]);

  // 태그 추가/제거/중복 방지
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

  // 변수 추가/제거
  const handleAddVariable = () => {
    if (newVariable.name.trim() && !templateVariables.some(v => v.name === newVariable.name.trim())) {
      setTemplateVariables([...templateVariables, {...newVariable}]);
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
    setNewVariable((prev) => ({...prev, ...v}));
  };

  // 저장/임시저장
  const handleSubmit = () => {
    if (!title || !description || !content || !category) {
      setError("필수 필드를 모두 입력해주세요.");
      return;
    }
    setError(null);
    onSubmit({
      title,
      description,
      content,
      tags,
      inputVariables: templateVariables,
      categoryId: parseInt(category),
      visibility,
      status: PromptStatus.PUBLISHED,
    });
  };
  const handleDraftSave = () => {
    if (!title || !description || !content || !category) {
      setError("필수 필드를 모두 입력해주세요.");
      return;
    }
    setError(null);
    onDraftSave({
      title,
      description,
      content,
      tags,
      inputVariables: templateVariables,
      categoryId: parseInt(category),
      visibility,
      status: PromptStatus.DRAFT,
    });
  };

  return (
      <div className="w-full max-w-3xl mx-auto py-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle
                className="text-white">{mode === "edit" ? "프롬프트 수정" : "새 프롬프트 작성"}</CardTitle>
            <CardDescription
                className="text-white/70">{mode === "edit" ? "프롬프트의 내용을 수정하세요" : "프롬프트의 내용을 입력하세요"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && <div className="text-red-400 mb-2">{error}</div>}
            {saveError && <div className="text-red-400 mb-2">{saveError}</div>}
            {/* 제목/설명/카테고리 */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">제목 *</Label>
              <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">설명 *</Label>
              <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">카테고리 *</Label>
              <CategorySelect
                  categories={categories}
                  rootCategories={rootCategories}
                  value={category}
                  onChange={setCategory}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
              />
            </div>
            {/* 내용 */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-white">프롬프트 내용 *</Label>
              <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[300px] font-mono"
              />
            </div>
            {/* 태그 */}
            <div className="space-y-2">
              <Label className="text-white">태그</Label>
              <div className="flex gap-2">
                <Input
                    placeholder="태그 입력 후 Enter"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                />
                <Button onClick={handleAddTag} variant="outline"
                        className="border-white/30 text-white hover:bg-white/10">
                  <Plus className="h-4 w-4"/>
                </Button>
              </div>
              {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary"
                               className="bg-white/10 text-white/70 pr-1">
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
            </div>
            {/* 템플릿 변수 */}
            <div className="space-y-2">
              <Label className="text-white">템플릿 변수</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                    placeholder="변수명"
                    value={newVariable.name}
                    onChange={(e) => handleNewVariableChange({name: e.target.value})}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
                />
                <Select
                    value={newVariable.type}
                    onValueChange={(value) => handleNewVariableChange({type: value})}
                >
                  <SelectTrigger
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <SelectValue placeholder="타입 선택"/>
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
              <Input
                  placeholder="설명"
                  value={newVariable.description}
                  onChange={(e) => handleNewVariableChange({description: e.target.value})}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
              />
              <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="varRequired"
                    checked={newVariable.required}
                    onChange={(e) => handleNewVariableChange({required: e.target.checked})}
                    className="rounded border-white/30"
                />
                <Label htmlFor="varRequired" className="text-white">필수 변수</Label>
              </div>
              <Input
                  placeholder="기본값"
                  value={newVariable.defaultValue}
                  onChange={(e) => handleNewVariableChange({defaultValue: e.target.value})}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
              />
              <Button onClick={handleAddVariable} variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 mt-2">
                <Plus className="h-4 w-4 mr-2"/> 변수 추가
              </Button>
              {templateVariables.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {templateVariables.map((variable, index) => (
                        <div key={index}
                             className="flex items-center justify-between py-2 border-b border-white/10">
                          <div>
                            <p className="text-white font-medium">{variable.name} <span
                                className="text-xs text-white/50">({variable.type})</span></p>
                            <p className="text-white/60 text-sm">{variable.description}</p>
                          </div>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveVariable(index)}
                              className="text-red-400 hover:text-red-300"
                              aria-label="변수 삭제"
                          >
                            <X className="h-4 w-4"/>
                          </Button>
                        </div>
                    ))}
                  </div>
              )}
            </div>
            {/* 상태/가시성 */}
            <div className="space-y-2">
              <Label className="text-white">공개 설정</Label>
              <div className="flex items-center gap-4">
                <span className="text-white/80">전체 공개</span>
                <Switch
                    checked={visibility === PromptVisibility.PUBLIC}
                    onCheckedChange={(checked) => setVisibility(checked ? PromptVisibility.PUBLIC : PromptVisibility.PRIVATE)}
                />
                <span className="text-white/80">비공개</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white">상태</Label>
              <Select value={status}
                      onValueChange={(v) => setStatus(v as typeof PromptStatus[keyof typeof PromptStatus])}>
                <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <SelectValue placeholder="상태 선택"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">임시저장</SelectItem>
                  <SelectItem value="PUBLISHED">게시됨</SelectItem>
                  <SelectItem value="ARCHIVED">보관됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* 저장/임시저장 버튼 */}
            <div className="flex gap-4 mt-6">
              <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 flex-1"
                  disabled={isSaving}
              >
                <Save
                    className="h-4 w-4 mr-2"/> {isSaving ? "저장 중..." : mode === "edit" ? "수정 완료" : "저장하고 게시"}
              </Button>
              <Button
                  onClick={handleDraftSave}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 flex-1"
                  disabled={isSaving}
              >
                {isSaving ? "저장 중..." : "임시 저장"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
} 