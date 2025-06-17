"use client"

import {Card, CardContent} from "@components/ui/card"
import {Input} from "@components/ui/input"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@components/ui/tabs"
import {Archive, Clock, Edit, Plus, Search, Share2,} from "lucide-react"
import {useCallback, useEffect, useMemo, useState} from "react"
import type {Category} from "@/app/types/category"
import {PromptCard} from "@components/my-prompts/PromptCard"
import {FavoritePromptCard} from "@components/my-prompts/FavoritePromptCard"
import {PromptStats} from "@components/my-prompts/PromptStats"
import {PromptFilters} from "@components/my-prompts/PromptFilters"
import {PromptActivity} from "@components/my-prompts/PromptActivity"
import {PromptQuickActions} from "@components/my-prompts/PromptQuickActions"
import {useMyPrompts} from "@/app/hooks/useMyPrompts"
import {useFavoritePrompts} from "@/app/hooks/useFavoritePrompts"
import {useFavoriteCount} from "@/app/hooks/useFavoriteCount"
import {addFavoritePrompt, removeFavoritePrompt} from "@/app/api/favoritePrompt"
import {useMyPromptLikeCount} from "@/app/hooks/useMyPromptLikeCount"
import {INITIAL_ACTIVITY, STATUS_CONFIG, VISIBILITY_CONFIG} from "@/app/constants/my-prompts"
import type {ActivityLog, ActivityType, Stat} from "@/app/types/my-prompts"
import {useDebounce} from "@/app/hooks/useDebounce"
import {deletePrompt} from "@/app/api/promptsApi"
import {useRouter} from "next/navigation";
import {fetchPromptStatistics} from "@/app/hooks/useMyPrompts"
import {useToast} from "@/components/ui/useToast";

type StatusType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
type VisibilityType = 'PUBLIC' | 'TEAM' | 'PRIVATE';

type FavoritePrompt = {
  id: string;
  title: string;
  description: string;
  category: Category;
  author: string;
  favoriteCount: number;
  viewCount: number;
  updatedAt: string;
  tags: string[];
};

