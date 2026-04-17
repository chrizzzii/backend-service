import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { createDrizzleProvider } from '../../../libs/common/database/drizzle.provider';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmployeeService } from './employee-service.service';
import { EmployeeServiceController } from './employee-service.controller';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8001 },
      },
    ]),
    PassportModule,
  ],
  providers: [
    EmployeeService,
    JwtStrategy,
    createDrizzleProvider('absensi_employee_db'),
  ],
  controllers: [EmployeeServiceController],
})
export class EmployeeServiceModule {}
