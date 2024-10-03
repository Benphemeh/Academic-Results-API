import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { Student } from './student.entity';
import { Course } from './course.entity';
import { Semester } from './semester.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Student, (student) => student.results)
  student: Student;

  @OneToMany(() => Course, (course) => course.result, { cascade: true })
  courses: Course[];

  @ManyToOne(() => Session, (session) => session.results)
  Session: Session[];

  @ManyToOne(() => Semester, (semester) => semester.results)
  semester: Semester;

  @Column()
  session: string;

  @Column({ type: 'float', nullable: true })
  gpa: number;

  @Column({ type: 'float', nullable: true })
  cgpa: number;
}
