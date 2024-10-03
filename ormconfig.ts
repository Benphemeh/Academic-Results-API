const dotenv = require('dotenv');

dotenv.config();
const dbconfig = {
  type: 'mysql',
  host: `${process.env.DB_HOST}`,
  database: `${process.env.DB_NAME}`,
  port: +process.env.DB_PORT,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: `${process.env.DB_SYNCHRONIZE}`,
  connectTimeout: 1000000,
  migrationsTableName: 'film_migration_table',
  migrations: ['src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  cache: {
    type: 'database',
    duration: 30000, // 30 seconds
    ignoreErrors: true,
  },
};

module.exports = dbconfig;
