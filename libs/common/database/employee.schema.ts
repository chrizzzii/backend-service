import {
  mysqlTable,
  varchar,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const employees = mysqlTable('employees', {
  id: varchar('id', { length: 36 }).primaryKey(), 
  nik: varchar('nik', { length: 20 }).unique().notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  position: varchar('position', { length: 100 }),
  status: mysqlEnum('status', ['active', 'inactive']).default('active'),
});