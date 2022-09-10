import { CookieModule } from '@lib/cookie';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WeiBoController } from './weiBo.controller';
import { WeiBoService } from './weiBo.service';

@Module({
  imports: [CookieModule, HttpModule],
  controllers: [WeiBoController],
  providers: [WeiBoService]
})
export class WeiBoModule {}
