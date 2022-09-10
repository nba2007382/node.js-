import { Controller, Get } from '@nestjs/common';
import { WeiBoService } from './weiBo.service';

@Controller('weiBo')
export class WeiBoController {
  constructor(private readonly weiBoService: WeiBoService) {

  };

  @Get('list')
  findList (accountEmail: string) {
    return this.weiBoService.getMonitorWeiBoList(accountEmail);
  }
}
