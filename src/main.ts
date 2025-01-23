import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import corsList from './common/helpers/cors.helper';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/passport-guard/jwt-auth.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptors/response-success.interceptor';
import { AllExceptionFilter } from './common/filter/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: corsList,
    // credentials: true, // FE and BE are both open to exchange cookies
  });

  // Global validate field
  // app.useGlobalPipes(new ValidationPipe());

  // NestJS reflector, use to transfer info of custom decorator > run modules on Global
  const reflector = app.get(Reflector);

  // Global protect api
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // use Global interceptor for Logging + Format response + error
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector));
  app.useGlobalFilters(new AllExceptionFilter());

  // put a "Listen Port" at the end of the codes
  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
