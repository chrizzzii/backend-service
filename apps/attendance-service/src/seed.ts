import { drizzle } from 'drizzle-orm/mysql2';
import { v4 as uuidv4 } from 'uuid';
import * as mysql from 'mysql2/promise';
import * as schema from '../../../libs/common/database/attendance.schema';
import * as dotenv from 'dotenv';
dotenv.config();

const dbName = 'absensi_attendance_db';

const pool = mysql.createPool(`${process.env.DB_BASE_URL}/${dbName}`);
const db = drizzle(pool);

async function main() {
  console.log('Seeding Attendances...');
  await db.insert(schema.attendances).values([
    {
      id: uuidv4(),
      employeeId: 'e1b2c3d4-a1b2-c3d4-e5f6-g7h8i9j0k1l2',
      photoUrl: 'https://placehold.co/600x400?text=Bukti+Absen',
      checkInTime: new Date(),
    },
  ]);
  console.log('Attendance seeding completed!');
  process.exit(0);
}

main();
