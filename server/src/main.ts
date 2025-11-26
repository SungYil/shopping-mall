import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Next.js 클라이언트 주소
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
