# 🧩 Prompt Center UI

프롬프트 템플릿 중앙화 프론트엔드

## 📝 프로젝트 개요
사내에서 반복적으로 사용하는 프롬프트를 역할/목적/도메인별로 등록·공유·검색·재사용할 수 있는 중앙화된 프롬프트 템플릿 UI입니다.

## 🎯 주요 기능

### 1. 🏠 메인 랜딩 페이지 (`/`)
- **히어로 섹션**: 서비스 소개 및 주요 가치 제안
- **인터랙티브 검색 데모**: 실시간 검색 미리보기
- **애니메이션 효과**: 페이지 로드 시 fade-in 애니메이션
- **핵심 기능 소개**: 6가지 주요 기능 카드 (검색, 버전관리, 팀협업, 즐겨찾기, 권한관리, 빠른배포)
- **사용자 타입별 안내**: 4가지 역할별 혜택 (백엔드, 프론트엔드, 데이터사이언티스트, 디자이너)
- **기술 스택 표시**: 사용된 기술들의 배지 형태 표시
- **CTA 버튼**: "시작하기", "데모 보기" 버튼
- **푸터**: 저작권 정보

### 2. 📊 대시보드 (`/dashboard`)
- **통계 카드**: 총 프롬프트, 팀 멤버, 조회수, 즐겨찾기 수
- **카테고리별 현황**: 각 카테고리별 프롬프트 개수 시각화
- **최근 프롬프트 목록**: 최근 수정된 프롬프트 4개 표시
- **실시간 검색**: 헤더의 검색 기능으로 프롬프트 필터링
- **프롬프트 카드**: 제목, 설명, 작성자, 통계, 태그 정보 표시
- **빠른 작업**: 새 프롬프트 작성, 즐겨찾기 보기, 최근 수정 항목
- **반응형 디자인**: 모바일/태블릿/데스크톱 대응
- **다크 테마**: 그라디언트 배경의 다크 모드
- **호버 효과**: 카드 및 버튼 인터랙션

### 3. 🔍 프롬프트 탐색 (`/prompts`)
- **통합 검색**: 제목, 설명, 태그 기반 실시간 검색
- **카테고리 필터**: Backend, Frontend, Data Science, Design, Database
- **정렬 옵션**: 최근 수정순, 인기순, 조회수순, 이름순
- **그리드 레이아웃**: 반응형 카드 그리드 (3열 → 2열 → 1열)
- **프롬프트 카드 정보**: 제목, 설명, 카테고리, 작성자, 좋아요, 조회수, 수정일, 태그(최대 3개 + 더보기), 공개/비공개 상태
- **좋아요/공유/즐겨찾기**: 프롬프트 좋아요 토글, URL 복사, 즐겨찾기 추가/제거
- **무한 스크롤**: "더 많은 프롬프트 보기" 버튼
- **검색 결과 카운트**: 필터링된 프롬프트 개수 표시
- **빈 상태 처리**: 검색 결과가 없을 때 안내

### 4. 📝 내 프롬프트 관리 (`/my-prompts`)
- **개인 통계**: 내 프롬프트, 즐겨찾기, 총 조회수, 총 좋아요
- **탭 기반 관리**: 내 프롬프트, 즐겨찾기 탭
- **프롬프트 관리**: 상태 표시(게시됨/임시저장, 공개/비공개), 액션 버튼(즐겨찾기, 공유, 복사, 편집, 삭제, 보기), 검색
- **필터링 옵션**: 상태별(게시됨/임시저장), 공개 범위별(공개/비공개) 필터
- **활동 추적**: 최근 활동 로그(생성, 수정, 즐겨찾기, 공유 등), 빠른 작업(새 프롬프트 작성, 내보내기, 보관함)

### 5. ✏️ 프롬프트 작성 (`/prompts/new`)
- **기본 정보 입력**: 제목(필수), 설명, 카테고리(드롭다운, 아이콘 포함)
- **마크다운 에디터**: 대용량 텍스트 영역(400px 높이), 문법 가이드 플레이스홀더
- **태그 관리**: 동적 태그 추가(Enter/버튼), 태그 제거(X 버튼), 중복 방지
- **공개 설정**: 공개/비공개 토글, 비공개 시 팀별 접근 권한 체크박스
- **파일 첨부**: 드래그 앤 드롭, 파일 선택, 업로드 목록 표시
- **템플릿 지원**: 카테고리별 템플릿(원클릭 적용)
- **저장 옵션**: 저장하고 게시, 임시 저장, 미리보기

