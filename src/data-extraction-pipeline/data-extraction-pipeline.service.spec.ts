import { Test, TestingModule } from '@nestjs/testing';
import { DataExtractionPipelineService } from './data-extraction-pipeline.service.js';

describe('DataExtractionPipelineService', () => {
  let service: DataExtractionPipelineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataExtractionPipelineService],
    }).compile();

    service = module.get<DataExtractionPipelineService>(DataExtractionPipelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
