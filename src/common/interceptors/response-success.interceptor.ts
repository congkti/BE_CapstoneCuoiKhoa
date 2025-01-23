import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { responseSuccess } from '../helpers/response.helper';
import { Reflector } from '@nestjs/core';
import { RESPONSE_METADATA } from '../decorators/response-mesage.decorator';
import { TResponseMetadata } from '../types/all.types';

@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // console.log({ data });

        // Nếu có refreshToken, set vào header và loại bỏ khỏi body
        if (data?.reT) {
          response.setHeader('babythree', data.reT);
          delete data.reT;
        }

        // dùng reflector lấy message từ decorator @ResponseMessage
        const metadata = this.reflector.getAllAndOverride<TResponseMetadata>(
          RESPONSE_METADATA,
          [context.getHandler(), context.getClass()],
        );
        // console.log(metadata);
        const message = metadata?.message || 'Operation successful';
        const code = metadata?.code || 200;

        const result = responseSuccess(data, message, code);
        return result;
      }),
    );
  }
}
