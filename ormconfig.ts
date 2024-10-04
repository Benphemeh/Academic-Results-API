import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

dotenv.config();

const dbconfig: TypeOrmModuleOptions = {
  type: 'postgres', // Explicitly set the type as 'postgres'
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10), // Ensure it's a number
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true', // Convert to boolean

  connectTimeoutMS: 1000000,
  migrationsTableName: 'academy_table',
  migrations: ['dist/src/migrations/*{.ts,.js}'], // Adjust path if necessary

  migrationsRun: true,
  cache: {
    type: 'database',
    duration: 30000,
    ignoreErrors: true,
  },
};
export default dbconfig;
