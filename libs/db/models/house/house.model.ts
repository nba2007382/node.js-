import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { prop, ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class House {
  constructor(private readonly httpService: HttpService) {
    this.httpService
  }
  @ApiProperty({ description:`ID` })
  @prop({ unique: true })
  housedel_id: Number

  @ApiProperty({ description:`名称` })
  @prop()
  name: String

  @ApiProperty({ description:`标题` })
  @prop()
  title: String

  @ApiProperty({ description:`链接` })
  @prop()
  href: String

  @ApiProperty({ description:`图片地址` })
  @prop()
  img: String

  @ApiProperty({ description:`房子位置` })
  @prop()
  position: String

  @prop()
  houseIcon: String

  @ApiProperty({ description:`房价` })
  @prop()
  price: Number

  @ApiProperty({ description:`均价` })
  @prop()
  untiprice: Number

  @ApiProperty({ description:`时间` })
  @prop()
  time: Number

  public static async updata (this: ReturnModelType<typeof House>) {
    const type = ['xiangzhouqu', 'jinwanqu', 'doumenqu'];
    let allFilms = [];
    for (let j = 0; j < type.length; j++) {
      const County = type[j];
      const stopNum = 101;
      for (let i = 1; i < stopNum; i++) { 
        let url = 'https://zh.ke.com/ershoufang/' + County + '/pg' + i + 'co42/';
        await new Promise((resolve) => {
          setTimeout(async() => {
            await this.
          },500);
         });
      }
     }
  }
}