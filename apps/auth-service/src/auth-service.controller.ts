import { Controller, Post, Body } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}
  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  @EventPattern('employee_created')
  async handleEmployeeCreated(data: any) {
    console.log('Received data from Employee Service:', data);

    await this.authService.createUser(data);
  }

  @EventPattern('employee_deleted')
  async handleEmployeeDeleted(@Payload() data: { employeeId: string }) {
    console.log(
      `[TCP Event] Menerima instruksi hapus akun untuk Employee ID: ${data.employeeId}`,
    );

    await this.authService.deleteUserByEmployeeId(data.employeeId);
  }
}
