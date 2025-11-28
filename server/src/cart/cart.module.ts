import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule], // AuthGuard 사용을 위해 AuthModule 임포트
    controllers: [CartController],
    providers: [CartService],
})
export class CartModule { }
