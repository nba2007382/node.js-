import { Module } from '@nestjs/common';
import { HouseController } from './house.controller';

@Module({
  imports: [],
  controllers: [HouseController]
})
export class HouseModule {}
