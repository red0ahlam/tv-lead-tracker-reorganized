import { Test, TestingModule } from '@nestjs/testing';
import { LogsDataProcessorService } from './logs-data-processor.service.js';

describe('LogsDataProcessorService', () => {
  let service: LogsDataProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsDataProcessorService],
    }).compile();

    service = module.get<LogsDataProcessorService>(LogsDataProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
