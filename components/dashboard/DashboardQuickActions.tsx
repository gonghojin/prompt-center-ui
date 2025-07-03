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
                variant="primary"
                className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2"/>새 프롬프트 작성
            </Button>
          </Link>
          <Link href="/my-prompts?tab=favorites">
            <Button
                variant="secondary-action"
                className="w-full justify-start"
            >
              <Star className="h-4 w-4 mr-2"/>
              즐겨찾기 보기
            </Button>
          </Link>
          <Link href="/prompts?filter=recent">
            <Button
                variant="tertiary"
                className="w-full justify-start"
            >
              <Clock className="h-4 w-4 mr-2"/>
              최근 수정된 항목
            </Button>
          </Link>
        </CardContent>
      </Card>
  )
} 