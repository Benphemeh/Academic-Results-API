import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Result } from './result.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  studentId: string;

  @Column()
  name: string;

  @OneToMany(() => Result, (result) => result.student)
  results: Result[];
}
