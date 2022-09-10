import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';

export class User {
  @ApiProperty({ description: `用户名`})
  @prop()
  name: string

  @ApiProperty({ description: `密码`})
  @prop()
  password: string

  @ApiProperty({ description: `邮箱`})
  @prop({ unique: true })
  email: string

  @ApiProperty({ description: `激活状态`})
  @prop()
  status: Number

  @ApiProperty({ description: `账号创建时间`})
  @prop()
  create_time: string
}