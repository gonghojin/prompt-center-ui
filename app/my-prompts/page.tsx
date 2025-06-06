"use client"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Input } from "@components/ui/input"
import { Badge } from "@components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import {
  Search,
  Plus,
  Star,
  Eye,
  Edit,
  Trash2,
  Clock,
  Heart,
  Share2,
  Copy,
  Filter,
  Download,
  Archive,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { fetchWithAuth } from "@/app/api/fetchWithAuth"
import { useCategories } from "@/app/hooks/useCategories"
import { CategoryBadge } from "@components/category/CategoryBadge"
import type { Category } from "@/app/types/category"
import { getRelativeTime } from "@/app/lib/getRelativeTime"

type StatusType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
type VisibilityType = 'PUBLIC' | 'TEAM' | 'PRIVATE';

type FavoritePrompt = {
  id: number;
  title: string;
  description: string;
  category: Category;
  author: string;
  likes: number;
  views: number;
  updatedAt: string;
  tags: string[];
};

type Prompt = {
  id: number;
  title: string;
  description: string;
  category: Category;
  favoriteCount: number;
  viewCount: number;
  updatedAt: string;
  status: StatusType;
  visibility: VisibilityType;
  isPublic: boolean;
  tags: string[];
};

type ActivityType = 'CREATE' | 'EDIT' | 'PUBLISH' | 'ARCHIVE';
type ActivityLog = {
  action: string;
  actionType: ActivityType;
  prompt: string;
  time: string;
};

