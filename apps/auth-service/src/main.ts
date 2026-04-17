import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 8001 },
  });

  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(3001);

  console.log('Auth Service is listening on HTTP: 3001 and TCP: 8001');
}
bootstrap();
