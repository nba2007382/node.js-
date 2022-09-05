import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { BeiKeController } from './beiKe.controller';
import { BeiKeService } from './beiKe.service';


@Module({
  imports: [HttpModule],
  controllers: [BeiKeController],
  providers: [BeiKeService]
})
export class HouseModule {}
