

import { HeaderInfoDTO, TableSeparationPatternDTO } from "../../../../data-extraction-pipeline/dto/inputs.dto.js";
import { HeaderValidationError, SeparatorValidationError } from "../../../../data-extractor/exceptions/table-extractor.exceptions.js";
import { HeaderDetails, TableCoords } from "../../../../data-extractor/iterfaces/interfaces.js";
import { ValidatorService } from "../../validator/validator.service.js";

export abstract class TableExtractor {

    constructor(protected validator: ValidatorService) { }
    abstract extractCoords(
        aoa: any[][],
        input: { tableSeparationPattern: TableSeparationPatternDTO, headerInfo: HeaderInfoDTO },
        headerDetails: HeaderDetails[]
    ): TableCoords

    /*
     * gets the header coordinates 
     */
    protected getHeaderCoords(aoa: any[][], headerInfo: HeaderInfoDTO): HeaderDetails[] {
        const headerValidationResult = this.validator.validateAndGetHeaderCoords(aoa, headerInfo)
        if (!headerValidationResult.success) {
            throw new HeaderValidationError({
                success: false,
                message: headerValidationResult.message,
                details: headerValidationResult.details ?? {}
            })
        }
        return headerValidationResult.details;
    }

    /**
     * helper for populating an object with the header coords
     */
    protected buildHeaderCoords(headerDetails: HeaderDetails[]) {
        return headerDetails.map(coords => ({
            row: coords.row,
            startColumn: coords.startColumn,
            endColumn: coords.endColumn,
        }));
    }

    /**
     * builds the full table coords {headerCoords, dataCoords}
    */
    protected buildTableCoords(
        headerDetails: HeaderDetails[],
        endIndices: number[] | null,
        fallbackEndRow: number = -1
    ): TableCoords {
        const headerCoords = this.buildHeaderCoords(headerDetails);
        const dataCoords: { startRow: number, endRow: number }[] = [];

        headerDetails.forEach((coords, index) => {
            const endRow = endIndices
                ? (endIndices[index] > 0 ? endIndices[index] - 1 : fallbackEndRow)
                : fallbackEndRow;

            dataCoords.push({
                startRow: coords.row + 1,
                endRow: endRow
            });
        });

        return {
            headerCoords,
            dataCoords
        }
    }

    /**
     * validates pattern deduplication and returns the extracted indices 
     */
    protected getDeduplicatedIdx(
        tableSeparationPattern: TableSeparationPatternDTO,
        startPatternIndices: number[],
        endPatternIndices: number[],
        isDividedType?: boolean
    ): number[] {

        let deduplicatedPatternIdx: number[] = endPatternIndices
        if (tableSeparationPattern!.endPattern?.isRepeated) {
            deduplicatedPatternIdx = this.patternDeduplicator(startPatternIndices, endPatternIndices)
            const validationCondition = isDividedType ? deduplicatedPatternIdx.slice(0, -1).includes(-1) : deduplicatedPatternIdx.includes(-1)
            if (validationCondition) {
                throw new SeparatorValidationError({
                    success: false,
                    message: "found conflicting coordinates where there are header(s) with no corresponding end pattern detected",
                    details: {
                        headerInfo: startPatternIndices,
                        endPatternInfo: endPatternIndices
                    }
                })
            }
        }

        return deduplicatedPatternIdx
    }

    /**
     * - this deduplicates patterns
     * - the reason it was added was because some patterns that i use to find the end of a table have duplicates under them 
        that don't correspond to any table end, so what this does is take all the instances of the end patterns 
        and picks the one that come right after the start pattern and discards all the others between that chosen end pattern
        and subsequent start pattern
    */
    private patternDeduplicator(headers: number[], patterns: number[]): number[] {
        const result: number[] = [];

        for (let i = 0; i < headers.length; i++) {
            const start = headers[i];
            const end = headers[i + 1] ?? Infinity

            let minPattern = Infinity;
            for (const p of patterns) {
                if (p > start && p < end && p < minPattern) {
                    minPattern = p;
                }
            }
            result.push(minPattern === Infinity ? -1 : minPattern); // -1 if none found
        }

        return result;
    }
}