import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CourseDto } from './course.dto';

export class CreateResultDto {
  @IsString()
  @IsAlphanumeric()
  studentId: string;

  @IsString()
  name: string;

  @IsString()
  @Matches(/^\d{4}\/\d{4}$/, {
    message: "Session format should be 'YYYY/YYYY'",
  })
  session: string;

  @IsString()
  @IsIn(['First', 'Second', 'Summer'])
  semester: string;

  @ValidateNested({ each: true })
  @Type(() => CourseDto)
  courses: CourseDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  gpa: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  cgpa: number;
}
