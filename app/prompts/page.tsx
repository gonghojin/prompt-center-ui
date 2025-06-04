"use client"

import Link from "next/link"
import { Button } from "@components/ui/button"
import { Loader2, AlertTriangle, Plus } from "lucide-react"
import { PromptCard } from "@/components/prompts/PromptCard"
import { PromptFilters } from "@/components/prompts/PromptFilters"
import { usePrompts } from "@/app/hooks/usePrompts"

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
    handleLike,
    handleFavorite,
    handleShare,
    handleLoadMore,
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
        <div className="mb-4">
          {loading ? (
            <div className="flex items-center gap-2 text-white/70"><Loader2 className="animate-spin" />불러오는 중...</div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-400"><AlertTriangle />{error}</div>
          ) : (
            <p className="text-white/70">{totalPrompts}개의 프롬프트를 찾았습니다</p>
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
          {currentPage + 1 < totalPrompts && (
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={handleLoadMore}>
              더 많은 프롬프트 보기
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
