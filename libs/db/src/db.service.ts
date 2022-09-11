import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import cheerio from 'cheerio'
import * as dayjs from 'dayjs'
import puppeteer from 'puppeteer';
import { InjectModel } from 'nestjs-typegoose';
import { lastValueFrom } from 'rxjs';
import { BeiKe } from '../models/house/BeiKe.model';
import { Unprice } from '../models/house/unprice.model'
import { Monito_BeiKe } from '../models/monito/BeiKe.model';
import { Monito_Jd } from '../models/monito/Jd.model';
import { CookieService } from '@lib/cookie';
import { Monito_WeiBo } from '../models/monito/WeiBo.model';
import { Movie } from '../models/movie/movie.model';
@Injectable()
export class DbService {
  constructor(
    private readonly axios: HttpService,
    private readonly cookieService: CookieService,
    @InjectModel(BeiKe) private readonly beiKe: ReturnModelType<typeof BeiKe>,
    @InjectModel(Unprice) private readonly unprice: ReturnModelType<typeof Unprice>,
    @InjectModel(Monito_BeiKe) private readonly monito_BeiKe: ReturnModelType<typeof Monito_BeiKe>,
    @InjectModel(Monito_Jd) private readonly monito_Jd: ReturnModelType<typeof Monito_Jd>,
    @InjectModel(Monito_WeiBo) private readonly monito_WeiBo: ReturnModelType<typeof Monito_WeiBo>,
    @InjectModel( Movie) private readonly DouBan: ReturnModelType<typeof Movie>
    ) {

    }
  
  async douBan_movieUpdata () {
    console.log('豆瓣开始更新');
    const type = ['欧美', '美国', '日本'];
    let allFilms = [];
    for (let i = 0; i < type.length; i++) {
      const countries = type[i];
      const stop = 51;
      for (let j = 0; j < stop; j++) {
        setTimeout(async() => {
          let t = j * 20;
          let url = "https://movie.douban.com/j/new_search_subjects?sort=S&range=0,10&tags=&start=" + t + "&countries=" + countries
          const res = await lastValueFrom(
            this.axios.get(url, {
              headers: {
                Cookie: '__utma=30149280.518822778.1576997740.1652951427.1654599740.54; _pk_id.100001.4cf6=844cf19a4e48a5b1.1576997742.47.1654600709.1654497573.; __utma=223695111.625330076.1576997743.1652951427.1654599740.45; __utmz=30149280.1651911852.48.26.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; douban-fav-remind=1; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1654599739%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; __utmz=223695111.1651911865.39.10.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; ll="118283"; bid=tLcgbbOB0Sw; __gads=ID=741e44e0f52a198f-228460a321d10040:T=1648205868:RT=1648205868:S=ALNI_May_y7lFf-z2n-Qad53CyZcq7hCBw; _vwo_uuid_v2=D0F4572DAA5F5EC9904800187B19F9BB6|e4ef90189ab8e9b4b868b13479a92c69; __yadk_uid=U2DeQ36GX4EVJTfzLHbH9RPyFOLlbRjM; Hm_lvt_16a14f3002af32bf3a75dfe352478639=1650627627; _vwo_uuid_v2=D0F4572DAA5F5EC9904800187B19F9BB6|e4ef90189ab8e9b4b868b13479a92c69; _ga=GA1.2.518822778.1576997740; __gpi=UID=0000058f725a1290:T=1652951454:RT=1654599746:S=ALNI_MavmFgBNqZDoGK4vg43xuSPr3cC5A; _pk_ses.100001.4cf6=*; ap_v=0,6.0; __utmb=30149280.0.10.1654599740; __utmc=30149280; __utmb=223695111.7.10.1654599740; __utmc=223695111; __utmt=1'
              }
            })
          );
          let Obj = res.data;
          Obj = JSON.parse(Obj);
          if (Array.isArray(Obj.data)) {
            Obj.data.forEach((el) => {
              el.tag = countries;
              allFilms.push(el);
            });
          } else {
            console.log(Obj);
            console.log('豆瓣电影没爬取到');
          };
        }, 5000);
      };
    for (let i = 0; i < allFilms.length; i++) {
      const el = allFilms[i];
      await this.DouBan.updateMany({ id: el.id }, { directors: el.directors, rate: el.rate, title: el.title, url: el.url, cover: el.cover, casts: el.casts, $addToSet: { tag: el.tag } }, {
          upsert: true
      });
    };
    };
    console.log('豆瓣更新完毕');
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
      monito_WeiBo: ReturnModelType<typeof Monito_WeiBo>) 
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
    const data = await this.monito_Jd.find({});
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      const url = el.href;
      const brower = await puppeteer.launch({
        headless: true
      });
      var page = await brower.newPage();
      await page.goto(url);
      const price = await page.$eval('.itemInfo-wrap  .summary-price-wrap .summary-price.J-summary-price .dd .p-price .price', el => el.innerHTML);
      const label = await page.$eval('.summary-price.J-summary-price .dt', el => el.innerHTML);
      const time = dayjs(new Date()).format('YYYY-MM-DD');
      await this.monito_Jd.updateMany({ id: el.id }, { $push: { price, time }, $set: { label } });
      brower.close();
      console.log('Jd更新成功');
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
    const houseList = await this.beiKe.aggregate([{
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

  async beiKe_houseListUpdata() {
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
      await this.beiKe.updateMany({ housedel_id: el.housedel_id }, { name: el.name, title: el.title, href: el.href, img: el.img, position: el.position, houseIcon: el.houseIcon, price: el.price, untiprice: el.untiprice }, {
          upsert: true
      });
    };
    console.log('更新贝壳列表完毕');
  }
}
