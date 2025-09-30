import { Test, TestingModule } from '@nestjs/testing';
import { DataExtractionPipelineController } from './data-extraction-pipeline.controller.js';

describe('DataExtractionPipelineController', () => {
  let controller: DataExtractionPipelineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataExtractionPipelineController],
    }).compile();

    controller = module.get<DataExtractionPipelineController>(DataExtractionPipelineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
