import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { initSwagger } from './common/configurations/swagger.config';
import { initAws } from './common/configurations/aws.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1'); 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  
  initAws(app);
  initSwagger(app);
  await app.listen(3000);
}
bootstrap();
