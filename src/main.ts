import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT, 10) || 3005;

  if (isNaN(port) || port < 0 || port > 65535) {
    throw new RangeError(`Port should be >= 0 and < 65536. Received ${port}`);
  }
  await app.listen(3005);
}
bootstrap();
