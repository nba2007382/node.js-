import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

interface Tid {
  data: {
    tid: string;
    new_tid: boolean;
  };
  retcode: number;
}

@Injectable()
export class CookieService {
  constructor(private readonly axios: HttpService) {}
  async getcookie() {
    const a = 'incarnate';
    const cb = 'cross_domain';
    const from = 'weibo';
    let t: string;
    let w: number;
    const c = 100;
    const obj = await getTid(this.axios);
    if (obj.retcode === 20000000) {
      t = obj.data.tid;
      w = obj.data.new_tid === true ? 3 : 2;
    }
    const res = await lastValueFrom(
      this.axios.get(
        `https://passport.weibo.com/visitor/visitor?t=${t}&w=${w}&a=${a}&cb=${cb}&from=${from}&c=${c}`,
      ),
    );
    let rawData = res.data + '';
    rawData = rawData.replace('window.cross_domain && cross_domain(', '');
    rawData = rawData.replace(');', '');
    const cookie = JSON.parse(rawData);
    return cookie;

    async function getTid(axios: HttpService): Promise<Tid> {
      const res = await lastValueFrom(
        axios.get(
          'https://passport.weibo.com/visitor/genvisitor?cb=gen_callback&fp={"os":"1","browser":"Chrome70,0,3538,25","fonts":"undefined","screenInfo":"1920*1080*24","plugins":"Portable Document Format::internal-pdf-viewer::Chromium PDF Plugin|::mhjfbmdgcfjbbpaeojofohoefgiehjai::Chromium PDF Viewer|::gbkeegbaiigmenfmjfclcdgdpimamgkj::Google文档、表格及幻灯片的Office编辑扩展程序|::internal-nacl-plugin::Native Client"}',
        ),
      );
      let rawData = res.data + '';
      rawData = rawData.replace('window.gen_callback && gen_callback(', '');
      rawData = rawData.replace(');', '');
      const obj = JSON.parse(rawData) as Tid;
      return obj;
    }
  }
}
