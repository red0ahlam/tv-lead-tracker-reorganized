
import { Injectable } from "@nestjs/common";
import { TableExtractor } from "./table-extractor.abstract.js";
import { TableCoords } from "../../../../data-extractor/iterfaces/interfaces.js";
import { HeaderInfoDTO, TableSeparationPatternDTO } from "../../../../data-extraction-pipeline/dto/inputs.dto.js";
import { ValidatorService } from "../../validator/validator.service.js";
import { SeparatorValidationError } from "../../../../data-extractor/exceptions/table-extractor.exceptions.js";

@Injectable()
export class ExtractDividedTable extends TableExtractor {

    /**
    *  called for divided table type files
    * extracts a start pattern and end pattern, or treats one passed pattern as the start and end pattern depending on the file.
    * then builds the tables coords from the start pattern coords and the end pattern coords
    * validation rules used:
    *   - if no start pattern specified throw error
    *   - if there was an error extracting the start pattern throw an error (for more info on the 
    *   extraction error see the function getSepartorCoords)
    *   - if end pattern doesn't exist:
    *       - create the table coords from the start pattern coords (used as both start/end)
    *   - if end pattern exists:
    *       - get its coords and check if there's no extraction error
    *       - check if there are multiple start pattern coords that are consecutive with no end pattern coord in between
    *       - check if the number of extracted start patterns matches the number of end patterns    
    */
    constructor(validator: ValidatorService) {
        super(validator)
    }

    extractCoords(
        aoa: any[][],
        input: { tableSeparationPattern: TableSeparationPatternDTO, headerInfo: HeaderInfoDTO },
    ): TableCoords {

        const { tableSeparationPattern } = input
        const headerDetails = this.getHeaderCoords(aoa, input.headerInfo)

        if (!tableSeparationPattern.startPattern) {
            throw new SeparatorValidationError({
                success: false,
                message: "failed at extracting tables due to no start pattern being specified",
                details: {}
            })
        }

        const startPatternValidationResult = this.validator.validateAndGetSeparatorCoords(aoa, tableSeparationPattern.startPattern)
        if (!startPatternValidationResult.success) {
            throw new SeparatorValidationError({
                success: false,
                message: startPatternValidationResult.message,
                details: startPatternValidationResult.details ?? {}
            })
        }
        const startPatternDetails = startPatternValidationResult.details

        const headerCoords = this.buildHeaderCoords(headerDetails)
        const dataCoords: { startRow: number, endRow: number }[] = [];

        if (!tableSeparationPattern.endPattern) {
            startPatternDetails.forEach((coords, index) => {
                const endRowValue = (startPatternDetails![index + 1] !== undefined) ? startPatternDetails![index + 1].row - 1 : aoa.length - 1
                dataCoords.push({
                    startRow: coords.row + 1,
                    endRow: endRowValue
                })
            })

        } else {
            const endPatternValidationResult = this.validator.validateAndGetSeparatorCoords(aoa, tableSeparationPattern!.endPattern)
            if (!endPatternValidationResult.success) {
                throw new SeparatorValidationError({
                    success: false,
                    message: endPatternValidationResult.message,
                    details: endPatternValidationResult.details ?? {}
                })
            }

            const endPatternDetails = endPatternValidationResult.details
            let startPatternIndices = startPatternDetails.map((element) => element.row)
            let endPatternIndices = endPatternDetails.map((element) => element.row)

            let deduplicatedPatternIdx = this.getDeduplicatedIdx(tableSeparationPattern, startPatternIndices, endPatternIndices, true)

            if (startPatternDetails.length !== deduplicatedPatternIdx.length) {
                throw new SeparatorValidationError({
                    success: false,
                    message: "extracted start/end pattern instances don't match",
                    details: {
                        startPatternInstances: startPatternDetails!.length,
                        endPatternInstances: deduplicatedPatternIdx.length
                    }
                })
            }

            if (startPatternDetails[0].row > endPatternDetails[0].row) {
                endPatternDetails.shift()
                endPatternDetails.push({ row: -1, column: -1 })
            }

            startPatternDetails.forEach((coords, index) => {
                const endRowValue = endPatternDetails[index].row !== -1 ? deduplicatedPatternIdx[index] - 1 : aoa.length - 1;

                dataCoords.push({
                    startRow: coords.row + 1,
                    endRow: endRowValue
                })
            })
        }

        const fullTableCoords = {
            headerCoords: headerCoords,
            dataCoords: dataCoords
        }

        return fullTableCoords
    }
}