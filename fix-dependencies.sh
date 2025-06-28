#!/bin/bash

# Prompth Center Frontend - 의존성 및 설정 수정 스크립트
# 사용법: ./fix-dependencies.sh

set -e

echo "🔧 프론트엔드 의존성 및 설정을 수정합니다..."

# 1. package-lock.json 및 node_modules 삭제
echo "📦 기존 의존성 파일 정리 중..."
rm -f package-lock.json
rm -rf node_modules
rm -rf .next

# 2. npm 캐시 정리
echo "🧹 npm 캐시 정리 중..."
npm cache clean --force

# 3. 의존성 재설치
echo "⬇️ 의존성 재설치 중..."
npm install

# 4. 타입 검사
echo "🔍 TypeScript 타입 검사 중..."
npm run type-check

# 5. 로컬 빌드 테스트
echo "🏗️ 로컬 빌드 테스트 중..."
npm run build

echo "✅ 의존성 및 설정 수정이 완료되었습니다!"
echo ""
echo "🚀 이제 다음 명령어로 배포를 재시도하세요:"
echo "   ./deploy/scripts/deploy.sh https dev"
echo ""
echo "📋 변경사항:"
echo "   • Tailwind CSS 의존성을 dependencies로 이동"
echo "   • Dockerfile에서 빌드 시 모든 의존성 설치"
echo "   • 로컬 빌드 테스트 완료"
