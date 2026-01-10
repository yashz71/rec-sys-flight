
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService:ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
   
        if (req && req.cookies) {
          token = req.cookies['access_token'];
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    if (!payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
    return { id: payload.sub, username: payload.username,roles: payload.roles };
  }
}
