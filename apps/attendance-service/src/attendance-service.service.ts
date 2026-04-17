import { Injectable, Inject } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy } from '@nestjs/microservices'; 
import { lastValueFrom } from 'rxjs'; 
import { eq } from 'drizzle-orm';
import * as schema from '../../../libs/common/database/attendance.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject('DRIZZLE_CONNECTION')
    private db: MySql2Database<typeof schema>,

    @Inject('EMPLOYEE_SERVICE')
    private client: ClientProxy,
  ) {}

  async submitAbsensi(employeeId: string, photoUrl: string) {
    const newAttendance = {
      id: uuidv4(),
      employeeId: employeeId,
      photoUrl: photoUrl,
      checkInTime: new Date(),
    };

    await this.db.insert(schema.attendances).values(newAttendance);
    return newAttendance;
  }

  async findAll() {
  
    const logs = await this.db.select().from(schema.attendances);

    const populatedLogs = await Promise.all(
      logs.map(async (log) => {
        try {
     
          const employee = await lastValueFrom(
            this.client.send({ cmd: 'get_employee_name' }, log.employeeId),
          );
          return { ...log, employeeName: employee?.fullName || 'Unknown' };
        } catch (error) {
          return { ...log, employeeName: 'Employee Service Unreachable' };
        }
      }),
    );

    return populatedLogs;
  }

  async findByEmployee(employeeId: string) {
   
    const logs = await this.db
      .select()
      .from(schema.attendances)
      .where(eq(schema.attendances.employeeId, employeeId));


    let employeeName = 'Unknown';
    try {
      const employee = await lastValueFrom(
        this.client.send({ cmd: 'get_employee_name' }, employeeId),
      );
      employeeName = employee?.fullName || 'Unknown';
    } catch (error) {
      console.error('Employee Service unreachable');
    }

    return logs.map((log) => ({ ...log, employeeName }));
  }
}
