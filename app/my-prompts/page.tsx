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

type FavoritePrompt = {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  likes: number;
  views: number;
  updatedAt: string;
  tags: string[];
};

export default function MyPromptsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("my-prompts")
  const [myPrompts, setMyPrompts] = useState([
    {
      id: 1,
      title: "API 설계 프롬프트",
      description: "RESTful API 설계를 위한 상세 가이드라인",
      category: "Backend",
      likes: 24,
      views: 156,
      updatedAt: "2시간 전",
      status: "published",
      isPublic: true,
      tags: ["API", "REST", "설계"],
    },
    {
      id: 2,
      title: "React 테스트 가이드",
      description: "React 컴포넌트 테스트 작성 방법론",
      category: "Frontend",
      likes: 12,
      views: 67,
      updatedAt: "1일 전",
      status: "draft",
      isPublic: false,
      tags: ["React", "Testing", "Jest"],
    },
    {
      id: 3,
      title: "데이터베이스 최적화",
      description: "쿼리 성능 최적화 전략",
      category: "Database",
      likes: 18,
      views: 89,
      updatedAt: "3일 전",
      status: "published",
      isPublic: true,
      tags: ["SQL", "최적화", "성능"],
    },
  ])

  const [favoritePrompts, setFavoritePrompts] = useState<FavoritePrompt[]>([
    {
      id: 4,
      title: "머신러닝 모델 평가",
      description: "ML 모델 성능 평가 지표와 방법론",
      category: "Data Science",
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
      category: "Design",
      author: "정디자인",
      likes: 22,
      views: 134,
      updatedAt: "4일 전",
      tags: ["UX", "리서치", "사용자"],
    },
  ])

  const [recentActivity, setRecentActivity] = useState([
    { action: "생성", prompt: "API 설계 프롬프트", time: "2시간 전" },
    { action: "수정", prompt: "React 테스트 가이드", time: "1일 전" },
    { action: "즐겨찾기", prompt: "머신러닝 모델 평가", time: "2일 전" },
    { action: "공유", prompt: "데이터베이스 최적화", time: "3일 전" },
  ])

  const [filteredMyPrompts, setFilteredMyPrompts] = useState(myPrompts)
  const [publishedFilter, setPublishedFilter] = useState(true)
  const [draftFilter, setDraftFilter] = useState(true)
  const [publicFilter, setPublicFilter] = useState(true)
  const [privateFilter, setPrivateFilter] = useState(true)

  useEffect(() => {
    let filtered = myPrompts.filter((prompt) => {
      if (publishedFilter && prompt.status === "published") return true
      if (draftFilter && prompt.status === "draft") return true
      return false
    })

    filtered = filtered.filter((prompt) => {
      if (publicFilter && prompt.isPublic) return true
      if (privateFilter && !prompt.isPublic) return true
      return false
    })

    filtered = filtered.filter((prompt) => prompt.title.toLowerCase().includes(searchQuery.toLowerCase()))

    setFilteredMyPrompts(filtered)
  }, [myPrompts, searchQuery, publishedFilter, draftFilter, publicFilter, privateFilter])

  const stats = [
    { label: "내 프롬프트", value: myPrompts.length, color: "text-blue-400" },
    { label: "즐겨찾기", value: favoritePrompts.length, color: "text-yellow-400" },
    {
      label: "총 조회수",
      value: myPrompts.reduce((sum, p) => sum + p.views, 0),
      color: "text-green-400",
    },
    {
      label: "총 좋아요",
      value: myPrompts.reduce((sum, p) => sum + p.likes, 0),
      color: "text-red-400",
    },
  ]

  const handleEditPrompt = (id: number) => {
    alert(`Editing prompt with ID: ${id}`)
  }

  const handleDeletePrompt = (id: number) => {
    setMyPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt.id !== id))
    setFilteredMyPrompts((prevPrompts) => prevPrompts.filter((prompt) => prompt.id !== id))
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
          { action: "즐겨찾기 취소", prompt: promptToToggle.title, time: "방금" },
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
          { action: "즐겨찾기", prompt: promptToToggle.title, time: "방금" },
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
                <Link href="/prompts" className="text-white/70 hover:text-white transition-colors">
                  프롬프트
                </Link>
                <Link href="/my-prompts" className="text-white hover:text-purple-400 transition-colors">
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
                  placeholder="내 프롬프트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <TabsContent value="my-prompts" className="space-y-4">
                {filteredMyPrompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-white">{prompt.title}</h3>
                            <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                              {prompt.category}
                            </Badge>
                            <Badge
                              variant={prompt.status === "published" ? "default" : "secondary"}
                              className={
                                prompt.status === "published" ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                              }
                            >
                              {prompt.status === "published" ? "게시됨" : "임시저장"}
                            </Badge>
                            {prompt.isPublic && (
                              <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
                                공개
                              </Badge>
                            )}
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
                              {prompt.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {prompt.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {prompt.updatedAt}
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
                ))}
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
                            <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                              {prompt.category}
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
                              {prompt.updatedAt}
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
                                  { action: "즐겨찾기 취소", prompt: promptToRemove.title, time: "방금" },
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
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <div className="flex-1">
                      <p className="text-white/80">
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
                    <label className="flex items-center gap-2 text-white/70 text-sm">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={publishedFilter}
                        onChange={(e) => setPublishedFilter(e.target.checked)}
                      />
                      게시됨
                    </label>
                    <label className="flex items-center gap-2 text-white/70 text-sm">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={draftFilter}
                        onChange={(e) => setDraftFilter(e.target.checked)}
                      />
                      임시저장
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white/80 text-sm font-medium">공개 범위</p>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-white/70 text-sm">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={publicFilter}
                        onChange={(e) => setPublicFilter(e.target.checked)}
                      />
                      공개
                    </label>
                    <label className="flex items-center gap-2 text-white/70 text-sm">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={privateFilter}
                        onChange={(e) => setPrivateFilter(e.target.checked)}
                      />
                      비공개
                    </label>
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
