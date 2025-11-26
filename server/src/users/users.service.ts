import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Provider } from '@prisma/client';

@Injectable()
export class UsersService {
    // PrismaService를 주입받아 DB에 접근할 수 있게 합니다.
    constructor(private prisma: PrismaService) { }

    /**
     * 이메일로 사용자를 조회합니다.
     * @param email 조회할 이메일
     */
    async findByEmail(email: string): Promise<User | null> {
        // prisma.user.findUnique: user 테이블에서 유니크한 값(email)으로 찾기
        return this.prisma.user.findUnique({ where: { email } });
    }

    /**
     * 새로운 사용자를 생성합니다.
     * @param data 사용자 생성 정보
     */
    async create(data: {
        email: string;
        name: string;
        provider: Provider;
        snsId: string;
    }): Promise<User> {
        // prisma.user.create: user 테이블에 데이터 삽입
        return this.prisma.user.create({ data });
    }

    /**
     * 사용자를 찾고, 없으면 생성합니다. (소셜 로그인용)
     */
    async findOrCreate(data: {
        email: string;
        name: string;
        provider: Provider;
        snsId: string;
    }): Promise<User> {
        // 1. 먼저 이메일로 사용자가 있는지 확인
        const user = await this.findByEmail(data.email);

        // 2. 있으면 그 사용자 반환
        if (user) {
            return user;
        }

        // 3. 없으면 새로 생성해서 반환
        return this.create(data);
    }
}
