import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from '../../../libs/common/roles.decorator';

@Controller('employees')
export class EmployeeServiceController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return await this.employeeService.getAllEmployees();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() body: any) {
    return await this.employeeService.createEmployee(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.employeeService.updateEmployee(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.employeeService.deleteEmployee(id);
  }

  @MessagePattern({ cmd: 'get_employee_name' })
  async getEmployeeName(@Payload() employeeId: string) {
    const emp = await this.employeeService.findOne(employeeId);
    return { fullName: emp?.fullName || 'Unknown' };
  }
}
