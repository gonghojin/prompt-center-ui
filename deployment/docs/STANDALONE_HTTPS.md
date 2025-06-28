# 독립 HTTPS 배포 가이드

프론트엔드만 독립적으로 HTTPS로 배포하는 방법입니다.

## 🎯 개요

- **장점**: 독립적인 배포, 빠른 프로토타이핑, 프론트엔드 전용 개발
- **단점**: CORS 설정 필요, 별도 도메인 관리
- **적합한 경우**: 프론트엔드 개발/테스트, 마이크로서비스 아키텍처

## 🔧 환경변수 설정

`.env.production` 파일 생성:

```bash
# 운영 환경 설정
NODE_ENV=production

# API 설정 (독립 배포에서는 백엔드 서버 전체 URL 사용)
NEXT_PUBLIC_API_URL=http://your-backend-server:8080/api

# 앱 정보
NEXT_PUBLIC_APP_NAME=Prompt Center
NEXT_PUBLIC_APP_VERSION=1.0.0

# 배포 설정 (독립 배포)
NEXT_PUBLIC_FRONTEND_URL=https://localhost:3443
NEXT_PUBLIC_BACKEND_INTEGRATED=false

# 보안 설정
NEXT_PUBLIC_SECURE_COOKIE=true

# 포트 설정
PORT=3000
HTTPS_PORT=3443
```

**중요**: `NEXT_PUBLIC_BACKEND_INTEGRATED=false`로 설정하면 Next.js가 직접 백엔드로 API 요청을 프록시합니다.

## 🚀 배포 방법

### 원클릭 HTTPS 배포

```bash
# SSL 인증서 생성 + 빌드 + 배포를 한 번에
npm run deploy:standalone:https
```

### 단계별 배포

#### 1. SSL 인증서 생성

```bash
npm run ssl:generate
```

#### 2. Docker 빌드 및 실행

```bash
# 빌드
docker-compose -f deployment/docker/https.yml build

# 실행
docker-compose -f deployment/docker/https.yml up -d

# 로그 확인
docker-compose -f deployment/docker/https.yml logs -f
```

## 🔍 접속 확인

### HTTPS 접속

- **프론트엔드**: https://localhost:3443
- **헬스체크**: https://localhost:3443/api/health

### 브라우저 보안 경고

개발용 자체 서명 인증서 사용시 브라우저에서 보안 경고가 나타납니다:

1. "고급" 클릭
2. "localhost로 이동(안전하지 않음)" 클릭

## 🔒 SSL 인증서 옵션

### 1. mkcert (권장 - 로컬 개발용)

```bash
# mkcert 설치 (macOS)
brew install mkcert

# 로컬 CA 설치
mkcert -install

# 인증서 생성
mkcert localhost 127.0.0.1 ::1
```

### 2. OpenSSL (일반적인 환경)

```bash
# 자동 생성 (스크립트 사용)
./deployment/scripts/generate-ssl.sh

# 수동 생성
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/localhost-key.pem \
  -out ssl/localhost.pem \
  -subj "/C=KR/ST=Seoul/L=Seoul/O=Dev/CN=localhost"
```

## 🐛 문제 해결

### SSL 인증서 문제

```bash
# 인증서 재생성
rm -rf ssl/
npm run ssl:generate

# 인증서 확인
openssl x509 -in ssl/localhost.pem -text -noout
```

### 포트 충돌

```bash
# 사용 중인 포트 확인
lsof -i :3443
lsof -i :80

# 다른 포트 사용
export HTTPS_PORT=4443
docker-compose -f deployment/docker/https.yml up -d
```

### CORS 문제

백엔드에서 CORS 허용 도메인에 프론트엔드 URL 추가:

```javascript
// Spring Boot 예시
@CrossOrigin(origins = {
    "https://localhost:3443",
    "https://your-frontend-domain.com"
})
```

### Docker 빌드 실패

```bash
# 캐시 정리
docker system prune -f

# 강제 재빌드
docker-compose -f deployment/docker/https.yml build --no-cache
```

## 🔧 nginx 설정 (고급)

독립 배포용 nginx 설정 (`deployment/nginx/standalone.conf`):

```nginx
server {
    listen 80;
    server_name localhost;
    return 301 https://$server_name:3443$request_uri;
}

server {
    listen 443 ssl http2;
    server_name localhost;

    ssl_certificate /etc/nginx/ssl/localhost.pem;
    ssl_certificate_key /etc/nginx/ssl/localhost-key.pem;

    # 보안 헤더
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 모니터링

### 헬스체크

```bash
# 컨테이너 상태
docker-compose -f deployment/docker/https.yml ps

# 헬스체크 URL
curl -k https://localhost:3443/api/health
```

### 로그 확인

```bash
# 모든 서비스 로그
docker-compose -f deployment/docker/https.yml logs -f

# 특정 서비스 로그
docker-compose -f deployment/docker/https.yml logs -f frontend
docker-compose -f deployment/docker/https.yml logs -f nginx
```

## 🎯 성능 최적화

### Gzip 압축

nginx에서 자동으로 Gzip 압축이 적용됩니다.

### 정적 파일 캐싱

```nginx
# Next.js 정적 파일들
location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 이미지 파일들
location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
    expires 30d;
    add_header Cache-Control "public";
}
```

## ✅ 체크리스트

- [ ] `.env.production` 파일 생성 및 환경변수 설정
- [ ] SSL 인증서 생성 확인
- [ ] Docker 빌드 성공 확인
- [ ] HTTPS 접속 확인 (https://localhost:3443)
- [ ] 헬스체크 API 정상 동작 확인
- [ ] 백엔드 API 연동 확인 (CORS 설정 포함)
- [ ] 브라우저에서 모든 기능 테스트

## 🎓 개발 팁

1. **로컬 개발시**: `npm run dev:https`로 HTTPS 개발 서버 사용
2. **인증서 관리**: mkcert 사용으로 브라우저 경고 없이 개발
3. **API 테스트**: Postman/Insomnia에서 self-signed 인증서 허용 설정

독립 HTTPS 배포는 프론트엔드 개발과 테스트에 최적화된 방식입니다.