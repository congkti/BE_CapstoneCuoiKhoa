import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportService } from '../passport.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private passportService: PassportService) {
    super();
  }

  // throw errors, return user in req
  async validate(username: string, password: string) {
    const user = await this.passportService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
