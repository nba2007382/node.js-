import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';
@Injectable()
export class House {
  constructor() {

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

}