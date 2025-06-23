import {Card, CardContent, CardHeader, CardTitle} from "@components/ui/card"
import {Button} from "@components/ui/button"
import Link from "next/link"
import {Clock, Plus, Star} from "lucide-react"
import {FC} from "react"

export const DashboardQuickActions: FC = () => {
  return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">빠른 작업</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/prompts/new">
            <Button
                className="w-full justify-start bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
              <Plus className="h-4 w-4 mr-2"/>새 프롬프트 작성
            </Button>
          </Link>
          <Link href="/my-prompts?tab=favorites">
            <Button
                variant="outline"
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
            >
              <Star className="h-4 w-4 mr-2"/>
              즐겨찾기 보기
            </Button>
          </Link>
          <Link href="/prompts?filter=recent">
            <Button
                variant="outline"
                className="w-full justify-start border-white/30 text-white hover:bg-white/10"
            >
              <Clock className="h-4 w-4 mr-2"/>
              최근 수정된 항목
            </Button>
          </Link>
        </CardContent>
      </Card>
  )
} 