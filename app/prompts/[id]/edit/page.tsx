"use client"

import {useEffect, useState} from "react";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {ArrowLeft} from "lucide-react";
import {useCategories} from "@/app/hooks/useCategories";
import PromptTypeSelector from "@/components/prompts/PromptTypeSelector";
import PromptBasicInfoForm from "@/components/prompts/PromptBasicInfoForm";
import PromptTemplateVariables from "@/components/prompts/PromptTemplateVariables";
import PromptContentEditor from "@/components/prompts/PromptContentEditor";
import PromptTagsInput from "@/components/prompts/PromptTagsInput";
import PromptVisibilitySettings from "@/components/prompts/PromptVisibilitySettings";
import PromptTemplateSuggestions from "@/components/prompts/PromptTemplateSuggestions";
import PromptSaveActions from "@/components/prompts/PromptSaveActions";
import {fetchWithAuth} from "@/app/api/fetchWithAuth";
import {useToast} from "@/components/ui/useToast";

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

export default function EditPromptPage() {
  const router = useRouter();
  const params = useParams();
  const {id} = params as { id: string };
  const {categories, rootCategories, loading: catLoading, error: catError} = useCategories();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const {showToast} = useToast();

  // 폼 상태
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
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
  const [status, setStatus] = useState<typeof PromptStatus[keyof typeof PromptStatus]>(PromptStatus.DRAFT);

  const teams = [
    "Backend Team",
    "Frontend Team",
    "Data Science Team",
    "Design Team",
    "Architecture Team",
    "QA Team",
  ];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setForbidden(false);
    fetchWithAuth(`/api/v1/prompts/${id}`)
    .then(async (res) => {
      if (res.status === 403) {
        setForbidden(true);
        setLoading(false);
        return;
      }
      if (res.status === 404) {
        setError("존재하지 않는 프롬프트입니다.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("프롬프트 정보를 불러오지 못했습니다.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTitle(data.title || "");
      setDescription(data.description || "");
      setContent(data.content || "");
      setCategory(data.categoryId?.toString() || "");
      setTags(data.tags || []);
      setTemplateVariables(data.inputVariables || []);
      setVisibility(data.visibility || PromptVisibility.PUBLIC);
      setSelectedTeams(data.selectedTeams || []);
      setStatus(data.status || PromptStatus.DRAFT);
      setIsTemplate((data.inputVariables || []).length > 0);
      setLoading(false);
    })
    .catch(() => {
      setError("프롬프트 정보를 불러오지 못했습니다.");
      setLoading(false);
    });
  }, [id]);

  // 태그
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
  // 팀
  const handleToggleTeam = (team: string) => {
    setSelectedTeams((prev) => (prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]));
  };
  // 변수
  const handleAddVariable = () => {
    if (newVariable.name.trim()) {
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
  // 템플릿 제안 클릭
  const handleTemplateClick = (templateContent: string) => {
    setContent(templateContent);
  };

  // 저장/임시저장
  const handleSubmit = async () => {
    if (!title || !description || !content || !category) {
      showToast({type: "error", message: "필수 필드를 모두 입력해주세요."});
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    const promptData = {
      title,
      description,
      content,
      tags,
      inputVariables: templateVariables,
      categoryId: parseInt(category),
      visibility,
      status: PromptStatus.PUBLISHED,
      selectedTeams,
    };
    try {
      const res = await fetchWithAuth(`/api/v1/prompts/${id}`,
          {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(promptData),
          }
      );
      if (!res.ok) {
        let msg = "수정에 실패했습니다.";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {
        }
        throw new Error(msg);
      }
      showToast({type: "success", message: "프롬프트가 성공적으로 수정되었습니다."});
      setTimeout(() => router.push(`/prompts/${id}`), 1200);
    } catch (e: any) {
      showToast({type: "error", message: e.message || "수정 중 오류가 발생했습니다."});
      setSaveError(e.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDraftSave = async () => {
    if (!title || !description || !content || !category) {
      showToast({type: "error", message: "필수 필드를 모두 입력해주세요."});
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    const promptData = {
      title,
      description,
      content,
      tags,
      inputVariables: templateVariables,
      categoryId: parseInt(category),
      visibility,
      status: PromptStatus.DRAFT,
      selectedTeams,
    };
    try {
      const res = await fetchWithAuth(`/api/v1/prompts/${id}`,
          {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(promptData),
          }
      );
      if (!res.ok) {
        let msg = "임시 저장에 실패했습니다.";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {
        }
        throw new Error(msg);
      }
      showToast({type: "success", message: "프롬프트가 임시 저장되었습니다."});
      setTimeout(() => router.push(`/prompts/${id}`), 1200);
    } catch (e: any) {
      showToast({type: "error", message: e.message || "임시 저장 중 오류가 발생했습니다."});
      setSaveError(e.message || "임시 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || catLoading) {
    return <div className="text-white">로딩 중...</div>;
  }
  if (catError) {
    return <div className="text-red-400">카테고리 정보를 불러오지 못했습니다.</div>;
  }
  if (forbidden) {
    return <div className="text-red-400">수정 권한이 없습니다.</div>;
  }
  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* 페이지 액션 헤더 (공통 헤더 아래) */}
        <div className="border-b border-white/20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/prompts" className="text-white/70 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5"/>
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
              <span
                  className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                PromptHub
              </span>
              </Link>
              <span className="text-white/70">/ 프롬프트 수정</span>
            </div>
            {/* 저장/미리보기 버튼 제거됨 */}
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <PromptTypeSelector isTemplate={isTemplate} handleChange={setIsTemplate}/>
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
              <PromptContentEditor content={content} handleContentChange={setContent}/>
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
              <PromptTemplateSuggestions handleTemplateClick={handleTemplateClick}/>
              <PromptSaveActions handleSubmit={handleSubmit} handleDraftSave={handleDraftSave}/>
              {saveError && <div className="text-red-400 mt-2">{saveError}</div>}
            </div>
          </div>
        </div>
      </div>
  );
}