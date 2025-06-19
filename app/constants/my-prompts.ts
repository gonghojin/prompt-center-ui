import {ActivityLog, ActivityType, StatusConfig, VisibilityConfig} from "../types/my-prompts";

export const STATUS_CONFIG: StatusConfig = {
  label: {
    DRAFT: "임시저장",
    PUBLISHED: "게시됨",
    ARCHIVED: "보관됨",
    DELETED: "삭제됨",
  },
  color: {
    DRAFT: "bg-yellow-600 text-white",
    PUBLISHED: "bg-green-600 text-white",
    ARCHIVED: "bg-gray-600 text-white",
    DELETED: "bg-red-600 text-white",
  }
};

export const VISIBILITY_CONFIG: VisibilityConfig = {
  label: {
    PUBLIC: "전체 공개",
    TEAM: "팀 공개",
    PRIVATE: "비공개",
  },
  color: {
    PUBLIC: "border-green-500/30 text-green-400",
    TEAM: "border-blue-500/30 text-blue-400",
    PRIVATE: "border-gray-500/30 text-gray-400",
  }
};

export const INITIAL_ACTIVITY: ActivityLog[] = [
  {action: "생성", actionType: "CREATE" as ActivityType, prompt: "API 설계 프롬프트", time: "2시간 전"},
  {action: "수정", actionType: "EDIT" as ActivityType, prompt: "React 테스트 가이드", time: "1일 전"},
  {action: "즐겨찾기", actionType: "PUBLISH" as ActivityType, prompt: "머신러닝 모델 평가", time: "2일 전"},
  {action: "보관", actionType: "ARCHIVE" as ActivityType, prompt: "데이터베이스 최적화", time: "3일 전"},
]; 