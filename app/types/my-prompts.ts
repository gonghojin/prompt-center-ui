export type StatusType = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
export type VisibilityType = 'PUBLIC' | 'TEAM' | 'PRIVATE';
export type ActivityType = 'CREATE' | 'EDIT' | 'PUBLISH' | 'ARCHIVE';

export interface ActivityLog {
  action: string;
  actionType: ActivityType;
  prompt: string;
  time: string;
}

export interface StatusConfig {
  label: Record<StatusType, string>;
  color: Record<StatusType, string>;
}

export interface VisibilityConfig {
  label: Record<VisibilityType, string>;
  color: Record<VisibilityType, string>;
}

export interface Stat {
  label: string;
  value: number;
  color: string;
}

export interface ActionConfig {
  icon: React.ReactNode;
  color: string;
} 