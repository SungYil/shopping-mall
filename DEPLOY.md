# AWS EC2 배포 가이드 (Amazon Linux 2023)

## 3. Node.js 설치 (NVM 사용 권장)
Amazon Linux의 기본 패키지 관리자(dnf)로는 최신 Node.js 버전을 받기 어려울 수 있습니다. **NVM(Node Version Manager)**을 사용하여 v20 이상을 설치하세요.

```bash
# 1. NVM 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. 환경 변수 적용 (또는 터미널 재접속)
source ~/.bashrc

# 3. Node.js v20 설치 (Next.js 14+ 요구사항)
nvm install 20
nvm use 20
nvm alias default 20

# 4. 버전 확인
node -v
# v20.x.x 라고 나와야 합니다.
```

## 4. Docker & Docker Compose 설치
(이전과 동일)
