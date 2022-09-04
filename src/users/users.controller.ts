import { Controller, Get } from '@nestjs/common';
import { User } from 'libs/db/models/user/user.model';
import { Crud } from 'nestjs-mongoose-crud';
import { InjectModel } from 'nestjs-typegoose';
import { ApiTags } from '@nestjs/swagger'
import { ReturnModelType } from '@typegoose/typegoose';

@Crud({
  model: User
})
@Controller('users')
@ApiTags('用户')
export class UsersController {
  constructor(@InjectModel(User) private readonly user: ReturnModelType<typeof User>) {
    
  }
}
