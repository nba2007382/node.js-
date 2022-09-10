import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";

@Injectable()
export class RegStrategy extends PassportStrategy(Strategy, 'jwt-Register') {
  constructor () {
    super({
      jwtFromrequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secreteOrKey: jwtConstants.register_secret,
      passReqToCallback: true
    })
  }

  validate(req: Request,payload:any) {
    const registerToken = req.get('authorization').replace('Bearer', '').trim();
    return {
      ...payload,
      registerToken
    }
  }
}