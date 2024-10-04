import { ResultsProcessor } from './result.processor.js';
import { Module } from '@nestjs/common';
import { ResultsController } from './result.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Student } from 'src/core/database/entity/student.entity';
import { Result } from 'src/core/database/entity/result.entity';
import { Course } from 'src/core/database/entity/course.entity';
import { ResultService } from './result.service.js';
import { Session } from 'src/core/database/entity/session.entity';
import { Semester } from 'src/core/database/entity/semester.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Course, Result, Session, Semester]),
    BullModule.registerQueue({
      name: 'bulk-results-queue',
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [ResultsController],
  providers: [ResultService, ResultsProcessor],
  exports: [ResultService],
})
export class ResultsModule {}
