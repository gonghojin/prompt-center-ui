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
