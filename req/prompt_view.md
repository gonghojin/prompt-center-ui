# 📊 조회수 기록 API 연동 작업 계획

## 🎯 작업 목표

프롬프트 조회수를 실시간으로 기록하고 통계를 제공하는 기능을 구현하여 사용자 참여도를 측정하고 인기 프롬프트를 식별할 수 있도록 한다.

## 📋 현재 상황 분석

### ✅ 기존 구현 현황

- **타입 정의**: `ApiPrompt.viewCount` (number) 타입 정의됨
- **UI 표시**: 프롬프트 상세 페이지에서 조회수 표시 구현됨
- **대시보드 구조**: 조회수 통계를 위한 기본 구조 준비됨
- **데이터 흐름**: 백엔드에서 조회수 데이터 제공 중

### ❌ 누락된 기능

- **조회수 증가 API 연동**: 프롬프트 조회 시 조회수 증가 처리 없음
- **실시간 업데이트**: 조회수 변경 시 UI 실시간 반영 없음
- **중복 조회 방지**: 동일 사용자 연속 조회 제한 로직 없음 (백엔드에서 1시간 중복 차단 처리)
- **통계 활용**: 조회수 기반 정렬, 인기 프롬프트 추천 등 부재

### 🔗 백엔드 API 스펙 확인 사항

- **조회수 증가 API**: `POST /api/v1/prompts/{id}/view`
- **조회수 조회 API**: `GET /api/v1/prompts/{id}/views`
- **중복 방지**: 백엔드에서 1시간 내 동일 사용자/IP 중복 차단 처리
- **비로그인 사용자**: anonymousId 기반 중복 방지 지원
- **응답 형식**: `{ "viewCount": number }`
- **요청 Body**: `{ "anonymousId": "anonymous_123456" }` (비로그인 사용자용, 선택사항)

## 🚀 1단계: 조회수 증가 기능 구현 [최우선]

### 📝 세부 작업 계획

#### 1-1. API 함수 구현 (30분)

**파일**: `app/api/promptsApi.ts`

```typescript
// 조회수 기록 API (백엔드 스펙 완전 반영)
export const recordPromptView = async (
  promptId: string, 
  anonymousId?: string
): Promise<{ viewCount: number }> => {
  const body: { anonymousId?: string } = {};
  
  // 비로그인 사용자인 경우 anonymousId 포함
  if (anonymousId) {
    body.anonymousId = anonymousId;
  }

  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/view`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
  });
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("프롬프트를 찾을 수 없습니다.");
    } else if (res.status === 400) {
      throw new Error("잘못된 요청입니다.");
    }
    throw new Error("조회수 기록 실패");
  }
  
  return res.json();
};

// 조회수 조회 API (기존 유지)
export const getPromptViewCount = async (promptId: string): Promise<{ viewCount: number }> => {
  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/views`);
  if (!res.ok) throw new Error("조회수 조회 실패");
  return res.json();
};
```

**완료 기준**:

- [ ] API 함수 작성 완료
- [ ] anonymousId 처리 로직 구현
- [ ] 에러 코드별 예외 처리 구현

#### 1-2. 익명 사용자 ID 관리 유틸리티 (15분)

**파일**: `app/utils/anonymousId.ts` (새로 생성)

```typescript
/**
 * 익명 사용자 ID 관리 유틸리티
 */

const ANONYMOUS_ID_KEY = 'prompt_center_anonymous_id';

/**
 * 익명 사용자 ID 생성
 */
export const generateAnonymousId = (): string => {
  return `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 익명 사용자 ID 조회 (없으면 생성)
 */
export const getAnonymousId = (): string => {
  if (typeof window === 'undefined') return generateAnonymousId();
  
  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
  
  if (!anonymousId) {
    anonymousId = generateAnonymousId();
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  }
  
  return anonymousId;
};

/**
 * 현재 사용자가 로그인 상태인지 확인
 */
export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // 토큰 존재 여부로 로그인 상태 확인 (기존 인증 로직 활용)
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  return !!token;
};
```

**완료 기준**:

- [ ] 익명 ID 생성/조회 함수 구현
- [ ] localStorage 기반 영구 저장
- [ ] 로그인 상태 확인 함수 구현

#### 1-3. 프롬프트 상세 페이지 조회수 증가 로직 (45분)

**파일**: `app/prompts/[id]/page.tsx`

**기존 코드 수정 부분**:

```typescript
import { getAnonymousId, isLoggedIn } from '@/app/utils/anonymousId';
import { recordPromptView } from '@/app/api/promptsApi';

