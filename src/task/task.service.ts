import { DbService } from '@libs/db';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(private readonly dbService: DbService) {}

  @Cron('45 * 12 * * *')
  async douBan_movieUpdata() {
    await this.dbService.douBan_movieUpdata();
  }

  @Cron('45 * 12 * * *')
  async monito_WeiBoUpdata() {
    await this.dbService.monito_WeiBoUpdata();
  }

  @Cron('45 * 12 * * *')
  async monito_JdUpdata() {
    await this.dbService.monito_JdUpdata();
  }

  @Cron('45 * 12 * * *')
  async monito_BeiKeUpdata() {
    await this.dbService.monito_BeiKeUpdata();
  }

  @Cron('45 * 12 * * *')
  async beiKe_houseListUpdata() {
    await this.dbService.beiKe_houseListUpdata();
    await this.dbService.unpricehouse();
  }
}
