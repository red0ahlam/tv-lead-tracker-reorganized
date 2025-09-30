import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DataExtractionPipelineModule } from './data-extraction-pipeline/data-extraction-pipeline.module.js';
import { DataExtractorModule } from './data-extractor/data-extractor.module.js';
import { DataProcessorModule } from './data-processor/data-processor.module.js';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    DataExtractionPipelineModule,
    DataExtractorModule,
    DataProcessorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
