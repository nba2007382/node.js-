import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from 'libs/db/models/user/user.model';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly user: ReturnModelType<typeof User>) {
    
  }

  async findOne (accountEmail: string) {
    const data = await this.user.findOne({ email: accountEmail });
    return data;
  };
}