// 기존 상태에 추가
const [viewCount, setViewCount] = useState<number>(0);
const [isRecordingView, setIsRecordingView] = useState<boolean>(false);

// 조회수 기록 함수 (새로 추가)
const recordView = useCallback(async () => {
  if (!prompt?.id || isRecordingView) return;
  
  // 세션 기반 중복 호출 방지
  const viewKey = `prompt_view_${prompt.id}`;
  if (sessionStorage.getItem(viewKey)) {
    return;
  }
  
  setIsRecordingView(true);
  
  try {
    const anonymousId = isLoggedIn() ? undefined : getAnonymousId();
    const result = await recordPromptView(prompt.id, anonymousId);
    
    // UI 즉시 업데이트
    setViewCount(result.viewCount);
    
    // 프롬프트 객체도 업데이트
    setPrompt(prev => prev ? { ...prev, viewCount: result.viewCount } : null);
    
    // 세션에 기록 (페이지 새로고침 시에만 재호출)
    sessionStorage.setItem(viewKey, 'true');
    
    console.log(`조회수 기록 성공: ${result.viewCount}`);
  } catch (error) {
    // 조회수 기록 실패는 사용자 경험에 영향을 주지 않도록 조용히 처리
    console.error('조회수 기록 실패:', error);
  } finally {
    setIsRecordingView(false);
  }
}, [prompt?.id, isRecordingView]);

// 프롬프트 데이터 로드 후 조회수 기록
useEffect(() => {
  if (prompt?.id && !isRecordingView) {
    // 약간의 지연을 두어 페이지 로딩에 영향을 주지 않도록 처리
    const timer = setTimeout(() => {
      recordView();
    }, 100);
    
    return () => clearTimeout(timer);
  }
}, [prompt?.id, recordView, isRecordingView]);

// 초기 viewCount 설정
useEffect(() => {
  if (prompt?.viewCount !== undefined) {
    setViewCount(prompt.viewCount);
  }
}, [prompt?.viewCount]);
```

**UI 표시 부분 수정**:

```typescript
// 기존 조회수 표시 부분을 동적 값으로 변경
<span className="flex items-center gap-1">
  <Eye className="h-3 w-3" />
  {viewCount || prompt?.viewCount || 0}
  {isRecordingView && <span className="text-xs opacity-50">↑</span>}
</span>
```

**완료 기준**:

- [ ] 페이지 진입 시 자동 조회수 증가
- [ ] 로그인/비로그인 사용자 구분 처리
- [ ] 세션 기반 중복 호출 방지
- [ ] 실시간 UI 업데이트
- [ ] 에러 상황 조용한 처리
- [ ] 페이지 로딩 성능에 영향 없음

### 🧪 테스트 계획 (30분)

#### 테스트 시나리오

1. **로그인 사용자 테스트**
    - [ ] 프롬프트 상세 페이지 진입 시 조회수 증가
    - [ ] 새로고침 시 조회수 재증가
    - [ ] 같은 세션에서 재방문 시 중복 증가 안함

2. **비로그인 사용자 테스트**
    - [ ] anonymousId 자동 생성 및 저장
    - [ ] 조회수 증가 정상 동작
    - [ ] localStorage에 anonymousId 유지

3. **에러 상황 테스트**
    - [ ] 존재하지 않는 프롬프트 ID (404)
    - [ ] 네트워크 오류 시 조용한 실패
    - [ ] API 응답 지연 시 로딩 표시

4. **성능 테스트**
    - [ ] 페이지 로딩 속도 영향 없음
    - [ ] 조회수 기록 중 페이지 조작 가능

### 📊 모니터링 포인트

#### 개발자 도구 콘솔 로그

```typescript
// 성공 시
"조회수 기록 성공: 1234"

// 중복 호출 방지 시
"조회수 기록 스킵: 이미 기록됨"

