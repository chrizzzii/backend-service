import { drizzle } from 'drizzle-orm/mysql2';
import { v4 as uuidv4 } from 'uuid';
import * as mysql from 'mysql2/promise';
import * as schema from '../../../libs/common/database/auth.schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

const dbName = 'absensi_auth_db';

const pool = mysql.createPool(`${process.env.DB_BASE_URL}/${dbName}`);
const db = drizzle(pool);

async function main() {
  console.log('Seeding Users...');
  const hashedEmployeePwd = await bcrypt.hash('password123', 10);
  const hashedAdminPwd = await bcrypt.hash('admin123', 10);

  await db.insert(schema.users).values([
    {
      id: uuidv4(),
      email: 'employee@work.com',
      password: hashedEmployeePwd,
      role: 'employee',
      employeeId: 'e1b2c3d4-a1b2-c3d4-e5f6-g7h8i9j0k1l2',
    },
    {
      id: uuidv4(),
      email: 'admin@hrd.com',
      password: hashedAdminPwd,
      role: 'admin',
      employeeId: 'f9e8d7c6-b5a4-3210-9876-543210fedcba',
    },
  ]);
  console.log('User seeding completed!');
  process.exit(0);
}

main();
