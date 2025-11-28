import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Google 로그인 엔드포인트
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) { }

    // Google 로그인 콜백
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {
        const { access_token } = await this.authService.validateOAuthLogin(req.user, 'GOOGLE');
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${access_token}`);
    }

    // Naver 로그인 엔드포인트
    @Get('naver')
    @UseGuards(AuthGuard('naver'))
    async naverAuth(@Req() req) { }

    // Naver 로그인 콜백
    @Get('naver/callback')
    @UseGuards(AuthGuard('naver'))
    async naverAuthRedirect(@Req() req, @Res() res) {
        const { access_token } = await this.authService.validateOAuthLogin(req.user, 'NAVER');
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${access_token}`);
    }
}
