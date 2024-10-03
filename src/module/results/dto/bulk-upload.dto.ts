import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateResultDto } from './create-result.dto';

export class BulkUploadDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateResultDto)
  results: CreateResultDto[];
}
