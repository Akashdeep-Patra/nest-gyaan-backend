import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req || !req.signedCookies) return null;
        return req.signedCookies[jwtConstants.accessToken];
      },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    console.log('here in validate');
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
      role: payload.role,
      permissions: payload.permissions,
      company: payload.company,
      companyId: payload.companyId,
    };
  }
}
