#!/bin/bash

# SSL 인증서 생성 스크립트
# 개발/테스트 환경용 자체 서명 인증서 생성

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 SSL 인증서 생성 중...${NC}"

# 프로젝트 루트로 이동
cd "$(dirname "$0")/../.."

# SSL 디렉토리 생성
mkdir -p ssl

# 개발용 자체 서명 인증서 생성
if command -v mkcert &> /dev/null; then
    echo -e "${GREEN}✅ mkcert를 사용하여 인증서 생성${NC}"
    
    # mkcert로 인증서 생성
    cd ssl
    mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost 127.0.0.1 ::1
    cd ..
    
    echo -e "${GREEN}✅ mkcert 인증서 생성 완료${NC}"
    
elif command -v openssl &> /dev/null; then
    echo -e "${YELLOW}⚠️  OpenSSL을 사용하여 자체 서명 인증서 생성 (브라우저 경고 발생 가능)${NC}"
    
    # OpenSSL로 자체 서명 인증서 생성
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/localhost-key.pem \
        -out ssl/localhost.pem \
        -subj "/C=KR/ST=Seoul/L=Seoul/O=PromptCenter/OU=Development/CN=localhost" \
        -extensions v3_req \
        -config <(cat <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF
)
    
    echo -e "${GREEN}✅ OpenSSL 자체 서명 인증서 생성 완료${NC}"
    
else
    echo -e "${RED}❌ mkcert 또는 openssl이 설치되어 있지 않습니다.${NC}"
    echo "다음 중 하나를 설치해주세요:"
    echo "  - mkcert (권장): brew install mkcert"
    echo "  - openssl: 일반적으로 시스템에 기본 설치됨"
    exit 1
fi

# 파일 권한 설정
chmod 600 ssl/localhost-key.pem
chmod 644 ssl/localhost.pem

echo -e "${GREEN}🎉 SSL 인증서 생성 완료!${NC}"
echo "📁 인증서 위치:"
echo "  - 개인키: ssl/localhost-key.pem"
echo "  - 인증서: ssl/localhost.pem"
echo ""
echo "🚀 이제 HTTPS로 배포할 수 있습니다:"
echo "  npm run deploy:standalone:https" 