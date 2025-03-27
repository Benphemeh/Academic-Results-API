import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Patch,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateResultDto } from './dto/create-result.dto';

import { diskStorage } from 'multer';
import { BulkResultDto } from './dto/bulk-result.dto';
import { ResultService } from './result.service';

@Controller('results')
export class ResultsController {
  private readonly logger = new Logger(ResultsController.name);
  constructor(private readonly resultsService: ResultService) {}
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createResult(@Body() createResultDto: CreateResultDto) {
    this.logger.log('Creating result');
    return this.resultsService.createResult(createResultDto);
  }
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  // async createResult(@Body() createResultDto: CreateResultDto) {
  //   this.logger.log('Creating a new result');
  //   const result = await this.resultsService.createResult(createResultDto);
  //   return result;
  // }

  @Post('bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async bulkCreateResults(
    @Body() bulkResultDto: BulkResultDto,
    @UploadedFile() file,
  ) {
    if (!file && !bulkResultDto) {
      throw new BadRequestException('No file / data uploaded');
    }
    console.log(file);

    return { message: 'Bulk data is being processed' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getResultById(@Param('id') id: number) {
    this.logger.log(`Fetching result with id ${id}`);
    return this.resultsService.getResultById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateResult(
    @Param('id') id: number,
    @Body() updateResultDto: Partial<CreateResultDto>,
  ) {
    this.logger.log(`Updating result with id ${id}`);
    return this.resultsService.updateResult(id, updateResultDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteResult(@Param('id') id: number) {
    return this.resultsService.deleteResult(id);
  }
}
