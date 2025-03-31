// import * as dotenv from 'dotenv';
// import { DataSource } from 'typeorm';

// import { Student } from 'src/core/database/entity/student.entity';
// import { Result } from 'src/core/database/entity/result.entity';
// import { Session } from 'inspector/promises';
// import { Semester } from 'src/core/database/entity/semester.entity';
// import { Course } from 'src/core/database/entity/course.entity';

// dotenv.config();

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT, 10) || 5432,
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || 'password',
//   database: process.env.DB_NAME || 'academic_results',
//   entities: [Student, Result, Session, Semester, Course],
//   migrations: ['src/migrations/*.js'],
//   synchronize: false,
// });

// export default AppDataSource;

import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Student } from 'src/core/database/entity/student.entity';
import { Result } from 'src/core/database/entity/result.entity';
import { Semester } from 'src/core/database/entity/semester.entity';
import { Course } from 'src/core/database/entity/course.entity';
import { Session } from 'src/core/database/entity/session.entity';

dotenv.config();

const dbconfig: TypeOrmModuleOptions = {
  type: 'postgres', // Explicitly set the type as 'postgres'
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432, // Ensure it's a number
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'academic_results',
  entities: [Student, Result, Session, Semester, Course], // Explicitly register entities
  synchronize: process.env.DB_SYNCHRONIZE === 'true', // Convert to boolean
  migrationsTableName: 'academy_table',
  migrations: ['dist/src/migrations/*{.ts,.js}'], // Adjust path if necessary
  migrationsRun: true,
  cache: {
    type: 'database',
    duration: 30000, // Cache duration in milliseconds
    ignoreErrors: true,
  },
};

export default dbconfig;
