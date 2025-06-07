import type {JSX} from "react";
import {FC} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@components/ui/card";

export interface ActivityLog {
  action: string;
  actionType: string;
  prompt: string;
  time: string;
}

interface PromptActivityProps {
  recentActivity: ActivityLog[];
  getActionIcon: (actionType: any) => JSX.Element;
  getActionColor: (actionType: any) => string;
}

export const PromptActivity: FC<PromptActivityProps> = ({
                                                          recentActivity,
                                                          getActionIcon,
                                                          getActionColor
                                                        }) => {
  return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">최근 활동</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.slice(0, 4).map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full ${getActionColor(activity.actionType)}`}/>
                <div className="flex-1">
                  <p className="text-white/80 flex items-center gap-1">
                    {getActionIcon(activity.actionType)}
                    <span className="text-purple-400">{activity.action}</span> {activity.prompt}
                  </p>
                  <p className="text-white/60 text-xs">{activity.time}</p>
                </div>
              </div>
          ))}
        </CardContent>
      </Card>
  );
}; 