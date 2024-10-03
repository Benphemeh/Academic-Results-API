import { ResultsProcessor } from './result.processor.js';
import { Module } from '@nestjs/common';
import { ResultsController } from './result.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Student } from 'src/core/database/entity/student.entity.js';
import { Result } from 'src/core/database/entity/result.entity.js';
import { Course } from 'src/core/database/entity/course.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Result, Course]),
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
  providers: [ResultsProcessor],
})
export class ResultsModule {}
