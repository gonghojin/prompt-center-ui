# 개발 환경 설정 가이드

로컬 개발 환경 구성 및 HTTPS 설정 방법입니다.

## 🎯 개요

- **목적**: 로컬 개발 환경에서 프론트엔드 개발 및 테스트
- **특징**: Hot Reload, HTTPS 지원, 개발 도구 최적화
- **적합한 경우**: 일상적인 개발 작업, 기능 테스트

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
# HTTP 개발 서버 (기본)
npm run dev

# HTTPS 개발 서버 (권장)
npm run dev:https

# 커스텀 HTTPS 개발 서버
npm run dev:custom-https
```

## 🔒 HTTPS 개발 환경

### 자동 HTTPS 설정 (Next.js 15+)

```bash
# Next.js 실험적 HTTPS 기능 사용
npm run dev:https
```

이 방법은 Next.js가 자동으로 SSL 인증서를 생성하고 관리합니다.

### 수동 HTTPS 설정 (mkcert 권장)

#### 1. mkcert 설치

```bash
# macOS
brew install mkcert

# Linux (Ubuntu/Debian)
sudo apt install mkcert

# Windows (Chocolatey)
choco install mkcert
```

#### 2. 로컬 CA 설치

```bash
mkcert -install
```

#### 3. 인증서 생성

```bash
mkcert localhost 127.0.0.1 ::1
```

#### 4. 커스텀 HTTPS 서버 실행

```bash
npm run dev:custom-https
```

## 🔧 환경변수 설정

### 개발용 환경변수

`.env.development` (또는 `.env.local`) 파일 생성:

```bash
# 개발 환경
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 앱 정보
NEXT_PUBLIC_APP_NAME=Prompt Center (Dev)
NEXT_PUBLIC_APP_VERSION=dev

# 개발 도구
NEXT_PUBLIC_DEBUG=true
```

### 백엔드 연동 설정

```bash
# 로컬 백엔드 연동
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 개발서버 백엔드 연동
NEXT_PUBLIC_API_URL=https://dev-backend.your-domain.com/api

# Docker Compose 백엔드 연동
NEXT_PUBLIC_API_URL=http://localhost/api
```

## 🐳 Docker 개발 환경

### 개발용 Docker 설정

```bash
# 개발용 Docker 이미지 빌드
npm run docker:build:dev

# 개발용 컨테이너 실행
docker run -p 3000:3000 -v $(pwd):/app prompt-center-ui:dev
```

### Docker Compose 개발 환경

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🔍 개발 도구 설정

### VS Code 설정

`.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### ESLint 및 Prettier

```bash
# Lint 검사
npm run lint

# Lint 자동 수정
npm run lint -- --fix
```

## 🌐 백엔드 연동 테스트

### CORS 설정 확인

백엔드에서 개발 서버 도메인 허용:

```javascript
// Spring Boot 예시
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://localhost:3000"
})
```

### API 연결 테스트

```bash
# 헬스체크 테스트
curl http://localhost:3000/api/health

# 백엔드 직접 테스트
curl http://localhost:8080/api/health
```

## 🔧 개발 스크립트

### package.json 스크립트

```json
{
  "scripts": {
    "dev": "next dev --turbopack -H 0.0.0.0",
    "dev:https": "next dev --turbopack --experimental-https",
    "dev:custom-https": "node dev-server.js",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### 유용한 개발 명령어

```bash
# 타입 검사
npm run type-check

# 프로덕션 빌드 테스트
npm run build && npm run start

# 의존성 업데이트 확인
npm outdated

# 패키지 취약점 검사
npm audit
```

## 🐛 개발 중 문제 해결

### 포트 충돌

```bash
# 사용 중인 포트 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>

# 다른 포트 사용
PORT=3001 npm run dev
```

### 캐시 문제

```bash
# Next.js 캐시 정리
rm -rf .next

# npm 캐시 정리
npm cache clean --force

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload 안됨

```bash
# 파일 시스템 감시 한도 증가 (Linux/macOS)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### TypeScript 오류

```bash
# 타입 정의 업데이트
npm install --save-dev @types/node @types/react @types/react-dom

# TypeScript 설정 확인
npx tsc --showConfig
```

## 🚀 성능 최적화 (개발)

### Turbopack 사용

```bash
# 기본으로 활성화됨
npm run dev
```

### 빌드 성능 모니터링

```bash
# 빌드 분석
npm run build -- --profile

# 번들 크기 분석
npm install --save-dev @next/bundle-analyzer
```

## 🔍 디버깅

### 브라우저 개발자 도구

1. **React Developer Tools** 설치
2. **Console** 탭에서 오류 확인
3. **Network** 탭에서 API 요청 확인

### VS Code 디버깅

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug client-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

## ✅ 체크리스트

- [ ] Node.js 및 npm 설치 확인
- [ ] 프로젝트 의존성 설치 (`npm install`)
- [ ] 환경변수 파일 생성 (`.env.development`)
- [ ] 개발 서버 실행 확인 (`npm run dev`)
- [ ] HTTPS 개발 서버 실행 확인 (필요시)
- [ ] 백엔드 API 연동 테스트
- [ ] Hot Reload 동작 확인
- [ ] 개발자 도구 설정 완료

## 🎓 개발 팁

1. **HTTPS 개발**: 최신 웹 API 사용을 위해 HTTPS 개발 환경 권장
2. **타입 안전성**: TypeScript strict 모드 활용
3. **코드 품질**: ESLint + Prettier 조합으로 코드 일관성 유지
4. **성능**: Turbopack으로 빠른 Hot Reload 경험
5. **디버깅**: React Developer Tools로 컴포넌트 상태 확인

개발 환경이 제대로 설정되면 효율적이고 즐거운 개발 경험을 할 수 있습니다! 