export default function MyPromptsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-prompts")
  const [myPrompts, setMyPrompts] = useState<Prompt[]>([
    {
      id: 1,
      title: "API 설계 프롬프트",
      description: "RESTful API 설계를 위한 상세 가이드라인",
      category: {
        id: 1,
        name: "Backend",
        displayName: "Backend",
        description: "Backend 카테고리",
        parentCategoryId: null,
        parentCategoryName: null,
        isSystem: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      favoriteCount: 24,
      viewCount: 156,
      updatedAt: "2시간 전",
      status: "PUBLISHED",
      visibility: "PUBLIC",
      isPublic: true,
      tags: ["API", "REST", "설계"],
    },
    {
      id: 2,
      title: "React 테스트 가이드",
      description: "React 컴포넌트 테스트 작성 방법론",
      category: {
        id: 2,
        name: "Frontend",
        displayName: "Frontend",
        description: "Frontend 카테고리",
        parentCategoryId: null,
        parentCategoryName: null,
        isSystem: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      favoriteCount: 12,
      viewCount: 67,
      updatedAt: "1일 전",
      status: "DRAFT",
      visibility: "PRIVATE",
      isPublic: false,
      tags: ["React", "Testing", "Jest"],
    },
    {
      id: 3,
      title: "데이터베이스 최적화",
      description: "쿼리 성능 최적화 전략",
      category: {
        id: 3,
        name: "Database",
        displayName: "Database",
        description: "Database 카테고리",
        parentCategoryId: null,
        parentCategoryName: null,
        isSystem: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      favoriteCount: 18,
      viewCount: 89,
      updatedAt: "3일 전",
      status: "ARCHIVED",
      visibility: "TEAM",
      isPublic: true,
      tags: ["SQL", "최적화", "성능"],
    },
  ])

  const [favoritePrompts, setFavoritePrompts] = useState<FavoritePrompt[]>([
    {
      id: 4,
      title: "머신러닝 모델 평가",
      description: "ML 모델 성능 평가 지표와 방법론",
      category: {
        id: 4,
        name: "Data Science",
        displayName: "Data Science",
        description: "Data Science 카테고리",
        parentCategoryId: null,
        parentCategoryName: null,
        isSystem: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      author: "한머신",
      likes: 31,
      views: 203,
      updatedAt: "2일 전",
      tags: ["ML", "평가", "모델"],
    },
    {
      id: 5,
      title: "UX 리서치 방법론",
      description: "사용자 경험 리서치 체계적 접근법",
      category: {
        id: 5,
        name: "Design",
        displayName: "Design",
        description: "Design 카테고리",
        parentCategoryId: null,
        parentCategoryName: null,
        isSystem: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      author: "정디자인",
      likes: 22,
      views: 134,
      updatedAt: "4일 전",
      tags: ["UX", "리서치", "사용자"],
    },
  ])

  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([
    { action: "생성", actionType: "CREATE", prompt: "API 설계 프롬프트", time: "2시간 전" },
    { action: "수정", actionType: "EDIT", prompt: "React 테스트 가이드", time: "1일 전" },
    { action: "즐겨찾기", actionType: "PUBLISH", prompt: "머신러닝 모델 평가", time: "2일 전" },
    { action: "보관", actionType: "ARCHIVE", prompt: "데이터베이스 최적화", time: "3일 전" },
  ])

  const [filteredMyPrompts, setFilteredMyPrompts] = useState(myPrompts)
  const [statusFilter, setStatusFilter] = useState<Record<StatusType, boolean>>({
    DRAFT: true,
    PUBLISHED: true,
    ARCHIVED: false,
    DELETED: false,
  })
  const [visibilityFilter, setVisibilityFilter] = useState<Record<VisibilityType, boolean>>({
    PUBLIC: true,
    TEAM: true,
    PRIVATE: true,
  })
  const statusLabel: Record<StatusType, string> = {
    DRAFT: "임시저장",
    PUBLISHED: "게시됨",
    ARCHIVED: "보관됨",
    DELETED: "삭제됨",
  }
  const statusColor: Record<StatusType, string> = {
    DRAFT: "bg-yellow-600 text-white",
    PUBLISHED: "bg-green-600 text-white",
    ARCHIVED: "bg-gray-600 text-white",
    DELETED: "bg-red-600 text-white",
  }
  const visibilityLabel: Record<VisibilityType, string> = {
    PUBLIC: "전체 공개",
    TEAM: "팀 공개",
    PRIVATE: "비공개",
  }
  const visibilityColor: Record<VisibilityType, string> = {
    PUBLIC: "border-green-500/30 text-green-400",
    TEAM: "border-blue-500/30 text-blue-400",
    PRIVATE: "border-gray-500/30 text-gray-400",
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [statistics, setStatistics] = useState<any>(null)

  const { categories } = useCategories()

  const fetchMyPrompts = async (params: {
    statusFilters?: StatusType[]
    visibilityFilters?: VisibilityType[]
    searchKeyword?: string
    sortType?: string
    page?: number
    size?: number
  }) => {
    const query = new URLSearchParams()
    if (params.statusFilters && params.statusFilters.length > 0) {
      query.append("statusFilters", params.statusFilters.join(","))
    }
    if (params.visibilityFilters && params.visibilityFilters.length > 0) {
      query.append("visibilityFilters", params.visibilityFilters.join(","))
    }
    if (params.searchKeyword) {
      query.append("searchKeyword", params.searchKeyword)
    }
    if (params.sortType) {
      query.append("sortType", params.sortType)
    }
    query.append("page", String(params.page ?? 0))
    query.append("size", String(params.size ?? 20))

    const res = await fetchWithAuth(`/api/v1/prompts/my?${query.toString()}`)
    if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.")
    return res.json()
  }

  const fetchPromptStatistics = async () => {
    const res = await fetchWithAuth("/api/v1/prompts/my/statistics")
    if (!res.ok) throw new Error("통계 정보를 불러오지 못했습니다.")
    return res.json()
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // 상태 필터, 공개 범위 필터 배열로 변환
        const statusArr = Object.entries(statusFilter)
          .filter(([_, v]) => v)
          .map(([k]) => k as StatusType)
        const visibilityArr = Object.entries(visibilityFilter)
          .filter(([_, v]) => v)
          .map(([k]) => k as VisibilityType)

        // 프롬프트 목록 API 호출
        const promptsRes = await fetchMyPrompts({
          statusFilters: statusArr,
          visibilityFilters: visibilityArr,
          searchKeyword: searchQuery,
          page: currentPage,
          size: 20,
        })
        // 카테고리 매핑
        const mappedPrompts = (promptsRes.content || []).map((item: any) => {
          const categoryObj = categories.find((c) => String(c.id) === String(item.categoryId)) || {
            id: 0,
            name: "other",
            displayName: "기타",
            description: "기타 카테고리",
            parentCategoryId: null,
            parentCategoryName: null,
            isSystem: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            ...item,
            category: categoryObj,
          };
        });
        setMyPrompts(mappedPrompts)
        setFilteredMyPrompts(mappedPrompts)
        setTotalPages(promptsRes.totalPages)

        // 통계 API 호출
        const statsRes = await fetchPromptStatistics()
        setStatistics(statsRes)
      } catch (err: any) {
        setError(err.message || '데이터를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    if (categories.length > 0) loadData()
  }, [statusFilter, visibilityFilter, searchQuery, currentPage, categories])

  // 통계 카드 4개로 고정
  const stats = [
    { label: "내 프롬프트", value: myPrompts.length, color: "text-blue-400" },
    { label: "즐겨찾기", value: favoritePrompts.length, color: "text-yellow-400" },
    { label: "총 조회수", value: myPrompts.reduce((sum, p) => sum + p.viewCount, 0), color: "text-green-400" },
    { label: "총 좋아요", value: myPrompts.reduce((sum, p) => sum + p.favoriteCount, 0), color: "text-red-400" },
  ];

  const handleEditPrompt = (id: number) => {
    alert(`Editing prompt with ID: ${id}`)
  }

  const handleArchivePrompt = (id: number) => {
    setMyPrompts((prev) => prev.map((p) => p.id === id ? { ...p, status: "ARCHIVED" } : p))
  }

  const handleDeletePrompt = (id: number) => {
    setMyPrompts((prev) => prev.map((p) => p.id === id ? { ...p, status: "DELETED" } : p))
    setFilteredMyPrompts((prev) => prev.filter((prompt) => prompt.id !== id))
  }

  const handleSharePrompt = (id: number) => {
    alert(`Sharing prompt with ID: ${id}`)
  }

  const handleToggleFavorite = (id: number) => {
    const promptToToggle = myPrompts.find((prompt) => prompt.id === id)
    if (promptToToggle) {
      const isFavorite = favoritePrompts.some((favPrompt) => favPrompt.id === id)
      if (isFavorite) {
        setFavoritePrompts((prevFavorites) => prevFavorites.filter((favPrompt) => favPrompt.id !== id))
        setRecentActivity((prevActivity) => [
          ...prevActivity,
          { action: "즐겨찾기 취소", actionType: "PUBLISH", prompt: promptToToggle.title, time: "방금" },
        ])
      } else {
        setFavoritePrompts((prevFavorites) => [
          ...prevFavorites,
          {
            id: promptToToggle.id,
            title: promptToToggle.title,
            description: promptToToggle.description,
            category: promptToToggle.category,
            author: "나",
            likes: promptToToggle.likes,
            views: promptToToggle.views,
            updatedAt: promptToToggle.updatedAt,
            tags: promptToToggle.tags,
          },
        ])
        setRecentActivity((prevActivity) => [
          ...prevActivity,
          { action: "즐겨찾기", actionType: "PUBLISH", prompt: promptToToggle.title, time: "방금" },
        ])
      }
    }
  }

  const handleCopyPrompt = (id: number) => {
    const promptToCopy = myPrompts.find((prompt) => prompt.id === id)
    if (promptToCopy) {
      navigator.clipboard.writeText(`Title: ${promptToCopy.title}\nDescription: ${promptToCopy.description}`)
      alert("Prompt copied to clipboard!")
    }
  }

  const handleStatusFilterChange = (status: StatusType, checked: boolean) => {
    setStatusFilter((prev) => ({ ...prev, [status]: checked }))
  }

  const handleVisibilityFilterChange = (visibility: VisibilityType, checked: boolean) => {
    setVisibilityFilter((prev) => ({ ...prev, [visibility]: checked }))
  }

  const getActionIcon = (actionType: ActivityType) => {
    switch (actionType) {
      case "CREATE": return <Plus className="h-4 w-4" />
      case "EDIT": return <Edit className="h-4 w-4" />
      case "PUBLISH": return <Share2 className="h-4 w-4" />
      case "ARCHIVE": return <Archive className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getActionColor = (actionType: ActivityType) => {
    switch (actionType) {
      case "CREATE": return "bg-green-400"
      case "EDIT": return "bg-blue-400"
      case "PUBLISH": return "bg-purple-400"
      case "ARCHIVE": return "bg-gray-400"
      default: return "bg-purple-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header 삭제됨 - 공통 Header만 사용 */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">내 프롬프트</h1>
          <p className="text-white/70">내가 작성하고 즐겨찾기한 프롬프트를 관리하세요</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded text-center">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="my-prompts" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
                <TabsTrigger value="my-prompts" className="data-[state=active]:bg-white/20">
                  내 프롬프트 ({myPrompts.length})
                </TabsTrigger>
                <TabsTrigger value="favorites" className="data-[state=active]:bg-white/20">
                  즐겨찾기 ({favoritePrompts.length})
                </TabsTrigger>
              </TabsList>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="프롬프트 제목, 설명, 태그로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <TabsContent value="my-prompts" className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <Card key={idx} className="bg-white/10 border-white/20 animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-white/20 rounded w-1/3 mb-2" />
                        <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
                        <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
                        <div className="h-4 bg-white/10 rounded w-1/4" />
                      </CardContent>
                    </Card>
                  ))
                ) : filteredMyPrompts.length === 0 ? (
                  <div className="text-white/60 text-center py-8">프롬프트가 없습니다.</div>
                ) : (
                  filteredMyPrompts.map((prompt) => (
                    <Card
                      key={prompt.id}
                      className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                              <CategoryBadge category={prompt.category} className="border-white/30 text-white/70 text-xs" />
                              <Badge className={statusColor[prompt.status as StatusType]}>{statusLabel[prompt.status as StatusType]}</Badge>
                              <Badge variant="outline" className={visibilityColor[prompt.visibility as VisibilityType] + " text-xs"}>
                                {visibilityLabel[prompt.visibility as VisibilityType]}
                              </Badge>
                            </div>
                            <p className="text-white/70 mb-3">{prompt.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {prompt.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-white/70">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-white/60">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {prompt.favoriteCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {prompt.viewCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getRelativeTime(prompt.updatedAt)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white/70 hover:text-yellow-300 p-1"
                              onClick={() => handleToggleFavorite(prompt.id)}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white/70 hover:text-white p-1"
                              onClick={() => handleSharePrompt(prompt.id)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white/70 hover:text-white p-1"
                              onClick={() => handleCopyPrompt(prompt.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Link href={`/prompts/${prompt.id}/edit`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/70 hover:text-white p-1"
                                onClick={() => handleEditPrompt(prompt.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white/70 hover:text-red-400 p-1"
                              onClick={() => handleDeletePrompt(prompt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Link href={`/prompts/${prompt.id}`}>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                              >
                                보기
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        className={`px-3 py-1 rounded text-sm font-medium ${currentPage === idx ? "bg-purple-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                        onClick={() => setCurrentPage(idx)}
                        aria-label={`페이지 ${idx + 1}`}
                        tabIndex={0}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4">
                {favoritePrompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                            <CategoryBadge category={prompt.category} className="border-white/30 text-white/70 text-xs" />
                          </div>
                          <p className="text-white/70 mb-3">{prompt.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {prompt.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-white/70">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <span>by {prompt.author}</span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {prompt.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {prompt.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getRelativeTime(prompt.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-yellow-400 hover:text-yellow-300 p-1"
                            onClick={() => {
                              const promptToRemove = myPrompts.find((p) => p.id === prompt.id)
                              if (promptToRemove) {
                                setFavoritePrompts((prevFavorites) =>
                                  prevFavorites.filter((favPrompt) => favPrompt.id !== prompt.id),
                                )
                                setRecentActivity((prevActivity) => [
                                  ...prevActivity,
                                  { action: "즐겨찾기 취소", actionType: "PUBLISH", prompt: promptToRemove.title, time: "방금" },
                                ])
                              }
                            }}
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/70 hover:text-white p-1"
                            onClick={() => handleCopyPrompt(prompt.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Link href={`/prompts/${prompt.id}`}>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                            >
                              보기
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/prompts/new">
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                    <Plus className="h-4 w-4 mr-2" />새 프롬프트 작성
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start border-white/30 text-white hover:bg-white/10">
                  <Download className="h-4 w-4 mr-2" />내 프롬프트 내보내기
                </Button>
                <Button variant="outline" className="w-full justify-start border-white/30 text-white hover:bg-white/10">
                  <Archive className="h-4 w-4 mr-2" />
                  보관된 프롬프트
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">최근 활동</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.slice(0, 4).map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getActionColor(activity.actionType)}`} />
                    <div className="flex-1">
                      <p className="text-white/80 flex items-center gap-1">
                        {getActionIcon(activity.actionType)}
                        <span className="text-purple-400">{activity.action}</span> {activity.prompt}
                      </p>
                      <p className="text-white/60 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Filter Options */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  필터
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-white/80 text-sm font-medium">상태</p>
                  <div className="space-y-1">
                    {(Object.keys(statusLabel) as StatusType[]).map((status) => (
                      <label key={status} className="flex items-center gap-2 text-white/70 text-sm">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={statusFilter[status]}
                          onChange={(e) => handleStatusFilterChange(status, e.target.checked)}
                        />
                        <span className={`px-2 py-0.5 rounded text-xs ${statusColor[status]}`}>{statusLabel[status]}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white/80 text-sm font-medium">공개 범위</p>
                  <div className="space-y-1">
                    {(Object.keys(visibilityLabel) as VisibilityType[]).map((visibility) => (
                      <label key={visibility} className="flex items-center gap-2 text-white/70 text-sm">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={visibilityFilter[visibility]}
                          onChange={(e) => handleVisibilityFilterChange(visibility, e.target.checked)}
                        />
                        <span className={`px-2 py-0.5 rounded text-xs ${visibilityColor[visibility]}`}>{visibilityLabel[visibility]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
