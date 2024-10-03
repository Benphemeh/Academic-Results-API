import { IsIn, IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class CourseDto {
  @IsString()
  courseCode: string;

  @IsString()
  courseTitle: string;

  @IsInt()
  @Min(1)
  unit: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsString()
  @IsIn(['A', 'B+', 'B', 'C', 'D', 'F'])
  grade: string;
}
