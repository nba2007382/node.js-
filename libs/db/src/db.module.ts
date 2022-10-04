import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from '../models/user/user.model';
import { DbService } from './db.service';
import { BeiKe } from '../models/house/BeiKe.model';
import { Unprice } from '../models/house/unprice.model';
import { Monito_BeiKe } from '../models/monito/BeiKe.model';
import { Monito_Jd } from '../models/monito/Jd.model';
import { Monito_WeiBo } from '../models/monito/WeiBo.model';
import { Movie } from '../models/movie/movie.model';
import { HttpModule } from '@nestjs/axios';
import { CookieModule } from '@lib/cookie';
import { ConfigModule, ConfigService } from '@nestjs/config';
const models = TypegooseModule.forFeature([
  User,
  Monito_BeiKe,
  Unprice,
  BeiKe,
  Monito_Jd,
  Monito_WeiBo,
  Movie,
]);

@Global()
@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const HOST = configService.get('DB_HOST');
        return {
          uri: HOST,
        };
      },
    }),
    HttpModule,
    CookieModule,
    models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
