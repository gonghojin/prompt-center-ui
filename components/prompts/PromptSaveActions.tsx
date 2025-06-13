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
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
        >
          <Save className="h-4 w-4 mr-2"/>
          저장하고 게시
        </Button>
        <Button
            onClick={handleDraftSave}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
        >
          임시 저장
        </Button>
      </CardContent>
    </Card>
);

export default PromptSaveActions; 