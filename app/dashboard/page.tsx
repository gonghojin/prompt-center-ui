"use client"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { Input } from "@components/ui/input"
import { Badge } from "@components/ui/badge"
import { Search, Plus, Star, TrendingUp, Users, Clock, Code2, Database, Palette, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, JSX } from "react"
import { useRouter } from "next/navigation"
import { usePromptStatistics } from "@/app/hooks/usePromptStatistics"

// DashboardPrompt 타입 정의
type DashboardPrompt = {
  id: number
  title: string
  description: string
  category: string
  author: string
  likes: number
  views: number
  updatedAt: string
  tags: string[]
  icon: JSX.Element
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPrompts, setFilteredPrompts] = useState<DashboardPrompt[]>([])
  const router = useRouter()
  const [userName, setUserName] = useState("");
  const { data: promptStats, loading: statsLoading, error: statsError } = usePromptStatistics();

  const recentPromptsData = [
    {
      id: 1,
      title: "API 설계 프롬프트",
      description: "RESTful API 설계를 위한 상세 가이드라인",
      category: "Backend",
      author: "김개발",
      likes: 24,
      views: 156,
      updatedAt: "2시간 전",
      tags: ["API", "REST", "설계"],
      icon: <Code2 className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "React 컴포넌트 테스트",
      description: "React 컴포넌트 단위 테스트 작성 가이드",
      category: "Frontend",
      author: "이프론트",
      likes: 18,
      views: 89,
      updatedAt: "4시간 전",
      tags: ["React", "Testing", "Jest"],
      icon: <Palette className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "데이터 분석 리포트",
      description: "비즈니스 데이터 분석 및 인사이트 도출",
      category: "Data Science",
      author: "박데이터",
      likes: 31,
      views: 203,
      updatedAt: "1일 전",
      tags: ["분석", "리포트", "인사이트"],
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "데이터베이스 최적화",
      description: "쿼리 성능 최적화 및 인덱스 설계",
      category: "Database",
      author: "최디비",
      likes: 27,
      views: 134,
      updatedAt: "2일 전",
      tags: ["SQL", "최적화", "성능"],
      icon: <Database className="h-5 w-5" />,
    },
  ]

  const [recentPrompts, setRecentPrompts] = useState<DashboardPrompt[]>(recentPromptsData)

  useEffect(() => {
    const results = recentPromptsData.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredPrompts(results)
    setRecentPrompts(results)
  }, [searchTerm])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || "");
        } catch {
          setUserName("");
        }
      }
    }
  }, []);

  const stats = [
    {
      label: "총 프롬프트",
      value: statsLoading ? "..." : promptStats ? promptStats.totalCount.toLocaleString() : "-",
      change: statsLoading
        ? "..."
        : promptStats
        ? `${promptStats.percentageChange > 0 ? "+" : ""}${promptStats.percentageChange}%`
        : "-",
      icon: <Code2 className="h-5 w-5" />, href: "/prompts"
    },
    { label: "팀 멤버", value: "24", change: "+3", icon: <Users className="h-5 w-5" />, href: "/team" },
    {
      label: "이번 주 조회수",
      value: "3,891",
      change: "+18%",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/analytics",
    },
    {
      label: "즐겨찾기",
      value: "156",
      change: "+7",
      icon: <Star className="h-5 w-5" />,
      href: "/prompts?filter=favorites",
    },
  ]

  const categories = [
    { name: "Backend", count: 342, color: "from-blue-500 to-cyan-500" },
    { name: "Frontend", count: 289, color: "from-purple-500 to-pink-500" },
    { name: "Data Science", count: 156, color: "from-green-500 to-emerald-500" },
    { name: "Design", count: 98, color: "from-yellow-500 to-orange-500" },
  ]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header 삭제됨 - 공통 Header만 사용 */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">안녕하세요, {userName ? `${userName}님` : "사용자"}! 👋</h1>
          <p className="text-white/70">오늘도 효율적인 프롬프트 관리로 생산성을 높여보세요</p>
        </div>

        {/* Stats Cards */}
        {statsError && (
          <div className="mb-4 text-red-400">{statsError}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.href}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-green-400 text-sm">{stat.change}</p>
                    </div>
                    <div className="text-purple-400">{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Prompts */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">최근 프롬프트</CardTitle>
                  <Link href="/prompts">
                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                      전체 보기
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPrompts.map((prompt) => (
                  <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
                    <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className="text-purple-400 mt-1">{prompt.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                              {prompt.title}
                            </h3>
                            <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                              {prompt.category}
                            </Badge>
                          </div>
                          <p className="text-white/70 text-sm mb-3">{prompt.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-white/60">
                              <span>by {prompt.author}</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {prompt.likes}
                              </span>
                              <span>{prompt.views} 조회</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {prompt.updatedAt}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {prompt.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-white/70">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Categories & Quick Actions */}
          <div className="space-y-6">
            {/* Categories */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">카테고리별 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                      <span className="text-white">{category.name}</span>
                    </div>
                    <span className="text-white/70">{category.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

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
                <Link href="/prompts?filter=favorites">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    즐겨찾기 보기
                  </Button>
                </Link>
                <Link href="/prompts?filter=recent">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-white/30 text-white hover:bg-white/10"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    최근 수정된 항목
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
