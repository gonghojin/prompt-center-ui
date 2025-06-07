import {Card, CardContent, CardHeader, CardTitle} from "@components/ui/card";
import {Filter} from "lucide-react";

interface PromptFiltersProps<StatusType extends string = string, VisibilityType extends string = string> {
  statusLabel: Record<StatusType, string>;
  statusColor: Record<StatusType, string>;
  statusFilter: Record<StatusType, boolean>;
  onStatusChange: (status: StatusType, checked: boolean) => void;
  visibilityLabel: Record<VisibilityType, string>;
  visibilityColor: Record<VisibilityType, string>;
  visibilityFilter: Record<VisibilityType, boolean>;
  onVisibilityChange: (visibility: VisibilityType, checked: boolean) => void;
}

export const PromptFilters = <StatusType extends string = string, VisibilityType extends string = string>({
                                                                                                            statusLabel,
                                                                                                            statusColor,
                                                                                                            statusFilter,
                                                                                                            onStatusChange,
                                                                                                            visibilityLabel,
                                                                                                            visibilityColor,
                                                                                                            visibilityFilter,
                                                                                                            onVisibilityChange,
                                                                                                          }: PromptFiltersProps<StatusType, VisibilityType>) => {
  return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5"/>
            필터
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-white/80 text-sm font-medium">상태</p>
            <div className="space-y-1">
              {Object.keys(statusLabel).map((status) => (
                  <label key={status} className="flex items-center gap-2 text-white/70 text-sm">
                    <input
                        type="checkbox"
                        className="rounded"
                        checked={statusFilter[status as StatusType]}
                        onChange={(e) => onStatusChange(status as StatusType, e.target.checked)}
                        aria-label={statusLabel[status as StatusType]}
                    />
                    <span
                        className={`px-2 py-0.5 rounded text-xs ${statusColor[status as StatusType]}`}>{statusLabel[status as StatusType]}</span>
                  </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-white/80 text-sm font-medium">공개 범위</p>
            <div className="space-y-1">
              {Object.keys(visibilityLabel).map((visibility) => (
                  <label key={visibility} className="flex items-center gap-2 text-white/70 text-sm">
                    <input
                        type="checkbox"
                        className="rounded"
                        checked={visibilityFilter[visibility as VisibilityType]}
                        onChange={(e) => onVisibilityChange(visibility as VisibilityType, e.target.checked)}
                        aria-label={visibilityLabel[visibility as VisibilityType]}
                    />
                    <span
                        className={`px-2 py-0.5 rounded text-xs ${visibilityColor[visibility as VisibilityType]}`}>{visibilityLabel[visibility as VisibilityType]}</span>
                  </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
  );
}; 