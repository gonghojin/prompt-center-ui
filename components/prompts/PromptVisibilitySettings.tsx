import {Card, CardHeader, CardTitle, CardContent} from "@components/ui/card";
import {Switch} from "@components/ui/switch";
import {Label} from "@components/ui/label";
import {Globe, Lock} from "lucide-react";
import React from "react";

const PromptVisibility = {
  PUBLIC: "PUBLIC",
  TEAM: "TEAM",
  PRIVATE: "PRIVATE",
} as const;

type PromptVisibilitySettingsProps = {
  visibility: typeof PromptVisibility[keyof typeof PromptVisibility];
  selectedTeams: string[];
  teams: string[];
  handleVisibilityChange: (v: typeof PromptVisibility[keyof typeof PromptVisibility]) => void;
  handleToggleTeam: (team: string) => void;
};

const PromptVisibilitySettings = ({
                                    visibility,
                                    selectedTeams,
                                    teams,
                                    handleVisibilityChange,
                                    handleToggleTeam,
                                  }: PromptVisibilitySettingsProps) => (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {visibility === PromptVisibility.PUBLIC ? <Globe className="h-5 w-5"/> :
              <Lock className="h-5 w-5"/>}
          공개 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="public" className="text-white">전체 공개</Label>
            <p className="text-white/60 text-sm">모든 사용자가 볼 수 있습니다</p>
          </div>
          <Switch
              id="public"
              checked={visibility === PromptVisibility.PUBLIC}
              onCheckedChange={(checked) => handleVisibilityChange(checked ? PromptVisibility.PUBLIC : PromptVisibility.PRIVATE)}
          />
        </div>
        {visibility !== PromptVisibility.PUBLIC && (
            <div className="space-y-3">
              <Label className="text-white">팀 접근 권한</Label>
              <div className="space-y-2">
                {teams.map((team) => (
                    <div key={team} className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          id={team}
                          checked={selectedTeams.includes(team)}
                          onChange={() => handleToggleTeam(team)}
                          className="rounded border-white/30"
                      />
                      <Label htmlFor={team} className="text-white/80 text-sm">{team}</Label>
                    </div>
                ))}
              </div>
            </div>
        )}
      </CardContent>
    </Card>
);

export default PromptVisibilitySettings; 