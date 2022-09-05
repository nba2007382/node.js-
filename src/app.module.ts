import { DbModule } from '@libs/db';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HouseModule } from './beiKe/beiKe.module';
import { JdModule } from './jd/jd.module';
import { WeiBoModule } from './weiBo/weiBo.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    HouseModule,
    JdModule,
    WeiBoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
