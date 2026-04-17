import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { createDrizzleProvider } from '../../../libs/common/database/drizzle.provider';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'abcd',
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  providers: [
    AuthServiceService,
    JwtStrategy,
    createDrizzleProvider('absensi_auth_db'),
  ],
  controllers: [AuthServiceController],
})
export class AuthServiceModule {}
