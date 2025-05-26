"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Eye, Clock, User, Plus, Code2, Database, Palette, BarChart3, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [prompts, setPrompts] = useState([
    {
      id: 1,
      title: "API 설계 프롬프트",
      description: "RESTful API 설계를 위한 상세 가이드라인과 베스트 프랙티스를 포함한 종합적인 프롬프트입니다.",
      category: "Backend",
      author: "김개발",
      likes: 24,
      views: 156,
      updatedAt: "2시간 전",
      tags: ["API", "REST", "설계", "백엔드"],
      icon: <Code2 className="h-5 w-5" />,
      isFavorite: true,
      isPublic: true,
    },
    {
      id: 2,
      title: "React 컴포넌트 테스트",
      description: "React 컴포넌트의 단위 테스트 작성을 위한 체계적인 접근 방법과 실제 예제 코드를 제공합니다.",
      category: "Frontend",
      author: "이프론트",
      likes: 18,
      views: 89,
      updatedAt: "4시간 전",
      tags: ["React", "Testing", "Jest", "프론트엔드"],
      icon: <Palette className="h-5 w-5" />,
      isFavorite: false,
      isPublic: true,
    },
    {
      id: 3,
      title: "데이터 분석 리포트",
      description: "비즈니스 데이터 분석 및 인사이트 도출을 위한 구조화된 분석 프레임워크입니다.",
      category: "Data Science",
      author: "박데이터",
      likes: 31,
      views: 203,
      updatedAt: "1일 전",
      tags: ["분석", "리포트", "인사이트", "데이터"],
      icon: <BarChart3 className="h-5 w-5" />,
      isFavorite: true,
      isPublic: true,
    },
    {
      id: 4,
      title: "데이터베이스 최적화",
      description: "쿼리 성능 최적화 및 인덱스 설계를 위한 실무 중심의 가이드라인을 제공합니다.",
      category: "Database",
      author: "최디비",
      likes: 27,
      views: 134,
      updatedAt: "2일 전",
      tags: ["SQL", "최적화", "성능", "데이터베이스"],
      icon: <Database className="h-5 w-5" />,
      isFavorite: false,
      isPublic: false,
    },
    {
      id: 5,
      title: "UX 리서치 방법론",
      description: "사용자 경험 리서치를 위한 체계적인 방법론과 실제 적용 사례를 다룹니다.",
      category: "Design",
      author: "정디자인",
      likes: 15,
      views: 67,
      updatedAt: "3일 전",
      tags: ["UX", "리서치", "사용자", "디자인"],
      icon: <Palette className="h-5 w-5" />,
      isFavorite: false,
      isPublic: true,
    },
    {
      id: 6,
      title: "머신러닝 모델 평가",
      description: "머신러닝 모델의 성능 평가 지표와 검증 방법에 대한 종합적인 가이드입니다.",
      category: "Data Science",
      author: "한머신",
      likes: 22,
      views: 98,
      updatedAt: "4일 전",
      tags: ["ML", "평가", "모델", "검증"],
      icon: <BarChart3 className="h-5 w-5" />,
      isFavorite: true,
      isPublic: true,
    },
  ])
  const [filteredPrompts, setFilteredPrompts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const promptsPerPage = 9

  useEffect(() => {
    // Filtering
    const filtered = prompts.filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sorting
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.likes - a.likes)
    } else if (sortBy === "views") {
      filtered.sort((a, b) => b.views - a.views)
    } else if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredPrompts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedCategory, sortBy, prompts])

  const handleLike = (id: number) => {
    setPrompts((prevPrompts) =>
      prevPrompts.map((prompt) => (prompt.id === id ? { ...prompt, likes: prompt.likes + 1 } : prompt)),
    )
  }

  const handleShare = (id: number) => {
    // Implement share functionality (e.g., copy to clipboard)
    const promptUrl = `${window.location.origin}/prompts/${id}`
    navigator.clipboard
      .writeText(promptUrl)
      .then(() => {
        alert("URL copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleFavorite = (id: number) => {
    setPrompts((prevPrompts) =>
      prevPrompts.map((prompt) => (prompt.id === id ? { ...prompt, isFavorite: !prompt.isFavorite } : prompt)),
    )
  }

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  const paginatedPrompts = filteredPrompts.slice(0, currentPage * promptsPerPage)

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
        <div className="mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="프롬프트 제목, 설명, 태그로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <SelectValue placeholder="카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 카테고리</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                  </SelectContent>
                </Select>
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
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-white/70">{filteredPrompts.length}개의 프롬프트를 찾았습니다</p>
        </div>

        {/* Prompts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-purple-400">{prompt.icon}</div>
                    <div>
                      <Badge variant="outline" className="border-white/30 text-white/70 text-xs mb-2">
                        {prompt.category}
                      </Badge>
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
                <div className="flex flex-wrap gap-1 mb-4">
                  {prompt.tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-white/70">
                      {tag}
                    </Badge>
                  ))}
                  {prompt.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-white/10 text-white/70">
                      +{prompt.tags.length - 3}
                    </Badge>
                  )}
                </div>

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
                      onClick={() => handleLike(prompt.id)}
                    >
                      <Heart className="h-3 w-3" />
                      {prompt.likes}
                    </Button>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {prompt.views}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/70 hover:text-white p-1"
                      onClick={() => handleShare(prompt.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/70 hover:text-white p-1"
                      onClick={() => handleFavorite(prompt.id)}
                    >
                      <Star className="h-4 w-4" />
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
