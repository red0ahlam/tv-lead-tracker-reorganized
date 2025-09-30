import { Injectable } from '@nestjs/common';
import { ExtractManyTables } from './factory-methods/extract-many-tables.service.js';
import { ExtractConnectedTable } from './factory-methods/extract-connected-table.service.js';
import { ExtractDividedTable } from './factory-methods/extract-divided-Table.service.js';
import { TableSchemaValidationError } from '../../exceptions/table-extractor.exceptions.js';

@Injectable()
export class DataExtractorFactoryService {

    constructor(
        private extractManyTables: ExtractManyTables,
        private extractConnectedTable: ExtractConnectedTable,
        private extractDividedTable: ExtractDividedTable,
    ){}

    getExtractor(mode: 'many' | 'one_connected' | 'one_divided') {
        switch (mode) {
            case 'many': return this.extractManyTables
            case 'one_connected': return this.extractConnectedTable
            case 'one_divided': return this.extractDividedTable
            default:
                throw new TableSchemaValidationError({
                    success: false,
                    message: "invalid extraction mode",
                    details: {
                        recieved: mode,
                        allowed: "many | one_connected | one_divided"
                    }
                })
        }
    }
}
