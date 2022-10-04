import { CacheModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const PORT = configService.get('REDIS_PORT');
        const REDISHOST = configService.get('REDIS_HOST');
        return {
          store: redisStore,
          host: REDISHOST,
          port: PORT,
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
