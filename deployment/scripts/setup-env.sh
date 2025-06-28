#!/bin/bash

# 환경변수 설정 도우미 스크립트
set -e

echo "🔧 Prompt Center UI - 환경변수 설정 도우미"

# 스크립트 디렉토리로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$PROJECT_ROOT"

# 환경 선택
echo ""
echo "설정할 환경을 선택하세요:"
echo "1) 개발 환경 (.env.development)"
echo "2) 운영 환경 (.env.production)"
echo "3) 로컬 환경 (.env.local)"

read -p "선택 (1-3): " env_choice

case $env_choice in
    1)
        ENV_FILE=".env.development"
        ENV_NAME="개발"
        DEFAULT_API_URL="http://localhost:8080/api"
        DEFAULT_APP_NAME="Prompt Center (Dev)"
        ;;
    2)
        ENV_FILE=".env.production"
        ENV_NAME="운영"
        DEFAULT_API_URL="http://localhost/api"
        DEFAULT_APP_NAME="Prompt Center"
        ;;
    3)
        ENV_FILE=".env.local"
        ENV_NAME="로컬"
        DEFAULT_API_URL="http://localhost:8080/api"
        DEFAULT_APP_NAME="Prompt Center (Local)"
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac

echo ""
echo "📝 $ENV_NAME 환경 설정을 시작합니다..."

# 기존 파일 백업
if [ -f "$ENV_FILE" ]; then
    echo "⚠️ 기존 $ENV_FILE 파일이 존재합니다."
    read -p "덮어쓰시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 설정을 취소합니다."
        exit 1
    fi
    cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo "기존 파일을 백업했습니다: $ENV_FILE.backup.*"
fi

# 환경변수 입력받기
echo ""
echo "🔧 환경변수를 입력하세요 (Enter키로 기본값 사용):"

read -p "API URL [$DEFAULT_API_URL]: " API_URL
API_URL=${API_URL:-$DEFAULT_API_URL}

read -p "앱 이름 [$DEFAULT_APP_NAME]: " APP_NAME
APP_NAME=${APP_NAME:-$DEFAULT_APP_NAME}

read -p "앱 버전 [1.0.0]: " APP_VERSION
APP_VERSION=${APP_VERSION:-1.0.0}

# 배포 설정
if [ "$env_choice" == "1" ]; then
    DEFAULT_FRONTEND_URL="http://localhost:3000"
    DEFAULT_BACKEND_INTEGRATED="false"
elif [ "$env_choice" == "2" ]; then
    DEFAULT_FRONTEND_URL="https://localhost:3443"
    DEFAULT_BACKEND_INTEGRATED="false"
else
    DEFAULT_FRONTEND_URL="http://localhost:3000"
    DEFAULT_BACKEND_INTEGRATED="false"
fi

read -p "프론트엔드 URL [$DEFAULT_FRONTEND_URL]: " FRONTEND_URL
FRONTEND_URL=${FRONTEND_URL:-$DEFAULT_FRONTEND_URL}

echo ""
echo "배포 방식을 선택하세요:"
echo "1) 독립 배포 (Next.js가 직접 API 프록시)"
echo "2) 백엔드 통합 배포 (nginx가 프록시 처리)"
read -p "선택 (1-2) [1]: " deploy_choice
deploy_choice=${deploy_choice:-1}

if [ "$deploy_choice" == "2" ]; then
    BACKEND_INTEGRATED="true"
    echo "ℹ️ 백엔드 통합 배포: nginx가 API 프록시를 처리합니다."
else
    BACKEND_INTEGRATED="false"
    echo "ℹ️ 독립 배포: Next.js가 직접 백엔드로 API 요청을 프록시합니다."
fi

if [ "$env_choice" == "1" ]; then
    read -p "디버그 모드 (true/false) [true]: " DEBUG_MODE
    DEBUG_MODE=${DEBUG_MODE:-true}
fi

if [ "$env_choice" == "2" ]; then
    read -p "보안 쿠키 사용 (true/false) [true]: " SECURE_COOKIE
    SECURE_COOKIE=${SECURE_COOKIE:-true}
fi

# 환경변수 파일 생성
echo ""
echo "📄 $ENV_FILE 파일을 생성하는 중..."

cat > "$ENV_FILE" << EOF
# $ENV_NAME 환경 설정
# 생성일: $(date)

# 환경 설정
NODE_ENV=$([ "$env_choice" == "2" ] && echo "production" || echo "development")

# API 설정
NEXT_PUBLIC_API_URL=$API_URL

# 앱 정보
NEXT_PUBLIC_APP_NAME=$APP_NAME
NEXT_PUBLIC_APP_VERSION=$APP_VERSION

# 배포 설정
NEXT_PUBLIC_FRONTEND_URL=$FRONTEND_URL
NEXT_PUBLIC_BACKEND_INTEGRATED=$BACKEND_INTEGRATED

EOF

# 추가 설정 (환경별)
if [ "$env_choice" == "1" ]; then
    cat >> "$ENV_FILE" << EOF
# 개발 도구
NEXT_PUBLIC_DEBUG=$DEBUG_MODE

# 포트 설정 (개발 환경)
PORT=3000

EOF
elif [ "$env_choice" == "2" ]; then
    cat >> "$ENV_FILE" << EOF
# 보안 설정
NEXT_PUBLIC_SECURE_COOKIE=$SECURE_COOKIE

# 포트 설정 (운영 환경)
PORT=3000
HTTPS_PORT=3443

EOF
else
    cat >> "$ENV_FILE" << EOF
# 로컬 개발 설정
NEXT_PUBLIC_DEBUG=true
PORT=3000

EOF
fi

# 공통 설정 추가
cat >> "$ENV_FILE" << EOF
# 기타 설정
# NEXT_PUBLIC_ANALYTICS_ID=
# NEXT_PUBLIC_SENTRY_DSN=
# DATABASE_URL=
EOF

echo "✅ $ENV_FILE 파일이 생성되었습니다!"

# 파일 내용 확인
echo ""
echo "📋 생성된 환경변수 파일 내용:"
echo "----------------------------------------"
cat "$ENV_FILE"
echo "----------------------------------------"

# .gitignore 확인
echo ""
if ! grep -q "$ENV_FILE" .gitignore 2>/dev/null; then
    echo "⚠️ .gitignore에 $ENV_FILE을 추가하는 것을 권장합니다."
    read -p ".gitignore에 추가하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "$ENV_FILE" >> .gitignore
        echo "✅ .gitignore에 $ENV_FILE을 추가했습니다."
    fi
fi

# 환경 테스트 제안
echo ""
echo "🧪 환경 테스트 명령어:"
if [ "$env_choice" == "1" ]; then
    echo "  npm run dev"
elif [ "$env_choice" == "2" ]; then
    echo "  npm run build"
    echo "  npm run start"
else
    echo "  npm run dev"
fi

echo ""
echo "🎉 환경변수 설정이 완료되었습니다!"
echo ""
echo "📚 추가 정보:"
echo "  - 환경변수 수정: $ENV_FILE 파일을 직접 편집"
echo "  - 백엔드 연동: NEXT_PUBLIC_API_URL 확인"
echo "  - 보안: 민감한 정보는 환경변수로만 관리" 