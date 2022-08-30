import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from '../models/user/user.model';
import { DbService } from './db.service';
import { House } from '../models/house/house.model';
import { Unprice } from '../models/house/unprice.model';
import { BeiKe } from '../models/monito/BeiKe.model';
import { JD } from '../models/monito/JD.model';
import { WeiBo } from '../models/monito/WeiBo.model';
import { Movie } from '../models/movie/movie.model';

const models = TypegooseModule.forFeature([
  User,
  House,
  Unprice,
  BeiKe,
  JD,
  WeiBo,
  Movie
]);

@Global()
@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost:27017'),
    HttpModule,
    models
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
