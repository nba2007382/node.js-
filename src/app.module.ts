import { DbModule } from '@libs/db';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HouseModule } from './house/house.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    HouseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
