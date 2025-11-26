import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import { ConfigService } from '@nestjs/config';

@Injectable()
// PassportStrategy를 상속받아 'naver' 전략을 정의합니다.
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>('NAVER_CLIENT_ID'),
            clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
            callbackURL: configService.get<string>('NAVER_CALLBACK_URL'),
        });
    }

    /**
     * 네이버 로그인 성공 시 호출
     */
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ): Promise<any> {
        // 네이버 프로필 구조에 맞춰서 데이터 추출
        const user = {
            email: profile.email,
            // 네이버는 name 또는 nickname을 줍니다.
            name: profile.name || profile.nickname,
            provider: 'NAVER',
            snsId: profile.id,
        };

        // req.user에 저장
        done(null, user);
    }
}
