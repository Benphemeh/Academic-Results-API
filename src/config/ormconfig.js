"use strict";
"use strict";
const dotenv = require("dotenv");
const { DataSource } = require("typeorm");

const { Student } = require("../core/database/entity/student.entity");
const { Result } = require("../core/database/entity/result.entity");
const { Session } = require("../core/database/entity/session.entity");
const { Semester } = require("../core/database/entity/semester.entity");
const { Course } = require("../core/database/entity/course.entity");


dotenv.config();

const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "academic_results",
  entities: [Student, Result, Session, Semester, Course], // Explicitly include entities
  migrations: ["src/migrations/*.js"], // Path to compiled migrations
  synchronize: process.env.DB_SYNCHRONIZE === "true", // Use environment variable for synchronization
  migrationsTableName: "academy_table", // Custom migrations table name
  migrationsRun: true, // Automatically run migrations
  cache: {
    type: "database",
    duration: 30000, // Cache duration in milliseconds
    ignoreErrors: true,
  },
  logging: true, // Enable logging for debugging
});

module.exports = dataSource;