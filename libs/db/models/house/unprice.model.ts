import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';

export class Unprice {
  @prop()
  name: String

  @prop()
  untiprice: Number

  @prop({ index: true })
  create_time: Number
}