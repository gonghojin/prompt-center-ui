"use client"

import {Button} from "@components/ui/button"
import {AlertTriangle, ChevronLeft, ChevronRight, ChevronUp, Loader2} from "lucide-react"
import {PromptCard} from "@/components/prompts/PromptCard"
import {PromptFilters} from "@/components/prompts/PromptFilters"
import {usePrompts} from "@/app/hooks/usePrompts"

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
    currentPage,
    totalPages,
    canGoBack,
    canLoadMore,
    handleLike,
    handleFavorite,
    handleShare,
    handleLoadMore,
    handleGoBack,
    handleGoToFirst,
    categories,
    rootCategories,
    totalPrompts,
  } = usePrompts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header 삭제됨 - 공통 Header만 사용 */}
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
        <div className="mb-4 flex items-center justify-between">
          <div>
            {loading ? (
                <div className="flex items-center gap-2 text-white/70">
                  <Loader2 className="animate-spin"/>
                  불러오는 중...
                </div>
            ) : error ? (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle/>
                  {error}
                </div>
            ) : (
                <p className="text-white/70">{totalPrompts}개의 프롬프트를 찾았습니다</p>
            )}
          </div>

          {/* Page Info */}
          {!loading && !error && totalPages > 0 && (
              <div className="text-white/70 text-sm">
                페이지 {currentPage + 1} / {totalPages}
              </div>
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

        {/* Navigation Controls */}
        <div className="mt-8 space-y-4">
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Previous Page Button - Secondary Action */}
            {canGoBack && (
                <Button
                    variant="outline"
                    className="border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400 flex items-center gap-2 transition-all duration-200"
                    onClick={handleGoBack}
                >
                  <ChevronLeft className="w-4 h-4"/>
                  이전 페이지
                </Button>
            )}

            {/* Load More Button - Primary Action */}
            {canLoadMore && (
                <Button
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 transition-all duration-200 font-medium"
                    onClick={handleLoadMore}
                    disabled={loading}
                >
                  {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin"/>
                  ) : (
                      <ChevronRight className="w-4 h-4"/>
                  )}
                  더 많은 프롬프트 보기
                </Button>
            )}

            {/* Go to First Button - Tertiary Action */}
            {currentPage > 0 && (
                <Button
                    variant="ghost"
                    className="text-white/50 hover:text-white/80 hover:bg-white/5 flex items-center gap-2 transition-all duration-200"
                    onClick={handleGoToFirst}
                >
                  <ChevronUp className="w-4 h-4"/>
                  맨 처음으로
                </Button>
            )}
          </div>

          {/* Progress Indicator */}
          {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center gap-3">
                  <div className="text-white/40 text-xs font-medium">진행률</div>
                  <div
                      className="w-40 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-purple-400 via-purple-500 to-pink-400 transition-all duration-500 ease-out shadow-sm"
                        style={{width: `${((currentPage + 1) / totalPages) * 100}%`}}
                    />
                  </div>
                  <div className="text-white/60 text-xs font-medium min-w-[2.5rem] text-right">
                    {Math.round(((currentPage + 1) / totalPages) * 100)}%
                  </div>
                </div>
              </div>
          )}
        </div>

        {/* No More Results Message */}
        {!loading && !canLoadMore && paginatedPrompts.length > 0 && (
            <div
                className="text-center mt-8 p-6 bg-gradient-to-r from-white/5 to-purple-500/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <p className="text-white/70 mb-3 font-medium">🎉 모든 프롬프트를 확인했습니다</p>
              {currentPage > 0 && (
                  <Button
                      variant="outline"
                      className="border-purple-400/30 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400/50 transition-all duration-200"
                      onClick={handleGoToFirst}
                  >
                    처음부터 다시 보기
                  </Button>
              )}
            </div>
        )}
      </div>
    </div>
  )
}
