import {FC} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@components/ui/card";
import {Button} from "@components/ui/button";
import Link from "next/link";
import {Archive, Download, Plus} from "lucide-react";

interface PromptQuickActionsProps {
  onNewPrompt: () => void;
  onExport: () => void;
  onArchive: () => void;
}

export const PromptQuickActions: FC<PromptQuickActionsProps> = ({
                                                                  onNewPrompt,
                                                                  onExport,
                                                                  onArchive
                                                                }) => {
  return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">빠른 작업</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/prompts/new?from=my-prompts">
            <Button
                variant="primary"
                className="w-full justify-start"
                onClick={onNewPrompt}
                aria-label="새 프롬프트 작성"
                tabIndex={0}
            >
              <Plus className="h-4 w-4 mr-2"/>새 프롬프트 작성
            </Button>
          </Link>
          <Button
              variant="secondary-action"
              className="w-full justify-start"
              onClick={onExport}
              aria-label="내 프롬프트 내보내기"
              tabIndex={0}
          >
            <Download className="h-4 w-4 mr-2"/>내 프롬프트 내보내기
          </Button>
          <Button
              variant="tertiary"
              className="w-full justify-start"
              onClick={onArchive}
              aria-label="보관된 프롬프트"
              tabIndex={0}
          >
            <Archive className="h-4 w-4 mr-2"/>보관된 프롬프트
          </Button>
        </CardContent>
      </Card>
  );
}; 