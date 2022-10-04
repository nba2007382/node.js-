import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { RedisService } from '@lib/redis';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.access_secret,
      passRequestCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const access_token = req.get('authorization').replace('Bearer', '').trim();
    const userEmail = await this.redisService.get(access_token);
    const { accountEmail } = payload;
    if (userEmail !== accountEmail) {
      throw new UnauthorizedException();
    }
    return {
      ...payload,
      access_token,
    };
  }
}
