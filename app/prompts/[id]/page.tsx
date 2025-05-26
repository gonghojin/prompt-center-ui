"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Star,
  Eye,
  Heart,
  Share2,
  Copy,
  Edit,
  User,
  Clock,
  GitBranch,
  MessageSquare,
  Code2,
  Download,
  Bookmark,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function PromptDetailPage() {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState([])
  const [prompt, setPrompt] = useState(null)
  const [versions, setVersions] = useState([])
  const params = useParams()
  const router = useRouter()

  const promptId = params.id

  useEffect(() => {
    // Mock data for demonstration - replace with actual API call
    const mockPrompt = {
      id: Number.parseInt(promptId as string) || 1,
      title: "API 설계 프롬프트",
      description: "RESTful API 설계를 위한 상세 가이드라인과 베스트 프랙티스를 포함한 종합적인 프롬프트입니다.",
      content: `# API 설계 가이드라인

## 개요
이 프롬프트는 RESTful API를 설계할 때 고려해야 할 핵심 요소들을 체계적으로 정리한 가이드입니다.

## 주요 설계 원칙

### 1. 리소스 중심 설계
- URL은 리소스를 나타내야 합니다
- 동사가 아닌 명사를 사용하세요
- 계층적 구조를 활용하세요

예시:
\`\`\`
GET /users          # 사용자 목록 조회
GET /users/123      # 특정 사용자 조회
POST /users         # 새 사용자 생성
PUT /users/123      # 사용자 정보 수정
DELETE /users/123   # 사용자 삭제
\`\`\`

### 2. HTTP 메서드 활용
- GET: 데이터 조회
- POST: 새 리소스 생성
- PUT: 전체 리소스 수정
- PATCH: 부분 리소스 수정
- DELETE: 리소스 삭제

### 3. 상태 코드 활용
- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청
- 401: 인증 실패
- 404: 리소스 없음
- 500: 서버 오류

이 가이드라인을 따라 일관성 있고 사용하기 쉬운 API를 설계하세요.`,
      category: "Backend",
      author: {
        name: "김개발",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Senior Backend Developer",
      },
      likes: 24,
      views: 156,
      createdAt: "2024-01-15",
      updatedAt: "2시간 전",
      version: "1.2",
      tags: ["API", "REST", "설계", "백엔드", "가이드라인"],
      isPublic: true,
      teamAccess: ["Backend Team", "Architecture Team"],
    }

    const mockComments = [
      {
        id: 1,
        author: "이프론트",
        content: "정말 유용한 가이드네요! 프론트엔드에서 API 연동할 때 많은 도움이 됩니다.",
        date: "1일 전",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: 2,
        author: "박데이터",
        content: "버전 관리 부분이 특히 도움이 되었습니다. 감사합니다!",
        date: "2일 전",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ]

    const mockVersions = [
      { version: "1.2", date: "2024-01-20", changes: "보안 섹션 추가, 예제 코드 개선" },
      { version: "1.1", date: "2024-01-18", changes: "페이지네이션 가이드 추가" },
      { version: "1.0", date: "2024-01-15", changes: "초기 버전 생성" },
    ]

    setPrompt(mockPrompt)
    setComments(mockComments)
    setVersions(mockVersions)
  }, [promptId])

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite)
    // 실제 API 호출로 좋아요 상태 업데이트
    console.log("Favorite clicked")
  }

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked)
    // 실제 API 호출로 북마크 상태 업데이트
    console.log("Bookmark clicked")
  }

  const handleShareClick = () => {
    // 실제 공유 기능 구현
    console.log("Share clicked")
  }

  const handleCopyClick = () => {
    // 실제 복사 기능 구현
    console.log("Copy clicked")
  }

  const handleCommentSubmit = () => {
    if (commentText.trim() !== "") {
      const newComment = {
        id: comments.length + 1,
        author: "현재 사용자", // 실제 사용자 정보로 대체
        content: commentText,
        date: "방금",
        avatar: "/placeholder.svg?height=32&width=32", // 실제 사용자 아바타로 대체
      }
      setComments([...comments, newComment])
      setCommentText("")
      // 실제 API 호출로 댓글 저장
      console.log("Comment submitted:", commentText)
    }
  }

  if (!prompt) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/prompts" className="text-white/70 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <Link href="/" className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  PromptHub
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                className={`text-white/70 hover:text-white ${isFavorite ? "text-yellow-400" : ""}`}
              >
                <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmarkClick}
                className={`text-white/70 hover:text-white ${isBookmarked ? "text-blue-400" : ""}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShareClick} className="text-white/70 hover:text-white">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCopyClick} className="text-white/70 hover:text-white">
                <Copy className="h-4 w-4" />
              </Button>
              <Link href={`/prompts/${prompt.id}/edit`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  onClick={() => router.push(`/prompts/${promptId}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  편집
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Prompt Header */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-white/30 text-white/70">
                        {prompt.category}
                      </Badge>
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        v{prompt.version}
                      </Badge>
                      {prompt.isPublic && (
                        <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                          공개
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{prompt.title}</CardTitle>
                    <CardDescription className="text-white/70 text-base">{prompt.description}</CardDescription>
                  </div>
                  <div className="text-purple-400">
                    <Code2 className="h-8 w-8" />
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-white/60 mt-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {prompt.likes} 좋아요
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {prompt.views} 조회
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {prompt.updatedAt} 업데이트
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {prompt.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-white/10 text-white/70">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Prompt Content */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-white">프롬프트 내용</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-white/90 leading-relaxed">{prompt.content}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  댓글 ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-white/5">
                    <img
                      src={comment.avatar || "/placeholder.svg"}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{comment.author}</span>
                        <span className="text-white/60 text-sm">{comment.date}</span>
                      </div>
                      <p className="text-white/80">{comment.content}</p>
                    </div>
                  </div>
                ))}

                <Separator className="bg-white/20" />

                <div className="space-y-3">
                  <Textarea
                    placeholder="댓글을 작성해주세요..."
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    onClick={handleCommentSubmit}
                  >
                    댓글 작성
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">작성자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={prompt.author.avatar || "/placeholder.svg"}
                    alt={prompt.author.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{prompt.author.name}</p>
                    <p className="text-white/60 text-sm">{prompt.author.role}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  <User className="h-4 w-4 mr-2" />
                  프로필 보기
                </Button>
              </CardContent>
            </Card>

            {/* Version History */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  버전 히스토리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {versions.map((version, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">v{version.version}</span>
                      <span className="text-white/60 text-sm">{version.date}</span>
                    </div>
                    <p className="text-white/70 text-sm">{version.changes}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Team Access */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">접근 권한</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {prompt.teamAccess.map((team, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-white/80 text-sm">{team}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  <Copy className="h-4 w-4 mr-2" />
                  복사하기
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4 mr-2" />
                  공유하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
