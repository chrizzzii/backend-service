import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { createDrizzleProvider } from '../../../libs/common/database/drizzle.provider';
import { AttendanceServiceController } from './attendance-service.controller';
import { AttendanceService } from './attendance-service.service';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMPLOYEE_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 8002 },
      },
    ]),
  ],
  providers: [
    AttendanceService,
    JwtStrategy,
    createDrizzleProvider('absensi_attendance_db'),
  ],
  controllers: [AttendanceServiceController],
})
export class AttendanceServiceModule {}
