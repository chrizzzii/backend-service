import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { EmployeeServiceModule } from './employee-service.module';

async function bootstrap() {
  const app = await NestFactory.create(EmployeeServiceModule);


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 8002 },
  });

  await app.startAllMicroservices();
  app.enableCors();
  await app.listen(3002);
}
bootstrap();