### 6. 👁️ 프롬프트 상세보기 (`/prompts/[id]`)
- **프롬프트 정보**: 헤더(제목, 설명, 카테고리, 버전, 공개상태), 메타데이터(좋아요, 조회수, 업데이트 시간), 태그
- **콘텐츠 표시**: 마크다운 렌더링, 코드 하이라이팅
- **댓글 시스템**: 댓글 목록(작성자, 내용, 작성일), 댓글 작성, 댓글 카운트
- **작성자 정보**: 프로필 카드(이름, 역할, 아바타), 상세 페이지 링크
- **버전 관리**: 버전 히스토리, 버전 정보(번호, 날짜, 변경 내용)
- **접근 권한**: 팀 접근 목록, 권한 상태
- **액션 기능**: 즐겨찾기, 북마크, 공유, 복사, 편집, 다운로드

## 🎨 공통 UI/UX 기능
- **다크 테마**: 일관된 다크 모드 디자인, Purple-Cyan 그라디언트, 글래스모피즘(반투명+블러)
- **반응형 디자인**: Mobile-first, sm/md/lg/xl 브레이크포인트, Grid/Flexbox 활용
- **인터랙션**: 카드/버튼 호버 애니메이션, 트랜지션, 로딩 컴포넌트
- **네비게이션**: 일관된 헤더, 브레드크럼, 백 버튼

## 🚀 시작하기

### 🔧 개발 환경

1. **저장소 클론 및 설치**
```bash
git clone <repository-url>
cd prompt-center-ui
npm install
```

2. **환경변수 설정**
```bash
# 환경변수 설정 도우미 실행
npm run env:setup

# 또는 수동으로 .env.development 생성
cp .env.example .env.development
```

3. **개발 서버 실행**
```bash
# HTTP 개발 서버
npm run dev

# HTTPS 개발 서버 (권장)
npm run dev:https
```

### 🚀 배포

#### 1. 백엔드 통합 배포 (권장)

```bash
# 백엔드 프로젝트에서 통합 배포
# deployment/docs/BACKEND_INTEGRATION.md 참조
```

#### 2. 독립 HTTPS 배포

```bash
# 원클릭 배포
npm run deploy:standalone:https

# 단계별 배포
npm run ssl:generate
npm run docker:https:build
npm run docker:https:up
```

### 📚 상세 가이드

배포 방법별 상세한 가이드는 `deployment/` 디렉토리를 참조하세요:

- **[메인 배포 가이드](deployment/README.md)** - 모든 배포 옵션 비교
- **[백엔드 통합 배포](deployment/docs/BACKEND_INTEGRATION.md)** - 운영 환경 권장
- **[독립 HTTPS 배포](deployment/docs/STANDALONE_HTTPS.md)** - 프론트엔드 전용
- **[개발 환경 설정](deployment/docs/DEVELOPMENT.md)** - 로컬 개발

## 🏗️ 프로젝트 구조
```
prompt-center-ui/
├── app/                    # Next.js 앱 라우트 및 페이지
│   ├── api/                # API 유틸리티
│   ├── auth/               # 인증 관련 페이지
│   ├── dashboard/          # 대시보드
│   ├── my-prompts/         # 내 프롬프트 관리
│   ├── prompts/            # 프롬프트 탐색/상세/작성
│   ├── hooks/              # 커스텀 훅
│   ├── types/              # 타입 정의
│   └── ...
├── components/             # UI 컴포넌트
│   ├── auth/               # 인증 컴포넌트
│   ├── prompts/            # 프롬프트 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   └── ui/                 # 기본 UI 컴포넌트
├── deployment/             # 🆕 배포 관련 파일들
│   ├── README.md           # 배포 메인 가이드
│   ├── docs/               # 상세 배포 가이드들
│   ├── docker/             # Docker 설정 파일들
│   ├── nginx/              # Nginx 설정 파일들
│   └── scripts/            # 배포 스크립트들
├── lib/                    # 유틸리티 함수
├── public/                 # 정적 파일
└── ...
```

## 📋 주요 스크립트

### 개발

```bash
npm run dev              # HTTP 개발 서버
npm run dev:https        # HTTPS 개발 서버 (권장)
npm run dev:custom-https # HTTPS 개발 서버 (커스텀)
npm run build           # 프로덕션 빌드
npm run lint            # 코드 검사
npm run type-check      # 타입 검사
```

### 환경 설정

```bash
npm run env:setup       # 환경변수 설정 도우미
npm run ssl:generate    # SSL 인증서 생성
```

### Docker 관리

```bash
npm run docker:build    # Docker 이미지 빌드
npm run docker:up       # Docker 컨테이너 시작
npm run docker:down     # Docker 컨테이너 중지
npm run docker:logs     # 로그 확인
npm run docker:ps       # 컨테이너 상태 확인
npm run docker:restart  # 컨테이너 재시작
```

### 배포

```bash
npm run deploy:standalone        # 독립 배포
npm run deploy:standalone:https  # HTTPS 독립 배포 (SSL 인증서 자동 생성)
```

## 🧪 테스트
```bash
npm test
```

## 🤝 기여하기
1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

## 📄 라이선스
이 프로젝트는 MIT 라이선스 하에 있습니다. 