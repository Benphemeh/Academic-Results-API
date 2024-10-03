import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResultDto } from './create-result.dto';

export class BulkResultDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResultDto)
  results: CreateResultDto[];
}