export default function MyPromptsPage() {
  const [activeTab, setActiveTab] = useState("my-prompts")
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>(INITIAL_ACTIVITY)
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const debouncedSearch = useDebounce(searchInput, 300)

  const {
    myPrompts,
    setMyPrompts,
    isLoading: isMyPromptsLoading,
    error: myPromptsError,
    currentPage,
    setCurrentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    visibilityFilter,
    setVisibilityFilter,
  } = useMyPrompts()

  const {
    favoritePrompts,
    isLoading: isFavoriteLoading,
    error: favoriteError,
    currentPage: favoritePage,
    totalPages: favoriteTotalPages,
    totalElements: favoriteTotalElements,
    searchQuery: favoriteSearchQuery,
    setSearchQuery: setFavoriteSearchQuery,
    setCurrentPage: setFavoritePage,
    reload: reloadFavoritePrompts,
    setFavoritePrompts,
  } = useFavoritePrompts()

  const {
    count: favoriteCountFromApi,
    isLoading: isFavoriteCountLoading,
    error: favoriteCountError
  } = useFavoriteCount()

  const {
    count: totalLikeCount,
    isLoading: isLikeCountLoading,
    error: likeCountError,
    setCount: setTotalLikeCount,
    reload: reloadLikeCount,
  } = useMyPromptLikeCount()

  useEffect(() => {
    if (activeTab === "my-prompts") {
      setSearchQuery(debouncedSearch)
    } else {
      setFavoriteSearchQuery(debouncedSearch)
    }
  }, [debouncedSearch, activeTab, setSearchQuery, setFavoriteSearchQuery])

  useEffect(() => {
    if (!isFavoriteCountLoading && !favoriteCountError) {
      setFavoriteCount(favoriteCountFromApi)
    }
  }, [favoriteCountFromApi, isFavoriteCountLoading, favoriteCountError])

  const stats: Stat[] = useMemo(() => [
    {label: "내 프롬프트", value: myPrompts.length, color: "text-blue-400"},
    {label: "즐겨찾기", value: favoriteCount, color: "text-yellow-400"},
    {
      label: "총 조회수",
      value: myPrompts.reduce((sum, p) => sum + p.viewCount, 0),
      color: "text-green-400"
    },
    {label: "총 좋아요", value: totalLikeCount, color: "text-red-400"},
  ], [myPrompts, favoriteCount, totalLikeCount])

  const handleLikeChange = useCallback((promptId: string, liked: boolean) => {
    setMyPrompts((prev) =>
        prev.map((p) => p.id === promptId ? {
          ...p,
          liked,
          favoriteCount: p.favoriteCount + (liked ? 1 : -1)
        } : p)
    )

    setFavoritePrompts((prev) =>
        prev.map((p) => p.promptUuid === promptId ? {
          ...p,
          liked,
          favoriteCount: p.favoriteCount + (liked ? 1 : -1)
        } : p)
    )

    setTotalLikeCount((prev) => liked ? prev + 1 : Math.max(prev - 1, 0))
    reloadLikeCount()
  }, [setMyPrompts, setFavoritePrompts, setTotalLikeCount, reloadLikeCount])

  const handleToggleFavorite = useCallback(async (id: string) => {
    if (favoriteLoadingId) return
    setFavoriteLoadingId(id)

    setMyPrompts((prev) =>
        prev.map((p) => p.id === id ? {...p, favorite: !p.favorite} : p)
    )

    const isFavorite = favoritePrompts.some((favPrompt) => favPrompt.promptUuid === id)
    setFavoriteCount((prev) => isFavorite ? prev - 1 : prev + 1)
    setTotalLikeCount((prev) => isFavorite ? prev - 1 : prev + 1)

    try {
      if (isFavorite) {
        await removeFavoritePrompt(id)
      } else {
        await addFavoritePrompt(id)
      }
      reloadFavoritePrompts()
      reloadLikeCount()
    } catch (e: any) {
      setMyPrompts((prev) =>
          prev.map((p) => p.id === id ? {...p, favorite: !p.favorite} : p)
      )
      setFavoriteCount((prev) => isFavorite ? prev + 1 : prev - 1)
      setTotalLikeCount((prev) => isFavorite ? prev + 1 : prev - 1)
      alert(e.message || "즐겨찾기 처리 중 오류가 발생했습니다.")
    } finally {
      setFavoriteLoadingId(null)
    }
  }, [favoriteLoadingId, favoritePrompts, setMyPrompts, setFavoriteCount, setTotalLikeCount, reloadFavoritePrompts, reloadLikeCount])

  const handleCopyPrompt = useCallback((id: string) => {
    const promptToCopy = myPrompts.find((prompt) => prompt.id === id)
    if (promptToCopy) {
      navigator.clipboard.writeText(`Title: ${promptToCopy.title}\nDescription: ${promptToCopy.description}`)
      alert("프롬프트가 클립보드에 복사되었습니다!")
    }
  }, [myPrompts])

  const handleStatusFilterChange = useCallback((status: string, checked: boolean) => {
    setStatusFilter((prev) => ({...prev, [status]: checked}))
  }, [setStatusFilter])

  const handleVisibilityFilterChange = useCallback((visibility: string, checked: boolean) => {
    setVisibilityFilter((prev) => ({...prev, [visibility]: checked}))
  }, [setVisibilityFilter])

  const getActionIcon = (actionType: ActivityType) => {
    switch (actionType) {
      case "CREATE":
        return <Plus className="h-4 w-4"/>
      case "EDIT":
        return <Edit className="h-4 w-4"/>
      case "PUBLISH":
        return <Share2 className="h-4 w-4"/>
      case "ARCHIVE":
        return <Archive className="h-4 w-4"/>
      default:
        return <Clock className="h-4 w-4"/>
    }
  }

  const getActionColor = (actionType: ActivityType) => {
    switch (actionType) {
      case "CREATE":
        return "bg-green-400"
      case "EDIT":
        return "bg-blue-400"
      case "PUBLISH":
        return "bg-purple-400"
      case "ARCHIVE":
        return "bg-gray-400"
      default:
        return "bg-purple-400"
    }
  }

  const renderMyPromptsContent = useCallback(() => (
      <TabsContent value="my-prompts" className="space-y-4">
        {isMyPromptsLoading ? (
            Array.from({length: 3}).map((_, idx) => (
                <Card key={idx} className="bg-white/10 border-white/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-white/20 rounded w-1/3 mb-2"/>
                    <div className="h-4 bg-white/10 rounded w-2/3 mb-3"/>
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-2"/>
                    <div className="h-4 bg-white/10 rounded w-1/4"/>
                  </CardContent>
                </Card>
            ))
        ) : myPrompts.length === 0 ? (
            <div className="text-white/60 text-center py-8">프롬프트가 없습니다.</div>
        ) : (
            <>
              {myPrompts.map((prompt) => (
                  <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      statusLabel={STATUS_CONFIG.label}
                      statusColor={STATUS_CONFIG.color}
                      visibilityLabel={VISIBILITY_CONFIG.label}
                      visibilityColor={VISIBILITY_CONFIG.color}
                      onEdit={(id) => alert(`프롬프트 수정: ${id}`)}
                      onDelete={(id) => setMyPrompts((prev) => prev.map((p) => p.id === id ? {
                        ...p,
                        status: "DELETED"
                      } : p))}
                      onShare={(id) => alert(`프롬프트 공유: ${id}`)}
                      onCopy={handleCopyPrompt}
                      onFavoriteSuccess={handleToggleFavorite}
                      onLikeChange={(liked) => handleLikeChange(prompt.id, liked)}
                  />
              ))}
              {totalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    {Array.from({length: totalPages}).map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                currentPage === idx
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/10 text-white/60 hover:bg-white/20"
                            }`}
                            onClick={() => setCurrentPage(idx)}
                            aria-label={`페이지 ${idx + 1}`}
                            tabIndex={0}
                        >
                          {idx + 1}
                        </button>
                    ))}
                  </div>
              )}
            </>
        )}
      </TabsContent>
  ), [
    isMyPromptsLoading,
    myPrompts,
    totalPages,
    currentPage,
    handleCopyPrompt,
    handleToggleFavorite,
    handleLikeChange,
    setCurrentPage
  ])

  const renderFavoriteContent = useCallback(() => (
      <TabsContent value="favorites" className="space-y-4">
        {isFavoriteLoading ? (
            Array.from({length: 3}).map((_, idx) => (
                <Card key={idx} className="bg-white/10 border-white/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-white/20 rounded w-1/3 mb-2"/>
                    <div className="h-4 bg-white/10 rounded w-2/3 mb-3"/>
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-2"/>
                    <div className="h-4 bg-white/10 rounded w-1/4"/>
                  </CardContent>
                </Card>
            ))
        ) : favoritePrompts.length === 0 ? (
            <div className="text-white/60 text-center py-8">즐겨찾기한 프롬프트가 없습니다.</div>
        ) : (
            <>
              {favoritePrompts.map((prompt) => (
                  <FavoritePromptCard
                      key={prompt.favoriteId}
                      prompt={prompt}
                      onRemoveFavorite={async (id) => {
                        setFavoritePrompts((prev) => prev.filter((p) => p.promptUuid !== id))
                        setFavoriteCount((prev) => (prev > 0 ? prev - 1 : 0))
                        setMyPrompts((prev) => prev.map((p) => p.id === id ? {
                          ...p,
                          favorite: false
                        } : p))
                        const isMine = myPrompts.some((p) => p.id === prompt.promptUuid)
                        if (isMine) {
                          setTotalLikeCount((prev) => (prev > 0 ? prev - 1 : 0))
                          reloadLikeCount()
                        }
                        reloadFavoritePrompts()
                      }}
                      onLikeChange={(liked) => handleLikeChange(prompt.promptUuid, liked)}
                      onCopy={(id) => {
                        const p = favoritePrompts.find((fp) => fp.promptUuid === id)
                        if (p) {
                          navigator.clipboard.writeText(`Title: ${p.title}\nDescription: ${p.description}`)
                          alert("프롬프트가 클립보드에 복사되었습니다!")
                        }
                      }}
                  />
              ))}
              {favoriteTotalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2">
                    {Array.from({length: favoriteTotalPages}).map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                favoritePage === idx
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/10 text-white/60 hover:bg-white/20"
                            }`}
                            onClick={() => setFavoritePage(idx)}
                            aria-label={`페이지 ${idx + 1}`}
                            tabIndex={0}
                        >
                          {idx + 1}
                        </button>
                    ))}
                  </div>
              )}
            </>
        )}
        {favoriteError && (
            <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded text-center">
              {favoriteError}
            </div>
        )}
      </TabsContent>
  ), [
    isFavoriteLoading,
    favoritePrompts,
    favoriteTotalPages,
    favoritePage,
    favoriteError,
    handleLikeChange,
    myPrompts,
    setFavoritePrompts,
    setFavoriteCount,
    setMyPrompts,
    setTotalLikeCount,
    reloadLikeCount,
    reloadFavoritePrompts,
    setFavoritePage
  ])

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">내 프롬프트</h1>
            <p className="text-white/70">내가 작성하고 즐겨찾기한 프롬프트를 관리하세요</p>
          </div>

          <PromptStats stats={stats}/>

          {likeCountError && (
              <div className="mb-2 text-sm text-red-400 text-center">
                {likeCountError}
              </div>
          )}

          {myPromptsError && (
              <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded text-center">
                {myPromptsError}
              </div>
          )}

          {favoriteCountError && (
              <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded text-center">
                {favoriteCountError}
              </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Tabs
                  defaultValue="my-prompts"
                  className="space-y-6"
                  value={activeTab}
                  onValueChange={setActiveTab}
              >
                <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
                  <TabsTrigger value="my-prompts" className="data-[state=active]:bg-white/20">
                    내 프롬프트 ({myPrompts.length})
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-white/20">
                    즐겨찾기 ({favoriteTotalElements})
                  </TabsTrigger>
                </TabsList>

                <div className="relative">
                  <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50"/>
                  <Input
                      placeholder="프롬프트 제목, 설명, 태그로 검색..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                {renderMyPromptsContent()}
                {renderFavoriteContent()}
              </Tabs>
            </div>

            <div className="space-y-6">
              <PromptQuickActions
                  onNewPrompt={() => {
                  }}
                  onExport={() => {
                  }}
                  onArchive={() => {
                  }}
              />

              <PromptActivity
                  recentActivity={recentActivity}
                  getActionIcon={getActionIcon}
                  getActionColor={getActionColor}
              />

              <PromptFilters
                  statusLabel={STATUS_CONFIG.label}
                  statusColor={STATUS_CONFIG.color}
                  statusFilter={statusFilter}
                  onStatusChange={handleStatusFilterChange}
                  visibilityLabel={VISIBILITY_CONFIG.label}
                  visibilityColor={VISIBILITY_CONFIG.color}
                  visibilityFilter={visibilityFilter}
                  onVisibilityChange={handleVisibilityFilterChange}
              />
            </div>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {promptIdToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                 role="dialog" aria-modal="true">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-lg font-bold mb-2 text-gray-900">정말 삭제하시겠습니까?</h2>
                <p className="mb-4 text-gray-700">삭제된 프롬프트는 복구할 수 없습니다.</p>
                {deleteError && (
                    <div
                        className="mb-2 p-2 bg-red-100 text-red-600 rounded text-sm">{deleteError}</div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                      className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
                      onClick={handleCancelDelete}
                      disabled={isDeleteLoading}
                      aria-label="삭제 취소"
                  >
                    취소
                  </button>
                  <button
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none disabled:opacity-60"
                      onClick={handleConfirmDelete}
                      disabled={isDeleteLoading}
                      aria-label="프롬프트 삭제"
                  >
                    {isDeleteLoading ? "삭제 중..." : "삭제"}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}
