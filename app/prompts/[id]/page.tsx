"use client"

import { useEffect, useState } from "react"
import type { JSX } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { Loader2, ArrowLeft, Share2, Heart, Eye, Star, User, Clock, Code2, Palette, BarChart3, Database } from "lucide-react"
import Link from "next/link"
import { useCategories } from "@/app/hooks/useCategories"
import { CategoryBadge } from "@/components/category/CategoryBadge"
import { Category } from "@/app/types/category"

interface ApiPrompt {
  id: string
  title: string
  description: string
  content: string
  author: {
    id: string
    email: string
    name: string
  }
  tags: { id: number; name: string }[]
  createdAt: string
  updatedAt: string
  viewCount: number
  favoriteCount: number
  categoryId: number
  visibility: string
  status: string
  public: boolean
}

const categoryIconMap: Record<string, JSX.Element> = {
  Backend: <Code2 className="h-5 w-5" />, // 예시
  Frontend: <Palette className="h-5 w-5" />, // 예시
  "Data Science": <BarChart3 className="h-5 w-5" />, // 예시
  Database: <Database className="h-5 w-5" />, // 예시
  Design: <Palette className="h-5 w-5" />, // 예시
  default: <Code2 className="h-5 w-5" />,
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-"
  return dateStr.slice(0, 10)
}

const PromptDetailPage = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { id } = params
  const [prompt, setPrompt] = useState<ApiPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)
  const { categories } = useCategories()

  // 카테고리 정보 추출
  const category: Category | undefined = categories.find((c) => c.id === prompt?.categoryId)
  const categoryIcon = categoryIconMap[category?.displayName ?? "default"] || categoryIconMap.default

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`/api/v1/prompts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.")
        return res.json()
      })
      .then((data: ApiPrompt) => {
        setPrompt(data)
      })
      .catch((e) => setError(e.message || "알 수 없는 오류"))
      .finally(() => setLoading(false))
  }, [id])

  const handleBack = () => {
    router.back()
  }

  const handleShare = () => {
    if (!prompt) return
    const url = `${window.location.origin}/prompts/${prompt.id}`
    navigator.clipboard.writeText(url)
      .then(() => alert("URL이 복사되었습니다!"))
      .catch(() => alert("클립보드 복사 실패"))
  }

  const handleLike = () => {
    setLiked((prev) => !prev)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="animate-spin text-white w-8 h-8 mb-4" />
        <span className="text-white/70">불러오는 중...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <span className="text-red-400">{error}</span>
        <Button className="mt-4" onClick={handleBack} aria-label="뒤로가기">뒤로가기</Button>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <span className="text-white/70">프롬프트를 찾을 수 없습니다.</span>
        <Button className="mt-4" onClick={handleBack} aria-label="뒤로가기">뒤로가기</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-white/20">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            aria-label="뒤로가기"
            tabIndex={0}
            className="text-white hover:text-purple-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="text-white/70 text-sm">프롬프트 상세보기</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-purple-400">{categoryIcon}</span>
          {category ? (
            <CategoryBadge category={category} className="border-white/30 text-white/70 text-xs" />
          ) : (
            <Badge variant="outline" className="border-white/30 text-white/70 text-xs">카테고리 없음</Badge>
          )}
          {!prompt.public && <Eye className="h-4 w-4 text-white/50 ml-2" aria-label="비공개" />}
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{prompt.title}</h1>
        <p className="text-white/70 mb-4">{prompt.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {prompt.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs bg-white/10 text-white/70">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {prompt.author?.name || "-"}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(prompt.updatedAt)}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-2">본문</h2>
          <pre className="bg-black/40 text-white p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm">
            {prompt.content}
          </pre>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {liked ? prompt.favoriteCount + 1 : prompt.favoriteCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {prompt.viewCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white p-1"
              onClick={handleShare}
              aria-label="공유"
              tabIndex={0}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white p-1"
              onClick={handleLike}
              aria-label="좋아요"
              tabIndex={0}
            >
              <Star className={`h-4 w-4 ${liked ? "text-yellow-400 fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptDetailPage
