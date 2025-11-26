import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
    async googleAuthRedirect(@Req() req) {
        return this.authService.validateOAuthLogin(req.user, 'GOOGLE');
    }

    // Naver 로그인 엔드포인트
    @Get('naver')
    @UseGuards(AuthGuard('naver'))
    async naverAuth(@Req() req) { }

    // Naver 로그인 콜백
    @Get('naver/callback')
    @UseGuards(AuthGuard('naver'))
    async naverAuthRedirect(@Req() req) {
        return this.authService.validateOAuthLogin(req.user, 'NAVER');
    }
}
