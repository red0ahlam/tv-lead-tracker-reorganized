import { Module } from '@nestjs/common';
import { DataProcessorService } from './data-processor.service.js';
import { LogsDataProcessorService } from './services/logs-data-processor/logs-data-processor.service.js';
import { LeadDataProcessorService } from './services/lead-data-processor/lead-data-processor.service.js';
import { AniDeduplicatorService } from './services/ani-deduplicator/ani-deduplicator.service.js';

@Module({
    providers: [
        DataProcessorService,
        LogsDataProcessorService,
        LeadDataProcessorService,
        AniDeduplicatorService
    ],
    exports: [DataProcessorService]
})
export class DataProcessorModule { }
