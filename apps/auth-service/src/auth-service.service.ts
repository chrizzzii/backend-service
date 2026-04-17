import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import * as schema from '../../../libs/common/database/auth.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServiceService {
  constructor(
    @Inject('DRIZZLE_CONNECTION')
    private db: MySql2Database<typeof schema>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    const user = results[0];

    if (!user) {
      throw new UnauthorizedException('Email salah');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role,
    };
  }

  async createUser(data: any) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    try {
      await this.db.insert(schema.users).values({
        id: crypto.randomUUID(),
        email: data.email,
        password: hashedPassword,
        role: 'employee',
        employeeId: data.employeeId,
      });

      console.log(`User created for email: ${data.email}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to create user in Auth Service:', errorMessage);
    }
  }

  async deleteUserByEmployeeId(employeeId: string) {
    try {
      await this.db
        .delete(schema.users)
        .where(eq(schema.users.employeeId, employeeId));

      console.log(
        `Akun login untuk Employee ID ${employeeId} berhasil dihapus.`,
      );
    } catch (error) {
      console.error('Gagal menghapus akun user:', error);
    }
  }
}
