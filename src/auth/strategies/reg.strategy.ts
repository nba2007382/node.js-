import { RedisService } from '@lib/redis';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class RegStrategy extends PassportStrategy(Strategy, 'jwt-Register') {
  constructor(private readonly redisService: RedisService) {
    super({
      jwtFromrequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secreteOrKey: jwtConstants.register_secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const registerToken = req.get('authorization').replace('Bearer', '').trim();
    const userEmail = await this.redisService.get(registerToken);
    const { accountEmail } = payload;
    if (userEmail !== accountEmail) {
      throw new UnauthorizedException();
    }
    return {
      ...payload,
      registerToken,
    };
  }
}
