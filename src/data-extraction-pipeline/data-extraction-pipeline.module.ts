import { Module } from '@nestjs/common';
import { DataExtractionPipelineService } from './data-extraction-pipeline.service.js';
import { DataExtractionPipelineController } from './data-extraction-pipeline.controller.js';
import { DataExtractorModule } from '../data-extractor/data-extractor.module.js';
import { DataProcessorModule } from '../data-processor/data-processor.module.js';

@Module({
  imports: [DataExtractorModule, DataProcessorModule],
  providers: [DataExtractionPipelineService],
  controllers: [DataExtractionPipelineController]
})
export class DataExtractionPipelineModule {}
