import {FC} from "react";
import {Card, CardContent} from "@components/ui/card";

export interface StatItem {
  label: string;
  value: number;
  color: string;
}

interface PromptStatsProps {
  stats: StatItem[];
}

export const PromptStats: FC<PromptStatsProps> = ({stats}) => {
  return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 text-center">
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
        ))}
      </div>
  );
}; 