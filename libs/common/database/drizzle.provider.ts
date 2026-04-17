import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

export const createDrizzleProvider = (dbName: string) => ({
  provide: 'DRIZZLE_CONNECTION',
  useFactory: async () => {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root', 
      password: 'bLacKmagician100',
      database: dbName, 
    });
    return drizzle(connection, { schema, mode: 'default' });
  },
});
