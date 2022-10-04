import { RedisModule } from '@lib/redis';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [forwardRef(() => AuthModule), EmailModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
