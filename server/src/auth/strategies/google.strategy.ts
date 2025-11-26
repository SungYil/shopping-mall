import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
// PassportStrategy를 상속받아 'google' 전략을 정의합니다.
// AuthGuard('google')이 실행될 때 이 클래스가 사용됩니다.
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        // 부모 클래스(PassportStrategy)에 설정값을 전달합니다.
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),     // 구글 클라우드 콘솔 ID
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'), // 구글 클라우드 콘솔 Secret
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),   // 로그인 후 돌아올 주소
            scope: ['email', 'profile'], // 요청할 사용자 정보 범위
        } as StrategyOptions);
    }

    /**
     * 구글 로그인이 성공하면 호출되는 메서드
     * @param accessToken 구글 API 접근 토큰
     * @param refreshToken 구글 API 갱신 토큰
     * @param profile 구글에서 받은 사용자 프로필 정보
     * @param done Passport 콜백 함수
     */
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;

        // 우리 서비스에서 사용할 형태로 사용자 정보를 정리합니다.
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
            provider: 'GOOGLE',
            snsId: profile.id,
        };

        // done(에러, 사용자객체)를 호출하면 req.user에 저장됩니다.
        done(null, user);
    }
}
