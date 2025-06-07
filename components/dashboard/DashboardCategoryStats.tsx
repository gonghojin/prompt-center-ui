import {Card, CardContent, CardHeader, CardTitle} from "@components/ui/card"
import {FC, JSX} from "react"
import type {Category} from "@/app/types/category"

type RootCategoryStat = {
  categoryId: number
  categoryName: string
  promptCount: number
}

type DashboardCategoryStatsProps = {
  rootCategoryStats: { categories: RootCategoryStat[] }
  loading?: boolean
  error?: string
  categories: Category[]
  categoryIconMap: Record<string, JSX.Element>
}

export const DashboardCategoryStats: FC<DashboardCategoryStatsProps> = ({
                                                                          rootCategoryStats,
                                                                          loading,
                                                                          error,
                                                                          categories,
                                                                          categoryIconMap,
                                                                        }) => {
  return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">카테고리별 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-red-400">{error}</div>}
          {loading ? (
              <div className="text-white/70 py-4 text-center">불러오는 중...</div>
          ) : rootCategoryStats && rootCategoryStats.categories.length > 0 ? (
              rootCategoryStats.categories.map((cat, idx) => {
                const categoryObj = categories.find((c) => c.id === cat.categoryId)
                return (
                    <div key={cat.categoryId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                            className="mr-1">{categoryIconMap[cat.categoryName] || categoryIconMap.default}</span>
                        {categoryObj ? (
                            <span
                                className="text-white font-semibold text-base">{categoryObj.displayName}</span>
                        ) : (
                            <span
                                className="text-white font-semibold text-base">{cat.categoryName}</span>
                        )}
                      </div>
                      <span className="text-white/70">{cat.promptCount}</span>
                    </div>
                )
              })
          ) : (
              <div className="text-white/70 py-4 text-center">카테고리 통계가 없습니다.</div>
          )}
        </CardContent>
      </Card>
  )
} 