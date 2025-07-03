"use client"

import {Card, CardContent} from "@components/ui/card"
import {Input} from "@components/ui/input"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@components/ui/tabs"
import {Archive, Clock, Edit, Plus, Search, Share2,} from "lucide-react"
import {useCallback, useEffect, useState} from "react"
import type {Category} from "@/app/types/category"
import {PromptCard} from "@components/my-prompts/PromptCard"
import {FavoritePromptCard} from "@components/my-prompts/FavoritePromptCard"
import {PromptStats} from "@components/my-prompts/PromptStats"
import {PromptFilters} from "@components/my-prompts/PromptFilters"
import {PromptActivity} from "@components/my-prompts/PromptActivity"
import {PromptQuickActions} from "@components/my-prompts/PromptQuickActions"
import {fetchPromptStatistics, useMyPrompts} from "@/app/hooks/useMyPrompts"
import {useFavoritePrompts} from "@/app/hooks/useFavoritePrompts"
import {useFavoriteCount} from "@/app/hooks/useFavoriteCount"
import {addFavoritePrompt, removeFavoritePrompt} from "@/app/api/favoritePrompt"
import {deletePrompt} from "@/app/api/promptsApi"
import {useRouter, useSearchParams} from "next/navigation";
import {useToast} from "@/components/ui/useToast";
import {useMyPromptLikeCount} from "@/app/hooks/useMyPromptLikeCount"
import {useMyPromptViewCount} from "@/app/hooks/useMyPromptViewCount"
import {useDebounce} from "@/app/hooks/useDebounce"
import {Button} from "@/components/ui/button"

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

type ActivityType = 'CREATE' | 'EDIT' | 'PUBLISH' | 'ARCHIVE';
type ActivityLog = {
  action: string;
  actionType: ActivityType;
  prompt: string;
  time: string;
};

