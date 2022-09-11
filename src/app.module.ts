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
import { TaskService } from './task/task.service';
import { TaskModule } from './task/task.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DbModule,
    UsersModule,
    HouseModule,
    JdModule,
    WeiBoModule,
    AuthModule,
    ScheduleModule.forRoot(),
    TaskModule,
    EmailModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AtGuard
  }, TaskService],
})
export class AppModule {}
