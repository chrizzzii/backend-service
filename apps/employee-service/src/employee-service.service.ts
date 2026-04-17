import { Injectable, Inject } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy } from '@nestjs/microservices';
import * as schema from '../../../libs/common/database/employee.schema';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('DRIZZLE_CONNECTION')
    private db: MySql2Database<typeof schema>,
    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy,
  ) {}

  async getAllEmployees() {
    return await this.db.select().from(schema.employees);
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.id, id));
    return result[0];
  }

  async createEmployee(data: any) {
    const employeeId = uuidv4();
    await this.db.insert(schema.employees).values({
      id: employeeId,
      nik: data.nik,
      fullName: data.fullName,
      position: data.position,
      status: 'active',
    });

    this.authClient.emit('employee_created', {
      employeeId,
      email: data.email,
      password: 'password123',
    });

    return { message: 'Employee created successfully', id: employeeId };
  }

  async updateEmployee(id: string, data: any) {
    await this.db
      .update(schema.employees)
      .set(data)
      .where(eq(schema.employees.id, id));

    return { message: 'Employee updated successfully' };
  }

  async deleteEmployee(id: string) {
    await this.db.delete(schema.employees).where(eq(schema.employees.id, id));

    this.authClient.emit('employee_deleted', { employeeId: id });

    return { message: 'Employee and related account deleted successfully' };
  }
}
