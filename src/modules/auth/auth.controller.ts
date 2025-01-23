import {
  Body,
  Controller,
  Headers,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, TUser } from './dto/auth.dto';
import {
  DecorLogin,
  DecorRefreshToken,
  DecorRegister,
} from './auth.apply-decorators';

@Controller('auth')
// @UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @DecorRegister()
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @DecorLogin()
  @Post('login')
  async login(@Request() req: { user: TUser }) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  @DecorRefreshToken()
  @Post('refresh-token')
  callRefreshToken(@Headers() headers: any) {
    // console.log('controller >>', headers);
    return this.authService.callRefreshToken(headers);
  }
}
