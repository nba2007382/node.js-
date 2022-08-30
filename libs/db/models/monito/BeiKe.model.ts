import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';

export class BeiKe {
  @prop()
  id: String

  @prop()
  title: String

  @prop()
  href: String

  @prop()
  img: String

  @prop()
  price: Array<Number>

  @prop()
  time: Array<Number>

  @prop()
  from: Array<String>
}