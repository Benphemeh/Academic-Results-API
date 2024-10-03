import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultsModule } from './module/results/results.module';
@Module({
  imports: [ResultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
