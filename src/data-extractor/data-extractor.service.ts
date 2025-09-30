
import { Injectable} from '@nestjs/common';
import { RelevantSideInfoDetails } from './iterfaces/interfaces.js';
import { HeaderInfoDTO, DataInfoDTO, TableExtractionInputDTO, TableHeaderMappingDTO, LeadsExtractionInputDTO} from '../data-extraction-pipeline/dto/inputs.dto.js';
import { RelevantSideInfoValidationError, RowDataValidationError } from './exceptions/table-extractor.exceptions.js';
import { FileReaderService } from './services/file-reader/file-reader.service.js';
import { ValidatorService } from './services/validator/validator.service.js';
import { DataExtractorFactoryService } from './services/data-extractor-factory/data-extractor-factory.service.js';
import { UtilityService } from '../common/services/utility-service/utility.service.js';
import { AnyCallCenterLead, LeadRowData, PostValidationLogDataOutput, PostValidationLogExtractionOutput } from '../data-extraction-pipeline/interfaces/interface.js';

@Injectable()
export class DataExtractorService {

    constructor(
        private fileReader: FileReaderService,
        private DataExtractorFactory: DataExtractorFactoryService,
        private validator: ValidatorService,
        private utilityService: UtilityService
    ) { }

    public async extractLeads(
        file: Express.Multer.File,
        providerInput: LeadsExtractionInputDTO
    ): Promise<AnyCallCenterLead[]> {

        const aoa = await this.fileReader.excelReader(file)
        const extractionInput = { tableSeparationPattern: providerInput.tableSeparationPattern ?? {}, headerInfo: providerInput.headerInfo }
        const extractor = this.DataExtractorFactory.getExtractor(providerInput.tableType)

        let outputCoords = extractor.extractCoords(aoa, extractionInput)
        let finalOutput = outputCoords.dataCoords.map((item: { startRow: number, endRow: number }) => {
            let rows = this.extractRows(aoa, item)
            let validated = this.validator.dataValidator(item, rows, providerInput.headerInfo, providerInput.dataInfo)

            if (!validated.success) {
                throw new RowDataValidationError({
                    success: false,
                    message: validated.message,
                    details: validated.details
                })
            }

            return this.mapRowsToObjects<LeadRowData>(validated.details!, providerInput.headerInfo)
        }).flat()

        return finalOutput
    }

    public async extractLogs(
        file: Express.Multer.File,
        providerInput: TableExtractionInputDTO
    ): Promise<PostValidationLogExtractionOutput[]> {
        const aoa = await this.fileReader.excelReader(file)
        const extractionInput = { tableSeparationPattern: providerInput.tableSeparationPattern ?? {}, headerInfo: providerInput.headerInfo }
        const extractor = this.DataExtractorFactory.getExtractor(providerInput.tableType)

        let outputCoords = extractor.extractCoords(aoa, extractionInput)
        let finalOutput = outputCoords.dataCoords.map((item: { startRow: number, endRow: number }) => {
            let rows = this.extractRows(aoa, item)
            let filtered = rows
            if (providerInput.dataInfo.sumRows) {
                filtered = this.sumRowsFilterer(rows, providerInput.dataInfo)
            }
            let validated = this.validator.dataValidator(item, filtered, providerInput.headerInfo, providerInput.dataInfo)

            if (!validated.success) {
                throw new RowDataValidationError({
                    success: false,
                    message: validated.message,
                    details: validated.details
                })
            }

            let final = this.mapRowsToObjects<PostValidationLogDataOutput>(validated.details!, providerInput.headerInfo)
            return final
        })


        if (providerInput.relevantSideInfo) {
            let relevantSideInfo = providerInput.relevantSideInfo.map((item) => {
                let result = this.validator.validateAndGetRelevantSideInfo(aoa, item)
                if (!result.success) {
                    throw new RelevantSideInfoValidationError({
                        success: false,
                        message: result.message,
                        details: result.details
                    })
                }

                return result.details
            })

            this.applySideInfo(finalOutput, relevantSideInfo)
        }

        return this.extractRelevantColumns(finalOutput.flat(), providerInput.headerMapping)
    }

