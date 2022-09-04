import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';

@Module({
  imports: [HttpModule],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
