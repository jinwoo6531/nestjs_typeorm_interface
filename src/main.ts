import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { initSwagger } from './common/configurations/swagger.config';
import { initAws } from './common/configurations/aws.config';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3000', //web배포후 수정하기
    credentials: true,
  });
  app.use(cookieParser());
  app.use(bodyParser.json({limit: '50mb'}));
  // app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  // app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

  initAws(app);
  initSwagger(app);
  await app.listen(3065);
}
bootstrap();
