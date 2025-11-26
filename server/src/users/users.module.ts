import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // AuthModule에서 사용하기 위해 내보내기 필수
})
export class UsersModule { }
