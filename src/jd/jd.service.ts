import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import dayjs from 'dayjs';
import { Monito_Jd } from 'libs/db/models/monito/Jd.model';
import { InjectModel } from 'nestjs-typegoose';
import puppeteer from 'puppeteer';
@Injectable()
export class JdService {
  constructor (@InjectModel(Monito_Jd) private readonly monito_Jd: ReturnModelType<typeof Monito_Jd>) {}

  async getGoods (monitoId: string) {
    const goods = await this.monito_Jd.findOne({ id: monitoId });
    return goods;
  }

  async getMonitorList (accountEmail: string) {
    const list = await this.monito_Jd.find({ from: accountEmail });
    return list;
  }

  async delMonitoJd (monitoId: string, accountEmail: string) {
    const data = await this.monito_Jd.find({ id: monitoId, from: accountEmail });
    const length = data[0].from.length;
    if (length === 1) {
        await this.monito_Jd.deleteMany({ id: monitoId, from: accountEmail });
    } else {
        await this.monito_Jd.updateOne({ id: monitoId }, { $pull: { from: { $in: [accountEmail] } } });
    }
  }

  async createtMonitoJd (monitoUrl: string, monitoId: string, accountEmail: string) {
    const brower = await puppeteer.launch({
      headless: true
    });
    const page = await brower.newPage();
    await page.goto(monitoUrl);
    const list = [];
    const price = await page.$eval('.itemInfo-wrap  .summary-price-wrap .summary-price.J-summary-price .dd .p-price .price', el => el.innerHTML);
    const label = await page.$eval('.summary-price.J-summary-price .dt', el => el.innerHTML);
    const img = await page.$eval('.product-intro .preview-wrap #preview #spec-n1 #spec-img', el => el.getAttribute('src'));
    const title = await page.$eval(' .w .product-intro.clearfix .itemInfo-wrap .sku-name', el => el.innerHTML);
    const from = accountEmail;
    const href = monitoUrl;
    const id = monitoId;
    const time = dayjs(new Date()).format('YYYY-MM-DD');
    list.push({ price, label, img, title, id, href, from, time });
    brower.close();
    await this.monito_Jd.insertMany(list);
  }
}
