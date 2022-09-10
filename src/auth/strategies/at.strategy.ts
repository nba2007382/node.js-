import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-local";
import { jwtConstants } from "../constants";
import { Request } from "express";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor () {
    super ({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.access_secret,
      passRequestCallback: true
    })
  }

  async validate(req: Request, payload: any) {
    const access_token = req.get('authorization').replace('Bearer', '').trim();
    return {
      ...payload,
      access_token
    };
  }
}