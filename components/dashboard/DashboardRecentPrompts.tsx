import {Card, CardContent, CardHeader, CardTitle} from "@components/ui/card"
import {Button} from "@components/ui/button"
import Link from "next/link"
import {FC, JSX} from "react"
import {Badge} from "@components/ui/badge"
import {Clock, Eye, Star} from "lucide-react"
import {CategoryBadge} from "@components/category/CategoryBadge"
import type {Category} from "@/app/types/category"

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
  categoryId: number
}

type DashboardRecentPromptsProps = {
  recentPrompts: DashboardPrompt[]
  loading?: boolean
  error?: string
  categories: Category[]
  categoryIconMap: Record<string, JSX.Element>
  getRelativeTime: (date: string) => string
}

export const DashboardRecentPrompts: FC<DashboardRecentPromptsProps> = ({
                                                                          recentPrompts,
                                                                          loading,
                                                                          error,
                                                                          categories,
                                                                          categoryIconMap,
                                                                          getRelativeTime,
                                                                        }) => {
  return (
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
          {error && <div className="text-red-400">{error}</div>}
          {loading ? (
              <div className="text-white/70 py-8 text-center">불러오는 중...</div>
          ) : recentPrompts && recentPrompts.length > 0 ? (
              recentPrompts.map((prompt) => {
                const category = categories.find((cat) => cat.id === prompt.categoryId) || {
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
                const icon = categoryIconMap[category.id] || categoryIconMap.default
                return (
                    <Link key={prompt.id} href={`/prompts/${prompt.id}`} aria-label={prompt.title}
                          tabIndex={0}>
                      <div
                          className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-start gap-3">
                          <div className="text-purple-400 mt-1">{icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                                {prompt.title}
                              </h3>
                              <CategoryBadge category={category}
                                             className="border-white/30 text-white/70 text-xs"/>
                            </div>
                            <p className="text-white/70 text-sm mb-3">{prompt.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-white/60">
                                <span>by {prompt.createdByName}</span>
                                <span className="flex items-center gap-1">
                            <Star className="h-3 w-3"/>
                                  {prompt.favoriteCount}
                          </span>
                                <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3"/>
                                  {getRelativeTime(prompt.updatedAt)}
                          </span>
                                <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3"/>
                                  {prompt.viewCount}
                          </span>
                              </div>
                            </div>
                            <div className="flex gap-1 mt-2">
                              {prompt.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary"
                                         className="text-xs bg-white/10 text-white/70">
                                    {tag}
                                  </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                )
              })
          ) : (
              <div className="text-white/70 py-8 text-center">최근 프롬프트가 없습니다.</div>
          )}
        </CardContent>
      </Card>
  )
} 