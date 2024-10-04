import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/core/database/entity/result.entity';
import { Student } from 'src/core/database/entity/student.entity';
import { Session } from 'src/core/database/entity/session.entity';
import { Semester } from 'src/core/database/entity/semester.entity';
import { CreateResultDto } from './dto/create-result.dto';
// import { Queue } from 'bull';
// import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ResultService {
  constructor(
    // @InjectQueue('results') private resultsQueue: Queue<Queue>,
    @InjectRepository(Result) private resultRepo: Repository<Result>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(Semester) private semesterRepo: Repository<Semester>,
  ) {}

  async createResult(createResultDto: CreateResultDto) {
    // Find or create student
    let student = await this.studentRepo.findOne({
      where: { studentId: createResultDto.studentId },
    });
    if (!student) {
      student = this.studentRepo.create({
        studentId: createResultDto.studentId,
        name: createResultDto.name,
      });
      await this.studentRepo.save(student);
    }

    // Find or create session
    let session = await this.sessionRepo.findOne({
      where: { session: createResultDto.session },
    });
    if (!session) {
      session = this.sessionRepo.create({ session: createResultDto.session });
      await this.sessionRepo.save(session);
    }

    let semester = await this.semesterRepo.findOne({
      where: { name: createResultDto.semester },
    });
    if (!semester) {
      semester = this.semesterRepo.create({ name: createResultDto.semester });
      await this.semesterRepo.save(semester);
    }
    const result = this.resultRepo.create({
      student: student,
      session: session.session,
      semester: semester,
      courses: createResultDto.courses,
      gpa: createResultDto.gpa,
      cgpa: createResultDto.cgpa,
    });

    return this.resultRepo.save(result);
  }

  //   const savedResult = await this.resultRepo.save(result);

  //   await this.addResultToQueue(savedResult); // Call the new method with the saved result

  //   return savedResult;
  // }

  // async addResultToQueue(data: any) {
  //   await this.queueService.addToQueue('results', data); // Add the result to the queue
  // }
}

// async processBulkResults(bulkResultDto: BulkResultDto) {
//   for (const createResultDto of bulkResultDto.results)
//     let student = await this.studentRepo.findOne({
//       where: { studentId: createResultDto.studentId },
//     });
//     if (!student) {
//       student = this.studentRepo.create({
//         studentId: createResultDto.studentId,
//         name: createResultDto.name,
//       });
//       await this.studentRepo.save(student);
//   }
