# 🚀 Prompt Center UI 배포 가이드

이 가이드는 Prompt Center UI 프론트엔드 애플리케이션의 모든 배포 옵션을 설명합니다.

## 📋 배포 옵션

### 1. 🏢 백엔드 통합 배포 (권장)

- **설명**: 기존 백엔드 프로젝트의 nginx와 docker-compose를 활용한 통합 배포
- **장점**: 단일 도메인, CORS 없음, 운영 복잡도 낮음
- **가이드**: [백엔드 통합 배포 가이드](docs/BACKEND_INTEGRATION.md)

### 2. 🔒 독립 HTTPS 배포

- **설명**: 프론트엔드만 독립적으로 HTTPS로 배포
- **장점**: 독립적인 배포, 빠른 프로토타이핑
- **가이드**: [독립 HTTPS 배포 가이드](docs/STANDALONE_HTTPS.md)

### 3. 🛠️ 개발 환경 설정

- **설명**: 로컬 개발 환경 구성 및 HTTPS 설정
- **가이드**: [개발 환경 가이드](docs/DEVELOPMENT.md)

## 🗂️ 디렉토리 구조

```
deployment/
├── README.md                    # 이 파일 (메인 가이드)
├── docs/                        # 상세 가이드 문서들
│   ├── BACKEND_INTEGRATION.md   # 백엔드 통합 배포
│   ├── STANDALONE_HTTPS.md      # 독립 HTTPS 배포
│   └── DEVELOPMENT.md           # 개발 환경 설정
├── docker/                      # Docker 설정 파일들
│   ├── Dockerfile              # 기본 Dockerfile
│   └── https.yml               # HTTPS 배포용 compose
├── nginx/                       # Nginx 설정 파일들
│   ├── standalone.conf          # 독립 배포용 nginx
│   └── backend-integration.conf # 백엔드 통합용 nginx 설정
└── scripts/                     # 배포 스크립트들
    ├── generate-ssl.sh          # SSL 인증서 생성
    ├── deploy-standalone.sh     # 독립 배포 스크립트
    └── setup-env.sh            # 환경변수 설정 스크립트
```

## ⚡ 빠른 시작

### 백엔드와 통합 배포 (권장)

```bash
# 1. 백엔드 프로젝트의 설정 업데이트
cp deployment/nginx/backend-integration.conf /path/to/backend/nginx/
cp deployment/docs/BACKEND_INTEGRATION.md /path/to/backend/

# 2. 백엔드 프로젝트에서 배포
cd /path/to/backend
docker-compose up -d
```

### 독립 HTTPS 배포

```bash
# 1. SSL 인증서 생성 및 배포
npm run deploy:standalone:https

# 2. 접속 확인
open https://localhost
```

## 🔧 환경변수 설정

### 필수 환경변수

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost/api  # 통합 배포시
# NEXT_PUBLIC_API_URL=http://backend-server:8080/api  # 독립 배포시
NEXT_PUBLIC_APP_NAME=Prompt Center
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 선택적 환경변수

```bash
# 포트 설정 (독립 배포시)
PORT=3000
HTTPS_PORT=3443

# 보안 설정
NEXT_PUBLIC_SECURE_COOKIE=true
```

## 🐛 문제 해결

### 일반적인 문제들

1. **포트 충돌**
   ```bash
   # 사용 중인 포트 확인
   lsof -i :3000
   lsof -i :80
   ```

2. **Docker 빌드 실패**
   ```bash
   # 캐시 정리 후 재빌드
   docker system prune -f
   npm run docker:build
   ```

3. **SSL 인증서 문제**
   ```bash
   # 인증서 재생성
   npm run ssl:generate
   ```

### 로그 확인

```bash
# 독립 배포 로그
npm run docker:logs

# 백엔드 통합 배포 로그 (백엔드 프로젝트에서)
docker-compose logs frontend-container
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. [개발 환경 가이드](docs/DEVELOPMENT.md)에서 기본 설정 확인
2. [FAQ 섹션](#-자주-묻는-질문)에서 일반적인 문제 해결책 확인
3. GitHub Issues에서 유사한 문제 검색

## ❓ 자주 묻는 질문

### Q: 어떤 배포 방식을 선택해야 하나요?

A: 백엔드가 이미 있다면 **백엔드 통합 배포**를, 프론트엔드만 테스트하려면 **독립 HTTPS 배포**를 선택하세요.

### Q: HTTPS가 꼭 필요한가요?

A: 네, `navigator.clipboard` API 등 보안 API 사용을 위해 HTTPS가 필수입니다.

### Q: 개발 환경에서 HTTPS를 사용할 수 있나요?

A: 네, `npm run dev:https` 명령어로 개발 환경에서도 HTTPS를 사용할 수 있습니다.

---

각 배포 방식의 상세한 설명은 `docs/` 디렉토리의 해당 가이드를 참조하세요. 