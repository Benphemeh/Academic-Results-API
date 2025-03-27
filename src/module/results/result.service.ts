import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from '@nestjs/cache-manager';
import { Result } from 'src/core/database/entity/result.entity';
import { Student } from 'src/core/database/entity/student.entity';
import { Session } from 'src/core/database/entity/session.entity';
import { Semester } from 'src/core/database/entity/semester.entity';
import { CreateResultDto } from './dto/create-result.dto';
// import { Queue } from 'bull';
// import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ResultService {
  private readonly logger = new Logger(ResultService.name);
  constructor(
    // @InjectQueue('results') private readonly resultsQueue: Queue,
    // @InjectQueue('results') private resultsQueue: Queue<Queue>,
    @InjectRepository(Result) private resultRepo: Repository<Result>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(Semester) private semesterRepo: Repository<Semester>,
    @Inject('CACHE_MANAGER') private cacheManager: Cache, // Inject Cache Manager
  ) {}
  async createResult(createResultDto: CreateResultDto) {
    // Validate input data
    if (
      !createResultDto.studentId ||
      !createResultDto.session ||
      !createResultDto.semester
    ) {
      throw new BadRequestException('Missing required fields');
    }

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

    const savedResult = await this.resultRepo.save(result);

    // Invalidate cache for getAllResults and student-specific results
    await this.cacheManager.del('all_results');
    await this.cacheManager.del(`student_results_${student.studentId}`);

    return savedResult;
  }

  async getAllResults() {
    this.logger.log('Fetching all results');

    // Try to get from cache first
    const cachedResults = await this.cacheManager.get('all_results');
    if (cachedResults) {
      this.logger.log('Returning results from cache');
      return cachedResults;
    }

    // If not in cache, get from database
    this.logger.log('Cache miss. Fetching results from database');
    const results = await this.resultRepo.find({
      relations: ['student', 'semester'],
    });

    // Store in cache for future requests
    await this.cacheManager.set('all_results', results, 3600);

    return results;
  }

  async getResultById(id: number) {
    this.logger.log(`Fetching result with ID ${id}`);

    // Try to get from cache first
    const cacheKey = `result_${id}`;
    const cachedResult = await this.cacheManager.get(cacheKey);
    if (cachedResult) {
      this.logger.log(`Returning result with ID ${id} from cache`);
      return cachedResult;
    }

    // If not in cache, get from database
    const result = await this.resultRepo.findOne({
      where: { id: id.toString() },
      relations: ['student', 'semester'],
    });

    if (!result) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }

    // Store in cache for future requests (TTL: 1 hour)
    await this.cacheManager.set(cacheKey, result, 3600);

    return result;
  }

  async updateResult(id: number, updateResultDto: Partial<CreateResultDto>) {
    const existingResult = await this.resultRepo.findOne({
      where: { id: id.toString() },
      relations: ['semester'],
    });
    if (!existingResult) {
      throw new NotFoundException(`Result with ID ${id} not found`);
    }

    if (updateResultDto.semester) {
      let semester = await this.semesterRepo.findOne({
        where: { name: updateResultDto.semester },
      });
      if (!semester) {
        semester = this.semesterRepo.create({ name: updateResultDto.semester });
        await this.semesterRepo.save(semester);
      }
      existingResult.semester = semester;
    }

    Object.assign(existingResult, updateResultDto);
    await this.resultRepo.save(existingResult);
    return this.resultRepo.findOne({
      where: { id: id.toString() },
      relations: ['student', 'semester'],
    });
  }
  async deleteResult(id: number) {
    await this.resultRepo.delete(id);
    return { message: `Result with id ${id} deleted successfully` };
  }
}
