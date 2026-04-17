import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from '../../../libs/common/database/employee.schema';
import * as dotenv from 'dotenv';
dotenv.config();

const dbName = 'absensi_employee_db';

const pool = mysql.createPool(`${process.env.DB_BASE_URL}/${dbName}`);
const db = drizzle(pool);

async function main() {
  console.log('Seeding Employees...');
  await db.insert(schema.employees).values([
    {
      id: 'e1b2c3d4-a1b2-c3d4-e5f6-g7h8i9j0k1l2',
      nik: '20240001',
      fullName: 'Karyawan Pertama',
      position: 'Web Developer',
      status: 'active',
    },
    {
      id: 'f9e8d7c6-b5a4-3210-9876-543210fedcba',
      nik: '20240002',
      fullName: 'Karyawan Kedua',
      position: 'HR Manager',
      status: 'active',
    },
  ]);
  console.log('Employee seeding completed!');
  process.exit(0);
}

main();
