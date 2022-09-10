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

  async active (accountEmail: string) {
    await this.user.updateOne(
      {
        email: accountEmail
      },
      {
        $set: {
          status: 1
        }
      }
    );
  }

  async register (user: any) {
    const userInfo = Object.assign(
      {
      status: 0,
      create_time: Date.now()
      },
      user
    );
    await this.user.insertMany(userInfo);
  }
}
