import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultsModule } from './module/results/results.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbconfig from 'ormconfig';
@Module({
  imports: [TypeOrmModule.forRoot(dbconfig), ResultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
