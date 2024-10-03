import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('results')
export class ResultsProcessor {
  @Process('processBulkJson')
  async handleBulkJson(job: Job) {
    const results = job.data;
    console.log('Processing bulk JSON data:', results);

    return { success: true };
  }

  @Process('processBulkCsv')
  async handleBulkCsv(job: Job) {
    const csvResults = job.data;
    console.log('Processing bulk CSV data:', csvResults);

    return { success: true };
  }
}
