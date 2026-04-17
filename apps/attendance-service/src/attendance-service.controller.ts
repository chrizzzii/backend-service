import {
  Controller,
  Get,
  Post,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AttendanceService } from './attendance-service.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from '../../../libs/common/roles.decorator';
import * as fs from 'fs';

@Controller('attendance')
export class AttendanceServiceController {
  constructor(private readonly attendanceService: AttendanceService) {
    const uploadPath = './uploads/attendance';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/attendance',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async checkIn(@Req() req: any, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Foto bukti absen harus diupload');
    }

    console.log('User dari Guard:', req.user);

    const employeeIdFromToken = req.user?.employeeId;

    if (!employeeIdFromToken) {
      throw new BadRequestException(
        'ID Karyawan tidak ditemukan dalam token login Anda',
      );
    }

    return await this.attendanceService.submitAbsensi(
      employeeIdFromToken,
      file.path,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('monitoring')
  async monitorAll() {
    return await this.attendanceService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('monitoring/:employeeId')
  async monitorByEmployee(@Param('employeeId') employeeId: string) {
    return await this.attendanceService.findByEmployee(employeeId);
  }
}
