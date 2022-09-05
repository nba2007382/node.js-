import { CookieService } from '@lib/cookie/cookie.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Monito_WeiBo } from 'libs/db/models/monito/WeiBo.model';
import { InjectModel } from 'nestjs-typegoose';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WeiBoService {
  constructor (
    private readonly axios: HttpService,
    private readonly Cookie: CookieService,
    @InjectModel(Monito_WeiBo) private readonly monito_WeiBo: ReturnModelType<typeof Monito_WeiBo>) {

  }

  async getMonitorWeiBoContent () {
    
  }

  async getMonitorWeiBoList (accountEmail: string) {
    const list = await this.monito_WeiBo.aggregate(
      [
        { 
          $match: { 
            from: accountEmail
          } 
        }, {
          $group: {
            _id:'$user.id',
            user: {
              $first: '$user'
            }
          },
        }, {
          $project: {
            user:'$user',
            _id:0    
          }
        }
      ]);
    return list;
  }

  async delMonitorWeiBo (monitoId: string, accountEmail: string) {
    const avator = await this.monito_WeiBo.find({ "user.id": monitoId });
    if (avator[0].from.length == 1) {
      await this.monito_WeiBo.deleteMany({ "user.id": monitoId });
    } else {
      await this.monito_WeiBo.updateMany({ "user.id": monitoId }, { $pull: { from: { $in: [accountEmail] } } });
    };
  }

  async createMonitorWeiBo (monitoUrl: string, monitoId: string, accountEmail: string) {
    console.log("开始添加微博监控");
    let page = 1;
    let cookieData= await this.Cookie.getcookie();
    cookieData= cookieData.data.sub ? cookieData : await this.Cookie.getcookie();
    const cookie=`SUB=${ cookieData.data.sub };SUBP=${ cookieData.data.subp }`;
    while (page !== -1) {
      const url = `https://weibo.com/ajax/statuses/mymblog?uid=${ monitoId }&page=${ page }&feature=0`;
      const res = await lastValueFrom (
        this.axios.get(url, {
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
          el.from = [accountEmail];
          el.url = monitoUrl;
          list[i] = el;
        }
        await this.monito_WeiBo.insertMany(list, { ordered: false });
        page++;
      } else {
        page = -1;
      };
    };
    console.log("微博监控添加完毕");
  }
}
