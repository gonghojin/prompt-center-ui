# Node.js 공식 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사 (SSL 인증서 파일 포함)
COPY . .

# 포트 노출 (HTTPS)
EXPOSE 3000

# HTTPS 개발 서버 시작
CMD ["npm", "run", "dev:custom-https"] 