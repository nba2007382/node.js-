import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Unprice } from 'libs/db/models/house/unprice.model';
import { InjectModel } from 'nestjs-typegoose';
import { lastValueFrom } from 'rxjs';
import cheerio from 'cheerio'
import dayjs from 'dayjs';
import { Monito_BeiKe } from 'libs/db/models/monito/BeiKe.model';

@Injectable()
export class BeiKeService {
  constructor (private readonly axios: HttpService,
    @InjectModel(Unprice) private readonly beike_Unprice: ReturnModelType<typeof Unprice>,
    @InjectModel(Monito_BeiKe) private readonly monito_BeiKe: ReturnModelType<typeof Monito_BeiKe>
    ) {}
  
  async getShowList () {
    const list = await this.monito_BeiKe.aggregate([{ $sample: { size: 4 } }]);
    return list;
  }  

  async getMonitorHouse (monitoId: string) {
    const data = await this.monito_BeiKe.findOne({ id: monitoId });
    return data;
  }

  async getMonitorList (accountEmail: string) {
    const list = await this.monito_BeiKe.find({ from: accountEmail });
    return list;
  }
  
  async createMonitoBeiKe (monitoUrl: string, monitoId: string, accountEmail: string) {
    const res = await lastValueFrom(
      this.axios.get(monitoUrl)
    );
    const html = res.data + '';
    const data = [];
    const $ = cheerio.load(html)
    $('.sellDetailPage').each(function() {
      const title = $('.title .main', this).attr('title')
      const href = monitoUrl //跳转房屋信息链接
      const img = $($('.smallpic li', this)[0]).attr('data-src') //展示图片
      const price = parseInt($('.content .price .total', this).text())
      const from = [accountEmail]
      const time = dayjs(new Date()).format('YYYY-MM-DD')
      data.push({ id: monitoId, title, href, img, price, from, time })
    });
    await this.monito_BeiKe.insertMany(data);
    console.log(`用户：${accountEmail}贝壳监控: ${monitoUrl}创建成功`);
  }

  async delMonitoBeiKe (monitoId: string, accountEmail: string) {
    const data = await this.monito_BeiKe.find({ id: monitoId, from: accountEmail });
    const length = data[0].from.length;
    if (length === 1) {
      await this.monito_BeiKe.deleteMany({ id: monitoId, from: accountEmail });
    } else {
      await this.monito_BeiKe.updateOne({ id: monitoId }, { $pull: { from: { $in: [accountEmail] } } });
    };
  }

  // async updataMonitoBeiKe () {

  // }

  async getChartList () {
    const chart1 = await this.beike_Unprice.aggregate([{ $sort: { 'create_time': -1 } }, { $limit: 3 }, { $sort: { 'name': -1 } }, {
      $group: { _id: 0, name: { $push: '$name' }, unprice: { $push: '$untiprice' } }
    }]);
    const chart2 = await this.beike_Unprice.aggregate([{ $sort: { "create_time": 1 } }, { $limit: 21 }, { $sort: { 'name': -1 } }, {
      $group: { _id: '$name', unprice: { $push: '$untiprice' }, time: { $push: '$create_time' } }
    }, {
      $project: {
        name: '$_id',
        time: '$time',
        unprice: "$unprice",
        _id: 0
      }
    }]);
    return {
      chart1,
      chart2
    };
  }
  
}
