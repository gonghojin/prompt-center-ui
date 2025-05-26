"use client"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card"
import { Badge } from "@components/ui/badge"
import { Input } from "@components/ui/input"
import {
  Search,
  Code2,
  Database,
  Palette,
  BarChart3,
  Users,
  Star,
  GitBranch,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Component() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "스마트 검색",
      description: "키워드와 태그 기반으로 원하는 프롬프트를 빠르게 찾아보세요",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <GitBranch className="h-6 w-6" />,
      title: "버전 관리",
      description: "프롬프트 변경 이력을 추적하고 이전 버전으로 쉽게 복원하세요",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "팀 협업",
      description: "팀별 권한 설정으로 안전하게 프롬프트를 공유하고 관리하세요",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "즐겨찾기",
      description: "자주 사용하는 프롬프트를 즐겨찾기로 등록하여 빠르게 접근하세요",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "권한 관리",
      description: "역할 기반 접근 제어로 보안성과 효율성을 동시에 확보하세요",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "빠른 배포",
      description: "검증된 프롬프트 템플릿으로 개발 속도를 획기적으로 향상시키세요",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  const userTypes = [
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "백엔드 개발자",
      description: "API 설계, 아키텍처 설계 프롬프트",
      benefits: ["API 문서 자동 생성", "코드 리뷰 템플릿", "아키텍처 가이드"],
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "프론트엔드 개발자",
      description: "UI 기능 정의, 테스트케이스 자동화",
      benefits: ["컴포넌트 설계", "테스트 시나리오", "UX 패턴"],
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "데이터 사이언티스트",
      description: "분석 자동화, 전처리 템플릿 활용",
      benefits: ["데이터 분석", "모델 평가", "리포트 생성"],
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "디자이너",
      description: "기능 정의, UX 메시지 생성",
      benefits: ["디자인 시스템", "사용자 여정", "프로토타입"],
    },
  ]

  const techStack = [
    "Java 17",
    "Spring Boot",
    "TypeScript",
    "Next.js",
    "React",
    "Tailwind",
    "JPA",
    "Redis",
    "Docker",
    "GitLab",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-white/90">프롬프트 템플릿 중앙화 서버</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                프롬프트를
              </span>
              <br />
              <span className="text-white">중앙화하세요</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              반복적으로 사용하는 프롬프트를 역할별, 도메인별로 등록하고 공유하여
              <span className="text-cyan-400 font-semibold"> 개발 효율성을 극대화</span>하세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/prompts">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300"
                >
                  데모 보기
                </Button>
              </Link>
            </div>

            {/* Interactive Search Demo */}
            <div className="max-w-md mx-auto">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors" />
                <Input
                  placeholder="프롬프트 검색해보기..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 rounded-full py-3 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                />
                {searchValue && (
                  <div className="absolute top-full mt-2 w-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-3">
                    <div className="space-y-2">
                      <div className="text-white/80 text-sm font-medium">"{searchValue}" 검색 결과</div>
                      <div className="text-white/60 text-xs">• API 설계 프롬프트</div>
                      <div className="text-white/60 text-xs">• React 컴포넌트 테스트</div>
                      <div className="text-white/60 text-xs">• 데이터 분석 리포트</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">핵심 기능</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">프롬프트 관리의 모든 것을 한 곳에서 해결하세요</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">누구를 위한 서비스인가요?</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              다양한 역할의 팀원들이 각자의 업무에 최적화된 프롬프트를 활용할 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((user, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:from-white/15 hover:to-white/10 transition-all duration-500 transform hover:scale-105 group"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
                    <div className="text-white">{user.icon}</div>
                  </div>
                  <CardTitle className="text-white text-lg">{user.title}</CardTitle>
                  <CardDescription className="text-white/70">{user.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white/80 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">검증된 기술 스택</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              안정성과 확장성을 보장하는 최신 기술들로 구축됩니다
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-4 py-2 text-sm transition-all duration-300 transform hover:scale-110 cursor-pointer"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <h2 className="text-4xl font-bold text-white mb-4">지금 시작해보세요</h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                프롬프트 템플릿 중앙화로 팀의 생산성을 한 단계 끌어올려보세요
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    무료로 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full transition-all duration-300"
                  >
                    문의하기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-white/60">© 2024 프롬프트 템플릿 서버. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
