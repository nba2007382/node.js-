import { RedisModule } from '@lib/redis';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import {
  RtStrategy,
  AtStrategy,
  RegStrategy,
  LocalStrategy,
} from './strategies';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({}),
    RedisModule,
  ],
  providers: [AuthService, LocalStrategy, RtStrategy, AtStrategy, RegStrategy],
  exports: [AuthService],
})
export class AuthModule {}
