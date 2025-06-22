# HTTPS 개발 환경 설정 가이드

이 가이드는 로컬 개발 환경에서 HTTPS를 사용하여 `navigator.clipboard` API와 같은 보안 API들을 테스트할 수 있도록 설정하는 방법을 안내합니다.

## 왜 HTTPS가 필요한가요?

- `navigator.clipboard` API는 보안상의 이유로 HTTPS 또는 localhost에서만 작동합니다
- 일부 브라우저 API들은 안전한 컨텍스트(Secure Context)에서만 사용 가능합니다
- 프로덕션 환경과 유사한 조건에서 테스트할 수 있습니다

## 설정 방법

### 1. mkcert 설치 및 설정

```bash
# macOS (Homebrew 사용)
brew install mkcert

# 로컬 CA 설치
mkcert -install

# localhost용 인증서 생성
mkcert localhost 127.0.0.1 ::1
```

### 2. 개발 서버 실행

다음 세 가지 방법 중 하나를 선택하여 HTTPS 개발 서버를 실행할 수 있습니다:

#### 방법 1: Next.js 실험적 HTTPS 기능 사용 (권장)

```bash
npm run dev:https
```

#### 방법 2: 커스텀 HTTPS 서버 사용

```bash
npm run dev:custom-https
```

#### 방법 3: 일반 HTTP 개발 서버 (기본)

```bash
npm run dev
```

### 3. 브라우저에서 접속

- **HTTPS**: https://localhost:3000
- **HTTP**: http://localhost:3000

## 문제 해결

### SSL 인증서 오류가 발생하는 경우

1. `mkcert -install`이 제대로 실행되었는지 확인
2. 브라우저를 완전히 재시작
3. 시크릿/인코그니토 모드에서 테스트

### 포트 충돌이 발생하는 경우

`dev-server.js` 파일에서 포트 번호를 변경:

```javascript
const port = 3001; // 다른 포트로 변경
```

## 복사 기능 테스트

HTTPS 환경에서 프롬프트 상세 페이지의 복사 기능이 정상적으로 작동하는지 확인하세요:

1. https://localhost:3000/prompts/[id] 페이지 접속
2. "복사" 버튼 클릭
3. 성공 토스트 메시지 확인

## 주의사항

- SSL 인증서 파일(`*.pem`)은 Git에 커밋되지 않습니다
- 개발팀의 각 구성원은 개별적으로 mkcert 설정을 진행해야 합니다
- 인증서는 3개월마다 갱신하는 것을 권장합니다 