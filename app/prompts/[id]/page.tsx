"use client"

import type {JSX} from "react"
import {useCallback, useEffect, useState} from "react"
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
import {useToast} from "@/components/ui/useToast"
import {getAnonymousId, isLoggedIn} from '@/app/utils/anonymousId'
import {getPromptViewCount, recordPromptView} from '@/app/api/promptsApi'

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
  const [viewCount, setViewCount] = useState<number>(0)
  const [isRecordingView, setIsRecordingView] = useState<boolean>(false)
  const [viewCountInitialized, setViewCountInitialized] = useState<boolean>(false)
  const { categories } = useCategories()
  const {showToast} = useToast();

  const category: Category | undefined = categories.find((c) => c.id === prompt?.categoryId)
  const categoryIcon = categoryIconMap[category?.displayName ?? "default"] || categoryIconMap.default

  const recordView = useCallback(async () => {
    if (!prompt?.id || isRecordingView) return;

    const viewKey = `prompt_view_${prompt.id}`;
    const hasRecorded = sessionStorage.getItem(viewKey);

    // 이미 기록했다면 조회수만 새로 가져오기 (매번 최신 데이터)
    if (hasRecorded) {
      try {
        const result = await getPromptViewCount(prompt.id);
        setViewCount(result.viewCount);
        setPrompt(prev => prev ? {...prev, viewCount: result.viewCount} : null);
      } catch (error) {
        console.error('조회수 조회 실패:', error);
      }
      return;
    }

    // 첫 방문이라면 낙관적 업데이트 후 조회수 기록
    // 현재 상태값을 우선 사용하고, 없으면 prompt 데이터 사용 (안전하게 처리)
    const currentViewCount = viewCount > 0 ? viewCount : (typeof prompt.viewCount === 'number' ? prompt.viewCount : 0);

    // 낙관적 업데이트: 즉시 UI 업데이트
    const optimisticViewCount = currentViewCount + 1;
    setViewCount(optimisticViewCount);
    setViewCountInitialized(true); // 초기화 완료 표시
    setPrompt(prev => prev ? {...prev, viewCount: optimisticViewCount} : null);

    setIsRecordingView(true);

    try {
      const anonymousId = isLoggedIn() ? undefined : getAnonymousId();
      const result = await recordPromptView(prompt.id, anonymousId);

      // 실제 응답값으로 정확한 값 설정
      if (result.viewCount !== optimisticViewCount) {
        setViewCount(result.viewCount);
        setPrompt(prev => prev ? {...prev, viewCount: result.viewCount} : null);
      }

      // 기록 완료 표시
      sessionStorage.setItem(viewKey, 'true');

    } catch (error) {
      // 실패 시 원래 값으로 롤백
      setViewCount(currentViewCount);
      setPrompt(prev => prev ? {...prev, viewCount: currentViewCount} : null);
      console.error('조회수 기록 실패:', error);
    } finally {
      setIsRecordingView(false);
    }
  }, [prompt?.id, isRecordingView, viewCount]);

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

      // viewCount 처리 - undefined나 null일 때 0으로 처리
      const safeViewCount = typeof prompt.viewCount === 'number' ? prompt.viewCount : 0;

      // viewCount는 아직 초기화되지 않았을 때만 설정
      if (!viewCountInitialized) {
        setViewCount(safeViewCount)
        setViewCountInitialized(true)
      } else {
        // 이미 초기화된 경우라도 백엔드에서 유효한 값이 왔다면 업데이트
        if (typeof prompt.viewCount === 'number' && prompt.viewCount !== viewCount) {
          setViewCount(prompt.viewCount);
        }
      }
    }
  }, [prompt, viewCountInitialized])

  useEffect(() => {
    if (prompt?.id && !isRecordingView) {
      const timer = setTimeout(() => {
        recordView();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [prompt?.id, recordView, isRecordingView]);

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
                initialLiked={prompt.liked ?? false}
                initialLikeCount={prompt.favoriteCount}
                onChange={(newLiked, newCount) => {
                  setLiked(newLiked);
                  setLikeCount(newCount);
                }}
            />
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {viewCount || prompt?.viewCount || 0}
              {isRecordingView && <span className="text-xs opacity-50 ml-1">↑</span>}
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
                initialFavorite={prompt.favorite ?? false}
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
