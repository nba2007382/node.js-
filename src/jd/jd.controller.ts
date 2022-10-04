import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { GetCurrentEmail } from 'libs/decorators';
import { JdService } from './jd.service';

@Controller('jd')
export class JdController {
  constructor(private readonly jdService: JdService) {}

  @Get('goods')
  async getGoods(@Param('id') id: string) {
    return await this.jdService.getGoods(id);
  }

  @Get('list')
  async getMonitorList(@GetCurrentEmail() email: string) {
    return await this.jdService.getMonitorList(email);
  }

  @HttpCode(HttpStatus.CREATED)
  @Get('add')
  async addMonitor(
    @Param('url') url: string,
    @GetCurrentEmail() email: string,
  ) {
    const pattern = /(?<=https:[/][/]item.jd.com[/]).\d+/;
    const id = '' + pattern.exec(url)[0];
    await this.jdService.createtMonitoJd(url, id, email);
    return {
      msg: '监控成功',
    };
  }

  @Get('del')
  async delMonitor(@Param('id') id: string, @GetCurrentEmail() email: string) {
    await this.jdService.delMonitoJd(id, email);
    return {
      msg: '删除成功',
    };
  }
}
