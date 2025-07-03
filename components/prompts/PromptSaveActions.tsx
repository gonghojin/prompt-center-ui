import {Card, CardHeader, CardTitle, CardContent} from "@components/ui/card";
import {Button} from "@components/ui/button";
import {Save} from "lucide-react";
import React from "react";

type PromptSaveActionsProps = {
  handleSubmit: () => void;
  handleDraftSave: () => void;
};

const PromptSaveActions = ({handleSubmit, handleDraftSave}: PromptSaveActionsProps) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">저장 옵션</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
            onClick={handleSubmit}
            variant="primary"
            className="w-full"
        >
          <Save className="h-4 w-4 mr-2"/>
          저장하고 게시
        </Button>
        <Button
            onClick={handleDraftSave}
            variant="secondary-action"
            className="w-full"
        >
          임시 저장
        </Button>
      </CardContent>
    </Card>
);

export default PromptSaveActions; 