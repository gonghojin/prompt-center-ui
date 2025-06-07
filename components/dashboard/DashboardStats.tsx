import {Card, CardContent} from "@components/ui/card"
import Link from "next/link"
import {FC, JSX} from "react"

export type StatItem = {
  label: string
  value: string | number
  change: string
  icon: JSX.Element
  href: string
}

type DashboardStatsProps = {
  stats: StatItem[]
  error?: string
  loading?: boolean
}

export const DashboardStats: FC<DashboardStatsProps> = ({stats, error, loading}) => {
  if (error) {
    return <div className="mb-4 text-red-400">{error}</div>
  }
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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
        ))}
      </div>
  )
} 