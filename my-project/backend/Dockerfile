# Node.js 런타임 환경을 기반으로 하는 이미지 선택
FROM node:18-alpine

# 컨테이너 내 작업 디렉토리 설정
WORKDIR /usr/src/app

# 의존성 설치를 위해 package.json과 package-lock.json을 먼저 복사
# (파일이 변경되지 않았다면 이 레이어는 캐시됨)
COPY package*.json ./

# 프로덕션 의존성 설치
RUN npm install --production

# 애플리케이션 소스 코드 복사
COPY . .

# 앱이 수신할 포트 지정
# (nginx.conf의 proxy_pass에서 8000번 포트를 사용했으므로 일치시킴)
EXPOSE 5000

# 컨테이너 시작 시 실행할 명령어
CMD [ "node", "server.js" ]