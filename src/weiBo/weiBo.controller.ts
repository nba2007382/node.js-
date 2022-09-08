import { Controller } from '@nestjs/common';
import { WeiBoService } from './weiBo.service';

@Controller('weiBo')
export class WeiBoController {
  constructor(private readonly weiBoService: WeiBoService) {

  };

  @Get('list')
  findList () {
    return this.weiBoService.getMonitorWeiBoList();
  }
}
