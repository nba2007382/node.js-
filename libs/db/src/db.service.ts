import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import cheerio from 'cheerio'
import * as dayjs from 'dayjs'
import puppeteer from 'puppeteer';
import { InjectModel } from 'nestjs-typegoose';
import { lastValueFrom } from 'rxjs';
import { House } from '../models/house/house.model';
import { Unprice } from '../models/house/unprice.model'
import { BeiKe } from '../models/monito/BeiKe.model';
import { JD } from '../models/monito/JD.model';
import { CookieService } from '@lib/cookie';
import { WeiBo } from '../models/monito/WeiBo.model';
@Injectable()
export class DbService {
  constructor(
    private readonly axios: HttpService,
    private readonly cookieService: CookieService,
    @InjectModel(House) private readonly house: ReturnModelType<typeof House>,
    @InjectModel(Unprice) private readonly unprice: ReturnModelType<typeof Unprice>,
    @InjectModel(BeiKe) private readonly monito_BeiKe: ReturnModelType<typeof BeiKe>,
    @InjectModel(JD) private readonly monito_JD: ReturnModelType<typeof JD>,
    @InjectModel(WeiBo) private readonly monito_WeiBo: ReturnModelType<typeof WeiBo>
    ) {

    }
  
  async monito_WeiBoUpdata () {
    console.log('WB更新');
    const data = await this.monito_WeiBo.find({})
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      const url = el.url
      const email=el.from
      const pattern = /(?<=https:[/][/]weibo.com[/]u[/])\d+/
      const id = pattern.exec(url)
      let page = 1
      for (let i = 0; i < page; i++) {
        const updataUrl = 'https://weibo.com/ajax/statuses/mymblog?uid=' + id + '&page=' + page + '&feature=0'
        await updataWB(updataUrl, email, url, this.cookieService, this.axios, this.monito_WeiBo).then(res => {
          if (res == 1) {
            page = page + 1;
          };
        });
      };
    };
    console.log('微博更新完毕');
    
    async function updataWB(
      updataUrl:string,
      email:string [],
      homeUrl:string,
      cookieService: CookieService,
      axios: HttpService,
      monito_WeiBo: ReturnModelType<typeof WeiBo>) 
      { 
        let cookieData = await cookieService.getcookie();
        cookieData = cookieData.data.sub ? cookieData : await cookieService.getcookie();
        const cookie = `SUB=${cookieData.data.sub};SUBP=${cookieData.data.subp}`;
        const res = await lastValueFrom(
          axios.get(updataUrl, {
            headers: {
              Cookie: cookie
            }
          })
        );
        const html = res.data + '';
        const data = JSON.parse(html);
        const { list } = data.data;
        if (list.length !== 0) {
          for (let i = 0; i < list.length; i++) {
            const el = list[i];
            el.from = email;
            el.url = homeUrl;
            list[i] = el;
          };
          await monito_WeiBo.insertMany(list, { ordered:false });
          return 1;
        } else {
          return 0;
        };
      };
  }  

  async monito_JdUpdata () {
    const data = await this.monito_JD.find({});
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      const url = el.href;
      const brower = await puppeteer.launch({
        headless: true
      });
      var page = await brower.newPage();
      await page.goto(url);
      await updataInfo();
      brower.close();
      console.log('JD更新成功');
      async function updataInfo() {
        const price = await page.$eval('.itemInfo-wrap  .summary-price-wrap .summary-price.J-summary-price .dd .p-price .price', el => el.innerHTML);
        const label = await page.$eval('.summary-price.J-summary-price .dt', el => el.innerHTML);
        const time = dayjs(new Date()).format('YYYY-MM-DD');
        await this.monito_JD.updateMany({ id: el.id }, { $push: { price, time }, $set: { label } });
      };
    };
  }

  async monito_BeiKeUpdata () {
    const data = await this.monito_BeiKe.find({});
    console.log('贝壳监控更新');
    data.forEach(async(el: {id: string, href: string }) => {
      const url = el.href;
      const res = await lastValueFrom(
        this.axios.get(url)
      );
      let html = res.data + ''
      const $ = cheerio.load(html);
      $('.sellDetailPage').each(async function() {
        const price = parseInt($('.content .price .total', this).text())
        const time = dayjs(new Date()).format('YYYY-MM-DD')
        await this.monito_BeiKe.updateMany({ id: el.id }, { $push: { price, time } })
      });
    });
    console.log('贝壳监控更新完毕');
  }

  async unpricehouse () {
    console.log('正在更新贝壳均价');
    const houseList = await this.house.aggregate([{
      $group: {
        _id: "$name",
        untiprice: { $avg: "$untiprice" }
      }
    }, {
      $project: {
        _id: 0,
        name: "$_id",
        untiprice: "$untiprice",
        create_time: dayjs(new Date()).format('YYYYMMDD')
      }
    }]);
    await this.unprice.insertMany(houseList);
    console.log('正在更新贝壳均价完毕');
  }

  async houseAllUpdata() {
    console.log('更新贝壳列表');
    const type = ['xiangzhouqu', 'jinwanqu', 'doumenqu'];
    let allFilms = [];
    for (let j = 0; j < type.length; j++) {
      const County = type[j];
      const stopNum = 101;
      for (let i = 1; i < stopNum; i++) {
        let url = 'https://zh.ke.com/ershoufang/' + County + '/pg' + i + 'co42/';
        await new Promise((resolve) => {
          setTimeout(async() => {
            console.log(url);            
            console.log('第'+i+'页===============================================================');
            const res = await lastValueFrom(
              this.axios.get(url)
            );
            console.log(res.data);         
            let html = res.data + '';
            const $ = cheerio.load(html);
            $('.sellListContent .clear').each(function() {
              if ($('.VIEWDATA .lj-lazy', this).attr('data-original') !== undefined) {
                let pattern = /housedel_id=\d+/;
                let num = /\D+/
                let housedel_id;
                eval(pattern.exec($('.info .title a', this).attr('data-action'))[0]) //housedel_id
                const name = County == 'xiangzhouqu' ? '香洲区' : County == 'jinwanqu' ? '金湾区' : '斗门区'
                const title = $('.info .title a', this).attr('title')
                const href = $('.info .title a', this).attr('href') //跳转房屋信息链接
                const img = $('.VIEWDATA .lj-lazy', this).attr('data-original') //展示图片
                const position = $('.info .address .positionInfo a', this).text() //房子位置
                const houseIcon = $('.info .address .houseInfo ', this).text() //房屋简要信息
                const price = parseInt($('.info .address .priceInfo .totalPrice span', this).text())
                const up = $('.info .address .priceInfo .unitPrice span', this).text()
                const untiprice = parseInt(up.replace(num, '').replace(num, '')) //均价
                allFilms.push({ housedel_id, name, title, href, img, position, houseIcon, price, untiprice })
                resolve(1)
              };
            });
          },500);
        });
      };
    };
    for (let i = 0; i < allFilms.length; i++) {
      const el = allFilms[i];
      await this.house.updateMany({ housedel_id: el.housedel_id }, { name: el.name, title: el.title, href: el.href, img: el.img, position: el.position, houseIcon: el.houseIcon, price: el.price, untiprice: el.untiprice }, {
          upsert: true
      });
    };
    console.log('更新贝壳列表完毕');
  }
}
