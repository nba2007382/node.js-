import { Controller, Delete, Get, HttpCode, HttpStatus, Injectable, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DbService } from 'libs/db/src/db.service'
import { GetCurrentEmail, Public } from 'libs/decorators';
import { BeiKeService } from './beiKe.service';
@ApiTags('贝壳')
@Injectable()
@Controller('house')
export class BeiKeController {
  constructor(
    private readonly beiKeService: BeiKeService
    ) {

  }

  @Get('monitorInfo')
  async getMonitorHouse(@Param('id') id: string) {
    return await this.beiKeService.getMonitorHouse(id)
  }

  @Public()
  @Get('chart')
  async getChart() {
    return await this.beiKeService.getChartList();
  }

  @Public()
  @Get('showList')
  async getShowList() {
    return await this.beiKeService.getShowList();
  }

  @Get('list')
  async getMonitorList(@GetCurrentEmail() email: string) {
    return await this.beiKeService.getMonitorList(email)
  }

  @HttpCode(HttpStatus.CREATED)
  @Get('add')
  async addMonito(@Param('url') url: string, @GetCurrentEmail() email: string) {
    const pattern = /[a-z]+\d+/; //从url中筛选出—id
    const monitoId = '' + pattern.exec(url)[0];
    await this.beiKeService.createMonitoBeiKe(url, monitoId, email);
    return {
      msg: '创建成功'
    };
  }

  @Delete('del')
  async delMonito (@Param('id') id: string, @GetCurrentEmail() email: string) {
    await this.beiKeService.delMonitoBeiKe(id, email);
    return {
      msg: '删除成功'
    }
  }
}
