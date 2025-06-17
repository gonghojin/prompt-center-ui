"use client"

import type {JSX} from "react"
import {useEffect, useState} from "react"
import {useParams, useRouter, useSearchParams} from "next/navigation"
import {Badge} from "@components/ui/badge"
import {Button} from "@components/ui/button"
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Code2,
  Copy,
  Database,
  Eye,
  Loader2,
  Palette,
  Share2,
  User
} from "lucide-react"
import {useCategories} from "@/app/hooks/useCategories"
import {CategoryBadge} from "@/components/category/CategoryBadge"
import {Category} from "@/app/types/category"
import ReactMarkdown from "react-markdown"
import {fetchWithAuth} from "@/app/api/fetchWithAuth"
import {FavoriteButton} from "@components/prompts/FavoriteButton"
import {LikeButton} from "@components/prompts/LikeButton"
import Link from "next/link"
import {useToast} from "@/components/ui/useToast"

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
  favorite?: boolean
  liked?: boolean
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
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const { id } = params
  const [prompt, setPrompt] = useState<ApiPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [likeLoading, setLikeLoading] = useState(false)
  const { categories } = useCategories()
  const {showToast} = useToast();

  // 카테고리 정보 추출
  const category: Category | undefined = categories.find((c) => c.id === prompt?.categoryId)
  const categoryIcon = categoryIconMap[category?.displayName ?? "default"] || categoryIconMap.default

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetchWithAuth(`/api/v1/prompts/${id}`)
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

  useEffect(() => {
    if (prompt) {
      setLiked(prompt.liked ?? false)
      setLikeCount(prompt.favoriteCount ?? 0)
      setFavorite(prompt.favorite ?? false)
    }
  }, [prompt])

  const handleBack = () => {
    router.push("/prompts");
  }

  const handleShare = () => {
    if (!prompt) return
    const url = `${window.location.origin}/prompts/${prompt.id}`
    navigator.clipboard.writeText(url)
    .then(() => showToast({type: "success", message: "URL이 복사되었습니다!"}))
    .catch(() => showToast({type: "error", message: "클립보드 복사 실패"}))
  }

  const handleToggleLike = async () => {
    if (!prompt || likeLoading) return;
    setLikeLoading(true);
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked((prev) => !prev);
    setLikeCount((count) => prevLiked ? count - 1 : count + 1);
    try {
      const method = prevLiked ? 'DELETE' : 'POST';
      const res = await fetchWithAuth(`/api/v1/prompts/${prompt.id}/like`, {method});
      if (!res.ok) throw new Error("좋아요 처리 실패");
      const data = await res.json();
      setLikeCount(data.likeCount);
      setLiked(!prevLiked);
    } catch (e: any) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      alert(e.message || "좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCopyContent = async () => {
    if (!prompt) return;
    if (!navigator.clipboard) {
      showToast({type: "error", message: "이 브라우저는 복사 기능을 지원하지 않습니다."});
      return;
    }
    try {
      await navigator.clipboard.writeText(prompt.content);
      showToast({type: "success", message: "복사되었습니다!"});
    } catch (e) {
      showToast({type: "error", message: "복사 실패"});
    }
  };

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
        <div className="prose prose-invert max-w-none text-white/70 mb-4">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-white/70">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300"
                >
                  {children}
                </a>
              ),
            }}
          >
            {prompt.description}
          </ReactMarkdown>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {(Array.isArray(prompt.tags) && typeof prompt.tags[0] === "string"
            ? prompt.tags
            : prompt.tags?.map((t: any) => t.name) || []
          ).map((tag: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-white/70">
              {tag}
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-semibold">본문</h2>
            <Button
                size="sm"
                variant="ghost"
                className="text-white/70 hover:text-white p-1 flex items-center gap-1"
                onClick={handleCopyContent}
                aria-label="본문 복사"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCopyContent();
                }}
            >
              <Copy className="h-4 w-4"/>
              <span className="text-xs">복사</span>
            </Button>
          </div>
          <pre className="bg-black/40 text-white p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-sm">
            {prompt.content}
          </pre>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4 text-xs text-white/60">
            <LikeButton
                promptId={prompt.id}
                initialLiked={prompt.liked}
                initialLikeCount={prompt.favoriteCount}
                onChange={(newLiked, newCount) => {
                  setLiked(newLiked);
                  setLikeCount(newCount);
                }}
            />
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
            <FavoriteButton
                promptId={prompt.id}
                initialFavorite={prompt.favorite}
                onSuccess={(isFavorite) => showToast({
                  type: isFavorite ? "success" : "info",
                  message: isFavorite ? "즐겨찾기에 추가되었습니다." : "즐겨찾기에서 제거되었습니다."
                })}
                onError={(e) => showToast({
                  type: "error",
                  message: e.message || "즐겨찾기 처리 중 오류가 발생했습니다."
                })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptDetailPage
