# AWS EC2 배포 가이드 (Amazon Linux 2023)

이 가이드는 **Amazon Linux 2023** AMI를 기준으로 작성되었습니다.

## 1. 인스턴스 스펙 및 보안 설정
- **AMI**: Amazon Linux 2023 AMI
- **인스턴스 유형**: `t3.small` 이상 권장 (Node.js + Docker 실행 시 메모리 필요)
  - *최소 사양*: `t2.micro` (프리티어)도 가능하지만 빌드 시 메모리 부족이 발생할 수 있으므로, 로컬에서 빌드 후 업로드하거나 Swap 메모리 설정이 필요할 수 있습니다.
- **보안 그룹(Security Group) 설정**:
  - **Inbound 규칙 추가**:
    - SSH (22): 내 IP
    - HTTP (80): Anywhere (0.0.0.0/0)
    - HTTPS (443): Anywhere (0.0.0.0/0)
    - Custom TCP (3000): Anywhere (Client)
    - Custom TCP (4000): Anywhere (Server)

## 2. 서버 접속 및 기본 설정
터미널에서 SSH로 접속합니다. (기본 사용자: `ec2-user`)
```bash
ssh -i "keypair.pem" ec2-user@<EC2-Public-IP>
```

패키지 업데이트 및 필수 도구 설치:
```bash
sudo dnf update -y
sudo dnf install -y git curl
```

## 3. Node.js 설치 (v20)
Amazon Linux 2023에서는 `dnf`를 통해 Node.js를 설치할 수 있습니다.
```bash
sudo dnf install -y nodejs
node -v
# v18 이상인지 확인 (권장 v20)
```
*만약 특정 버전을 원한다면 nvm 사용을 권장합니다.*

## 4. Docker & Docker Compose 설치
```bash
# Docker 설치
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
# (권한 적용을 위해 로그아웃 후 다시 접속하거나 다음 명령어 실행)
newgrp docker

# Docker Compose 설치 (플러그인 방식)
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
docker compose version
```

## 5. 프로젝트 클론 및 설정
```bash
git clone <GITHUB_REPOSITORY_URL> shopping-mall
cd shopping-mall
```

### 데이터베이스 실행
```bash
# docker-compose.yml이 있는 루트 폴더에서 실행
docker compose up -d
```

## 6. 백엔드 (Server) 배포
```bash
cd server

# 의존성 설치
npm install

# 환경 변수 설정 (.env 생성)
nano .env
# 아래 내용 붙여넣기 (실제 값으로 변경)
# DATABASE_URL="postgresql://user:password@localhost:5432/shopping_mall?schema=public"
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_CALLBACK_URL=http://<EC2-Public-IP>:4000/auth/google/callback
# NAVER_CLIENT_ID=...
# NAVER_CLIENT_SECRET=...
# NAVER_CALLBACK_URL=http://<EC2-Public-IP>:4000/auth/naver/callback
# JWT_SECRET=...
# CLIENT_URL=http://<EC2-Public-IP>:3000

# Prisma 클라이언트 생성 및 마이그레이션
npx prisma generate
npx prisma migrate deploy

# 빌드 및 실행
npm run build
# 프로덕션 모드 실행 (PM2 사용 권장)
npm install -g pm2
pm2 start dist/main.js --name server
```

## 7. 프론트엔드 (Client) 배포
```bash
cd ../client

# 의존성 설치
npm install

# 환경 변수 설정 (.env.local 생성)
nano .env.local
# 아래 내용 붙여넣기
# NEXT_PUBLIC_API_URL=http://<EC2-Public-IP>:4000

# 빌드
npm run build

# 실행
pm2 start npm --name client -- start
```

## 8. PM2 설정 저장 (재부팅 시 자동 실행)
```bash
pm2 save
pm2 startup
# 출력되는 명령어를 복사해서 실행
```
