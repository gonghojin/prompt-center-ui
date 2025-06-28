# 백엔드 통합 배포 가이드

기존 백엔드 프로젝트의 nginx와 docker-compose를 활용하여 프론트엔드를 함께 배포하는 방법입니다.

## 🎯 개요

- **장점**: 단일 도메인, CORS 없음, 운영 복잡도 낮음
- **단점**: 백엔드 프로젝트 수정 필요
- **적합한 경우**: 프로덕션 환경, 백엔드와 함께 운영

## 🔧 환경변수 설정

### 백엔드 통합 배포용 환경변수

`.env.production` 파일 생성:

```bash
# 운영 환경 설정
NODE_ENV=production

# API 설정 (통합 배포에서는 상대 경로 사용)
NEXT_PUBLIC_API_URL=/api

# 앱 정보
NEXT_PUBLIC_APP_NAME=Prompt Center
NEXT_PUBLIC_APP_VERSION=1.0.0

# 배포 설정 (백엔드 통합)
NEXT_PUBLIC_FRONTEND_URL=https://your-domain.com
NEXT_PUBLIC_BACKEND_INTEGRATED=true

# 보안 설정
NEXT_PUBLIC_SECURE_COOKIE=true

# 포트 설정
PORT=3000
```

**중요**: `NEXT_PUBLIC_BACKEND_INTEGRATED=true`로 설정하면 Next.js rewrites가 비활성화되고 nginx가 모든 프록시를 처리합니다.

## 📋 필요 작업

### 1. 백엔드 docker-compose.yml 업데이트

기존 백엔드 프로젝트의 `docker-compose.yml`에 프론트엔드 서비스를 추가:

```yaml
services:
  # ... 기존 서비스들 (backend, postgres, redis, etc.) ...

  # 프론트엔드 서비스 추가
  frontend-container:
    build:
      context: ../prompt-center-ui  # 프론트엔드 프로젝트 경로 조정
      dockerfile: deployment/docker/Dockerfile.production
    container_name: prompt-center-frontend
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost/api
      - NEXT_PUBLIC_APP_NAME=Prompt Center
    networks:
      - your-network-name  # 기존 네트워크 사용
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    # ... 기존 nginx 설정 ...
    depends_on:
      - backend
      - frontend-container  # 의존성 추가
```

### 2. nginx.conf 업데이트

#### Step 1: upstream 블록에 프론트엔드 추가

```nginx
upstream backend {
    server backend:8080;
    keepalive 32;
}

# 프론트엔드 upstream 추가
upstream frontend {
    server frontend-container:3000;
    keepalive 32;
}
```

#### Step 2: 정적 파일 서빙 부분 교체

기존의 정적 파일 서빙 설정을 제거하고 다음으로 교체:

```nginx
# === 프론트엔드 관련 설정 ===

# Next.js 정적 파일들
location /_next/ {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 정적 파일들
location ~ \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|css|js|map)$ {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    expires 30d;
    add_header Cache-Control "public";
}

# 모든 다른 요청을 프론트엔드로 프록시
location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Connection "";
    proxy_http_version 1.1;

    # WebSocket 지원
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_cache_bypass $http_upgrade;
}
```

### 3. 설정 파일 복사

프론트엔드 프로젝트에서 필요한 파일들을 백엔드 프로젝트로 복사:

```bash
# 프론트엔드 프로젝트에서
cp deployment/nginx/backend-integration.conf /path/to/backend/nginx/nginx.conf
```

## 🚀 배포 실행

### 1. 프론트엔드 빌드 테스트

```bash
# 프론트엔드 프로젝트에서
npm run build
```

### 2. 백엔드 프로젝트에서 배포

```bash
# 백엔드 프로젝트에서
docker-compose down
docker-compose build
docker-compose up -d
```

### 3. 확인

```bash
# 서비스 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs frontend-container
docker-compose logs nginx

# 웹 접속 테스트
curl http://localhost
curl http://localhost/api/health
```

## 🔍 접속 URL

- **프론트엔드**: http://localhost
- **백엔드 API**: http://localhost/api/...
- **Swagger UI**: http://localhost/swagger-ui.html
- **헬스체크**: http://localhost/actuator/health

## 🐛 문제 해결

### 프론트엔드 컨테이너 시작 실패

```bash
# 로그 확인
docker-compose logs frontend-container

# 빌드 문제 해결
docker-compose build --no-cache frontend-container
```

### nginx 프록시 오류

```bash
# nginx 설정 테스트
docker-compose exec nginx nginx -t

# nginx 재시작
docker-compose restart nginx
```

### 네트워크 연결 문제

```bash
# 컨테이너 간 통신 테스트
docker-compose exec nginx ping frontend-container
docker-compose exec frontend-container ping backend
```

## ✅ 체크리스트

- [ ] 백엔드 docker-compose.yml에 프론트엔드 서비스 추가
- [ ] nginx.conf에 프론트엔드 upstream 추가
- [ ] nginx.conf의 location / 블록을 프론트엔드 프록시로 변경
- [ ] 프론트엔드 프로젝트 빌드 테스트
- [ ] 백엔드 프로젝트에서 통합 배포 실행
- [ ] 웹 브라우저에서 프론트엔드 접근 확인
- [ ] API 요청이 백엔드로 정상 프록시되는지 확인

이 방식으로 배포하면 하나의 도메인에서 프론트엔드와 백엔드를 모두 제공할 수 있어 CORS 문제 없이 안정적인 서비스가 가능합니다. 