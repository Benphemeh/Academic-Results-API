import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Result } from './result.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  session: string;

  @OneToMany(() => Result, (result) => result.session)
  results: Result[];
}
