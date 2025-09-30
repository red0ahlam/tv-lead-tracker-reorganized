import { Module } from '@nestjs/common';
import { DataExtractorService } from './data-extractor.service.js';
import { DataExtractorFactoryService } from './services/data-extractor-factory/data-extractor-factory.service.js';
import { ExtractManyTables } from './services/data-extractor-factory/factory-methods/extract-many-tables.service.js';
import { ExtractConnectedTable } from './services/data-extractor-factory/factory-methods/extract-connected-table.service.js';
import { ExtractDividedTable } from './services/data-extractor-factory/factory-methods/extract-divided-Table.service.js';
import { FileReaderService } from './services/file-reader/file-reader.service.js';
import { ValidatorService } from './services/validator/validator.service.js';
import { CommonModule } from '../common/services/common.module.js';

@Module({
    imports: [CommonModule],
    providers: [
        DataExtractorService,
        FileReaderService,
        ValidatorService,
        DataExtractorFactoryService,
        ExtractManyTables,
        ExtractConnectedTable,
        ExtractDividedTable
    ],
    exports: [DataExtractorService]
})
export class DataExtractorModule { }
