import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

const dbName = 'absensi_auth_db';

export default defineConfig({
  out: './drizzle',
  schema: './libs/common/database/auth.schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    url: `${process.env.DB_BASE_URL}/${dbName}`,
  },
});
