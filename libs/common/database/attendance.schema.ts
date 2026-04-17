import {
  mysqlTable,
  varchar,
  timestamp,
  text,
} from 'drizzle-orm/mysql-core';

export const attendances = mysqlTable('attendances', {
  id: varchar('id', { length: 36 }).primaryKey(),
  employeeId: varchar('employee_id', { length: 36 }).notNull(),
  checkInTime: timestamp('check_in_time').defaultNow(),
  photoUrl: text('photo_url').notNull(),
});
