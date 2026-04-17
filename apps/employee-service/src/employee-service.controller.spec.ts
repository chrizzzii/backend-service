import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeServiceController } from './employee-service.controller';
import { EmployeeService } from './employee-service.service';

describe('EmployeeServiceController', () => {
  let employeeServiceController: EmployeeServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeServiceController],
      providers: [EmployeeService],
    }).compile();

    employeeServiceController = app.get<EmployeeServiceController>(
      EmployeeServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(employeeServiceController.getHello()).toBe('Hello World!');
    });
  });
});
