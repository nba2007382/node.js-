import { DbModule } from '@libs/db';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HouseModule } from './beiKe/beiKe.module';
import { JdModule } from './jd/jd.module';
import { WeiBoModule } from './weiBo/weiBo.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    DbModule,
    UsersModule,
    HouseModule,
    JdModule,
    WeiBoModule,
    AuthModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AtGuard
  }],
})
export class AppModule {}
