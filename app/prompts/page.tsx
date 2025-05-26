"use client"

import { useState, useEffect, JSX } from "react"
import Link from "next/link"
import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Input } from "@components/ui/input"
import { Badge } from "@components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Tooltip, TooltipTrigger, TooltipContent } from "@components/ui/tooltip"
import { Search, Star, Eye, Clock, User, Plus, Code2, Database, Palette, BarChart3, Heart, Share2, Loader2, AlertTriangle } from "lucide-react"
import { useCategories } from "@/app/hooks/useCategories";
import { CategorySelect } from "@/components/category/CategorySelect";
import { CategoryBadge } from "@/components/category/CategoryBadge";
import { Category } from "@/app/types/category";

// 타입 정의
interface ApiPrompt {
  id: string
  title: string
  description: string
  content: string
  author: { id: string; email: string; name: string }
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

interface Prompt {
  id: string
  title: string
  description: string
  category: Category
  author: string
  favoriteCount: number
  viewCount: number
  updatedAt: string
  tags: string[]
  icon: JSX.Element
  isFavorite: boolean
  isPublic: boolean
}

const categoryIconMap: Record<string, JSX.Element> = {
  Backend: <Code2 className="h-5 w-5" />, 
  Frontend: <Palette className="h-5 w-5" />, 
  "Data Science": <BarChart3 className="h-5 w-5" />, 
  Database: <Database className="h-5 w-5" />, 
  Design: <Palette className="h-5 w-5" />, 
  default: <Code2 className="h-5 w-5" />,
}

// 1. usePrompts 커스텀 훅
const usePrompts = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const promptsPerPage = 9
  const { categories, rootCategories } = useCategories()

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/v1/prompts?page=0&size=100&sort=createdAt,desc")
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.")
        const data: ApiPrompt[] = await res.json()
        const mapped: Prompt[] = data.map((item) => {
          const category = categories.find((c) => c.id === item.categoryId) || {
            id: 0,
            name: "other",
            displayName: "기타",
            description: "기타 카테고리",
            parentCategoryId: null,
            parentCategoryName: null,
            isSystem: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          const icon = categoryIconMap[category.displayName] || categoryIconMap.default
          const updatedAt = item.updatedAt ? item.updatedAt.slice(0, 10) : "-"
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            category,
            author: item.author?.name || "-",
            favoriteCount: item.favoriteCount,
            viewCount: item.viewCount,
            updatedAt,
            tags: item.tags?.map((t) => t.name) || [],
            icon,
            isFavorite: false,
            isPublic: item.public,
          }
        })
        setPrompts(mapped)
      } catch (e: any) {
        setError(e.message || "알 수 없는 오류")
      } finally {
        setLoading(false)
      }
    }
    if (categories.length > 0) fetchPrompts()
  }, [categories])

  useEffect(() => {
    const filtered = prompts.filter((prompt) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        (prompt.title?.toLowerCase() || "").includes(q) ||
        (prompt.description?.toLowerCase() || "").includes(q) ||
        (prompt.tags || []).some((tag) => (tag?.toLowerCase() || "").includes(q))
      const matchesCategory =
        selectedCategory === "all" ||
        prompt.category.id.toString() === selectedCategory ||
        (prompt.category.parentCategoryId && prompt.category.parentCategoryId.toString() === selectedCategory)
      return matchesSearch && matchesCategory
    })
    if (sortBy === "recent") {
      filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.favoriteCount - a.favoriteCount)
    } else if (sortBy === "views") {
      filtered.sort((a, b) => b.viewCount - a.viewCount)
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }
    setFilteredPrompts(filtered)
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, sortBy, prompts])

  const handleLike = (id: string) => {
    setPrompts((prev) => prev.map((p) => p.id === id ? { ...p, favoriteCount: p.favoriteCount + 1 } : p))
  }
  const handleFavorite = (id: string) => {
    setPrompts((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
  }
  const handleShare = (id: string) => {
    const promptUrl = `${window.location.origin}/prompts/${id}`
    navigator.clipboard.writeText(promptUrl).then(() => {
      alert("URL이 복사되었습니다!")
    })
  }
  const handleLoadMore = () => setCurrentPage((prev) => prev + 1)
  const paginatedPrompts = filteredPrompts.slice(0, currentPage * promptsPerPage)

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    loading,
    error,
    paginatedPrompts,
    filteredPrompts,
    currentPage,
    promptsPerPage,
    handleLike,
    handleFavorite,
    handleShare,
    handleLoadMore,
    categories,
    rootCategories,
  }
}

