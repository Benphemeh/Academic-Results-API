import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateResultDto } from './dto/create-result.dto';

import { diskStorage } from 'multer';
import { BulkResultDto } from './dto/bulk-result.dto';
import { ResultService } from './result.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultService) {}

  // Single result endpoint
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createResult(@Body() createResultDto: CreateResultDto) {
    const result = await this.resultsService.create(createResultDto);
    return result;
  }

  // Bulk results endpoint (JSON or CSV)
  @Post('bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Save CSV to uploads folder
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async bulkCreateResults(
    @Body() bulkResultDto: BulkResultDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file && !bulkResultDto) {
      throw new BadRequestException('No file or data uploaded.');
    }

    if (file) {
      await this.resultsService.processCsvFile(file.path);
    } else if (bulkResultDto) {
      await this.resultsService.processBulkResults(bulkResultDto);
    }

    return { message: 'Bulk data is being processed.' };
  }
}
