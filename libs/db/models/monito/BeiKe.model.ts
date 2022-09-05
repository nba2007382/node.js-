import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';

export class Monito_BeiKe {
  @prop()
  id: string

  @prop()
  title: string

  @prop()
  href: string

  @prop()
  img: string

  @prop()
  price: Array<number>

  @prop()
  time: Array<number>

  @prop()
  from: Array<string>
}