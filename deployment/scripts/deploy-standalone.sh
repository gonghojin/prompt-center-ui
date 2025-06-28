#!/bin/bash

# 독립 배포 스크립트
# 프론트엔드만 독립적으로 배포

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 함수 정의
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 프로젝트 루트로 이동
cd "$(dirname "$0")/../.."

print_step "독립 배포를 시작합니다..."

# 1. 환경변수 파일 확인
print_step "환경변수 파일 확인 중..."
if [ ! -f ".env.production" ]; then
    print_warning ".env.production 파일이 없습니다. 생성하시겠습니까? (y/n)"
    read -p "선택: " create_env
    if [ "$create_env" = "y" ]; then
        ./deployment/scripts/setup-env.sh
    else
        print_error "환경변수 파일이 필요합니다."
        exit 1
    fi
fi
print_success "환경변수 파일 확인 완료"

# 2. SSL 인증서 확인
print_step "SSL 인증서 확인 중..."
if [ ! -d "ssl" ] || [ ! -f "ssl/localhost.pem" ]; then
    print_warning "SSL 인증서가 없습니다. 생성하시겠습니까? (y/n)"
    read -p "선택: " create_ssl
    if [ "$create_ssl" = "y" ]; then
        ./deployment/scripts/generate-ssl.sh
    else
        print_error "SSL 인증서가 필요합니다."
        exit 1
    fi
fi
print_success "SSL 인증서 확인 완료"

# 3. 기존 컨테이너 정리
print_step "기존 컨테이너 정리 중..."
docker-compose -f deployment/docker/https.yml down --remove-orphans 2>/dev/null || true
print_success "컨테이너 정리 완료"

# 4. 프론트엔드 빌드
print_step "프론트엔드 빌드 중..."
npm run build
print_success "빌드 완료"

# 5. Docker 이미지 빌드
print_step "Docker 이미지 빌드 중..."
docker-compose -f deployment/docker/https.yml build --no-cache
print_success "Docker 이미지 빌드 완료"

# 6. 서비스 시작
print_step "서비스 시작 중..."
docker-compose -f deployment/docker/https.yml up -d
print_success "서비스 시작 완료"

# 7. 헬스체크 대기
print_step "서비스 상태 확인 중..."
echo "서비스가 시작될 때까지 대기 중..."

for i in {1..30}; do
    if curl -k -f https://localhost:3443/api/health >/dev/null 2>&1; then
        print_success "서비스가 정상적으로 시작되었습니다!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        print_error "서비스 시작 시간이 초과되었습니다."
        echo "로그를 확인해보세요:"
        echo "docker-compose -f deployment/docker/https.yml logs"
        exit 1
    fi
    
    echo -n "."
    sleep 2
done

# 8. 배포 완료 정보
echo ""
echo "🎉 독립 HTTPS 배포가 완료되었습니다!"
echo ""
echo "📍 접속 정보:"
echo "  • 프론트엔드: https://localhost:3443"
echo "  • 헬스체크: https://localhost:3443/api/health"
echo ""
echo "📊 컨테이너 상태:"
docker-compose -f deployment/docker/https.yml ps
echo ""
echo "📝 유용한 명령어:"
echo "  • 로그 확인: docker-compose -f deployment/docker/https.yml logs -f"
echo "  • 서비스 중지: docker-compose -f deployment/docker/https.yml down"
echo "  • 서비스 재시작: docker-compose -f deployment/docker/https.yml restart"
echo ""
print_success "배포 완료!" 