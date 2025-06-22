"use client"

import {Code2, Star, TrendingUp, Users} from "lucide-react"
import {JSX, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {usePromptStatistics} from "@/app/hooks/usePromptStatistics"
import {useRecentPrompts} from "@/app/hooks/useRecentPrompts"
import {useCategories} from "@/app/hooks/useCategories"
import {useWeeklyViewStatistics} from "@/app/hooks/useWeeklyViewStatistics"
import {useUserStatistics} from "@/app/hooks/useUserStatistics"
import {useFavoriteStatistics} from "@/app/hooks/useFavoriteStatistics"
import {categoryIconMap} from "@/lib/categoryIconMap"
import {getRelativeTime} from "@/app/lib/getRelativeTime"
import {useRootCategoryStatistics} from "@/app/hooks/useRootCategoryStatistics"
import {DashboardStats} from "@components/dashboard/DashboardStats"
import {DashboardRecentPrompts} from "@components/dashboard/DashboardRecentPrompts"
import {DashboardCategoryStats} from "@components/dashboard/DashboardCategoryStats"
import {DashboardQuickActions} from "@components/dashboard/DashboardQuickActions"

// DashboardPrompt 타입 정의
type DashboardPrompt = {
  id: string
  title: string
  description: string
  category: string
  author: string
  favoriteCount: number
  viewCount: number
  updatedAt: string
  tags: string[]
  icon: JSX.Element
  createdByName: string
}

// DashboardPrompt 타입 정의
// (분리 컴포넌트에서 사용하는 타입)
type DashboardPromptForComponent = {
  id: string
  title: string
  description: string
  category: string
  author: string
  favoriteCount: number
  viewCount: number
  updatedAt: string
  tags: string[]
  icon: JSX.Element
  createdByName: string
  categoryId: number
}

// API에서 받은 DashboardPrompt를 컴포넌트용으로 변환
const mapToDashboardPrompt = (prompt: any, categories: any[], categoryIconMap: Record<string, JSX.Element>): DashboardPromptForComponent => {
  const categoryObj = categories.find((cat) => cat.id === prompt.categoryId)
  return {
    id: prompt.id,
    title: prompt.title,
    description: prompt.description,
    category: categoryObj ? categoryObj.displayName : prompt.categoryName || "기타",
    author: prompt.createdByName || "-",
    favoriteCount: prompt.favoriteCount,
    viewCount: prompt.viewCount,
    updatedAt: prompt.updatedAt,
    tags: prompt.tags || [],
    icon: categoryIconMap[prompt.categoryId] || categoryIconMap.default,
    createdByName: prompt.createdByName || "-",
    categoryId: prompt.categoryId,
  }
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPrompts, setFilteredPrompts] = useState<DashboardPrompt[]>([])
  const router = useRouter()
  const [userName, setUserName] = useState("");
  const { data: promptStats, loading: statsLoading, error: statsError } = usePromptStatistics();
  const {
    data: weeklyViewStats,
    loading: weeklyViewsLoading,
    error: weeklyViewsError
  } = useWeeklyViewStatistics();
  const {data: userStats, loading: userStatsLoading, error: userStatsError} = useUserStatistics();
  const {
    data: favoriteStats,
    loading: favoriteStatsLoading,
    error: favoriteStatsError
  } = useFavoriteStatistics();

  const [recentPromptsData, setRecentPromptsData] = useState<DashboardPrompt[]>([])

  const {categories} = useCategories();

  const {
    data: rootCategoryStats,
    loading: rootStatsLoading,
    error: rootStatsError
  } = useRootCategoryStatistics();

  useEffect(() => {
    const results = recentPromptsData.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredPrompts(results)
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
    {
      label: "팀 멤버",
      value: userStatsLoading ? "..." : userStats?.totalCount?.toLocaleString() ?? "-",
      change: userStatsLoading
          ? "..."
          : userStats
              ? `${userStats.percentageChange > 0 ? "+" : ""}${userStats.percentageChange}%`
              : "-",
      icon: <Users className="h-5 w-5"/>,
      href: "/team"
    },
    {
      label: "이번 주 조회수",
      value: weeklyViewsLoading ? "..." : weeklyViewStats?.thisWeekViewCount?.toLocaleString() ?? "-",
      change: weeklyViewsLoading
          ? "..."
          : weeklyViewStats
              ? `${weeklyViewStats.changeRate > 0 ? "+" : ""}${weeklyViewStats.changeRate.toFixed(1)}%`
              : "-",
      icon: <TrendingUp className="h-5 w-5" />,
      href: "/analytics",
    },
    {
      label: "즐겨찾기",
      value: favoriteStatsLoading ? "..." : favoriteStats?.totalCount?.toLocaleString() ?? "-",
      change: favoriteStatsLoading
          ? "..."
          : favoriteStats
              ? `${favoriteStats.percentageChange > 0 ? "+" : ""}${favoriteStats.percentageChange}%`
              : "-",
      icon: <Star className="h-5 w-5" />,
      href: "/prompts?filter=favorites",
    },
  ]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const {data: recentPrompts, loading: recentLoading, error: recentError} = useRecentPrompts(4);

  // recentPrompts 변환
  const recentPromptsForComponent = (recentPrompts ?? []).map((prompt) =>
      mapToDashboardPrompt(prompt, categories, categoryIconMap)
  )

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
        <DashboardStats stats={stats} error={statsError ?? undefined} loading={statsLoading}/>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Prompts */}
          <div className="lg:col-span-2">
            <DashboardRecentPrompts
                recentPrompts={recentPromptsForComponent}
                loading={recentLoading}
                error={recentError ?? undefined}
                categories={categories}
                categoryIconMap={categoryIconMap}
                getRelativeTime={getRelativeTime}
            />
          </div>

          {/* Categories & Quick Actions */}
          <div className="space-y-6">
            {/* Categories */}
            <DashboardCategoryStats
                rootCategoryStats={rootCategoryStats ?? {categories: []}}
                loading={rootStatsLoading}
                error={rootStatsError ?? undefined}
                categories={categories}
                categoryIconMap={categoryIconMap}
            />
            {/* Quick Actions */}
            <DashboardQuickActions/>
          </div>
        </div>
      </div>
    </div>
  )
}
