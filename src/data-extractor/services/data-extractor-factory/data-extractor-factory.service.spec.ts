import { Test, TestingModule } from '@nestjs/testing';
import { DataExtractorFactoryService } from './data-extractor-factory.service.js';

describe('DataExtractorFactoryService', () => {
  let service: DataExtractorFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataExtractorFactoryService],
    }).compile();

    service = module.get<DataExtractorFactoryService>(DataExtractorFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
