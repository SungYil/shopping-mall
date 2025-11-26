# AWS EC2 배포 가이드 (Amazon Linux 2023)

## 3. Node.js 설치 (NVM 사용 권장)
(생략)

## 8. PM2 설정 저장 및 업데이트 (중요)
Node.js 버전을 업데이트했다면, PM2가 사용하는 Node 버전도 업데이트해야 합니다.

```bash
# 1. 기존 프로세스 삭제
pm2 delete all

# 2. PM2 업데이트 (현재 Node 버전 적용)
pm2 update

# 3. 서버 재시작 (빌드 다시 필요할 수 있음)
cd server
npm run build
pm2 start dist/main.js --name server

# 4. 클라이언트 재시작
cd ../client
pm2 start npm --name client -- start
```
