import { Test, TestingModule } from '@nestjs/testing';
import { AniDeduplicatorService } from './ani-deduplicator.service';

describe('AniDeduplicatorService', () => {
  let service: AniDeduplicatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AniDeduplicatorService],
    }).compile();

    service = module.get<AniDeduplicatorService>(AniDeduplicatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