// 2. PromptFilters 컴포넌트
const PromptFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  rootCategories,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  selectedCategory: string
  setSelectedCategory: (v: string) => void
  sortBy: string
  setSortBy: (v: string) => void
  categories: Category[]
  rootCategories: Category[]
}) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="프롬프트 제목, 설명, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
            aria-label="프롬프트 검색"
          />
        </div>
        <CategorySelect
          categories={categories}
          rootCategories={rootCategories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          className="w-full md:w-48 bg-white/10 backdrop-blur-sm border-white/20 text-white"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">최근 수정순</SelectItem>
            <SelectItem value="popular">인기순</SelectItem>
            <SelectItem value="views">조회수순</SelectItem>
            <SelectItem value="alphabetical">이름순</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
)

// 3. PromptTags 컴포넌트
const PromptTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-1 mb-4">
    {tags.slice(0, 3).map((tag, idx) => (
      <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-white/70">
        {tag}
      </Badge>
    ))}
    {tags.length > 3 && (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className="text-xs bg-white/10 text-white/70 cursor-pointer"
            tabIndex={0}
            aria-label={`추가 태그 ${tags.length - 3}개 더 보기`}
          >
            +{tags.length - 3}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{tags.slice(3).join(", ")}</TooltipContent>
      </Tooltip>
    )}
  </div>
)

// 4. PromptCard 컴포넌트
const PromptCard = ({
  prompt,
  onLike,
  onShare,
  onFavorite,
}: {
  prompt: Prompt
  onLike: (id: string) => void
  onShare: (id: string) => void
  onFavorite: (id: string) => void
}) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-purple-400">{prompt.icon}</div>
          <div>
            <CategoryBadge category={prompt.category} className="border-white/30 text-white/70 text-xs mb-2" />
            <CardTitle className="text-white text-lg group-hover:text-purple-400 transition-colors">
              {prompt.title}
            </CardTitle>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {prompt.isFavorite && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
          {!prompt.isPublic && <Eye className="h-4 w-4 text-white/50" />}
        </div>
      </div>
      <CardDescription className="text-white/70 line-clamp-3">{prompt.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <PromptTags tags={prompt.tags} />
      <div className="flex items-center justify-between text-xs text-white/60 mb-4">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {prompt.author}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {prompt.updatedAt}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-white/60">
          <Button
            size="sm"
            variant="ghost"
            className="text-white/70 hover:text-white p-1"
            onClick={() => onLike(prompt.id)}
            aria-label="좋아요"
          >
            <Heart className="h-3 w-3" />
            {prompt.favoriteCount}
          </Button>
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
            onClick={() => onShare(prompt.id)}
            aria-label="공유"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white/70 hover:text-white p-1"
            onClick={() => onFavorite(prompt.id)}
            aria-label="즐겨찾기"
          >
            <Star className="h-4 w-4" />
          </Button>
          <Link href={`/prompts/${prompt.id}`} tabIndex={0} aria-label="프롬프트 상세 보기">
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
)

// 5. 메인 컴포넌트
export default function PromptsPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    loading,
    error,
    paginatedPrompts,
    filteredPrompts,
    currentPage,
    promptsPerPage,
    handleLike,
    handleFavorite,
    handleShare,
    handleLoadMore,
    categories,
    rootCategories,
  } = usePrompts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  PromptHub
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">
                  대시보드
                </Link>
                <Link href="/prompts" className="text-white hover:text-purple-400 transition-colors">
                  프롬프트
                </Link>
                <Link href="/my-prompts" className="text-white/70 hover:text-white transition-colors">
                  내 프롬프트
                </Link>
                <Link href="/settings" className="text-white/70 hover:text-white transition-colors">
                  설정
                </Link>
              </nav>
            </div>
            <Link href="/prompts/new">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                <Plus className="h-4 w-4 mr-2" />새 프롬프트
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">프롬프트 탐색</h1>
          <p className="text-white/70">팀에서 공유된 다양한 프롬프트 템플릿을 찾아보세요</p>
        </div>

        {/* Search and Filters */}
        <PromptFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          rootCategories={rootCategories}
        />

        {/* Results */}
        <div className="mb-4">
          {loading ? (
            <div className="flex items-center gap-2 text-white/70"><Loader2 className="animate-spin" />불러오는 중...</div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-400"><AlertTriangle />{error}</div>
          ) : (
            <p className="text-white/70">{filteredPrompts.length}개의 프롬프트를 찾았습니다</p>
          )}
        </div>

        {/* Prompts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onLike={handleLike}
              onShare={handleShare}
              onFavorite={handleFavorite}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          {currentPage * promptsPerPage < filteredPrompts.length && (
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={handleLoadMore}>
              더 많은 프롬프트 보기
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
