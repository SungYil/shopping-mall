import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Provider } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateOAuthLogin(profile: any, provider: Provider): Promise<any> {
        try {
            const user = await this.usersService.findOrCreate({
                email: profile.email,
                name: `${profile.firstName} ${profile.lastName}`,
                provider,
                snsId: profile.snsId,
            });
            return this.login(user);
        } catch (error) {
            throw new InternalServerErrorException('Login failed');
        }
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
