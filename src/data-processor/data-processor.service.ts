import { Injectable } from '@nestjs/common';
import { LogsDataProcessorService } from './services/logs-data-processor/logs-data-processor.service.js';
import { LeadDataProcessorService } from './services/lead-data-processor/lead-data-processor.service.js';
import { AnyCallCenterLead, PostValidationLogExtractionOutput, FormattedCallCenterLead, PostProcessingLogExtractionOutput } from '../data-extraction-pipeline/interfaces/interface.js';
import { StepConfigDTO } from 'src/data-extraction-pipeline/dto/inputs.dto.js';

@Injectable()
export class DataProcessorService {

    constructor(
        private logsDataProcessor: LogsDataProcessorService,
        private leadDataProcessor: LeadDataProcessorService
    ) {}

    processLeads(input: AnyCallCenterLead[], pipeline: StepConfigDTO[]): FormattedCallCenterLead[] {
        return this.leadDataProcessor.process(input, pipeline)
    }

    processLogs(input: PostValidationLogExtractionOutput[]): PostProcessingLogExtractionOutput[] {
        return this.logsDataProcessor.process(input)
    }
}