// 실패 시 (조용한 처리)
"조회수 기록 실패: [에러 메시지]"
```

#### 네트워크 탭 확인사항

- POST `/api/v1/prompts/{id}/view` 호출 확인
- 응답 시간 100ms 이내 목표
- 에러 응답 코드별 적절한 처리

### 🔄 다음 단계 연결점

1단계 완료 후 즉시 연결 가능한 작업들:

- **2단계**: 대시보드 통계 연동 (조회수 데이터 활용)
- **3단계**: 프롬프트 목록에서 실시간 조회수 표시
- **성능 최적화**: 배치 조회수 조회 API 활용

---

## 🚀 단계별 구현 계획

### 1단계: 핵심 API 함수 구현 [우선순위: 높음] ✅ 위에서 상세 계획 완료

**파일**: `app/api/promptsApi.ts`
**작업 내용**:

```typescript
// 조회수 기록 API (백엔드 스펙에 맞춰 수정)
export const recordPromptView = async (promptId: string): Promise<{ viewCount: number }> => {
  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/view`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("조회수 기록 실패");
  return res.json();
};

// 조회수 조회 API (백엔드 스펙에 맞춰 수정)
export const getPromptViewCount = async (promptId: string): Promise<{ viewCount: number }> => {
  const res = await fetchWithAuth(`/api/v1/prompts/${promptId}/views`);
  if (!res.ok) throw new Error("조회수 조회 실패");
  return res.json();
};

// 여러 프롬프트 조회수 일괄 조회 (향후 확장용)
export const getBatchPromptViewCounts = async (promptIds: string[]): Promise<Record<string, number>> => {
  const params = new URLSearchParams();
  promptIds.forEach(id => params.append('ids', id));
  const res = await fetchWithAuth(`/api/v1/prompts/views/batch?${params.toString()}`);
  if (!res.ok) throw new Error("조회수 일괄 조회 실패");
  return res.json();
};
```

**예상 소요시간**: 1시간
**완료 기준**: API 함수 작성 및 기본 테스트 완료

### 2단계: 프롬프트 상세 페이지 조회수 증가 로직 [우선순위: 높음] ✅ 위에서 상세 계획 완료

**파일**: `app/prompts/[id]/page.tsx`
**작업 내용**:

- 페이지 진입 시 조회수 증가 API 호출
- **중복 조회 방지는 백엔드에서 처리하므로 프론트엔드 로직 단순화**
- 실시간 조회수 UI 업데이트
- 에러 처리 및 로딩 상태 관리

**구현 세부사항** (백엔드 중복 방지 반영):

```typescript
// 백엔드에서 중복 방지를 처리하므로 프론트엔드는 단순화
const recordView = useCallback(async () => {
  // 이미 조회수를 기록했다면 중복 호출 방지 (세션 기반)
  const viewKey = `prompt_view_${promptId}`;
  if (sessionStorage.getItem(viewKey)) {
    return;
  }
  
  try {
    const result = await recordPromptView(promptId);
    setViewCount(result.viewCount);
    
    // 세션에 기록하여 페이지 새로고침 시에만 재호출되도록 처리
    sessionStorage.setItem(viewKey, 'true');
  } catch (error) {
    // 조회수 기록 실패는 사용자 경험에 영향을 주지 않도록 조용히 처리
    console.error('조회수 기록 실패:', error);
  }
}, [promptId]);

// 컴포넌트 마운트 시 자동 호출
useEffect(() => {
  if (prompt?.id) {
    recordView();
  }
}, [prompt?.id, recordView]);
```

**예상 소요시간**: 1.5시간 (백엔드 중복 방지로 로직 단순화)
**완료 기준**: 조회수 증가 및 실시간 업데이트 동작 확인

### 3단계: 대시보드 조회수 통계 연동 [우선순위: 중간]

**파일**: `app/dashboard/page.tsx`, `app/api/dashboardApi.ts`
**작업 내용**:

- 총 조회수 통계 카드 추가
- 조회수 증가율 표시
- **인기 프롬프트 TOP 3 표시 (백엔드 스펙 반영)**

**통계 카드 구성** (백엔드 스펙 반영):

- 총 조회수
- 오늘 조회수
- 어제 대비 증가율
- **가장 많이 조회된 프롬프트 TOP 3** (백엔드에서 제공)

**새로운 대시보드 API 함수**:

```typescript
// 조회수 통계 조회
export const getViewStatistics = async (): Promise<{
  totalViews: number;
  todayViews: number;
  yesterdayViews: number;
  changeRate: number;
  topViewedPrompts: Array<{
    id: string;
    title: string;
    viewCount: number;
  }>;
}> => {
  const res = await fetchWithAuth('/api/v1/dashboard/view-statistics');
  if (!res.ok) throw new Error("조회수 통계 조회 실패");
  return res.json();
};
```

**예상 소요시간**: 3시간
**완료 기준**: 대시보드에 조회수 통계 정상 표시

### 4단계: 프롬프트 탐색 페이지 조회수 기능 강화 [우선순위: 중간]

**파일**: `app/prompts/page.tsx`, `components/prompts/PromptFilters.tsx`
**작업 내용**:

- 정렬 옵션에 "조회수순" 추가
- 프롬프트 카드에 조회수 아이콘 및 수치 표시
- **인기 프롬프트 배지 표시** (조회수 기준)

**정렬 옵션 확장**:

```typescript
const sortOptions = [
  { value: 'recent', label: '최근 수정순' },
  { value: 'popular', label: '인기순 (좋아요)' },
  { value: 'views', label: '조회수순' }, // 새로 추가
  { value: 'name', label: '이름순' }
];
```

**인기 프롬프트 배지 로직**:

```typescript
// 조회수 상위 10% 프롬프트에 "인기" 배지 표시
const isPopularPrompt = (viewCount: number, averageViewCount: number) => {
  return viewCount > averageViewCount * 2; // 평균의 2배 이상
};
```

**예상 소요시간**: 2시간
**완료 기준**: 조회수순 정렬 및 카드 표시 정상 동작

### 5단계: 내 프롬프트 관리 조회수 통계 [우선순위: 낮음]

**파일**: `app/my-prompts/page.tsx`
**작업 내용**:

- 개인 총 조회수 통계 표시
- 프롬프트별 조회수 현황 테이블
- 조회수 기반 성과 분석

**통계 정보**:

- 내 프롬프트 총 조회수
- 평균 조회수
- 가장 인기 있는 내 프롬프트
- 최근 7일간 조회수 변화

**예상 소요시간**: 2시간
**완료 기준**: 개인 조회수 통계 정상 표시

### 6단계: 커스텀 훅 및 리팩토링 [우선순위: 낮음]

**파일**: `app/hooks/useViewTracking.ts`
**작업 내용**:

- 조회수 추적 로직을 재사용 가능한 커스텀 훅으로 분리
- 성능 최적화 및 코드 정리
- 타입 안정성 강화

**커스텀 훅 구조** (백엔드 중복 방지 반영):

```typescript
export const useViewTracking = (promptId: string) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  
  const recordView = useCallback(async () => {
    // 백엔드에서 중복 방지 처리하므로 단순화된 로직
    const viewKey = `prompt_view_${promptId}`;
    if (sessionStorage.getItem(viewKey)) return;
    
    setIsRecording(true);
    try {
      const result = await recordPromptView(promptId);
      setViewCount(result.viewCount);
      sessionStorage.setItem(viewKey, 'true');
    } catch (error) {
      console.error('조회수 기록 실패:', error);
    } finally {
      setIsRecording(false);
    }
  }, [promptId]);
  
  return { viewCount, recordView, isRecording };
};
```

**예상 소요시간**: 1시간 (로직 단순화로 시간 단축)
**완료 기준**: 커스텀 훅 구현 및 기존 코드 리팩토링 완료

## 🛠️ 기술적 고려사항

### 성능 최적화

- **백엔드 캐싱**: 백엔드에서 Redis 캐싱 처리 예정
- **배치 조회**: 여러 프롬프트 조회수 일괄 조회 API 활용
- **비동기 처리**: 조회수 기록이 페이지 로딩에 영향을 주지 않도록 처리

### 사용자 경험

- **즉시 반영**: 조회수 증가 시 UI 즉시 업데이트
- **오프라인 대응**: 네트워크 오류 시 조용한 실패 처리 (사용자 경험 방해 안함)
- **로딩 표시**: 조회수 기록 중 적절한 로딩 표시 (선택사항)

### 데이터 정합성

- **백엔드 중복 방지**: 1시간 내 동일 사용자/IP 중복 차단은 백엔드에서 처리
- **프론트엔드 중복 방지**: 세션 기반으로 페이지 새로고침 시에만 재호출
- **에러 처리**: 조회수 기록 실패가 사용자 경험에 영향을 주지 않도록 처리

### 🆕 백엔드 연동 특이사항

- **비로그인 사용자 지원**: IP 기반 중복 방지 (프론트엔드에서 별도 처리 불필요)
- **자동 IP 추출**: 백엔드에서 Proxy 환경 고려한 IP 추출 처리
- **중복 방지 로직**: 백엔드에서 1시간 기준 중복 차단 (프론트엔드 로직 단순화)

## 📅 일정 계획

| 단계  | 작업 내용         | 예상 소요시간 | 완료 목표일 |
|-----|---------------|---------|--------|
| 1단계 | API 함수 구현     | 1시간     | D+1    |
| 2단계 | 상세 페이지 조회수 로직 | 1.5시간   | D+2    |
| 3단계 | 대시보드 통계 연동    | 3시간     | D+5    |
| 4단계 | 탐색 페이지 기능 강화  | 2시간     | D+7    |
| 5단계 | 내 프롬프트 통계     | 2시간     | D+10   |
| 6단계 | 리팩토링 및 최적화    | 1시간     | D+12   |

**총 예상 소요시간**: 10.5시간 (백엔드 중복 방지로 1시간 단축)
**전체 완료 목표**: 2주 내

## ✅ 완료 체크리스트

### 1단계 완료 기준 (상세 계획 완료) ✅ 완료!

- [x] `recordPromptView` API 함수 구현 (POST /api/v1/prompts/{id}/view)
- [x] anonymousId 파라미터 처리 로직 구현
- [x] HTTP 상태 코드별 에러 처리 (400, 404)
- [x] `getPromptViewCount` API 함수 구현 (GET /api/v1/prompts/{id}/views)
- [x] `getBatchPromptViewCounts` API 함수 구현 (일괄 조회용)
- [x] 익명 사용자 ID 관리 유틸리티 구현
- [x] API 함수 기본 테스트 완료 (빌드 성공)

### 2단계 완료 기준 (상세 계획 완료) ✅ 완료!

- [x] 프롬프트 상세 페이지 진입 시 자동 조회수 증가
- [x] 로그인/비로그인 사용자 구분 처리
- [x] anonymousId 자동 생성 및 전송
- [x] 세션 기반 중복 호출 방지 로직 동작
- [x] 실시간 조회수 UI 업데이트
- [x] 에러 상황 조용한 처리 (사용자 경험 방해 안함)
- [x] 페이지 로딩 성능에 영향 없음 (100ms 지연 처리)
- [x] 테스트 시나리오 준비 완료 (백엔드 연동 대기)

### 3단계 완료 기준

- [ ] 대시보드 총 조회수 통계 표시
- [ ] 조회수 증가율 계산 및 표시
- [ ] 인기 프롬프트 TOP 3 표시
- [ ] 통계 데이터 정확성 검증

### 4단계 완료 기준

- [ ] 조회수순 정렬 옵션 추가
- [ ] 프롬프트 카드 조회수 표시
- [ ] 인기 프롬프트 배지 표시
- [ ] 정렬 기능 정상 동작

### 5단계 완료 기준

- [ ] 개인 조회수 통계 표시
- [ ] 프롬프트별 조회수 현황 표시
- [ ] 통계 정보 정확성 검증

### 6단계 완료 기준

- [ ] `useViewTracking` 커스텀 훅 구현
- [ ] 기존 코드 리팩토링 완료
- [ ] 성능 최적화 적용
- [ ] 타입 안정성 확보

## 🔄 향후 확장 계획

### 단기 확장 (1개월 내)

- 조회수 기반 개인화 추천 시스템
- 조회수 트렌드 분석 차트
- 조회수 기반 프롬프트 랭킹 시스템

### 중장기 확장 (3개월 내)

- 실시간 조회수 알림 시스템
- 조회수 기반 프롬프트 품질 지표
- A/B 테스트를 위한 조회수 분석 도구

## 🔗 백엔드 의존성 체크리스트

### 필수 확인 사항

- [x] 백엔드 API 엔드포인트 확정
    - `POST /api/v1/prompts/{id}/view` - 조회수 증가
    - `GET /api/v1/prompts/{id}/views` - 조회수 조회
- [x] 응답 형식 확정: `{ "viewCount": number }`
- [x] 요청 Body 형식 확정: `{ "anonymousId": "anonymous_123456" }` (선택사항)
- [x] HTTP 상태 코드 확정: 200, 400, 404
- [x] 중복 방지 로직 (1시간 기준) 백엔드 구현 완료
- [x] 비로그인 사용자 anonymousId 기반 처리 백엔드 구현 완료
- [ ] 대시보드 통계 API 추가 구현 필요
    - `/api/v1/dashboard/view-statistics`
    - 응답: 총 조회수, 오늘 조회수, 증가율, TOP 3 프롬프트

### 백엔드 개발 완료 대기 항목

- [ ] 대시보드 조회수 통계 API
- [ ] 여러 프롬프트 조회수 일괄 조회 API (선택사항)
- [ ] 개인 프롬프트 조회수 통계 API

---

**작성일**: 2024년 12월 19일  
**작성자**: AI 개발 어시스턴트  
**최종 업데이트**: 2024년 12월 19일 (백엔드 API 스펙 완전 반영, 1-2단계 상세 계획 완료)  
**검토 필요**: 1-2단계 구현 후 대시보드 통계 API 추가 개발 일정 협의
