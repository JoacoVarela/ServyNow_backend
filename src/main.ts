import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { config } from 'dotenv';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4200',
      'https://servy-now-frontend.vercel.app',
      /^https:\/\/.*\.ngrok-free\.dev$/,
      /^https:\/\/.*\.ngrok\.io$/,
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    credentials: true,
    optionsSuccessStatus: 200,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useStaticAssets(join(process.cwd(), 'public', 'uploads'), { prefix: '/uploads' });
  app.setGlobalPrefix('api');
  const port = Number(process.env.PORT) || 6500;
  await app.listen(port);

  console.log(`API: http://localhost:${port}/api`);
}
bootstrap();
