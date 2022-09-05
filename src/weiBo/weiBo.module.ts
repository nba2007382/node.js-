import { CookieService } from '@lib/cookie/cookie.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WeiBoController } from './weiBo.controller';
import { WeiBoService } from './weiBo.service';

@Module({
  imports: [CookieService, HttpModule],
  controllers: [WeiBoController],
  providers: [WeiBoService]
})
export class WeiBoModule {}
