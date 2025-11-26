import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Provider } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        // 의존성 주입 (Dependency Injection)
        // UsersService: 사용자 DB 처리를 위해 주입
        // JwtService: JWT 토큰 생성을 위해 주입
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * OAuth 로그인 성공 시 호출되는 메서드
     * @param profile 소셜 로그인 프로필 정보 (이메일, 이름, ID 등)
     * @param provider 로그인 제공자 (GOOGLE, NAVER)
     */
    async validateOAuthLogin(profile: any, provider: Provider): Promise<any> {
        try {
            // 1. DB에서 사용자를 찾거나, 없으면 새로 생성합니다.
            // findOrCreate 메서드는 UsersService에 구현되어 있습니다.
            const user = await this.usersService.findOrCreate({
                email: profile.email,
                name: `${profile.firstName} ${profile.lastName}`.trim(), // 이름 공백 제거
                provider,
                snsId: profile.snsId,
            });

            // 2. 사용자 정보를 바탕으로 JWT 토큰을 발급합니다.
            return this.login(user);
        } catch (error) {
            console.error('Login Error:', error);
            throw new InternalServerErrorException('로그인 처리에 실패했습니다.');
        }
    }

    /**
     * 사용자 정보를 받아 JWT 토큰을 생성하는 메서드
     * @param user 사용자 객체
     */
    async login(user: any) {
        // 토큰에 담을 정보 (Payload)
        // sub: Subject (주체), 보통 사용자 ID를 넣습니다.
        const payload = { email: user.email, sub: user.id, role: user.role };

        return {
            // jwtService.sign()이 payload를 암호화하여 문자열 토큰을 만듭니다.
            access_token: this.jwtService.sign(payload),
        };
    }
}
