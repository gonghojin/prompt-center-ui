"use client"

import type React from "react"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Input } from "@components/ui/input"
import { Label } from "@components/ui/label"
import { Textarea } from "@components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Switch } from "@components/ui/switch"
import { Badge } from "@components/ui/badge"
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  X,
  Upload,
  FileText,
  Code2,
  Database,
  Palette,
  BarChart3,
  Globe,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NewPromptPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  const categories = [
    { value: "backend", label: "Backend", icon: <Code2 className="h-4 w-4" /> },
    { value: "frontend", label: "Frontend", icon: <Palette className="h-4 w-4" /> },
    { value: "data-science", label: "Data Science", icon: <BarChart3 className="h-4 w-4" /> },
    { value: "database", label: "Database", icon: <Database className="h-4 w-4" /> },
    { value: "design", label: "Design", icon: <Palette className="h-4 w-4" /> },
  ]

  const teams = ["Backend Team", "Frontend Team", "Data Science Team", "Design Team", "Architecture Team", "QA Team"]

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const toggleTeam = (team: string) => {
    setSelectedTeams((prev) => (prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]))
  }

  const handleSubmit = async () => {
    // 폼 검증 로직
    if (!title || !description || !content || !category) {
      alert("필수 필드를 모두 입력해주세요.")
      return
    }

    // 실제 저장 기능 구현 (API 호출 등)
    try {
      // FormData 객체 생성
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("content", content)
      formData.append("category", category)
      formData.append("tags", JSON.stringify(tags)) // 태그를 JSON 문자열로 변환
      formData.append("isPublic", String(isPublic)) // isPublic을 문자열로 변환
      formData.append("selectedTeams", JSON.stringify(selectedTeams)) // 선택된 팀을 JSON 문자열로 변환

      // 파일 추가
      files.forEach((file) => {
        formData.append("files", file)
      })

      // API 엔드포인트 URL (실제 API 엔드포인트로 변경)
      const apiUrl = "/api/prompts"

      // POST 요청
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // 성공적으로 저장된 경우
        alert("프롬프트가 성공적으로 저장되었습니다.")
        // 필요에 따라 페이지 리디렉션 또는 상태 초기화
      } else {
        // 오류 발생 시
        console.error("프롬프트 저장 실패:", response.statusText)
        alert("프롬프트 저장에 실패했습니다.")
      }
    } catch (error) {
      console.error("프롬프트 저장 중 오류 발생:", error)
      alert("프롬프트 저장 중 오류가 발생했습니다.")
    }
  }

  const handleTemplateClick = (templateContent: string) => {
    setContent(templateContent)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
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
                  <Label htmlFor="title" className="text-white">
                    제목 *
                  </Label>
                  <Input
                    id="title"
                    placeholder="프롬프트 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    설명 *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="프롬프트에 대한 간단한 설명을 입력하세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    카테고리 *
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            {cat.icon}
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">프롬프트 내용</CardTitle>
                <CardDescription className="text-white/70">
                  프롬프트의 상세 내용을 작성해주세요. 마크다운 문법을 지원합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="프롬프트 내용을 입력하세요...

예시:
# 제목
## 부제목
- 목록 항목
\`\`\`code
코드 블록
\`\`\`"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 min-h-[400px] font-mono"
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">태그</CardTitle>
                <CardDescription className="text-white/70">
                  프롬프트를 쉽게 찾을 수 있도록 관련 태그를 추가하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="태그 입력 후 Enter"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button onClick={addTag} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-white/10 text-white/70 pr-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-400 transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visibility Settings */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  {isPublic ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  공개 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public" className="text-white">
                      전체 공개
                    </Label>
                    <p className="text-white/60 text-sm">모든 사용자가 볼 수 있습니다</p>
                  </div>
                  <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                </div>

                {!isPublic && (
                  <div className="space-y-3">
                    <Label className="text-white">팀 접근 권한</Label>
                    <div className="space-y-2">
                      {teams.map((team) => (
                        <div key={team} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={team}
                            checked={selectedTeams.includes(team)}
                            onChange={() => toggleTeam(team)}
                            className="rounded border-white/30"
                          />
                          <Label htmlFor={team} className="text-white/80 text-sm">
                            {team}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Template Suggestions */}
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

            {/* File Upload */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">파일 첨부</CardTitle>
                <CardDescription className="text-white/70">관련 파일이나 이미지를 첨부하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-white/50 mx-auto mb-2" />
                  <p className="text-white/70 text-sm mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setFiles(Array.from(e.target.files))
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                      <span className="cursor-pointer">파일 선택</span>
                    </Button>
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white mb-2">업로드된 파일:</p>
                    <ul className="space-y-1">
                      {files.map((file, index) => (
                        <li key={index} className="text-white/70 text-sm flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Actions */}
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
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  임시 저장
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
