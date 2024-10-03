import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Result } from './result.entity';

@Entity()
export class Semester {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string; // Values: "First", "Second", "Summer"

  @OneToMany(() => Result, (result) => result.semester)
  results: Result[];
}
