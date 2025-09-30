import { Test, TestingModule } from '@nestjs/testing';
import { LeadDataProcessorService } from './lead-data-processor.service';

describe('LeadDataProcessorService', () => {
  let service: LeadDataProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeadDataProcessorService],
    }).compile();

    service = module.get<LeadDataProcessorService>(LeadDataProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