    /**
     * - extracts only the columns that are needed for pre-log calculation and discards the others
     * - also renames those columns to uniform names using a file columns to uniform names map in the input
     */
    private extractRelevantColumns(
        data: { rowIndex: number, rowData: Record<string, any> }[], headerMapping: TableHeaderMappingDTO
    ): PostValidationLogExtractionOutput[] {
        let relevantData = data.map((row) => {
            let extractedRow: any = {};
            Object.entries(headerMapping.map).forEach(([key, value]) => {
                let normalizedValue = this.utilityService.normalizeText(value)
                extractedRow[key] = row.rowData[normalizedValue]
            })

            if (headerMapping.constants) {
                Object.entries(headerMapping.constants).forEach(([key, value]) => {
                    extractedRow[key] = value;
                });
            }

            return { rowIndex: row.rowIndex, rowData: extractedRow }
        });

        return relevantData
    }

    // this applies the side info extracted to the pure object extracted from the table
    private applySideInfo(finalOutput: { rowIndex: number, rowData: Record<string, any> }[][], sideInfos: RelevantSideInfoDetails[]): void {
        for (const item of sideInfos) {
            const isMulti = item.values.length > 1
            finalOutput.forEach((output, outputIdx) => {
                const value = isMulti ? item.values[outputIdx] : item.values[0]
                output.forEach(obj => {
                    obj.rowData[item.mappedProperty] = value
                })
            })
        }
    }

    // in the files there some sum rows added that need to be filtered out
    // this checks if the file includes them then filters out rows that have the specified row schema passed
    private sumRowsFilterer(rows: any[][], dataInfo: DataInfoDTO) {
        let sumRows = dataInfo.sumRows
        let relevantColumns = sumRows!.map((row) => row.column)

        let extractedSumRows = rows.filter((row) => {
            return !row.every((cell, colIdx) => {
                if (relevantColumns.includes(colIdx)) {
                    const sumRow = sumRows!.find(sr => sr.column === colIdx)!
                    let validate: Function
                    if (sumRow.checkingFn === "isConstant") {
                        validate = this.utilityService.validators[sumRow.checkingFn]
                        return validate(cell, sumRow.constant)
                    }
                    validate = this.utilityService.validators[sumRow.checkingFn] || this.utilityService.validators.default
                    return validate(cell)
                } else {
                    return cell === null
                }
            })
        })

        return extractedSumRows
    }

    // extracts rows from the original array
    private extractRows(aoa: any[][], rowCoords: { startRow: number, endRow: number }) {
        return aoa.slice(rowCoords.startRow, rowCoords.endRow + 1)
    }

    // takes in the array of arrays that xlsx returns and maps it to an array of objects that have the row index and the row data as an object with each key/value being the header/cell value respectively
    private mapRowsToObjects<T>(
        rows: { rowIndex: number, rowData: any[] }[], headerInfo: HeaderInfoDTO
    // ): { rowIndex: number, rowData: Record<string, any> }[] {
    ): {rowIndex: number, rowData: T}[] {
        return rows.map(row => {
            const obj = {};
            headerInfo.headerValues.forEach((header, i) => {
                let normalizedValue = this.utilityService.normalizeText(header.value)
                obj[normalizedValue] = row.rowData[i];
            })
            return { rowIndex: row.rowIndex, rowData: obj as T}
        });
    }

    // private async getProviderInput<T extends keyof providerInputMapType>(
    //     provider: string,
    //     type: "logs" | "leads"
    // ): Promise<providerInputMapType[T]> {
    //     // db pulling simulation here
    //     const providerInput = providerInputMap[provider]
    //     if (!providerInput) {
    //         throw new NotFoundException("no such provider exists")
    //     }
    //     return await this.validateProviderInput(providerInput, type)
    // }

    // private async validateProviderInput<T extends keyof providerInputMapType>(
    //     input: unknown,
    //     type: "logs" | "leads"
    // ): Promise<providerInputMapType[T]> {

    //     let dto: TableExtractionInputDTO | LeadsExtractionInputDTO

    //     if (type === "logs") {
    //         dto = plainToInstance(TableExtractionInputDTO, input);
    //     } else {
    //         dto = plainToInstance(LeadsExtractionInputDTO, input);
    //     }

    //     const errors = await validate(dto)
    //     if (errors.length > 0) {
    //         throw new Error(`Provider Input Validation failed: ${JSON.stringify(errors)}`);
    //     }
    //     const cleanedDto = instanceToPlain(dto, { exposeUnsetFields: false });
    //     return cleanedDto as providerInputMapType[T];
    // }
}
