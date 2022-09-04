import { Controller, Get, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DbService } from 'libs/db/src/db.service'
@ApiTags('贝壳')
@Injectable()
@Controller('house')
export class HouseController {
  constructor( private readonly Db: DbService) {

  }


  @Get('updataHouse')
  updataHouse() {
    console.log('----------------------------');
    
    this.Db.monito_BeiKeUpdata()
  }
}
