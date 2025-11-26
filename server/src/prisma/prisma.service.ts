import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// PrismaClient를 상속받아서 NestJS 서비스로 만듭니다.
// OnModuleInit: 모듈이 초기화될 때 실행되는 라이프사이클 훅
export class PrismaService extends PrismaClient implements OnModuleInit {
    /**
     * 모듈이 초기화될 때 DB에 연결합니다.
     */
    async onModuleInit() {
        await this.$connect();
    }
}