export default function MyPromptsPage() {
  // 라우터 훅 사용
  const router = useRouter();
  const searchParams = useSearchParams();

  // 토스트 훅 사용
  const {showToast} = useToast();

  // useMyPrompts 훅 사용
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
  } = useMyPrompts();

  // URL 쿼리 파라미터에서 탭 정보 읽기
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => {
    // URL에 tab 파라미터가 있고 유효한 값이면 사용, 아니면 기본값
    return (tabFromUrl === 'favorites' || tabFromUrl === 'my-prompts') ? tabFromUrl : "my-prompts";
  });

  // 즐겨찾기 프롬프트 API 연동
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
  } = useFavoritePrompts();

  // 즐겨찾기 개수 API 연동
  const {
    count: favoriteCountFromApi,
    isLoading: isFavoriteCountLoading,
    error: favoriteCountError
  } = useFavoriteCount();
  const [favoriteCount, setFavoriteCount] = useState(0);

  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([
    {action: "생성", actionType: "CREATE", prompt: "API 설계 프롬프트", time: "2시간 전"},
    {action: "수정", actionType: "EDIT", prompt: "React 테스트 가이드", time: "1일 전"},
    {action: "즐겨찾기", actionType: "PUBLISH", prompt: "머신러닝 모델 평가", time: "2일 전"},
    {action: "보관", actionType: "ARCHIVE", prompt: "데이터베이스 최적화", time: "3일 전"},
  ])

  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(null);
  const [promptIdToDelete, setPromptIdToDelete] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const statusLabel: Record<Exclude<StatusType, 'DELETED'>, string> = {
    DRAFT: "임시저장",
    PUBLISHED: "게시됨",
    ARCHIVED: "보관됨",
  }
  const statusColor: Record<Exclude<StatusType, 'DELETED'>, string> = {
    DRAFT: "bg-yellow-600 text-white",
    PUBLISHED: "bg-green-600 text-white",
    ARCHIVED: "bg-gray-600 text-white",
  }
  const visibilityLabel: Record<VisibilityType, string> = {
    PUBLIC: "전체 공개",
    TEAM: "팀 공개",
    PRIVATE: "비공개",
  }
  const visibilityColor: Record<VisibilityType, string> = {
    PUBLIC: "border-green-500/30 text-green-400",
    TEAM: "border-blue-500/30 text-blue-400",
    PRIVATE: "border-gray-500/30 text-gray-400",
  }

  const handleEditPrompt = (id: string) => {
    router.push(`/prompts/${id}/edit?from=my-prompts`);
  }

  const handleViewPrompt = (id: string) => {
    router.push(`/prompts/${id}?from=my-prompts`);
  }

  const handleArchivePrompt = (id: string) => {
    setMyPrompts((prev) => prev.map((p) => p.id === id ? {...p, status: "ARCHIVED"} : p))
  }

  const handleDeletePrompt = (id: string) => {
    setPromptIdToDelete(id);
    setDeleteError(null);
  }

  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    // useMyPrompts의 statistics를 page.tsx의 statistics로 동기화
    fetchPromptStatistics().then(setStatistics);
  }, []);

  const handleConfirmDelete = async () => {
    if (!promptIdToDelete) return;
    setIsDeleteLoading(true);
    setDeleteError(null);
    // Optimistic UI: 통계값 즉시 감소
    setStatistics((prev: any) => prev ? {
      ...prev,
      totalCount: Math.max(0, prev.totalCount - 1)
    } : prev);
    try {
      await deletePrompt(promptIdToDelete);
      setMyPrompts((prev) => prev.map((p) => p.id === promptIdToDelete ? {
        ...p,
        status: "DELETED"
      } : p));
      setPromptIdToDelete(null);
      showToast({type: "success", message: "프롬프트가 삭제되었습니다."});
      // 통계 API로 동기화
      const statsRes = await fetchPromptStatistics();
      setStatistics(statsRes);
    } catch (e: any) {
      setDeleteError(e.message || "프롬프트 삭제 중 오류가 발생했습니다.");
      showToast({type: "error", message: e.message || "프롬프트 삭제 중 오류가 발생했습니다."});
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setPromptIdToDelete(null);
    setDeleteError(null);
  };

  const handleSharePrompt = (id: string) => {
    showToast({type: "info", message: `프롬프트 공유 기능은 준비 중입니다. (ID: ${id})`});
  }

  const handleToggleFavorite = async (id: string) => {
    if (favoriteLoadingId) return; // 중복 방지
    setFavoriteLoadingId(id);

    // 현재 즐겨찾기 상태 확인 (promptUuid와 id 비교)
    const isFavorite = favoritePrompts.some((favPrompt) => favPrompt.promptUuid === id);

    // Optimistic UI: myPrompts에서 favorite 값 즉시 토글
    setMyPrompts((prev) =>
        prev.map((p) =>
            p.id === id ? {...p, favorite: !p.favorite} : p
        )
    );
    setFavoriteCount((prev) => isFavorite ? prev - 1 : prev + 1);

    try {
      if (isFavorite) {
        await removeFavoritePrompt(id);
      } else {
        await addFavoritePrompt(id);
      }
      // 즐겨찾기 목록 새로고침 및 myPrompts 동기화
      reloadFavoritePrompts();
      setMyPrompts((prev) =>
          prev.map((p) =>
              p.id === id ? {...p, favorite: !isFavorite} : p
          )
      );
    } catch (e: any) {
      // 실패 시 롤백
      setMyPrompts((prev) =>
          prev.map((p) =>
              p.id === id ? {...p, favorite: isFavorite} : p
          )
      );
      setFavoriteCount((prev) => isFavorite ? prev + 1 : prev - 1);
      showToast({type: "error", message: e.message || "즐겨찾기 처리 중 오류가 발생했습니다."});
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  const handleCopyPrompt = (id: string) => {
    const promptToCopy = myPrompts.find((prompt) => prompt.id === id)
    if (promptToCopy) {
      navigator.clipboard.writeText(`Title: ${promptToCopy.title}\nDescription: ${promptToCopy.description}`)
      showToast({type: "success", message: "프롬프트가 클립보드에 복사되었습니다!"});
    }
  }

  const handleStatusFilterChange = (status: StatusType, checked: boolean) => {
    setStatusFilter((prev) => ({...prev, [status]: checked}))
  }

  const handleVisibilityFilterChange = (visibility: VisibilityType, checked: boolean) => {
    setVisibilityFilter((prev) => ({...prev, [visibility]: checked}))
  }

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

  // statusFilter에서 DELETED 제외
  const filteredStatusFilter = Object.fromEntries(
      Object.entries(statusFilter).filter(([k]) => k !== 'DELETED')
  ) as Record<Exclude<StatusType, 'DELETED'>, boolean>;

  const {
    count: totalLikeCount,
    isLoading: isLikeCountLoading,
    error: likeCountError,
    setCount: setTotalLikeCount,
    reload: reloadLikeCount,
  } = useMyPromptLikeCount()

  const {
    count: totalViewCount,
    isLoading: isViewCountLoading,
    error: viewCountError,
    setCount: setTotalViewCount,
    reload: reloadViewCount,
  } = useMyPromptViewCount()

  // 통계 카드 4개로 고정 (총 좋아요는 API에서 가져온 데이터 사용)
  const stats = [
    {label: "내 프롬프트", value: statistics?.totalCount ?? 0, color: "text-blue-400"},
    {label: "즐겨찾기", value: favoriteCount, color: "text-yellow-400"},
    {
      label: "총 조회수",
      value: totalViewCount,
      color: "text-green-400"
    },
    {
      label: "총 좋아요",
      value: totalLikeCount,
      color: "text-red-400"
    },
  ];

  const [searchInput, setSearchInput] = useState("")
  const debouncedSearch = useDebounce(searchInput, 300)

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

  const handleLikeChange = useCallback((promptId: string, liked: boolean, likeCount: number) => {
    const safeLikeCount = typeof likeCount === 'number' && !isNaN(likeCount) ? likeCount : 0;
    setMyPrompts((prev) =>
        prev.map((p) => p.id === promptId ? {...p, liked, favoriteCount: safeLikeCount} : p)
    );
    setFavoritePrompts((prev) =>
        prev.map((p) =>
            (p.promptUuid === promptId || p.id === promptId)
                ? {...p, liked, favoriteCount: safeLikeCount}
                : p
        )
    );
    setTotalLikeCount((prev) => liked ? prev + 1 : Math.max(prev - 1, 0));
    reloadLikeCount();
  }, [setMyPrompts, setFavoritePrompts, setTotalLikeCount, reloadLikeCount]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header 삭제됨 - 공통 Header만 사용 */}
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">내 프롬프트</h1>
            <p className="text-white/70">내가 작성하고 즐겨찾기한 프롬프트를 관리하세요</p>
          </div>

          {/* Stats */}
          <PromptStats stats={stats}/>

          {/* 에러 메시지 */}
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
          {viewCountError && (
              <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded text-center">
                {viewCountError}
              </div>
          )}
          {likeCountError && (
              <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded text-center">
                {likeCountError}
              </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="my-prompts" className="space-y-6" value={activeTab}
                    onValueChange={setActiveTab}>
                <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
                  <TabsTrigger value="my-prompts" className="data-[state=active]:bg-white/20">
                    내 프롬프트 ({myPrompts.length})
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-white/20">
                    즐겨찾기 ({favoriteTotalElements})
                  </TabsTrigger>
                </TabsList>

                {/* Search */}
                <div className="relative">
                  <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50"/>
                  <Input
                      placeholder="프롬프트 제목, 설명, 태그로 검색..."
                      value={activeTab === "my-prompts" ? searchQuery : favoriteSearchQuery}
                      onChange={(e) => {
                        if (activeTab === "my-prompts") setSearchQuery(e.target.value)
                        else setFavoriteSearchQuery(e.target.value)
                      }}
                      className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

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
                      myPrompts.map((prompt) => (
                          <PromptCard
                              key={prompt.id}
                              prompt={prompt}
                              statusLabel={statusLabel}
                              statusColor={statusColor}
                              visibilityLabel={visibilityLabel}
                              visibilityColor={visibilityColor}
                              onEdit={handleEditPrompt}
                              onDelete={handleDeletePrompt}
                              onShare={handleSharePrompt}
                              onCopy={handleCopyPrompt}
                              onFavoriteSuccess={(id, isFavorite) => {
                                setMyPrompts((prev) => prev.map((p) => p.id === id ? {
                                  ...p,
                                  favorite: isFavorite
                                } : p));
                                setFavoriteCount((prev) => isFavorite ? prev + 1 : Math.max(prev - 1, 0));
                                reloadFavoritePrompts();
                              }}
                              onView={handleViewPrompt}
                              onLikeChange={(liked, likeCount) => handleLikeChange(prompt.id, liked, likeCount)}
                          />
                      ))
                  )}
                  {/* 페이지네이션 */}
                  {totalPages > 1 && (
                      <div className="flex justify-center mt-6 gap-2">
                        {Array.from({length: totalPages}).map((_, idx) => (
                            <button
                                key={idx}
                                className={`px-3 py-1 rounded text-sm font-medium ${currentPage === idx ? "bg-purple-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                                onClick={() => setCurrentPage(idx)}
                                aria-label={`페이지 ${idx + 1}`}
                                tabIndex={0}
                            >
                              {idx + 1}
                            </button>
                        ))}
                      </div>
                  )}
                </TabsContent>

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
                      favoritePrompts.map((prompt) => {
                        const matchedPrompt = myPrompts.find((p) => p.category?.id === prompt.categoryId)
                        const category = matchedPrompt?.category || {
                          id: prompt.categoryId,
                          name: "",
                          displayName: "",
                          description: "",
                          parentCategoryId: null,
                          parentCategoryName: null,
                          isSystem: false,
                          createdAt: "",
                          updatedAt: ""
                        }
                        return (
                            <FavoritePromptCard
                                key={prompt.favoriteId}
                                prompt={{
                                  ...prompt,
                                  id: prompt.promptUuid,
                                  category,
                                  author: prompt.createdByName,
                                }}
                                onRemoveFavorite={(id) => {
                                  setFavoritePrompts((prev) => prev.filter((p) => p.promptUuid !== id));
                                  setFavoriteCount((prev) => (prev > 0 ? prev - 1 : 0));
                                  setMyPrompts((prev) => prev.map((p) => p.id === id ? {
                                    ...p,
                                    favorite: false
                                  } : p));
                                  reloadFavoritePrompts();
                                }}
                                onCopy={(id) => {
                                  const p = favoritePrompts.find((fp) => fp.promptUuid === id);
                                  if (p) {
                                    navigator.clipboard.writeText(`Title: ${p.title}\nDescription: ${p.description}`);
                                  }
                                }}
                                onLikeChange={(liked, likeCount) => handleLikeChange(prompt.promptUuid, liked, likeCount)}
                            />
                        )
                      })
                  )}
                  {/* 페이지네이션 */}
                  {favoriteTotalPages > 1 && (
                      <div className="flex justify-center mt-6 gap-2">
                        {Array.from({length: favoriteTotalPages}).map((_, idx) => (
                            <button
                                key={idx}
                                className={`px-3 py-1 rounded text-sm font-medium ${favoritePage === idx ? "bg-purple-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
                                onClick={() => setFavoritePage(idx)}
                                aria-label={`페이지 ${idx + 1}`}
                                tabIndex={0}
                            >
                              {idx + 1}
                            </button>
                        ))}
                      </div>
                  )}
                  {/* 에러 메시지 */}
                  {favoriteError && (
                      <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded text-center">
                        {favoriteError}
                      </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <PromptQuickActions
                  onNewPrompt={() => {
                  }}
                  onExport={() => {
                  }}
                  onArchive={() => {
                  }}
              />

              {/* Recent Activity */}
              <PromptActivity
                  recentActivity={recentActivity}
                  getActionIcon={getActionIcon}
                  getActionColor={getActionColor}
              />

              {/* Filter Options */}
              <PromptFilters
                  statusLabel={statusLabel}
                  statusColor={statusColor}
                  statusFilter={filteredStatusFilter}
                  onStatusChange={handleStatusFilterChange}
                  visibilityLabel={visibilityLabel}
                  visibilityColor={visibilityColor}
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
                  <Button variant="secondary-action" onClick={handleCancelDelete}
                          aria-label="삭제 취소">
                    취소
                  </Button>
                  <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleteLoading}
                          aria-label="프롬프트 삭제">
                    {isDeleteLoading ? "삭제 중..." : "삭제"}
                  </Button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}
