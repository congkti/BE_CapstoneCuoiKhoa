import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { INVALID_USER } from 'src/common/constant/global.constant';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('protect') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // check if no access token assigned to header
    const request = context.switchToHttp().getRequest();
    // const token = request.headers['authorization'];
    const [type, accessToken] =
      request.headers['authorization']?.split(' ') ?? [];
    if (!accessToken || type !== 'Bearer') {
      throw new UnauthorizedException(
        'Token is invalid or has no Bearer in the header',
      );
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // console.log({ err, user, info });

    if (info instanceof TokenExpiredError)
      throw new ForbiddenException('Token expirent'); //403

    if (info instanceof JsonWebTokenError || info instanceof Error)
      throw new UnauthorizedException('Please Login'); //401
    // JsonWebTokenError = tất cả lỗi (bao gồm lỗi 403 bên trên)

    if (!user) throw new UnauthorizedException('User does not exist'); //401

    return user;
  }
}
