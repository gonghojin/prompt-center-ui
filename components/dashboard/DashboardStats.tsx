import {Card, CardContent} from "@components/ui/card"
import Link from "next/link"
import {FC, JSX} from "react"
import {useToast} from "@components/ui/useToast"

export type StatItem = {
  label: string
  value: string | number
  change: string
  icon: JSX.Element
  href: string
  isUnderDevelopment?: boolean
}

type DashboardStatsProps = {
  stats: StatItem[]
  error?: string
  loading?: boolean
}

export const DashboardStats: FC<DashboardStatsProps> = ({stats, error, loading}) => {
  const {showToast} = useToast()

  const handleUnderDevelopmentClick = (label: string) => {
    showToast({
      type: "info",
      message: `"${label}" 상세보기 화면은 현재 개발 중입니다.\n더 나은 서비스를 위해 준비 중이니 조금만 기다려 주세요! 🚧`,
      duration: 4000
    })
  }

  if (error) {
    return <div className="mb-4 text-red-400">{error}</div>
  }
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          if (stat.isUnderDevelopment) {
            return (
                <div
                    key={index}
                    onClick={() => handleUnderDevelopmentClick(stat.label)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleUnderDevelopmentClick(stat.label)
                      }
                    }}
                    aria-label={`${stat.label} - 상세보기 개발 중`}
                >
                  <Card
                      className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                          <p className="text-green-400 text-sm">{stat.change}</p>
                        </div>
                        <div className="text-purple-400">{stat.icon}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
            )
          }

          return (
              <Link key={index} href={stat.href} aria-label={stat.label} tabIndex={0}>
                <Card
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-green-400 text-sm">{stat.change}</p>
                      </div>
                      <div className="text-purple-400">{stat.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
          )
        })}
      </div>
  )
} 