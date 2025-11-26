import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global(): 이 모듈을 전역 모듈로 만듭니다.
// 다른 모듈에서 imports: [PrismaModule]을 하지 않아도 PrismaService를 사용할 수 있습니다.
@Global()
@Module({
  providers: [PrismaService], // 이 모듈이 생성하는 서비스
  exports: [PrismaService],   // 다른 모듈이 사용할 수 있게 내보내는 서비스
})
export class PrismaModule { }
