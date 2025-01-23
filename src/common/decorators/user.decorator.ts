import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// get user from req when protect api
export const LoginUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
